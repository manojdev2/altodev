'use client';
import { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { SILVER_MAP_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/googleMaps';
import type { Route, LatLng } from '@/types/route';
import type { Station } from '@/types/station';

function RouteLine({ waypoints }: { waypoints: LatLng[] }) {
  const map = useMap();
  const lineRef = useRef<google.maps.Polyline | null>(null);
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    lineRef.current = new google.maps.Polyline({ path: waypoints, strokeColor: '#00D4FF', strokeWeight: 4, strokeOpacity: 0.9, map });
    return () => { lineRef.current?.setMap(null); };
  }, [map, waypoints]);
  return null;
}

function createMarkerIcon(color: string): google.maps.Icon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="20" fill="${color}" fill-opacity="0.18"/>
    <circle cx="22" cy="22" r="13" fill="${color}" fill-opacity="0.35"/>
    <circle cx="22" cy="22" r="8" fill="${color}"/>
    <circle cx="22" cy="22" r="3.5" fill="white"/>
  </svg>`;
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(44, 44),
    anchor: new google.maps.Point(22, 22),
  };
}

function StationMarkers({ stations, onStationClick }: { stations: Station[]; onStationClick?: (s: Station) => void }) {
  const map = useMap();
  const refs = useRef<google.maps.Marker[]>([]);
  useEffect(() => {
    if (!map) return;
    refs.current.forEach(m => m.setMap(null));
    refs.current = [];
    stations.forEach(s => {
      const color = s.status === 'Available' ? '#00B894' : s.status === 'Busy' ? '#F39C12' : '#E74C3C';
      const m = new google.maps.Marker({
        map,
        position: { lat: s.latitude, lng: s.longitude },
        icon: createMarkerIcon(color),
        title: s.name,
        zIndex: s.isAIRecommended ? 10 : 5,
      });
      m.addListener('click', () => onStationClick?.(s));
      refs.current.push(m);
    });
    return () => { refs.current.forEach(m => m.setMap(null)); };
  }, [map, stations, onStationClick]);
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

interface Props { route?: Route | null; stations?: Station[]; onStationClick?: (s: Station) => void; }

function MapContents({ route, stations = [], onStationClick }: Props) {
  return (
    <>
      {route && <RouteLine waypoints={route.waypoints} />}
      {route && <EVMarker waypoints={route.waypoints} />}
      <StationMarkers stations={stations} onStationClick={onStationClick} />
    </>
  );
}

export function LiveRouteMap({ route, stations, onStationClick }: Props) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={13}
        styles={SILVER_MAP_STYLE as unknown as google.maps.MapTypeStyle[]}
        disableDefaultUI
        gestureHandling="greedy"
        mapTypeId="roadmap"
      >
        <MapContents route={route} stations={stations} onStationClick={onStationClick} />
      </Map>
    </APIProvider>
  );
}
