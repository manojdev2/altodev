'use client';
import { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { SILVER_MAP_STYLE, LIGHT_MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/googleMaps';
import type { Route, LatLng } from '@/types/route';
import type { Station } from '@/types/station';

/* ── Static dashed line ──────────────────────────────────────────── */
function RouteLine({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const lineRef = useRef<google.maps.Polyline | null>(null);
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    lineRef.current = new google.maps.Polyline({
      path: waypoints,
      strokeOpacity: 0,
      icons: [{
        icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeWeight: 2.5, strokeColor: '#1E293B', scale: 4 },
        offset: '0', repeat: '18px',
      }],
      map,
    });
    return () => { lineRef.current?.setMap(null); };
  }, [map, waypoints]);
  return null;
}

/* ── Dark animated flowing-arrow line (Pulse screen) ─────────────── */
function AnimatedRouteLine({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    lineRef.current = new google.maps.Polyline({
      path: waypoints,
      strokeColor: '#12122A',
      strokeWeight: 3.5,
      strokeOpacity: 0.9,
      icons: [{
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 2.8, strokeColor: '#FFFFFF', strokeWeight: 1.5,
          fillColor: '#FFFFFF', fillOpacity: 1,
        },
        offset: '0%', repeat: '60px',
      }],
      map,
    });
    let count = 0;
    intervalRef.current = setInterval(() => {
      count = (count + 1) % 200;
      const icons = lineRef.current?.get('icons');
      if (icons) { icons[0].offset = (count / 2) + '%'; lineRef.current?.set('icons', icons); }
    }, 20);
    return () => {
      lineRef.current?.setMap(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [map, waypoints]);
  return null;
}

/* ── Green-to-dark gradient animated line (Home screen) ──────────── */
function GradientRouteLine({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const linesRef = useRef<google.maps.Polyline[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    const colors = ['#00B894', '#00967A', '#006B56', '#2A2A4A', '#12122A'];
    const n = waypoints.length;
    colors.forEach((color, i) => {
      const start = Math.floor((i / colors.length) * (n - 1));
      const end = Math.min(Math.floor(((i + 1) / colors.length) * (n - 1)) + 1, n);
      if (end - start < 2) return;
      linesRef.current.push(new google.maps.Polyline({
        path: waypoints.slice(start, end),
        strokeColor: color, strokeWeight: 3.5, strokeOpacity: 0.9,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2.8, strokeColor: '#FFFFFF', strokeWeight: 1.5,
            fillColor: '#FFFFFF', fillOpacity: 1,
          },
          offset: '0%', repeat: '60px',
        }],
        map,
      }));
    });
    let count = 0;
    intervalRef.current = setInterval(() => {
      count = (count + 1) % 200;
      linesRef.current.forEach(line => {
        const icons = line.get('icons');
        if (icons) { icons[0].offset = (count / 2) + '%'; line.set('icons', icons); }
      });
    }, 20);
    return () => {
      linesRef.current.forEach(l => l.setMap(null));
      linesRef.current = [];
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [map, waypoints]);
  return null;
}

/* ── Marker icon factories ───────────────────────────────────────── */

function createTearDropIcon(variant: 'home' | 'charger' | 'selected'): google.maps.Icon {
  const bg = variant === 'selected' ? '#00B894' : '#12122A';
  const homeIcon = `<path d="M22 13l-9 8v11h6v-7h6v7h6V21l-9-8z" fill="white" stroke="white" stroke-width="0.3"/>`;
  const zapIcon = `<path d="M25 11l-7 11h5l-4 11 10-14h-6l5-8H25z" fill="white"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="58" viewBox="0 0 46 58">
    <defs><filter id="ds" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000025"/>
    </filter></defs>
    <path d="M23 2C12 2 3 11 3 22C3 37 23 56 23 56C23 56 43 37 43 22C43 11 34 2 23 2Z" fill="${bg}" filter="url(#ds)"/>
    ${variant === 'home' ? homeIcon : zapIcon}
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(46, 58),
    anchor: new google.maps.Point(23, 56),
  };
}

/* Blue pulsing GPS dot — SMIL <animate> works in Chrome/Firefox */
function createLocationDotIcon(): google.maps.Icon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <circle cx="40" cy="40" r="36" fill="rgba(37,99,235,0.08)">
      <animate attributeName="r" values="18;36;18" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="40" r="24" fill="rgba(37,99,235,0.14)">
      <animate attributeName="r" values="12;24;12" dur="2.4s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="40" r="14" fill="rgba(37,99,235,0.22)"/>
    <circle cx="40" cy="40" r="10" fill="#2563EB"/>
    <circle cx="40" cy="40" r="4.5" fill="white"/>
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(80, 80),
    anchor: new google.maps.Point(40, 40),
  };
}

/* Green pulsing glow ring (Pulse + Home screens) */
function createGlowIcon(): google.maps.Icon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">
    <circle cx="65" cy="65" r="58" fill="rgba(0,184,148,0.1)">
      <animate attributeName="r" values="24;58;24" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="65" cy="65" r="38" fill="rgba(0,184,148,0.18)">
      <animate attributeName="r" values="16;38;16" dur="2s" begin="0.55s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="0.55s" repeatCount="indefinite"/>
    </circle>
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(130, 130),
    anchor: new google.maps.Point(65, 65),
  };
}

/* Black circle destination + callout (Pulse screen) */
function createDestinationIcon(waitMins: number, reliability: number): google.maps.Icon {
  const label1 = `${waitMins} min away`;
  const label2 = `${reliability}% reliable`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
    <defs><filter id="sh" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="rgba(0,0,0,0.14)"/>
    </filter></defs>
    <rect x="2" y="2" width="156" height="62" rx="15" fill="white" filter="url(#sh)"/>
    <text x="16" y="29" font-family="system-ui,-apple-system,sans-serif" font-size="14" font-weight="700" fill="#00B894">${label1}</text>
    <text x="16" y="50" font-family="system-ui,-apple-system,sans-serif" font-size="12" fill="#6B7280">${label2}</text>
    <polygon points="72,64 88,64 80,76" fill="white"/>
    <circle cx="80" cy="98" r="20" fill="#12122A" stroke="white" stroke-width="2.5" filter="url(#sh)"/>
    <rect x="73" y="88.5" width="14" height="4" rx="2" fill="white"/>
    <rect x="70.5" y="92.5" width="19" height="10" rx="3" fill="white"/>
    <rect x="74" y="102.5" width="12" height="4" rx="2" fill="white"/>
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(160, 120),
    anchor: new google.maps.Point(80, 118),
  };
}

/* Rounded-square destination + callout (Home screen) */
function createHomeDestinationIcon(waitMins: number, reliability: number): google.maps.Icon {
  const label1 = `${waitMins} min away`;
  const label2 = `${reliability}% reliable`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="156" viewBox="0 0 160 156">
    <defs><filter id="sh4" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="rgba(0,0,0,0.13)"/>
    </filter></defs>
    <rect x="2" y="2" width="156" height="62" rx="14" fill="white" filter="url(#sh4)"/>
    <text x="16" y="29" font-family="system-ui,-apple-system,sans-serif" font-size="14" font-weight="700" fill="#00B894">${label1}</text>
    <text x="16" y="50" font-family="system-ui,-apple-system,sans-serif" font-size="12" fill="#6B7280">${label2}</text>
    <polygon points="72,64 88,64 80,76" fill="white"/>
    <rect x="58" y="78" width="44" height="44" rx="10" fill="#12122A" filter="url(#sh4)"/>
    <rect x="71" y="88" width="18" height="4" rx="2" fill="white"/>
    <rect x="69" y="92" width="22" height="12" rx="3" fill="white" opacity="0.95"/>
    <rect x="73" y="104" width="14" height="4" rx="2" fill="white"/>
    <rect x="77.5" y="122" width="5" height="14" fill="#12122A"/>
    <ellipse cx="80" cy="140" rx="5.5" ry="5.5" fill="#12122A"/>
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(160, 156),
    anchor: new google.maps.Point(80, 145.5),
  };
}

/* ── Pulse-mode markers (dark circle) ────────────────────────────── */
function PulseMarkers({ currentLoc, destLatLng, bestStation }: {
  currentLoc: LatLng; destLatLng?: LatLng; bestStation?: Station;
}) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null));
    refs.current = [];
    refs.current.push(new google.maps.Marker({ map, position: currentLoc, icon: createLocationDotIcon(), zIndex: 15 }));
    if (destLatLng && bestStation) {
      refs.current.push(new google.maps.Marker({ map, position: destLatLng, icon: createGlowIcon(), zIndex: 10 }));
      refs.current.push(new google.maps.Marker({
        map, position: destLatLng,
        icon: createDestinationIcon(bestStation.waitTimeMinutes, bestStation.reliability),
        zIndex: 20, title: bestStation.name,
      }));
    }
    return () => { refs.current.forEach(m => m.setMap(null)); };
  }, [map, currentLoc, destLatLng, bestStation]);
  return null;
}

/* ── Home-mode markers (rounded-square) ─────────────────────────── */
function HomePulseMarkers({ currentLoc, destLatLng, bestStation }: {
  currentLoc: LatLng; destLatLng?: LatLng; bestStation?: Station;
}) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null));
    refs.current = [];
    refs.current.push(new google.maps.Marker({ map, position: currentLoc, icon: createLocationDotIcon(), zIndex: 15 }));
    if (destLatLng && bestStation) {
      refs.current.push(new google.maps.Marker({ map, position: destLatLng, icon: createGlowIcon(), zIndex: 10 }));
      refs.current.push(new google.maps.Marker({
        map, position: destLatLng,
        icon: createHomeDestinationIcon(bestStation.waitTimeMinutes, bestStation.reliability),
        zIndex: 20, title: bestStation.name,
      }));
    }
    return () => { refs.current.forEach(m => m.setMap(null)); };
  }, [map, currentLoc, destLatLng, bestStation]);
  return null;
}

/* ── Teardrop station markers ────────────────────────────────────── */
function StationMarkers({ stations, onStationClick, selectedId }: {
  stations: Station[]; onStationClick?: (s: Station) => void; selectedId?: string;
}) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null));
    refs.current = [];
    stations.forEach(s => {
      const variant = s._id === selectedId ? 'selected' : 'charger';
      const m = new google.maps.Marker({
        map, position: { lat: s.latitude, lng: s.longitude },
        icon: createTearDropIcon(variant), title: s.name,
        zIndex: s._id === selectedId ? 20 : 5,
      });
      m.addListener('click', () => onStationClick?.(s));
      refs.current.push(m);
    });
    refs.current.push(new google.maps.Marker({
      map, position: DEFAULT_CENTER, icon: createTearDropIcon('home'), title: 'Home', zIndex: 15,
    }));
    return () => { refs.current.forEach(m => m.setMap(null)); };
  }, [map, stations, onStationClick, selectedId]);
  return null;
}

function EVMarker({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const markerRef = useRef<google.maps.Marker | null>(null);
  const animRef = useRef<number | null>(null);
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    markerRef.current = new google.maps.Marker({
      map, position: waypoints[0], zIndex: 10,
      icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 5, fillColor: '#00D4FF', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 1 },
    });
    const dur = 25000; let t0: number | null = null;
    const animate = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const ri = p * (waypoints.length - 1); const fi = Math.floor(ri); const fr = ri - fi;
      if (fi < waypoints.length - 1) {
        const a = waypoints[fi], b = waypoints[fi + 1];
        markerRef.current?.setPosition({ lat: a.lat + (b.lat - a.lat) * fr, lng: a.lng + (b.lng - a.lng) * fr });
      }
      if (p < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); markerRef.current?.setMap(null); };
  }, [map, waypoints]);
  return null;
}

/* ── Props ───────────────────────────────────────────────────────── */
interface Props {
  route?: Route | null;
  stations?: Station[];
  onStationClick?: (s: Station) => void;
  mapStyle?: 'silver' | 'light';
  selectedStationId?: string;
  /** Pulse screen: dark animated arrows + circle destination */
  pulseMode?: boolean;
  /** Home screen: green gradient arrows + rounded-square destination */
  homeMode?: boolean;
  /** Destination lat/lng for glow + marker */
  destLatLng?: LatLng;
  /** Station data for callout text */
  bestStation?: Station;
  /** Override initial map center */
  mapCenter?: LatLng;
  /** Override initial zoom */
  mapZoom?: number;
}

function MapContents({ route, stations = [], onStationClick, selectedStationId, pulseMode, homeMode, destLatLng, bestStation }: Props) {
  const currentLoc: LatLng = route?.waypoints?.[0] ?? DEFAULT_CENTER;

  if (homeMode) {
    return (
      <>
        {route && <GradientRouteLine waypoints={route.waypoints} />}
        <HomePulseMarkers currentLoc={currentLoc} destLatLng={destLatLng} bestStation={bestStation} />
      </>
    );
  }
  if (pulseMode) {
    return (
      <>
        {route && <AnimatedRouteLine waypoints={route.waypoints} />}
        <PulseMarkers currentLoc={currentLoc} destLatLng={destLatLng} bestStation={bestStation} />
      </>
    );
  }
  return (
    <>
      {route && <RouteLine waypoints={route.waypoints} />}
      {route && <EVMarker waypoints={route.waypoints} />}
      <StationMarkers stations={stations} onStationClick={onStationClick} selectedId={selectedStationId} />
    </>
  );
}

export function LiveRouteMap({
  route, stations, onStationClick, mapStyle = 'silver', selectedStationId,
  pulseMode, homeMode, destLatLng, bestStation, mapCenter, mapZoom,
}: Props) {
  const style = mapStyle === 'light' ? LIGHT_MAP_STYLE : SILVER_MAP_STYLE;
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={mapCenter ?? DEFAULT_CENTER}
        defaultZoom={mapZoom ?? DEFAULT_ZOOM}
        styles={style as unknown as google.maps.MapTypeStyle[]}
        disableDefaultUI
        gestureHandling="greedy">
        <MapContents
          route={route} stations={stations} onStationClick={onStationClick}
          selectedStationId={selectedStationId} pulseMode={pulseMode} homeMode={homeMode}
          destLatLng={destLatLng} bestStation={bestStation}
        />
      </Map>
    </APIProvider>
  );
}
