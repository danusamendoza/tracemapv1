import { useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, animate, PanInfo } from 'motion/react';
import {
  Broadcast,
  WarningCircle,
  Star,
  ShieldCheck,
  Clock,
} from '@phosphor-icons/react';
import GlassSurface from './ui/GlassSurface';
import {
  computeZoneMonitoringStats,
  formatIndicatorCount,
  safetyLevelColorClass,
} from '../utils/zoneMonitoring';
import { Incident } from '../types';

interface ZoneMonitoringCardProps {
  incidents: Incident[];
}

interface IndicatorTileProps {
  icon: any;
  label: string;
  value: string;
}

const TILE_WIDTH_REM = 7.25;
const TILE_GAP_REM = 0.625;
const SWIPE_THRESHOLD = 40;

function remToPx(rem: number): number {
  if (typeof document === 'undefined') return rem * 16;
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
}

function IndicatorTile({ icon, label, value }: IndicatorTileProps) {
  return (
    <div className="indicator-tile shrink-0 w-[7.25rem] px-3.5 py-3 flex flex-col gap-2 select-none">
      <div className="w-8 h-8 rounded-xl bg-warning/15 flex items-center justify-center text-warning">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-neutral-500 font-medium leading-tight">{label}</p>
        <p className="text-xl font-extrabold text-black leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

interface IndicatorCarouselProps {
  tiles: Array<{ key: string; icon: any; label: string; value: string }>;
}

/** Horizontal swipe carousel for zone indicator tiles (left ↔ right). */
function IndicatorCarousel({ tiles }: IndicatorCarouselProps) {
  const tileStep = useMemo(
    () => remToPx(TILE_WIDTH_REM) + remToPx(TILE_GAP_REM),
    []
  );
  const maxIndex = Math.max(0, tiles.length - 1);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    animate(x, -index * tileStep, {
      type: 'spring',
      stiffness: 320,
      damping: 32,
    });
  }, [index, tileStep, x]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const draggedLeft = info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -400;
    const draggedRight = info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 400;

    if (draggedLeft) {
      setIndex((prev) => Math.min(prev + 1, maxIndex));
    } else if (draggedRight) {
      setIndex((prev) => Math.max(prev - 1, 0));
    } else {
      const nearest = Math.round(-x.get() / tileStep);
      setIndex(Math.max(0, Math.min(nearest, maxIndex)));
    }
  };

  return (
    <div className="overflow-hidden -mx-1 px-1 pt-1 pb-3">
      <motion.div
        className="flex gap-2.5 cursor-grab active:cursor-grabbing"
        style={{ x, touchAction: 'pan-x' }}
        drag="x"
        dragConstraints={{ left: -maxIndex * tileStep, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
      >
        {tiles.map((tile) => (
          <IndicatorTile
            key={tile.key}
            icon={tile.icon}
            label={tile.label}
            value={tile.value}
          />
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Zone Monitoring card — resumen de seguridad e indicadores de la zona actual.
 * Solo se usa en Home > vista Lista (ver spec-zone-monitoring.md).
 */
export default function ZoneMonitoringCard({ incidents }: ZoneMonitoringCardProps) {
  const stats = computeZoneMonitoringStats(incidents);
  const levelColor = safetyLevelColorClass(stats.safetyLevel);

  const lastIncidentValue = stats.lastIncidentAgo
    ? stats.lastIncidentAgo.replace(/^Hace\s/i, '')
    : '—';

  const tiles = [
    {
      key: 'reportes',
      icon: <WarningCircle className="w-4 h-4" weight="fill" />,
      label: 'Reportes',
      value: formatIndicatorCount(stats.reportCount),
    },
    {
      key: 'valoracion',
      icon: <Star className="w-4 h-4" weight="fill" />,
      label: 'Valoración',
      value: stats.rating.toFixed(1),
    },
    {
      key: 'resueltos',
      icon: <ShieldCheck className="w-4 h-4" weight="fill" />,
      label: 'Resueltos',
      value: formatIndicatorCount(stats.resolvedCount),
    },
    {
      key: 'ultimo',
      icon: <Clock className="w-4 h-4" weight="fill" />,
      label: 'Último incidente',
      value: lastIncidentValue,
    },
  ];

  return (
    <GlassSurface
      variant="card"
      className="bento-card border border-white/60 shadow-[0_10px_34px_rgba(15,23,42,0.08)] p-4 mx-4 mb-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-black leading-tight">
            El transporte para ti
          </h2>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5 leading-snug">
            Reportes y alertas a tu alrededor
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Broadcast className="w-4 h-4 text-warning" weight="fill" />
          <div className="text-right">
            <p className="text-[10px] text-neutral-500 font-medium leading-tight">Tu zona</p>
            <p className={`text-sm font-extrabold leading-tight ${levelColor}`}>
              {stats.safetyLabel}
            </p>
          </div>
        </div>
      </div>

      <IndicatorCarousel tiles={tiles} />
    </GlassSurface>
  );
}
