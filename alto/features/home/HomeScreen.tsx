'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Bell, Search, Layers, Crosshair, Sparkles, Shield, Tag, Clock,
  ChevronRight,
  CheckCircle2, Crown, CalendarCheck, BatteryFull, Headphones, Lock, Zap, X, Plug,
} from 'lucide-react';
import { useAuthStore } from '@/store/authSlice';
import { getNearbyStations } from '@/services/stationService';
import { getOptimizedRoute } from '@/services/routeService';
import type { Station } from '@/types/station';

const LiveRouteMap = dynamic(
  () => import('@/components/maps/LiveRouteMap').then(m => ({ default: m.LiveRouteMap })),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: '#F0F4F8' }} /> }
);

const MiniSparkline = dynamic(
  () => import('./MiniSparkline').then(m => ({ default: m.MiniSparkline })),
  { ssr: false }
);

const ORIGIN = { lat: 12.9279, lng: 77.6271 };
const DEST   = { lat: 12.9698, lng: 77.7500 };
const HOME_MAP_CENTER = { lat: 12.948, lng: 77.700 };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

/* ── Trip stats row ──────────────────────────────────────────────── */
function TripStatsRow() {
  const stats = [
    { label: 'ARRIVE',   value: '4:18 PM' },
    { label: 'TRIP',     value: '2h 47m'  },
    { label: 'CHARGING', value: '₹185'    },
  ] as const;
  return (
    <div className="flex rounded-2xl overflow-hidden"
      style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
      {stats.map(({ label, value }, i) => (
        <div key={label} className="flex-1 flex flex-col items-center py-3 gap-0.5"
          style={{ borderRight: i < stats.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
          <p className="text-[9px] font-bold tracking-widest" style={{ color: '#9CA3AF' }}>{label}</p>
          <p className="text-[14px] font-bold" style={{ color: '#0F0F1A' }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Savings tags row ────────────────────────────────────────────── */
function SavingsTagsRow() {
  const tags = [
    { text: '-22 min wait', green: true  },
    { text: '-₹86 cost',   green: true  },
    { text: '+2 mi detour', green: false },
    { text: '150 kW DC',   green: false },
  ] as const;
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map(({ text, green }) => (
        <span key={text} className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{
            background: green ? 'rgba(0,184,148,0.1)' : '#F1F5F9',
            color: green ? '#00B894' : '#6B7280',
          }}>
          {text}
        </span>
      ))}
    </div>
  );
}

/* ── Charging stop card ──────────────────────────────────────────── */
const STOP_META = [
  { network: 'Tata Power',  distKm: 0.8, kw: 50,  chargeTo: 65, timeMin: 18, costRs: 72,  aiPick: false },
  { network: 'ChargePoint', distKm: 1.2, kw: 150, chargeTo: 80, timeMin: 22, costRs: 85,  aiPick: true  },
  { network: 'BPCL EV',     distKm: 2.1, kw: 50,  chargeTo: 72, timeMin: 28, costRs: 95,  aiPick: false },
] as const;

function ChargingStopCard({ station, rank }: { station: Station; rank: 1 | 2 | 3 }) {
  const meta = STOP_META[rank - 1];
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${meta.aiPick ? 'rgba(0,184,148,0.3)' : '#F1F5F9'}` }}>
      <div className="flex items-center gap-3 p-3.5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#0F0F1A' }}>
          <span className="text-[14px] font-black text-white">{rank}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[13px] truncate" style={{ color: '#0F0F1A' }}>
              {station.name}
            </p>
            {meta.aiPick && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
                style={{ background: 'rgba(0,184,148,0.12)', color: '#00B894' }}>
                AI PICK
              </span>
            )}
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>
            {meta.network} · {meta.distKm} km · {meta.kw} kW DC
          </p>
        </div>
      </div>
      <div className="flex" style={{ borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
        {([
          { label: 'CHARGE TO', value: `${meta.chargeTo}%` },
          { label: 'TIME',      value: `${meta.timeMin} min` },
          { label: 'COST',      value: `₹${meta.costRs}` },
        ] as const).map(({ label, value }, i) => (
          <div key={label} className="flex-1 flex flex-col items-center py-2.5"
            style={{ borderRight: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
            <p className="text-[9px] font-bold tracking-widest" style={{ color: '#9CA3AF' }}>{label}</p>
            <p className="text-[13px] font-bold mt-0.5"
              style={{ color: meta.aiPick && label === 'COST' ? '#00B894' : '#0F0F1A' }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Start trip CTA row ──────────────────────────────────────────── */
function StartTripRow() {
  return (
    <div className="flex gap-2">
      <motion.button whileTap={{ scale: 0.97 }}
        className="flex-1 py-4 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
        style={{ background: '#0F0F1A' }}>
        Start trip →
      </motion.button>
      <motion.button whileTap={{ scale: 0.95 }}
        className="w-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: '#F1F5F9' }}>
        <Plug size={20} style={{ color: '#0F0F1A' }} />
      </motion.button>
    </div>
  );
}

/* ── Desktop shared sub-components ──────────────────────────────── */
const FILTERS = [
  { label: 'Nearby',     icon: Zap,    color: '#00B894' },
  { label: 'Cheapest',   icon: Tag,    color: '#00B894' },
  { label: 'Short wait', icon: Clock,  color: '#F39C12' },
  { label: 'Reliable',   icon: Shield, color: '#0984E3' },
] as const;

const PLUS_FEATURES = [
  { icon: Sparkles,      label: 'AI Predictions',     sub: 'Max savings'  },
  { icon: CalendarCheck, label: 'Smart Reservations', sub: 'Zero wait'    },
  { icon: BatteryFull,   label: 'Battery Coach',      sub: 'Longer life'  },
  { icon: Headphones,    label: 'Priority Support',   sub: '24/7'         },
]
const MAP_FILTER_ICONS = [
  { Icon: Zap, label: 'Live', active: true },
  { Icon: Tag, label: 'Price', active: false },
  { Icon: Clock, label: 'Wait', active: false },
  { Icon: Shield, label: 'Trust', active: false },
];



function AIInsightCard() {
  return (
    <div className="card p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: '#00B894' }} />
      <div className="pl-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} style={{ color: '#00B894' }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#6C5CE7' }}>Best time to charge</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.2)' }}>
            <Lock size={10} style={{ color: '#00B894' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#00B894' }}>Premium</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#6B7280' }}>Best time to charge today</p>
            <p className="text-xl font-bold" style={{ color: '#00B894' }}>10:30 PM – 1:30 AM</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
              Save up to <span className="font-semibold" style={{ color: '#00B894' }}>₹126</span>
            </p>
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
    <motion.div whileTap={{ scale: 0.99 }} className="card flex items-center gap-3 p-3 cursor-pointer">
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(0,184,148,0.12)' }}>
        <CheckCircle2 size={22} style={{ color: '#00B894' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#0F0F1A' }}>Drivers near you</p>
        <p className="text-xs truncate" style={{ color: '#6B7280' }}>8 drivers confirmed this charger 12 sec ago</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="flex -space-x-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: ['#00B894', '#0984E3', '#F39C12'][i] }}>
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
      style={{ background: 'linear-gradient(135deg, #12122A 0%, #0D2B22 100%)', border: '1px solid rgba(0,184,148,0.25)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown size={20} style={{ color: '#FFD700' }} />
          <div>
            <p className="font-bold text-white text-base">Alto Plus</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Smarter charging, every time</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold"
          style={{ border: '1.5px solid rgba(0,184,148,0.5)', color: '#00B894' }}>
          Upgrade <ChevronRight size={12} />
        </motion.button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {PLUS_FEATURES.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl"
            style={{ background: 'rgba(0,184,148,0.1)' }}>
            <Icon size={16} style={{ color: '#00B894' }} />
            <p className="text-[9px] text-center font-semibold leading-tight" style={{ color: '#E0FFF8' }}>{label}</p>
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
          Book now
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
      <div className="flex items-start justify-between px-5 pt-8 pb-4">
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#9CA3AF' }}>
            Smart Charging · Verified by Drivers
          </p>
          <h1 className="text-xl font-bold mt-0.5" style={{ color: '#0F0F1A' }}>
            {greeting()}, {user?.fullName?.split(' ')[0] ?? 'Arjun'} 👋
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,15,26,0.1)' }}>
            <Bell size={16} style={{ color: '#0F0F1A' }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#00B894' }} />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #00B894, #00D4A8)' }}>
            {user?.fullName?.charAt(0) ?? 'A'}
          </div>
        </div>
      </div>
      <div className="px-4 space-y-3 pb-6">
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
          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>rating</p>
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
      <div className="p-4 pt-6 flex-shrink-0" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="card flex items-center gap-3 px-4 py-3 mb-3">
          <Search size={15} style={{ color: '#9CA3AF' }} />
          <span className="flex-1 text-sm" style={{ color: '#9CA3AF' }}>Search charger or place</span>
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
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-[11px] font-semibold px-1 pb-1" style={{ color: '#9CA3AF' }}>
          {stations.length} stations nearby
        </p>
        {stations.map(station => {
          const available = station.status === 'Available';
          const sel = selectedStation?._id === station._id;
          return (
            <motion.button key={station._id} whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(station)}
              className="w-full text-left p-3.5 rounded-2xl"
              style={{
                background: sel ? 'rgba(0,184,148,0.06)' : '#FFFFFF',
                border: `1.5px solid ${sel ? '#00B894' : '#F1F5F9'}`,
                boxShadow: '0 1px 6px rgba(15,15,26,0.05)',
              }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: available ? 'rgba(0,184,148,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  <Zap size={16} style={{ color: available ? '#00B894' : '#EF4444' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#0F0F1A' }}>{station.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: available ? '#00B894' : '#EF4444' }} />
                    <span className="text-[11px]" style={{ color: available ? '#00B894' : '#EF4444' }}>{station.status}</span>
                    <span className="text-[11px]" style={{ color: '#D1D5DB' }}>·</span>
                    <span className="text-[11px] font-medium" style={{ color: '#00B894' }}>₹{station.pricePerHour}/hr</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold" style={{ color: '#00B894' }}>{station.reliability}%</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF' }}>trust</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main HomeScreen ─────────────────────────────────────────────── */
export function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showRerouting, setShowRerouting] = useState(true);

  const { data: stations = [] } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getNearbyStations(12.97, 77.59),
  });
  const { data: route } = useQuery({
    queryKey: ['homeRoute'],
    queryFn: () => getOptimizedRoute(ORIGIN, DEST, 72),
  });

  const featuredStation = stations.find(s => s.isAIRecommended) ?? stations[0];
  const toggleStation = (s: Station) => setSelectedStation(prev => prev?._id === s._id ? null : s);

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="min-h-screen lg:hidden" style={{ background: '#F5F6FA' }}>
        <div className="flex items-start justify-between px-5 pt-12 pb-4">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#9CA3AF' }}>
              Smart Charging · Verified by Drivers
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

        {/* Map area */}
        <div className="relative flex-shrink-0" style={{ height: '46vh', minHeight: 260 }}>
          <LiveRouteMap
            route={route}
            mapStyle="silver"
            homeMode
            destLatLng={DEST}
            bestStation={featuredStation}
            rankedStations={stations.slice(0, 3)}
            mapCenter={HOME_MAP_CENTER}
            mapZoom={11}
          />

          {/* Finding Best Charger badge */}
          <div className="absolute top-5 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
              style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.12)' }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,184,148,0.12)' }}>
                <Sparkles size={14} style={{ color: '#00B894' }} />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#0F0F1A' }}>Finding Best Charger</p>
                <div className="flex items-center gap-1">
                  <p className="text-[10px]" style={{ color: '#6B7280' }}>Live charger availability</p>
                  <span className="w-1.5 h-1.5 rounded-full availability-pulse" style={{ background: '#00B894' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top-right: sparkles + layers + crosshair */}
          <div className="absolute z-20 flex flex-col gap-2" style={{ top: 48, right: 16 }}>
            {([Sparkles, Layers, Crosshair] as const).map((Icon, i) => (
              <button key={i} className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.12)' }}>
                <Icon size={17} style={{ color: '#374151' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom sheet */}
        <div className="flex-1 overflow-y-auto rounded-t-3xl relative z-10"
          style={{ background: '#FFFFFF', marginTop: -20, boxShadow: '0 -4px 24px rgba(15,15,26,0.1)' }}>
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
          </div>

          <div className="px-5 pt-2 pb-28">
            {stations.length > 0 ? (
              <div className="space-y-3">
                {/* AI Rerouting banner */}
                {showRerouting && (
                  <div className="flex items-center justify-between rounded-2xl px-3.5 py-3"
                    style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.2)' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(0,184,148,0.15)' }}>
                        <Sparkles size={15} style={{ color: '#00B894' }} />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold" style={{ color: '#0F0F1A' }}>AI Rerouting active</p>
                        <p className="text-[10px]" style={{ color: '#6B7280' }}>Better charger found nearby</p>
                      </div>
                    </div>
                    <button onClick={() => setShowRerouting(false)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ color: '#00B894', background: 'rgba(0,184,148,0.12)' }}>
                      Undo
                    </button>
                  </div>
                )}

                {/* Title */}
                <div>
                  <h2 className="text-[20px] font-bold leading-tight" style={{ color: '#0F0F1A' }}>
                    Predictive Charger Switch
                  </h2>
                  <p className="text-[11px] mt-1 leading-snug" style={{ color: '#6B7280' }}>
                    Queue at your charger jumped to{' '}
                    <span style={{ color: '#EF4444', fontWeight: 600 }}>8 vehicles</span>
                    {' '}· Found a faster option{' '}
                    <span style={{ color: '#0F0F1A', fontWeight: 600 }}>2 min away</span>
                  </p>
                </div>

                <TripStatsRow />
                <SavingsTagsRow />

                {/* Charging plan header */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] font-bold tracking-widest" style={{ color: '#9CA3AF' }}>
                    CHARGING PLAN
                  </p>
                  <button className="text-[11px] font-semibold" style={{ color: '#0F0F1A' }}>
                    Edit →
                  </button>
                </div>

                {/* 3 charging stop cards */}
                {(stations.slice(0, 3) as Station[]).map((station, i) => (
                  <ChargingStopCard
                    key={station._id}
                    station={station}
                    rank={(i + 1) as 1 | 2 | 3}
                  />
                ))}

                <StartTripRow />
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Finding best charger...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden lg:grid h-screen overflow-hidden"
        style={{ gridTemplateColumns: '300px 1fr 300px' }}>

        <DesktopLeftPanel user={user} />

        <div className="relative h-full">
          <LiveRouteMap
            route={route}
            mapStyle="silver"
            homeMode
            destLatLng={DEST}
            bestStation={featuredStation}
            rankedStations={stations.slice(0, 3)}
            mapCenter={HOME_MAP_CENTER}
            mapZoom={11}
          />
          <div className="absolute top-5 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
              style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.12)' }}>
              <Sparkles size={14} style={{ color: '#00B894' }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#0F0F1A' }}>Alto is optimizing</p>
                <div className="flex items-center gap-1">
                  <p className="text-[10px]" style={{ color: '#6B7280' }}>Finding best charger</p>
                  <span className="w-1.5 h-1.5 rounded-full availability-pulse" style={{ background: '#00B894' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DesktopRightPanel
          stations={stations}
          selectedStation={selectedStation}
          onSelect={toggleStation}
        />
      </div>
    </>
  );
}
