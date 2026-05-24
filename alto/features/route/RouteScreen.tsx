'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, Search, Layers, CloudRain, Navigation, Clock, Shield } from 'lucide-react';
import { getOptimizedRoute } from '@/services/routeService';
import { getNearbyStations } from '@/services/stationService';

const LiveRouteMap = dynamic(
  () => import('@/components/maps/LiveRouteMap').then(m => ({ default: m.LiveRouteMap })),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: '#F0F4F8' }} /> }
);

const ORIGIN = { lat: 12.9279, lng: 77.6271 };
const DEST   = { lat: 12.9698, lng: 77.7500 };
const PULSE_CENTER = { lat: 12.948, lng: 77.700 };

const SHEET_H = 172;

export function RouteScreen() {
  const [sheetOpen, setSheetOpen] = useState(true);

  const { data: route } = useQuery({
    queryKey: ['route'],
    queryFn: () => getOptimizedRoute(ORIGIN, DEST, 72),
  });
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getNearbyStations(12.97, 77.59),
  });

  const bestStation = stations.find(s => s.isAIRecommended) ?? stations[0];

  return (
    <div className="relative h-screen overflow-hidden" style={{ background: '#F0F4F8' }}>

      {/* ── Map ── */}
      <div className="absolute inset-0" style={{ bottom: sheetOpen ? SHEET_H : 80 }}>
        <LiveRouteMap
          route={route}
          mapStyle="silver"
          pulseMode
          destLatLng={DEST}
          bestStation={bestStation}
          mapCenter={PULSE_CENTER}
          mapZoom={11}
        />
      </div>

      {/* ── AI Optimizing card (top-left) ── */}
      <div className="absolute z-30" style={{ top: 48, left: 16 }}>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 16px rgba(15,15,26,0.12)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(108,92,231,0.1)' }}>
            <Sparkles size={17} style={{ color: '#6C5CE7' }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#0F0F1A' }}>AI Optimizing</p>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px]" style={{ color: '#6B7280' }}>Best route & time</p>
              <span className="w-1.5 h-1.5 rounded-full availability-pulse" style={{ background: '#00B894' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Layers buttons (top-right) ── */}
      <div className="absolute z-30 flex flex-col gap-2" style={{ top: 48, right: 16 }}>
        <button className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.12)' }}>
          <Search size={17} style={{ color: '#374151' }} />
        </button>
        <button className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.12)' }}>
          <Layers size={17} style={{ color: '#374151' }} />
        </button>
      </div>

      {/* ── Weather widget (right-center) ── */}
      <div className="absolute z-30" style={{ right: 16, top: '50%', transform: 'translateY(-50%)' }}>
        <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.1)' }}>
          <CloudRain size={20} style={{ color: '#60A5FA' }} />
          <p className="text-sm font-bold leading-none" style={{ color: '#0F0F1A' }}>24°</p>
          <p className="text-[10px] text-center leading-tight" style={{ color: '#6B7280' }}>
            Light<br />rain
          </p>
        </div>
      </div>

      {/* ── Bottom sheet ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 rounded-t-3xl"
        style={{ background: '#FFFFFF', boxShadow: '0 -4px 24px rgba(15,15,26,0.1)' }}
        animate={{ y: sheetOpen ? 0 : SHEET_H + 8 }}
        transition={{ type: 'spring', damping: 30, stiffness: 240 }}>

        {/* Pull handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={() => setSheetOpen(o => !o)}>
          <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
        </div>

        {/* Station card */}
        {bestStation ? (
          <div className="flex items-center gap-4 px-5 pb-8 pt-2">
            {/* Charging station icon */}
            <div className="w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden flex items-center justify-center"
              style={{ background: '#12122A' }}>
              <svg width="26" height="32" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="0" width="12" height="4.5" rx="2.25" fill="white" opacity="0.9"/>
                <rect x="4" y="4.5" width="18" height="15" rx="3" fill="white" opacity="0.95"/>
                <rect x="8" y="19.5" width="10" height="3.5" rx="1.75" fill="white" opacity="0.8"/>
                <rect x="10" y="23" width="6" height="9" rx="1.5" fill="white" opacity="0.65"/>
              </svg>
            </div>

            {/* Station info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-[15px]" style={{ color: '#0F0F1A' }}>Best charger for you</p>
                {/* Green checkmark badge */}
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#00B894' }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p className="text-[13px] mb-2.5" style={{ color: '#6B7280' }}>
                {Math.round(bestStation.distanceKm * 1000)} m · {bestStation.address.split(',').slice(-2, -1)[0]?.trim() ?? 'Indiranagar'}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} style={{ color: '#9CA3AF' }} />
                  <span className="text-[12px] font-medium" style={{ color: '#374151' }}>
                    {bestStation.waitTimeMinutes} min away
                  </span>
                </div>
                <div className="w-px h-3" style={{ background: '#E8EAF0' }} />
                <div className="flex items-center gap-1.5">
                  <Shield size={13} style={{ color: '#9CA3AF' }} />
                  <span className="text-[12px] font-medium" style={{ color: '#374151' }}>
                    {bestStation.reliability}% reliable
                  </span>
                </div>
              </div>
            </div>

            {/* Navigate button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#0F0F1A', boxShadow: '0 4px 16px rgba(15,15,26,0.3)' }}>
              <Navigation size={19} className="text-white" style={{ transform: 'rotate(40deg)' }} />
            </motion.button>
          </div>
        ) : (
          <div className="px-5 pb-8 pt-2 h-32" />
        )}
      </motion.div>
    </div>
  );
}
