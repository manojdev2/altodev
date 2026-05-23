'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Bell, Search, SlidersHorizontal, Zap, Tag, Clock, Shield,
  Sparkles, Lock, CheckCircle2, ChevronRight, Crown,
  CalendarCheck, BatteryFull, Headphones, Star
} from 'lucide-react';
import { useAuthStore } from '@/store/authSlice';
import { getNearbyStations } from '@/services/stationService';
import type { Station } from '@/types/station';

const LiveRouteMap = dynamic(
  () => import('@/components/maps/LiveRouteMap').then(m => ({ default: m.LiveRouteMap })),
  { ssr: false, loading: () => <div className="w-full h-full skeleton" /> }
);

const MiniSparkline = dynamic(
  () => import('./MiniSparkline').then(m => ({ default: m.MiniSparkline })),
  { ssr: false }
);

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

const FILTERS = [
  { label: 'Nearby', sub: 'Live & verified', icon: Zap, color: '#00B894' },
  { label: 'Cheapest', sub: 'From ₹15/kWh', icon: Tag, color: '#6C5CE7' },
  { label: 'Short wait', sub: '< 5 min', icon: Clock, color: '#F39C12' },
  { label: 'Reliable', sub: 'High trust', icon: Shield, color: '#0984E3' },
] as const;

const MAP_FILTER_ICONS = [
  { Icon: Zap, label: 'Pulse', active: true },
  { Icon: Tag, label: 'Price', active: false },
  { Icon: Clock, label: 'Wait', active: false },
  { Icon: Shield, label: 'Trust', active: false },
];

const PLUS_FEATURES = [
  { icon: Sparkles, label: 'AI Predictions', sub: 'Max savings' },
  { icon: CalendarCheck, label: 'Smart Reservations', sub: 'Zero wait' },
  { icon: BatteryFull, label: 'Battery Coach', sub: 'Longer life' },
  { icon: Headphones, label: 'Priority Support', sub: '24/7' },
];

/* ── Shared sub-components ───────────────────────────────────────── */
function AIInsightCard() {
  return (
    <div className="card p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: '#6C5CE7' }} />
      <div className="pl-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} style={{ color: '#6C5CE7' }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#6C5CE7' }}>AI Insight</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(108,92,231,0.08)', border: '1px solid rgba(108,92,231,0.2)' }}>
            <Lock size={10} style={{ color: '#6C5CE7' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#6C5CE7' }}>Premium</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#6B7280' }}>Best time to charge today</p>
            <p className="text-xl font-bold" style={{ color: '#6C5CE7' }}>10:30 PM – 1:30 AM</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Save up to <span className="font-semibold text-green-600">₹126</span></p>
          </div>
          <div className="w-28 h-16 flex-shrink-0">
            <MiniSparkline />
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityRow() {
  return (
    <motion.div whileTap={{ scale: 0.99 }}
      className="card flex items-center gap-3 p-3 cursor-pointer">
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(0,184,148,0.12)' }}>
        <CheckCircle2 size={22} style={{ color: '#00B894' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#0F0F1A' }}>Community power</p>
        <p className="text-xs truncate" style={{ color: '#6B7280' }}>Verified live 12 sec ago by 8 nearby drivers</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="flex -space-x-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: ['#6C5CE7', '#00B894', '#F39C12'][i] }}>
              {['A', 'B', 'C'][i]}
            </div>
          ))}
        </div>
        <span className="text-xs font-medium ml-1" style={{ color: '#6B7280' }}>+8</span>
        <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
      </div>
    </motion.div>
  );
}

function AltoPlusCard() {
  return (
    <div className="rounded-2xl p-4"
      style={{ background: 'linear-gradient(135deg, #12122A 0%, #1E1B4B 100%)', border: '1px solid rgba(108,92,231,0.3)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown size={20} style={{ color: '#FFD700' }} />
          <div>
            <p className="font-bold text-white text-base">Alto Plus</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Most intelligent charging experience</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold"
          style={{ border: '1.5px solid rgba(108,92,231,0.6)', color: '#A78BFA' }}>
          Upgrade Now <ChevronRight size={12} />
        </motion.button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {PLUS_FEATURES.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ background: 'rgba(108,92,231,0.12)' }}>
            <Icon size={16} style={{ color: '#A78BFA' }} />
            <p className="text-[9px] text-center font-semibold leading-tight" style={{ color: '#E0D9FF' }}>{label}</p>
            <p className="text-[8px] text-center leading-tight" style={{ color: '#6B7280' }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedStationCard({ station }: { station: Station }) {
  return (
    <div className="card-dark p-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,184,148,0.2)' }}>
          <Zap size={20} style={{ color: '#00B894' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base">{station.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full availability-pulse" style={{ background: '#00B894' }} />
              <span className="text-xs" style={{ color: '#00B894' }}>Live</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={11} style={{ color: '#9CA3AF' }} />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{station.reliability}% trust</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={11} style={{ color: '#9CA3AF' }} />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{station.reviewCount} verified</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: <Zap size={15} style={{ color: '#9CA3AF' }} />, label: 'DC Fast', value: `${station.chargingSpeedKw} kW`, highlight: false },
          { icon: <Tag size={15} style={{ color: '#00B894' }} />, label: `₹${station.pricePerHour}/hr`, value: 'Best price now', highlight: true },
          { icon: <Clock size={15} style={{ color: '#9CA3AF' }} />, label: `< ${station.waitTimeMinutes + 5} min`, value: 'Est. wait time', highlight: false },
        ].map(({ icon, label, value, highlight }) => (
          <div key={label} className="rounded-xl p-2.5 flex flex-col gap-1"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            {icon}
            <p className="text-sm font-bold" style={{ color: highlight ? '#00B894' : '#FFFFFF', fontWeight: 700 }}>{label}</p>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.3)' }}>
          View details
        </button>
        <motion.button whileTap={{ scale: 0.97 }}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #6C5CE7, #8B7FF0)' }}>
          <CalendarCheck size={15} />
          Reserve now
        </motion.button>
      </div>
    </div>
  );
}

/* ── Mobile-only: map section ────────────────────────────────────── */
function MobileMapSection({ stations }: { stations: Station[] }) {
  return (
    <div className="relative w-full" style={{ height: '42vh', minHeight: 240, maxHeight: 400 }}>
      <LiveRouteMap stations={stations} />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
        <div className="rounded-2xl overflow-hidden shadow-lg"
          style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)' }}>
          {MAP_FILTER_ICONS.map(({ Icon, label, active }, i) => (
            <button key={label}
              className={`flex flex-col items-center px-3 py-2.5 ${i < MAP_FILTER_ICONS.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: '#E8EAF0', minWidth: 56 }}>
              <Icon size={18} style={{ color: active ? '#6C5CE7' : '#9CA3AF' }} />
              <span className="text-[10px] mt-0.5 font-medium" style={{ color: active ? '#6C5CE7' : '#9CA3AF' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile-only: filter chips ───────────────────────────────────── */
function FilterChips() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {FILTERS.map(({ label, sub, icon: Icon, color }, i) => (
        <motion.button key={label} whileTap={{ scale: 0.96 }}
          onClick={() => setActive(i)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl whitespace-nowrap flex-shrink-0"
          style={{
            background: active === i ? `${color}15` : '#FFFFFF',
            border: `1.5px solid ${active === i ? color : '#E8EAF0'}`,
            boxShadow: '0 1px 4px rgba(15,15,26,0.05)',
          }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20` }}>
            <Icon size={14} style={{ color }} />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold" style={{ color: active === i ? color : '#0F0F1A' }}>{label}</p>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{sub}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

/* ── Desktop: left panel ─────────────────────────────────────────── */
function DesktopLeftPanel({ user }: { user: { fullName?: string; email?: string } | null }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto"
      style={{ background: '#F5F6FA', borderRight: '1px solid #E8EAF0' }}>
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-8 pb-4">
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#9CA3AF' }}>
            AI Powered · Community Verified
          </p>
          <h1 className="text-xl font-bold mt-0.5" style={{ color: '#0F0F1A' }}>
            {greeting()}, {user?.fullName?.split(' ')[0] ?? 'Arjun'} 👋
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,15,26,0.1)' }}>
            <Bell size={16} style={{ color: '#0F0F1A' }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#6C5CE7' }} />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #6C5CE7, #8B7FF0)' }}>
            {user?.fullName?.charAt(0) ?? 'A'}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 pb-6">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Sessions', value: '142' },
            { label: 'kWh Today', value: '12.4' },
            { label: 'CO₂ Saved', value: '4 kg' },
          ].map(({ label, value }) => (
            <div key={label} className="card p-3 text-center">
              <p className="text-sm font-bold" style={{ color: '#0F0F1A' }}>{value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
            </div>
          ))}
        </div>

        <AIInsightCard />
        <CommunityRow />
        <AltoPlusCard />
      </div>
    </div>
  );
}

/* ── Desktop: station list item ──────────────────────────────────── */
function StationListItem({ station, selected, onClick }: {
  station: Station;
  selected: boolean;
  onClick: () => void;
}) {
  const available = station.status === 'Available';
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick}
      className="w-full text-left p-3.5 rounded-2xl transition-all"
      style={{
        background: selected ? 'rgba(108,92,231,0.06)' : '#FFFFFF',
        border: `1.5px solid ${selected ? '#6C5CE7' : '#F1F5F9'}`,
        boxShadow: '0 1px 6px rgba(15,15,26,0.05)',
      }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: available ? 'rgba(0,184,148,0.1)' : 'rgba(239,68,68,0.1)' }}>
          <Zap size={16} style={{ color: available ? '#00B894' : '#EF4444' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: '#0F0F1A' }}>{station.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full"
                style={{ background: available ? '#00B894' : '#EF4444' }} />
              <span className="text-[11px]" style={{ color: available ? '#00B894' : '#EF4444' }}>
                {station.status}
              </span>
            </div>
            <span className="text-[11px]" style={{ color: '#D1D5DB' }}>·</span>
            <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{station.chargingSpeedKw} kW</span>
            <span className="text-[11px]" style={{ color: '#D1D5DB' }}>·</span>
            <span className="text-[11px] font-medium" style={{ color: '#6C5CE7' }}>₹{station.pricePerHour}/hr</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold" style={{ color: '#00B894' }}>{station.reliability}%</p>
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>trust</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 pt-2" style={{ borderTop: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-1">
          <Clock size={11} style={{ color: '#9CA3AF' }} />
          <span className="text-[11px]" style={{ color: '#6B7280' }}>~{station.waitTimeMinutes} min wait</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={11} style={{ color: '#9CA3AF' }} />
          <span className="text-[11px]" style={{ color: '#6B7280' }}>{station.reviewCount} reviews</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ── Desktop: right panel ────────────────────────────────────────── */
function DesktopRightPanel({ stations, selectedStation, onSelect }: {
  stations: Station[];
  selectedStation: Station | null;
  onSelect: (s: Station) => void;
}) {
  const [filterActive, setFilterActive] = useState(0);
  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background: '#FAFAFA', borderLeft: '1px solid #E8EAF0' }}>
      {/* Search + filters */}
      <div className="p-4 pt-6 flex-shrink-0" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="card flex items-center gap-3 px-4 py-3 mb-3">
          <Search size={15} style={{ color: '#9CA3AF' }} />
          <span className="flex-1 text-sm" style={{ color: '#9CA3AF' }}>Search charger or place</span>
          <div className="w-px h-4" style={{ background: '#E8EAF0' }} />
          <SlidersHorizontal size={15} style={{ color: '#6C5CE7' }} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {FILTERS.map(({ label, icon: Icon, color }, i) => (
            <motion.button key={label} whileTap={{ scale: 0.96 }}
              onClick={() => setFilterActive(i)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 text-xs font-semibold"
              style={{
                background: filterActive === i ? `${color}15` : '#FFFFFF',
                border: `1.5px solid ${filterActive === i ? color : '#E8EAF0'}`,
                color: filterActive === i ? color : '#6B7280',
              }}>
              <Icon size={11} style={{ color: filterActive === i ? color : '#9CA3AF' }} />
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Station list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-[11px] font-semibold px-1 pb-1" style={{ color: '#9CA3AF' }}>
          {stations.length} stations nearby
        </p>
        {stations.map(station => (
          <StationListItem
            key={station._id}
            station={station}
            selected={selectedStation?._id === station._id}
            onClick={() => onSelect(station)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main HomeScreen ─────────────────────────────────────────────── */
export function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getNearbyStations(12.97, 77.59),
  });
  const featuredStation = stations.find(s => s.isAIRecommended) ?? stations[0];

  const toggleStation = (s: Station) =>
    setSelectedStation(prev => prev?._id === s._id ? null : s);

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="min-h-screen lg:hidden" style={{ background: '#F5F6FA' }}>
        <div className="flex items-start justify-between px-5 pt-12 pb-4">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#9CA3AF' }}>
              AI Powered. Community Verified.
            </p>
            <h1 className="text-2xl font-bold mt-0.5" style={{ color: '#0F0F1A' }}>
              {greeting()}, {user?.fullName?.split(' ')[0] ?? 'Arjun'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,15,26,0.1)' }}>
              <Bell size={18} style={{ color: '#0F0F1A' }} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#6C5CE7' }} />
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6C5CE7, #8B7FF0)' }}>
              {user?.fullName?.charAt(0) ?? 'A'}
            </div>
          </div>
        </div>

        <MobileMapSection stations={stations} />

        <div className="px-4 py-4 space-y-4">
          <div className="card flex items-center gap-3 px-4 py-3.5">
            <Search size={16} style={{ color: '#9CA3AF' }} />
            <span className="flex-1 text-sm" style={{ color: '#9CA3AF' }}>Search charger or place</span>
            <div className="w-px h-4" style={{ background: '#E8EAF0' }} />
            <SlidersHorizontal size={16} style={{ color: '#6C5CE7' }} />
          </div>
          <FilterChips />
          <AIInsightCard />
          <CommunityRow />
          {featuredStation && <FeaturedStationCard station={featuredStation} />}
          <AltoPlusCard />
          <div className="h-4" />
        </div>
      </div>

      {/* ── Desktop layout (lg+) ── */}
      <div className="hidden lg:grid h-screen overflow-hidden"
        style={{ gridTemplateColumns: '300px 1fr 300px' }}>

        {/* Left: info panel */}
        <DesktopLeftPanel user={user} />

        {/* Center: full-height interactive map */}
        <div className="relative h-full">
          <LiveRouteMap
            stations={stations}
            onStationClick={toggleStation}
            selectedStationId={selectedStation?._id}
          />

          {/* AI Optimizing badge */}
          <div className="absolute top-5 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
              style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.12)' }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,184,148,0.12)' }}>
                <Sparkles size={14} style={{ color: '#00B894' }} />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#0F0F1A' }}>AI Optimizing</p>
                <div className="flex items-center gap-1">
                  <p className="text-[10px]" style={{ color: '#6B7280' }}>Best routes · Live</p>
                  <span className="w-1.5 h-1.5 rounded-full availability-pulse" style={{ background: '#00B894' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Map filter sidebar */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <div className="rounded-2xl overflow-hidden shadow-lg"
              style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)' }}>
              {MAP_FILTER_ICONS.map(({ Icon, label, active }, i) => (
                <button key={label}
                  className={`flex flex-col items-center px-3 py-2.5 ${i < MAP_FILTER_ICONS.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: '#E8EAF0', minWidth: 56 }}>
                  <Icon size={16} style={{ color: active ? '#6C5CE7' : '#9CA3AF' }} />
                  <span className="text-[10px] mt-0.5 font-medium" style={{ color: active ? '#6C5CE7' : '#9CA3AF' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected station card */}
          {selectedStation && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-6 left-4 right-4 z-10">
              <FeaturedStationCard station={selectedStation} />
            </motion.div>
          )}
        </div>

        {/* Right: search + station list */}
        <DesktopRightPanel
          stations={stations}
          selectedStation={selectedStation}
          onSelect={toggleStation}
        />
      </div>
    </>
  );
}
