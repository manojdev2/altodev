'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Bell, Search, Layers, Crosshair, Sparkles, Shield, Tag, Clock,
  Users, BatteryCharging, Activity, ChevronRight, Navigation,
  CheckCircle2, Crown, CalendarCheck, BatteryFull, Headphones, Lock, Zap,
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

/* ── AI Confidence circular badge ────────────────────────────────── */
function AIConfidenceBadge({ score }: { score: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E5F5F0" strokeWidth="4" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="#00B894" strokeWidth="4"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-lg font-bold leading-none" style={{ color: '#0F0F1A' }}>{score}</p>
        <p className="text-[7px] text-center leading-tight mt-0.5" style={{ color: '#9CA3AF' }}>AI<br />Confidence</p>
      </div>
    </div>
  );
}

/* ── 5-stat row ──────────────────────────────────────────────────── */
function StatsRow({ station }: { station: Station }) {
  const stats = [
    { Icon: Clock,          value: `${station.waitTimeMinutes}m`, label: 'away',       green: false },
    { Icon: Shield,         value: `${station.reliability}%`,     label: 'reliable',   green: true  },
    { Icon: Tag,            value: '₹126',                        label: 'cheaper',    green: true  },
    { Icon: Users,          value: '18',                          label: 'verified',   green: true  },
    { Icon: BatteryCharging,value: 'Best',                        label: 'for battery',green: false },
  ];
  return (
    <div className="flex py-3" style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
      {stats.map(({ Icon, value, label, green }, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-0.5"
          style={{ borderRight: i < stats.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
          <Icon size={12} style={{ color: green ? '#00B894' : '#9CA3AF' }} />
          <p className="text-xs font-bold leading-tight" style={{ color: green ? '#00B894' : '#0F0F1A' }}>{value}</p>
          <p className="text-[9px] text-center leading-tight" style={{ color: '#9CA3AF' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Station detail card ─────────────────────────────────────────── */
function StationCard({ station }: { station: Station }) {
  return (
    <div className="rounded-2xl p-4"
      style={{ border: '1px solid #F1F5F9', boxShadow: '0 2px 10px rgba(15,15,26,0.06)' }}>
      <div className="flex gap-3 mb-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#12122A' }}>
          <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
            <rect x="7" y="0" width="12" height="4.5" rx="2.25" fill="white" opacity="0.9" />
            <rect x="4" y="4.5" width="18" height="15" rx="3" fill="white" />
            <rect x="8" y="19.5" width="10" height="3.5" rx="1.75" fill="white" opacity="0.8" />
            <rect x="10" y="23" width="6" height="9" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="font-bold text-[15px] truncate" style={{ color: '#0F0F1A' }}>{station.name}</p>
            <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#00B894' }}>
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.2 5.8L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <p className="text-[12px] mb-2" style={{ color: '#6B7280' }}>
            {Math.round(station.distanceKm * 1000)} m · Indiranagar
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['DC Fast', 'CCS2', `${station.chargingSpeedKw} kW`].map(chip => (
              <span key={chip} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                style={{ background: '#F1F5F9', color: '#374151' }}>{chip}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Driver verification */}
      <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid #F9FAFB' }}>
        <div className="flex -space-x-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-5 h-5 rounded-full border border-white"
              style={{ background: ['#00B894', '#0984E3', '#F39C12'][i] }} />
          ))}
        </div>
        <p className="text-[11px] flex-1" style={{ color: '#6B7280' }}>
          Verified{' '}
          <span style={{ color: '#00B894', fontWeight: 600 }}>14 sec ago</span>
          {' '}by 18 drivers
        </p>
        <ChevronRight size={14} style={{ color: '#9CA3AF' }} />
      </div>
    </div>
  );
}

/* ── Best time to charge row ─────────────────────────────────────── */
function BestTimeRow() {
  return (
    <motion.div whileTap={{ scale: 0.99 }}
      className="flex items-center gap-3 rounded-2xl p-3.5 cursor-pointer"
      style={{ background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.15)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(0,184,148,0.12)' }}>
        <Activity size={18} style={{ color: '#00B894' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#0F0F1A' }}>Best time to charge</p>
        <p className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>
          10:30 PM – 1:30 AM · Save up to{' '}
          <span style={{ color: '#00B894', fontWeight: 600 }}>₹126</span>
        </p>
      </div>
      <ChevronRight size={15} style={{ color: '#9CA3AF' }} />
    </motion.div>
  );
}

/* ── Dual CTA buttons ────────────────────────────────────────────── */
function CTARow({ station }: { station: Station }) {
  return (
    <div className="flex gap-3">
      <motion.button whileTap={{ scale: 0.97 }}
        className="flex-1 flex items-center gap-2.5 px-3.5 py-3.5 rounded-2xl"
        style={{ background: '#0F0F1A' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.1)' }}>
          <Navigation size={15} className="text-white" style={{ transform: 'rotate(40deg)' }} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-white leading-tight">Start navigation</p>
          <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {station.waitTimeMinutes} min away · Fastest route
          </p>
        </div>
      </motion.button>

      <motion.button whileTap={{ scale: 0.97 }}
        className="flex-1 flex items-center gap-2.5 px-3.5 py-3.5 rounded-2xl"
        style={{ background: 'rgba(0,184,148,0.08)', border: '1.5px solid rgba(0,184,148,0.2)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,184,148,0.15)' }}>
          <Sparkles size={15} style={{ color: '#00B894' }} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold leading-tight" style={{ color: '#0F0F1A' }}>Let Alto handle it</p>
          <p className="text-[10px] font-semibold leading-tight" style={{ color: '#00B894' }}>Auto reserve & monitor</p>
        </div>
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
];

function AIInsightCard() {
  return (
    <div className="card p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: '#00B894' }} />
      <div className="pl-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} style={{ color: '#00B894' }} />
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#00B894' }}>AI Insight</span>
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
        <p className="text-sm font-semibold" style={{ color: '#0F0F1A' }}>Community power</p>
        <p className="text-xs truncate" style={{ color: '#6B7280' }}>Verified live 12 sec ago by 8 nearby drivers</p>
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
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Most intelligent charging experience</p>
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

/* ── Desktop left panel ──────────────────────────────────────────── */
function DesktopLeftPanel({ user }: { user: { fullName?: string } | null }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto"
      style={{ background: '#F5F6FA', borderRight: '1px solid #E8EAF0' }}>
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

/* ── Desktop right panel ─────────────────────────────────────────── */
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
      <div className="lg:hidden flex flex-col overflow-hidden" style={{ height: '100dvh', background: '#F0F4F8' }}>

        {/* Map area */}
        <div className="relative flex-shrink-0" style={{ height: '46vh', minHeight: 260 }}>
          <LiveRouteMap
            route={route}
            mapStyle="silver"
            homeMode
            destLatLng={DEST}
            bestStation={featuredStation}
            mapCenter={HOME_MAP_CENTER}
            mapZoom={11}
          />

          {/* Alto is optimizing (top-left) */}
          <div className="absolute z-20" style={{ top: 48, left: 16 }}>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl"
              style={{ background: '#FFFFFF', boxShadow: '0 2px 16px rgba(15,15,26,0.12)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,184,148,0.1)' }}>
                <Sparkles size={16} style={{ color: '#00B894' }} />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#0F0F1A' }}>Alto is optimizing</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px]" style={{ color: '#6B7280' }}>Finding best charger & time</p>
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
            {featuredStation ? (
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h2 className="text-[20px] font-bold leading-tight" style={{ color: '#0F0F1A' }}>
                      Alto found your best charger
                    </h2>
                    <p className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>
                      Based on live data, your battery & route
                    </p>
                  </div>
                  <AIConfidenceBadge score={featuredStation.reliability} />
                </div>

                <StatsRow station={featuredStation} />
                <StationCard station={featuredStation} />
                <BestTimeRow />
                <CTARow station={featuredStation} />
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
