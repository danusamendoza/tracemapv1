import { useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import {
  Clock,
  MapPin,
  ChatCircle,
  ThumbsUp,
  CheckCircle,
} from '@phosphor-icons/react';
import { Incident } from '../types';

interface StackedIncidentCardsProps {
  incidents: Incident[];
  onSelect: (inc: Incident) => void;
  newlyCreatedId: string | null;
}

const SWIPE_THRESHOLD = 80;

/** Shared visual face of a single incident card (glass + bento). */
function CardFace({ inc }: { inc: Incident }) {
  return (
    <div className="h-full w-full glass-card bento-card-lg border border-white/60 p-5 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white ${
              inc.status === 'critical' ? 'bg-critical/90' : 'bg-warning/90'
            }`}
          >
            {inc.status === 'critical' ? 'Crítico' : 'Retraso'}
          </span>
          {inc.verified ? (
            <span className="bg-white/70 text-neutral-700 border border-white/70 text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <CheckCircle className="w-2.5 h-2.5 text-black" /> Oficial
            </span>
          ) : (
            <span className="bg-white/70 text-black border border-white/70 text-[9px] font-semibold px-2 py-0.5 rounded-full">
              Comunidad
            </span>
          )}
        </div>
        <span className="text-[10px] text-neutral-500 font-medium flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5" /> {inc.timeAgo}
        </span>
      </div>

      <h4 className="font-semibold text-black text-lg leading-tight">{inc.title}</h4>

      <p className="text-[12px] text-neutral-600 mt-2 line-clamp-4 leading-relaxed flex-1">
        {inc.description}
      </p>

      <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
        <span className="text-[10px] text-neutral-500 font-bold flex items-center gap-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
          <span className="truncate">{inc.location}</span>
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1">
            <ChatCircle className="w-3.5 h-3.5 text-neutral-400" />
            {inc.comments.length}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/60 border border-white/70">
            <ThumbsUp className={`w-3 h-3 ${inc.voted === 'up' ? 'text-black' : 'text-neutral-400'}`} />
            <span className="text-[10px] font-extrabold text-neutral-700">{inc.votes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Card-deck / stacked-cards view for the incident list. The front card can be
 * swiped horizontally to reveal the next incident; tapping it opens the detail.
 */
export default function StackedIncidentCards({
  incidents,
  onSelect,
  newlyCreatedId,
}: StackedIncidentCardsProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Keep the active index valid when the filtered list changes.
  useEffect(() => {
    setIndex((prev) => (incidents.length === 0 ? 0 : Math.min(prev, incidents.length - 1)));
  }, [incidents.length]);

  if (incidents.length === 0) return null;

  const total = incidents.length;
  const active = incidents[index];

  const advance = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + total) % total);
  };

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) {
      advance(1);
    } else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) {
      advance(-1);
    }
  };

  // Up to two cards peeking behind the active one.
  const peekDepths = total > 1 ? [1, 2].slice(0, Math.min(2, total - 1)) : [];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, scale: 0.95, opacity: 0 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -320 : 320,
      rotate: dir > 0 ? -10 : 10,
      opacity: 0,
      transition: { duration: 0.28 },
    }),
  };

  return (
    <div className="px-5 pt-4">
      <div className="relative h-72">
        {peekDepths.map((depth) => {
          const peekInc = incidents[(index + depth) % total];
          return (
            <div
              key={`peek-${depth}-${peekInc.id}`}
              className="absolute inset-x-0 top-0 h-full origin-bottom"
              style={{
                transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`,
                zIndex: 10 - depth,
                opacity: 1 - depth * 0.22,
              }}
            >
              <div className="h-full w-full glass-card bento-card-lg border border-white/60" />
            </div>
          );
        })}

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            onClick={() => onSelect(active)}
            style={{ touchAction: 'pan-y' }}
            className={`absolute inset-x-0 top-0 h-full z-20 cursor-grab active:cursor-grabbing ${
              newlyCreatedId === active.id ? 'ring-2 ring-emerald-500 ring-offset-2 rounded-[2.5rem]' : ''
            }`}
            whileTap={{ scale: 0.99 }}
          >
            <CardFace inc={active} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
