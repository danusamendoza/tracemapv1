import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import { Incident } from '../types';
import {
  MADRID_CENTER,
  incidentsToHeatPoints,
  incidentsToDensityZones,
  densityZoneRadius,
} from '../utils/heatmap';
import { Compass } from '@phosphor-icons/react';

interface IncidentHeatMapProps {
  incidents: Incident[];
  isLoading: boolean;
  newlyCreatedId: string | null;
  onSelectIncident: (inc: Incident) => void;
  fullscreen?: boolean;
  interactive?: boolean;
  className?: string;
  showCompass?: boolean;
  activeIncidentId?: string | null;
}

function MapResizeHandler({ fullscreen }: { fullscreen?: boolean }) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const root = container.closest('.relative') as HTMLElement | null;

    const invalidate = () => map.invalidateSize();

    invalidate();
    const timer = setTimeout(invalidate, 100);

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(invalidate)
      : null;
    resizeObserver?.observe(container);
    if (root && root !== container) resizeObserver?.observe(root);

    return () => {
      clearTimeout(timer);
      resizeObserver?.disconnect();
    };
  }, [map, fullscreen]);

  return null;
}

/** Gently recenters the map on the currently focused incident (carousel sync) */
function MapFocusHandler({
  incidents,
  activeIncidentId,
}: {
  incidents: Incident[];
  activeIncidentId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!activeIncidentId) return;
    const inc = incidents.find((i) => i.id === activeIncidentId);
    if (!inc) return;
    map.flyTo([inc.lat, inc.lng], Math.max(map.getZoom(), 14), {
      duration: 0.6,
    });
  }, [map, incidents, activeIncidentId]);

  return null;
}

function HeatLayer({ incidents }: { incidents: Incident[] }) {
  const map = useMap();

  useEffect(() => {
    if (incidents.length === 0) return;

    let layer: L.Layer | null = null;
    let cancelled = false;

    const addHeatLayer = () => {
      if (cancelled) return;
      const size = map.getSize();
      if (size.x === 0 || size.y === 0) {
        map.once('resize', addHeatLayer);
        map.invalidateSize();
        return;
      }

      const points = incidentsToHeatPoints(incidents);
      layer = (L as typeof L & { heatLayer: typeof import('leaflet.heat').default }).heatLayer(
        points,
        {
          radius: 34,
          blur: 26,
          maxZoom: 17,
          minOpacity: 0.3,
          gradient: {
            0.2: '#FFFFFF',
            0.45: '#FED7AA',
            0.7: '#FB923C',
            1.0: '#EA580C',
          },
        }
      );
      layer.addTo(map);
    };

    addHeatLayer();

    return () => {
      cancelled = true;
      map.off('resize', addHeatLayer);
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [map, incidents]);

  return null;
}

/** Soft orange radius / density overlays (referencia imagen2). */
function RadiusOverlayLayer({ incidents }: { incidents: Incident[] }) {
  const map = useMap();

  useEffect(() => {
    if (incidents.length === 0) return;

    const group = L.layerGroup();
    const zones = incidentsToDensityZones(incidents);

    zones.forEach((zone) => {
      const fillOpacity = 0.1 + Math.min(zone.weight, 1) * 0.12;
      L.circle([zone.lat, zone.lng], {
        radius: densityZoneRadius(zone),
        className: 'density-radius',
        stroke: false,
        fillColor: '#F59E0B',
        fillOpacity,
      }).addTo(group);
    });

    group.addTo(map);

    return () => {
      map.removeLayer(group);
    };
  }, [map, incidents]);

  return null;
}

/** Marker clustering: groups nearby incidents into numbered bubbles. */
function ClusterLayer({
  incidents,
  newlyCreatedId,
  interactive,
  onSelectIncident,
}: {
  incidents: Incident[];
  newlyCreatedId: string | null;
  interactive: boolean;
  onSelectIncident: (inc: Incident) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: 50,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      removeOutsideVisibleBounds: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const isHot = count >= 4;
        const size = count >= 10 ? 54 : count >= 4 ? 46 : 40;
        const fontSize = count >= 10 ? 16 : 14;
        return L.divIcon({
          html: `<div class="cluster-bubble ${isHot ? 'is-hot' : ''}" style="width:${size}px;height:${size}px;font-size:${fontSize}px">${count}</div>`,
          className: 'tracemap-cluster',
          iconSize: [size, size],
        });
      },
    });

    incidents.forEach((inc) => {
      const marker = L.marker([inc.lat, inc.lng], {
        icon: createIncidentIcon(inc, newlyCreatedId === inc.id),
      });
      if (interactive) {
        marker.on('click', () => onSelectIncident(inc));
      }
      group.addLayer(marker);
    });

    map.addLayer(group);

    return () => {
      map.removeLayer(group);
    };
  }, [map, incidents, newlyCreatedId, interactive, onSelectIncident]);

  return null;
}

function categoryMarkerHtml(inc: Incident, isNewReport: boolean): string {
  const statusBg: Record<Incident['status'], string> = {
    critical: 'bg-critical',
    warning: 'bg-warning',
    info: 'bg-primary',
    secondary: 'bg-warning',
  };
  const bgClass = statusBg[inc.status];

  const icons: Record<Incident['category'], string> = {
    accidente: '⚠',
    seguridad: '🛡',
    congestion: '👥',
    retraso: '⏱',
    obras: '⚙',
  };

  const pulseRing = isNewReport
    ? '<span class="absolute -inset-4 rounded-full border-4 border-emerald-500 animate-ping opacity-60 pointer-events-none"></span>'
    : '';

  return `
    <div class="relative w-9 h-9 flex items-center justify-center">
      ${pulseRing}
      <div class="relative w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-xl ${bgClass} text-white text-sm font-bold cursor-pointer">
        ${icons[inc.category]}
      </div>
    </div>
  `;
}

function createIncidentIcon(inc: Incident, isNewReport: boolean): L.DivIcon {
  return L.divIcon({
    html: categoryMarkerHtml(inc, isNewReport),
    className: 'incident-marker-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export default function IncidentHeatMap({
  incidents,
  isLoading,
  newlyCreatedId,
  onSelectIncident,
  fullscreen = false,
  interactive = true,
  className = '',
  showCompass = true,
  activeIncidentId = null,
}: IncidentHeatMapProps) {
  const heightClass = fullscreen ? 'h-full min-h-0 flex-1' : 'flex-1 min-h-0 w-full';

  return (
    <div className={`relative w-full overflow-hidden border-b border-slate-100 ${heightClass} ${className}`}>
      <div className="absolute inset-0">
      <MapContainer
        center={[MADRID_CENTER.lat, MADRID_CENTER.lng]}
        zoom={fullscreen ? 14 : 13}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        <MapResizeHandler fullscreen={fullscreen} />
        <MapFocusHandler incidents={incidents} activeIncidentId={activeIncidentId} />
        {incidents.length > 0 && <RadiusOverlayLayer incidents={incidents} />}
        {incidents.length > 0 && <HeatLayer incidents={incidents} />}
        {incidents.length > 0 && (
          <ClusterLayer
            incidents={incidents}
            newlyCreatedId={newlyCreatedId}
            interactive={interactive}
            onSelectIncident={onSelectIncident}
          />
        )}
      </MapContainer>
      </div>

      {interactive && showCompass && (
        <div className="absolute right-3.5 bottom-3.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md text-slate-500 pointer-events-none z-[1000]">
          <Compass className="w-4 h-4 animate-spin-slow text-primary-container" />
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[2px] flex items-center justify-center z-[1000]">
          <div className="bg-white/95 px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-600">Actualizando mapa social...</span>
          </div>
        </div>
      )}
    </div>
  );
}
