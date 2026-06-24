import { Incident } from '../types';

export type ZoneSafetyLevel = 'segura' | 'moderada' | 'critica';

export interface ZoneMonitoringStats {
  safetyLevel: ZoneSafetyLevel;
  safetyLabel: string;
  reportCount: number;
  rating: number;
  resolvedCount: number;
  lastIncidentAgo: string | null;
}

/** Mock fijo: valoración media de la zona según usuarios. */
const MOCK_ZONE_RATING = 4.2;

/** Mock fijo: incidencias resueltas en la zona. */
const MOCK_RESOLVED_COUNT = 12;

/**
 * Deriva indicadores de Zone Monitoring a partir de los incidentes mock.
 * Nivel: crítica si hay ≥1 critical; moderada si hay warnings; segura en otro caso.
 */
export function computeZoneMonitoringStats(incidents: Incident[]): ZoneMonitoringStats {
  const hasCritical = incidents.some((inc) => inc.status === 'critical');
  const hasWarning = incidents.some((inc) => inc.status === 'warning');

  let safetyLevel: ZoneSafetyLevel = 'segura';
  let safetyLabel = 'Segura';

  if (hasCritical) {
    safetyLevel = 'critica';
    safetyLabel = 'Crítica';
  } else if (hasWarning) {
    safetyLevel = 'moderada';
    safetyLabel = 'Moderada';
  }

  const mostRecent =
    incidents.length > 0
      ? incidents.reduce((latest, inc) => (inc.timestamp > latest.timestamp ? inc : latest))
      : null;

  return {
    safetyLevel,
    safetyLabel,
    reportCount: incidents.length,
    rating: MOCK_ZONE_RATING,
    resolvedCount: MOCK_RESOLVED_COUNT,
    lastIncidentAgo: mostRecent?.timeAgo ?? null,
  };
}

export function safetyLevelColorClass(level: ZoneSafetyLevel): string {
  switch (level) {
    case 'segura':
      return 'text-success';
    case 'moderada':
      return 'text-warning';
    case 'critica':
      return 'text-critical';
  }
}

/** Formato compacto de conteo (p. ej. 7 → "07"). */
export function formatIndicatorCount(value: number): string {
  return value.toString().padStart(2, '0');
}
