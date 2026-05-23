'use client';
import { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { SILVER_MAP_STYLE, LIGHT_MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/googleMaps';
import type { Route, LatLng } from '@/types/route';
import type { Station } from '@/types/station';

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
        offset: '0',
        repeat: '18px',
      }],
      map,
    });
    return () => { lineRef.current?.setMap(null); };
  }, [map, waypoints]);
  return null;
}

function createTearDropIcon(variant: 'home' | 'charger' | 'selected'): google.maps.Icon {
  const bg = variant === 'selected' ? '#00B894' : '#12122A';
  const homeIcon = `<path d="M22 13l-9 8v11h6v-7h6v7h6V21l-9-8z" fill="white" stroke="white" stroke-width="0.3"/>`;
  const zapIcon = `<path d="M25 11l-7 11h5l-4 11 10-14h-6l5-8H25z" fill="white"/>`;
  const iconSvg = variant === 'home' ? homeIcon : zapIcon;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="58" viewBox="0 0 46 58">
    <defs>
      <filter id="ds" x="-30%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000025"/>
      </filter>
    </defs>
    <path d="M23 2C12 2 3 11 3 22C3 37 23 56 23 56C23 56 43 37 43 22C43 11 34 2 23 2Z" fill="${bg}" filter="url(#ds)"/>
    ${iconSvg}
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(46, 58),
    anchor: new google.maps.Point(23, 56),
  };
}

function StationMarkers({ stations, onStationClick, selectedId }: { stations: Station[]; onStationClick?: (s: Station) => void; selectedId?: string }) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null));
    refs.current = [];
    stations.forEach(s => {
      const variant = s._id === selectedId ? 'selected' : 'charger';
      const m = new google.maps.Marker({
        map,
        position: { lat: s.latitude, lng: s.longitude },
        icon: createTearDropIcon(variant),
        title: s.name,
        zIndex: s._id === selectedId ? 20 : 5,
      });
      m.addListener('click', () => onStationClick?.(s));
      refs.current.push(m);
    });
    // Add Home marker at DEFAULT_CENTER
    const homeMarker = new google.maps.Marker({
      map,
      position: DEFAULT_CENTER,
      icon: createTearDropIcon('home'),
      title: 'Home',
      zIndex: 15,
    });
    refs.current.push(homeMarker);
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
    markerRef.current = new google.maps.Marker({ map, position: waypoints[0], zIndex: 10,
      icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 5, fillColor: '#00D4FF', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 1 } });
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

interface Props {
  route?: Route | null;
  stations?: Station[];
  onStationClick?: (s: Station) => void;
  mapStyle?: 'silver' | 'light';
  selectedStationId?: string;
}

function MapContents({ route, stations = [], onStationClick, selectedStationId }: Props) {
  return (
    <>
      {route && <RouteLine waypoints={route.waypoints} />}
      {route && <EVMarker waypoints={route.waypoints} />}
      <StationMarkers stations={stations} onStationClick={onStationClick} selectedId={selectedStationId} />
    </>
  );
}

export function LiveRouteMap({ route, stations, onStationClick, mapStyle = 'silver', selectedStationId }: Props) {
  const style = mapStyle === 'light' ? LIGHT_MAP_STYLE : SILVER_MAP_STYLE;
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        styles={style as unknown as google.maps.MapTypeStyle[]}
        disableDefaultUI
        gestureHandling="greedy">
        <MapContents route={route} stations={stations} onStationClick={onStationClick} selectedStationId={selectedStationId} />
      </Map>
    </APIProvider>
  );
}
