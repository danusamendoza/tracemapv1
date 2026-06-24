import { Incident } from '../types';

export const MADRID_CENTER = { lat: 40.4168, lng: -3.7038 } as const;

export function incidentToHeatWeight(inc: Incident): number {
  const statusWeight: Record<Incident['status'], number> = {
    critical: 1.0,
    warning: 0.65,
    info: 0.45,
    secondary: 0.35,
  };
  const voteBoost = Math.min(inc.votes / 50, 0.25);
  return Math.min(statusWeight[inc.status] + voteBoost, 1);
}

export function incidentsToHeatPoints(incidents: Incident[]): Array<[number, number, number]> {
  return incidents.map((inc) => [inc.lat, inc.lng, incidentToHeatWeight(inc)]);
}

export interface DensityZone {
  lat: number;
  lng: number;
  count: number;
  /** Average heat weight (0..1) of the incidents in the zone. */
  weight: number;
}

/**
 * Groups incidents into coarse spatial cells (~500 m) and returns the centroid,
 * count and average weight of each cell. Used to draw the soft orange radius /
 * density overlays on the map.
 */
export function incidentsToDensityZones(incidents: Incident[]): DensityZone[] {
  const cell = 0.005; // ~500 m at Madrid's latitude
  const buckets = new Map<string, { latSum: number; lngSum: number; count: number; weightSum: number }>();

  for (const inc of incidents) {
    const key = `${Math.round(inc.lat / cell)}:${Math.round(inc.lng / cell)}`;
    const bucket = buckets.get(key) ?? { latSum: 0, lngSum: 0, count: 0, weightSum: 0 };
    bucket.latSum += inc.lat;
    bucket.lngSum += inc.lng;
    bucket.count += 1;
    bucket.weightSum += incidentToHeatWeight(inc);
    buckets.set(key, bucket);
  }

  return [...buckets.values()].map((b) => ({
    lat: b.latSum / b.count,
    lng: b.lngSum / b.count,
    count: b.count,
    weight: b.weightSum / b.count,
  }));
}

/** Radius in meters for a density zone overlay, scaled by incident count. */
export function densityZoneRadius(zone: DensityZone): number {
  return 320 + zone.count * 130;
}

/** Small random offset (~±200 m) around Puerta del Sol for new reports */
export function randomSolCoordinates(): { lat: number; lng: number } {
  return {
    lat: MADRID_CENTER.lat + (Math.random() * 0.004 - 0.002),
    lng: MADRID_CENTER.lng + (Math.random() * 0.004 - 0.002),
  };
}
