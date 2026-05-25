'use client';
import { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { SILVER_MAP_STYLE, LIGHT_MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/googleMaps';
import type { Route, LatLng } from '@/types/route';
import type { Station } from '@/types/station';

/* Decode a standard Google/OSRM encoded polyline into LatLng points */
function decodePolyline(encoded: string): google.maps.LatLng[] {
  const pts: google.maps.LatLng[] = [];
  let i = 0, lat = 0, lng = 0;
  while (i < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(i++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    pts.push(new google.maps.LatLng(lat / 1e5, lng / 1e5));
  }
  return pts;
}

/* ── Road-following route line via OSRM (no API key required) ────── */
function RoadRouteLine({ origin, destination, mode }: {
  origin: LatLng;
  destination: LatLng;
  mode: 'gradient' | 'animated' | 'dashed';
}) {
  const map = useMap();
  const linesRef    = useRef<google.maps.Polyline[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!map) return;
    let alive = true;

    (async () => {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
          `?overview=full&geometries=polyline`;
        const data = await fetch(url).then(r => r.json());
        if (!alive || data.code !== 'Ok' || !data.routes?.length) return;

        const path = decodePolyline(data.routes[0].geometry as string);
        if (!alive || path.length < 2) return;

        if (mode === 'dashed') {
          linesRef.current.push(new google.maps.Polyline({
            path, map,
            strokeOpacity: 0,
            icons: [{
              icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeWeight: 2.5, strokeColor: '#1E293B', scale: 4 },
              offset: '0', repeat: '18px',
            }],
          }));

        } else if (mode === 'animated') {
          const line = new google.maps.Polyline({
            path, map,
            strokeColor: '#12122A', strokeWeight: 3.5, strokeOpacity: 0.9,
            icons: [{ icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 2.8, strokeColor: '#FFFFFF', strokeWeight: 1.5, fillColor: '#FFFFFF', fillOpacity: 1 }, offset: '0%', repeat: '60px' }],
          });
          linesRef.current.push(line);
          let count = 0;
          intervalRef.current = setInterval(() => {
            count = (count + 1) % 200;
            const icons = line.get('icons');
            if (icons) { icons[0].offset = (count / 2) + '%'; line.set('icons', icons); }
          }, 20);

        } else { /* gradient */
          const colors = ['#00B894', '#00967A', '#006B56', '#2A2A4A', '#12122A'];
          const n = path.length;
          colors.forEach((color, ci) => {
            const s = Math.floor((ci / colors.length) * (n - 1));
            const e = Math.min(Math.floor(((ci + 1) / colors.length) * (n - 1)) + 1, n);
            if (e - s < 2) return;
            linesRef.current.push(new google.maps.Polyline({
              path: path.slice(s, e), map,
              strokeColor: color, strokeWeight: 3.5, strokeOpacity: 0.9,
              icons: [{ icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 2.8, strokeColor: '#FFFFFF', strokeWeight: 1.5, fillColor: '#FFFFFF', fillOpacity: 1 }, offset: '0%', repeat: '60px' }],
            }));
          });
          let count = 0;
          intervalRef.current = setInterval(() => {
            count = (count + 1) % 200;
            linesRef.current.forEach(l => {
              const icons = l.get('icons');
              if (icons) { icons[0].offset = (count / 2) + '%'; l.set('icons', icons); }
            });
          }, 20);
        }
      } catch { /* network unavailable — no route drawn */ }
    })();

    return () => {
      alive = false;
      linesRef.current.forEach(l => l.setMap(null));
      linesRef.current = [];
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, origin.lat, origin.lng, destination.lat, destination.lng, mode]);
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
    <circle cx="65" cy="65" r="58" fill="rgba(9, 11, 11, 0.1)">
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

/* Numbered ranked pin: callout bubble + black rounded-square head + stem + glow dot */
function createRankedPinIcon(rank: 1 | 2 | 3, station: Station): google.maps.Icon {
  const isAI   = rank === 2;
  const glowColor  = isAI ? '#00B894' : rank === 1 ? '#EF4444' : '#9CA3AF';
  const textColor  = isAI ? '#00B894' : rank === 1 ? '#EF4444' : '#374151';
  const outerGlowR = isAI ? 22 : 15;

  const W = 130, CX = 65;

  /* Bubble */
  const bH = 52;
  /* Tail triangle */
  const tailH = 10, tailY = bH;
  /* Pin head */
  const pinW = 50, pinH = 50, pinRx = 13;
  const pinX = CX - pinW / 2, pinY = tailY + tailH;
  /* Stem */
  const stemY1 = pinY + pinH, stemY2 = stemY1 + 16;
  /* Glow */
  const glowCY = stemY2 + 12;
  const totalH  = glowCY + outerGlowR + 4;

  const line1 = `${station.waitTimeMinutes ?? 2} min away`;
  const line2  = `${station.reliability ?? 95}% reliable`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${totalH}" viewBox="0 0 ${W} ${totalH}">
    <defs>
      <filter id="bs${rank}" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.13)"/>
      </filter>
      <radialGradient id="gl${rank}" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="${glowColor}" stop-opacity="0.55"/>
        <stop offset="60%"  stop-color="${glowColor}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Bubble -->
    <rect x="5" y="0" width="${W - 10}" height="${bH}" rx="12" fill="white" filter="url(#bs${rank})"/>
    <polygon points="${CX - 8},${tailY} ${CX},${tailY + tailH} ${CX + 8},${tailY}" fill="white"/>
    <!-- Bubble text -->
    <text x="${CX}" y="20" text-anchor="middle"
      font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="700"
      fill="${textColor}">${line1}</text>
    <text x="${CX}" y="39" text-anchor="middle"
      font-family="system-ui,-apple-system,sans-serif" font-size="11"
      fill="#6B7280">${line2}</text>
    <!-- Glow rings -->
    <circle cx="${CX}" cy="${glowCY}" r="${outerGlowR}" fill="url(#gl${rank})"/>
    <circle cx="${CX}" cy="${glowCY}" r="${outerGlowR * 0.52}" fill="${glowColor}" opacity="0.22"/>
    <circle cx="${CX}" cy="${glowCY}" r="${outerGlowR * 0.28}" fill="${glowColor}" opacity="0.65"/>
    <circle cx="${CX}" cy="${glowCY}" r="${outerGlowR * 0.13}" fill="${glowColor}"/>
    <!-- Stem -->
    <line x1="${CX}" y1="${stemY1}" x2="${CX}" y2="${stemY2}"
      stroke="#374151" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Pin head -->
    <rect x="${pinX}" y="${pinY}" width="${pinW}" height="${pinH}" rx="${pinRx}" fill="#0F0F1A"/>
    <!-- Rank number -->
    <text x="${CX}" y="${pinY + pinH * 0.68}" text-anchor="middle"
      font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="900"
      fill="white">${rank}</text>
  </svg>`;

  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(W, totalH),
    anchor: new google.maps.Point(CX, glowCY),
  };
}

const RANK_WAIT_COUNTS = [8, 1, 3];
const RANK_LABELS      = ['Current', 'Recommended ✓', 'Option 3'];
const RANK_COLORS      = ['#EF4444', '#00B894', '#9CA3AF'];
const RANK_BADGE_BG    = ['#FEE2E2', 'rgba(0,184,148,0.14)', '#F1F5F9'];

function makeInfoContent(station: Station, rank: 1 | 2 | 3): string {
  const i = rank - 1;
  const dot = RANK_COLORS[i];
  return `<div style="font-family:system-ui,-apple-system,sans-serif;padding:10px 4px 4px;min-width:190px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">
      <div style="width:22px;height:22px;border-radius:50%;background:${dot};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="color:white;font-size:11px;font-weight:800;">${rank}</span>
      </div>
      <span style="font-size:13px;font-weight:700;color:#0F0F1A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;">${station.name}</span>
    </div>
    <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;flex-wrap:wrap;">
      <span style="font-size:11px;color:#6B7280;">👥 ${RANK_WAIT_COUNTS[i]} waiting</span>
      <span style="color:#D1D5DB;">·</span>
      <span style="font-size:11px;color:#6B7280;">⏱ ~${station.waitTimeMinutes} min</span>
      <span style="color:#D1D5DB;">·</span>
      <span style="font-size:12px;font-weight:700;color:#0F0F1A;">₹${station.pricePerHour}/hr</span>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:10px;font-weight:600;padding:3px 9px;border-radius:20px;background:${RANK_BADGE_BG[i]};color:${dot};">${RANK_LABELS[i]}</span>
      <span style="font-size:10px;color:#9CA3AF;">${station.reliability}% reliable</span>
    </div>
  </div>`;
}

/* ── Home ranked markers: GPS dot + 3 numbered station pins ─────── */
function HomeRankedMarkers({ currentLoc, rankedStations }: {
  currentLoc: LatLng; rankedStations?: Station[];
}) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null));
    refs.current = [];
    infoRef.current?.close();
    infoRef.current = new google.maps.InfoWindow({ maxWidth: 240 });

    refs.current.push(new google.maps.Marker({ map, position: currentLoc, icon: createLocationDotIcon(), zIndex: 15 }));

    if (rankedStations) {
      rankedStations.slice(0, 3).forEach((station, i) => {
        const rank = (i + 1) as 1 | 2 | 3;
        const pos = { lat: station.latitude, lng: station.longitude };
        const marker = new google.maps.Marker({
          map, position: pos,
          icon: createRankedPinIcon(rank, station),
          zIndex: rank === 2 ? 25 : 20,
          title: station.name,
        });
        marker.addListener('click', () => {
          infoRef.current?.setContent(makeInfoContent(station, rank));
          infoRef.current?.open({ map, anchor: marker });
        });
        refs.current.push(marker);
      });
    }

    const mapClickListener = map.addListener('click', () => infoRef.current?.close());
    return () => {
      refs.current.forEach(m => m.setMap(null));
      infoRef.current?.close();
      google.maps.event.removeListener(mapClickListener);
    };
  }, [map, currentLoc, rankedStations]);
  return null;
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

/* ── Rescue mode: red animated line + technician orange dot ─────── */
function RescueRouteLine({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    lineRef.current = new google.maps.Polyline({
      path: waypoints,
      strokeColor: '#EF4444',
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

function createTechnicianDotIcon(): google.maps.Icon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <circle cx="40" cy="40" r="36" fill="rgba(239,68,68,0.08)">
      <animate attributeName="r" values="18;36;18" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="40" r="24" fill="rgba(239,68,68,0.14)">
      <animate attributeName="r" values="12;24;12" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.35;0;0.35" dur="2s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="40" r="14" fill="rgba(239,68,68,0.22)"/>
    <circle cx="40" cy="40" r="10" fill="#EF4444"/>
    <circle cx="40" cy="40" r="4.5" fill="white"/>
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(80, 80),
    anchor: new google.maps.Point(40, 40),
  };
}

function RescueMarkers({ userLocation, technicianLocation }: { userLocation?: LatLng; technicianLocation?: LatLng }) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null));
    refs.current = [];
    if (userLocation) {
      refs.current.push(new google.maps.Marker({ map, position: userLocation, icon: createLocationDotIcon(), zIndex: 15, title: 'Your location' }));
    }
    if (technicianLocation) {
      refs.current.push(new google.maps.Marker({ map, position: technicianLocation, icon: createTechnicianDotIcon(), zIndex: 20, title: 'Technician' }));
    }
    return () => { refs.current.forEach(m => m.setMap(null)); };
  }, [map, userLocation, technicianLocation]);
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
  /** Rescue screen: red animated route + pulsing technician dot */
  rescueMode?: boolean;
  /** Technician's current interpolated location (rescue mode) */
  technicianLocation?: LatLng;
  /** User's rescue location (rescue mode) */
  userRescueLocation?: LatLng;
  /** Destination lat/lng for glow + marker */
  destLatLng?: LatLng;
  /** Station data for callout text */
  bestStation?: Station;
  /** Override initial map center */
  mapCenter?: LatLng;
  /** Override initial zoom */
  mapZoom?: number;
  /** Home mode: up to 3 stations to show as ranked numbered pins */
  rankedStations?: Station[];
}

function MapContents({ route, stations = [], onStationClick, selectedStationId, pulseMode, homeMode, rescueMode, technicianLocation, userRescueLocation, destLatLng, bestStation, rankedStations }: Props) {
  const currentLoc: LatLng = route?.origin ?? DEFAULT_CENTER;

  if (rescueMode) {
    return (
      <>
        {route && route.waypoints.length >= 2 && <RescueRouteLine waypoints={route.waypoints} />}
        <RescueMarkers userLocation={userRescueLocation} technicianLocation={technicianLocation} />
      </>
    );
  }
  if (homeMode) {
    return (
      <>
        {route && <RoadRouteLine origin={route.origin} destination={route.destination} mode="gradient" />}
        <HomeRankedMarkers currentLoc={currentLoc} rankedStations={rankedStations} />
      </>
    );
  }
  if (pulseMode) {
    return (
      <>
        {route && <RoadRouteLine origin={route.origin} destination={route.destination} mode="animated" />}
        {rankedStations && rankedStations.length > 0
          ? <HomeRankedMarkers currentLoc={currentLoc} rankedStations={rankedStations} />
          : <PulseMarkers currentLoc={currentLoc} destLatLng={destLatLng} bestStation={bestStation} />
        }
      </>
    );
  }
  return (
    <>
      {route && <RoadRouteLine origin={route.origin} destination={route.destination} mode="dashed" />}
      {route && <EVMarker waypoints={route.waypoints} />}
      <StationMarkers stations={stations} onStationClick={onStationClick} selectedId={selectedStationId} />
    </>
  );
}

export function LiveRouteMap({
  route, stations, onStationClick, mapStyle = 'silver', selectedStationId,
  pulseMode, homeMode, rescueMode, technicianLocation, userRescueLocation,
  destLatLng, bestStation, mapCenter, mapZoom, rankedStations,
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
          rescueMode={rescueMode} technicianLocation={technicianLocation}
          userRescueLocation={userRescueLocation}
          destLatLng={destLatLng} bestStation={bestStation} rankedStations={rankedStations}
        />
      </Map>
    </APIProvider>
  );
}
