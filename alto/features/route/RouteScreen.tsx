'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Sparkles, SlidersHorizontal, Zap, Tag, Clock, Shield, Cloud,
  Users, ChevronRight, Crosshair, Zap as ZapIcon
} from 'lucide-react';
import { getOptimizedRoute } from '@/services/routeService';
import { getNearbyStations } from '@/services/stationService';
import type { Station } from '@/types/station';

const LiveRouteMap = dynamic(
  () => import('@/components/maps/LiveRouteMap').then(m => ({ default: m.LiveRouteMap })),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: '#EEF2FF' }} /> }
);

const ChargingTimeChart = dynamic(
  () => import('./ChargingTimeChart').then(m => ({ default: m.ChargingTimeChart })),
  { ssr: false }
);

const RIGHT_FILTERS = [
  { icon: Zap, label: 'Live', active: true },
  { icon: Tag, label: 'Price', active: false },
  { icon: Clock, label: 'Wait', active: false },
  { icon: Shield, label: 'Trust', active: false },
  { icon: Cloud, label: 'Weather', active: false },
];

function BestMatchCard({ station }: { station: Station }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-20"
      style={{ top: '35%', left: '50%', transform: 'translateX(-60%)' }}>
      <div className="rounded-2xl px-4 py-3 shadow-lg" style={{ background: '#FFFFFF', minWidth: 180 }}>
        <p className="text-xs font-bold mb-0.5" style={{ color: '#00B894' }}>Best match</p>
        <p className="text-sm font-bold" style={{ color: '#0F0F1A' }}>{station.reliability}% reliable</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs" style={{ color: '#6B7280' }}>{station.pricePerHour}</span>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>·</span>
          <ZapIcon size={10} style={{ color: '#F39C12' }} />
          <span className="text-xs font-medium" style={{ color: '#F39C12' }}>Fast</span>
        </div>
      </div>
    </motion.div>
  );
}

export function RouteScreen() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);

  const { data: route } = useQuery({
    queryKey: ['route'],
    queryFn: () => getOptimizedRoute({ lat: 12.9279, lng: 77.6271 }, { lat: 12.9698, lng: 77.7500 }, 72),
  });
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getNearbyStations(12.97, 77.59),
  });

  const SHEET_H = 'calc(38vh + 16px)';

  return (
    <div className="relative h-screen overflow-hidden" style={{ background: '#EEF2FF' }}>

      {/* ── Map ── */}
      <div className="absolute inset-0" style={{ bottom: sheetOpen ? '38vh' : '64px' }}>
        <LiveRouteMap
          route={route}
          stations={stations}
          onStationClick={s => setSelectedStation(prev => prev?._id === s._id ? null : s)}
          mapStyle="silver"
          selectedStationId={selectedStation?._id}
        />
        {selectedStation && <BestMatchCard station={selectedStation} />}
      </div>

      {/* ── AI Optimizing card (top-left) ── */}
      <div className="absolute top-12 left-4 z-30">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.1)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,184,148,0.12)' }}>
            <Sparkles size={16} style={{ color: '#00B894' }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#0F0F1A' }}>AI Optimizing</p>
            <div className="flex items-center gap-1">
              <p className="text-[10px]" style={{ color: '#6B7280' }}>Best route & time</p>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00B894' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Settings button (top-right) ── */}
      <div className="absolute top-12 right-4 z-30">
        <button className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.1)' }}>
          <SlidersHorizontal size={18} style={{ color: '#374151' }} />
        </button>
      </div>

      {/* ── Right sidebar filters ── */}
      <div className="absolute right-4 z-30" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(15,15,26,0.1)' }}>
          {RIGHT_FILTERS.map(({ icon: Icon, label, active }, i) => (
            <button key={label}
              className={`flex flex-col items-center justify-center px-3.5 py-3 ${i < RIGHT_FILTERS.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: '#F1F5F9', minWidth: 60 }}>
              <Icon size={17} style={{ color: active ? '#6C5CE7' : '#9CA3AF' }} />
              <span className="text-[10px] mt-1 font-medium" style={{ color: active ? '#6C5CE7' : '#9CA3AF' }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── GPS button ── */}
      <div className="absolute right-4 z-30" style={{ bottom: sheetOpen ? 'calc(38vh + 56px)' : '120px' }}>
        <button className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.12)' }}>
          <Crosshair size={18} style={{ color: '#374151' }} />
        </button>
      </div>

      {/* ── Live community pill ── */}
      <div className="absolute left-4 z-30" style={{ bottom: sheetOpen ? 'calc(38vh + 12px)' : '76px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.1)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,184,148,0.12)' }}>
            <Users size={14} style={{ color: '#00B894' }} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold" style={{ color: '#0F0F1A' }}>Live community</p>
              <span className="w-1.5 h-1.5 rounded-full availability-pulse" style={{ background: '#00B894' }} />
            </div>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>1,243 updates · 12s ago</p>
          </div>
          <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
        </motion.button>
      </div>

      {/* ── Bottom sheet ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ height: SHEET_H }}
        animate={{ y: sheetOpen ? 0 : 'calc(38vh - 48px)' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}>
        <div className="h-full rounded-t-3xl px-5 pt-3 pb-6 overflow-y-auto"
          style={{ background: '#FFFFFF', boxShadow: '0 -4px 24px rgba(15,15,26,0.08)' }}>
          {/* Pull handle */}
          <div className="flex justify-center mb-4 cursor-pointer" onClick={() => setSheetOpen(o => !o)}>
            <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
          </div>

          {/* Charging time info */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#374151' }}>Best time to charge today</p>
              <p className="text-2xl font-bold" style={{ color: '#00B894' }}>10:30 PM – 1:30 AM</p>
              <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Save up to ₹126</p>
            </div>
          </div>

          {/* Chart */}
          <ChargingTimeChart />
        </div>
      </motion.div>
    </div>
  );
}
