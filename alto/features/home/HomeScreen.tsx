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
  { Icon: Shield, label: 'Reliability', active: false },
];

const PLUS_FEATURES = [
  { icon: Sparkles, label: 'AI Predictions', sub: 'Max savings' },
  { icon: CalendarCheck, label: 'Smart Reservations', sub: 'Zero wait' },
  { icon: BatteryFull, label: 'Battery Coach', sub: 'Longer life' },
  { icon: Headphones, label: 'Priority Support', sub: '24/7' },
];

/* ── Map with right-side filter sidebar ─────────────────────────── */
function MapSection({ stations }: { stations: Station[] }) {
  return (
    <div className="relative w-full" style={{ height: '42vh', minHeight: 240, maxHeight: 400 }}>
      <LiveRouteMap stations={stations} />
      {/* Right filter sidebar */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1">
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

/* ── Filter chips ────────────────────────────────────────────────── */
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

/* ── AI Insight card ─────────────────────────────────────────────── */
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

/* ── Community verification ──────────────────────────────────────── */
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

/* ── Featured station card (dark) ────────────────────────────────── */
function FeaturedStationCard({ station }: { station: Station }) {
  return (
    <div className="card-dark p-4">
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
          { icon: <Zap size={15} style={{ color: '#6B7280' }} />, label: 'DC Fast', value: `${station.chargingSpeedKw} kW` },
          { icon: <Tag size={15} style={{ color: '#00B894' }} />, label: station.pricePerHour, value: 'Best price now', highlight: true },
          { icon: <Clock size={15} style={{ color: '#6B7280' }} />, label: `< ${station.waitTimeMinutes + 5} min`, value: 'Est. wait time' },
        ].map(({ icon, label, value, highlight }) => (
          <div key={label} className="rounded-xl p-2.5 flex flex-col gap-1"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            {icon}
            <p className="text-sm font-bold" style={{ color: highlight ? '#00B894' : '#FFFFFF' }}>{label}</p>
            <p className="text-[10px]" style={{ color: '#6B7280' }}>{value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)' }}>
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

/* ── Alto Plus card ──────────────────────────────────────────────── */
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

/* ── Main HomeScreen ─────────────────────────────────────────────── */
export function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getNearbyStations(12.97, 77.59),
  });
  const featuredStation = stations.find(s => s.isAIRecommended) ?? stations[0];

  return (
    <div className="min-h-screen" style={{ background: '#F5F6FA' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-12 pb-4" style={{ background: '#F5F6FA' }}>
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

        {/* Map */}
        <MapSection stations={stations} />

        {/* Scrollable content below map */}
        <div className="px-4 py-4 space-y-4">
          {/* Search bar */}
          <div className="card flex items-center gap-3 px-4 py-3.5">
            <Search size={16} style={{ color: '#9CA3AF' }} />
            <span className="flex-1 text-sm" style={{ color: '#9CA3AF' }}>Search charger or place</span>
            <div className="w-px h-4" style={{ background: '#E8EAF0' }} />
            <SlidersHorizontal size={16} style={{ color: '#6C5CE7' }} />
          </div>

          {/* Filter chips */}
          <FilterChips />

          {/* AI Insight */}
          <AIInsightCard />

          {/* Community */}
          <CommunityRow />

          {/* Featured station */}
          {featuredStation && <FeaturedStationCard station={featuredStation} />}

          {/* Alto Plus */}
          <AltoPlusCard />

          {/* Bottom spacer for nav */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
