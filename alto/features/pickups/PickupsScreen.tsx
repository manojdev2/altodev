'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Bell, ChevronRight, Crown, Sparkles, Navigation,
  ShoppingCart, Coffee, Utensils, MoreHorizontal, LayoutGrid,
} from 'lucide-react';

const LiveRouteMap = dynamic(
  () => import('@/components/maps/LiveRouteMap').then(m => ({ default: m.LiveRouteMap })),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: '#E8F0E9' }} /> }
);

const CATEGORIES = [
  { label: 'All', Icon: LayoutGrid },
  { label: 'Grocery', Icon: ShoppingCart },
  { label: 'Cafe', Icon: Coffee },
  { label: 'Restaurants', Icon: Utensils },
  { label: 'More', Icon: MoreHorizontal },
];

const MAP_CARDS = [
  { name: 'Instamart', time: '12 min', top: '38%', left: '22%', bg: '#F97316', abbr: 'I' },
  { name: 'Blue Tokai\nCafe', time: '8 min', top: '28%', left: '64%', bg: '#1E3A5F', abbr: 'BT' },
  { name: 'Farci Cafe', badge: 'Reserve', top: '62%', left: '18%', bg: '#7C3AED', abbr: 'FC', accent: '#7C3AED' },
  { name: 'Smoke House\nDeli', time: '10 min', top: '60%', left: '66%', bg: '#374151', abbr: 'SD' },
];

const CURATED = [
  {
    id: '1', name: 'Instamart Pickup', sub: 'Ready in 12 min',
    loc: 'MG Road · 1.2 km', badge: 'Save ₹60', bg: '#F97316', abbr: 'I',
  },
  {
    id: '2', name: 'Blue Tokai Coffee Roasters', sub: 'Skip the line',
    loc: 'Indiranagar · 850 m', badge: '10% off', bg: '#1E3A5F', abbr: 'BT',
  },
  {
    id: '3', name: 'Smoke House Deli', sub: 'Pre-order & pickup',
    loc: 'Domlur · 1.8 km', badge: 'Save ₹60', bg: '#374151', abbr: 'SD',
  },
];

function MapPlaceCard({ card }: { card: typeof MAP_CARDS[0] }) {
  return (
    <div className="absolute z-10 pointer-events-none"
      style={{ top: card.top, left: card.left, transform: 'translate(-50%, -100%)' }}>
      <div className="relative">
        <div className="flex items-center gap-2 rounded-2xl px-2.5 py-2 shadow-lg"
          style={{ background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: card.bg }}>
            <span className="text-[9px] font-bold text-white">{card.abbr}</span>
          </div>
          <div>
            {card.name.split('\n').map((l, i) => (
              <p key={i} className="text-[10px] font-bold leading-tight" style={{ color: '#0F0F1A' }}>{l}</p>
            ))}
            {card.time && (
              <p className="text-[9px] font-semibold" style={{ color: '#16A34A' }}>{card.time}</p>
            )}
            {card.badge && (
              <p className="text-[9px] font-semibold" style={{ color: card.accent ?? '#16A34A' }}>{card.badge}</p>
            )}
          </div>
        </div>
        {/* Tail */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{ background: '#FFFFFF', boxShadow: '2px 2px 4px rgba(0,0,0,0.08)' }} />
      </div>
    </div>
  );
}

export function PickupsScreen() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3 bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: '#16A34A' }}>
            <Sparkles size={15} color="white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight" style={{ color: '#0F0F1A' }}>Alto</p>
            <p className="text-[10px] leading-tight" style={{ color: '#9CA3AF' }}>AI that moves with you</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: '#F5F6FA' }}>
            <Bell size={16} style={{ color: '#0F0F1A' }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#16A34A' }} />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #16A34A, #22C55E)' }}>A</div>
        </div>
      </div>

      {/* Pickup question + sparkle CTA */}
      <div className="flex items-start justify-between px-5 pb-3 flex-shrink-0">
        <div>
          <p className="text-lg font-bold leading-snug" style={{ color: '#0F0F1A' }}>
            What would you like to pickup<br />or reserve?
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Groceries, coffee, meals & more</p>
        </div>
        <button className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ml-3 mt-0.5"
          style={{ background: '#16A34A' }}>
          <Sparkles size={20} color="white" />
        </button>
      </div>

      {/* Map + floating cards */}
      <div className="relative flex-shrink-0" style={{ height: '34vh', minHeight: 190 }}>
        <div className="absolute inset-0">
          <LiveRouteMap mapStyle="light" />
        </div>

        {MAP_CARDS.map(card => <MapPlaceCard key={card.name} card={card} />)}

        {/* Navigation button */}
        <button className="absolute bottom-3 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
          <Navigation size={16} style={{ color: '#374151' }} />
        </button>
      </div>

      {/* Scrollable bottom */}
      <div className="flex-1 overflow-y-auto px-5 pt-4">

        {/* Quick access */}
        <p className="text-sm font-bold mb-3" style={{ color: '#0F0F1A' }}>Quick access</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 -mx-1 px-1">
          {CATEGORIES.map(({ label, Icon }, i) => {
            const active = activeCategory === i;
            return (
              <motion.button key={label} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(i)}
                className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl flex-shrink-0"
                style={{ background: active ? '#0F0F1A' : '#F5F6FA', minWidth: 60 }}>
                <Icon size={16} style={{ color: active ? '#FFFFFF' : '#6B7280' }} />
                <span className="text-[10px] font-semibold"
                  style={{ color: active ? '#FFFFFF' : '#6B7280' }}>
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Curated for you */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <p className="text-sm font-bold" style={{ color: '#0F0F1A' }}>Curated for you</p>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(22,163,74,0.1)' }}>
            <Sparkles size={9} style={{ color: '#16A34A' }} />
            <span className="text-[9px] font-semibold" style={{ color: '#16A34A' }}>
              Optimized for your location &amp; time
            </span>
          </div>
        </div>

        {/* List */}
        <div className="space-y-0 divide-y" style={{ borderColor: '#F1F5F9' }}>
          {CURATED.map(item => (
            <motion.button key={item.id} whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 py-3.5 text-left">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.bg }}>
                <span className="text-xs font-bold text-white">{item.abbr}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: '#0F0F1A' }}>{item.name}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>{item.sub}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{item.loc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: 'rgba(22,163,74,0.1)', color: '#16A34A' }}>
                  {item.badge}
                </span>
                <ChevronRight size={15} style={{ color: '#D1D5DB' }} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Alto Pickup Pass */}
        <div className="mt-4 rounded-2xl p-4 flex items-center justify-between mb-28"
          style={{ background: 'linear-gradient(135deg, #15803D, #16A34A)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Crown size={18} color="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Alto Pickup Pass</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Unlimited free pickups &amp; exclusive offers
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)' }}>
            Explore
          </button>
        </div>

      </div>
    </div>
  );
}
