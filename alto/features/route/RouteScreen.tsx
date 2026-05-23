'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation } from 'lucide-react';
import { AIFloatingPanel } from '@/components/ai/AIFloatingPanel';
import { RouteBottomSheet } from './RouteBottomSheet';
import { getOptimizedRoute } from '@/services/routeService';
import { getNearbyStations } from '@/services/stationService';

const LiveRouteMap = dynamic(
  () => import('@/components/maps/LiveRouteMap').then(m => ({ default: m.LiveRouteMap })),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse" style={{ background: '#e5e5e5' }} /> }
);

export function RouteScreen() {
  const [sheetOpen, setSheetOpen] = useState(true);
  const { data: route } = useQuery({ queryKey: ['route'], queryFn: () => getOptimizedRoute({ lat: 12.9279, lng: 77.6271 }, { lat: 12.9698, lng: 77.7500 }, 72) });
  const { data: stations = [] } = useQuery({ queryKey: ['stations'], queryFn: () => getNearbyStations(12.97, 77.59) });

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ bottom: sheetOpen ? '50vh' : '64px' }}>
        <LiveRouteMap route={route} stations={stations} />
      </div>

      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={16} className="text-gray-400" />
          <span className="text-gray-300 text-sm flex-1">Whitefield, Bangalore</span>
          <Navigation size={16} style={{ color: '#00D4FF' }} />
        </div>
      </div>

      <AnimatePresence>
        {route?.aiInsight && <AIFloatingPanel insight={route.aiInsight} visible={true} bottomOffset={sheetOpen ? 'calc(50vh + 8px)' : '80px'} />}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 rounded-t-3xl"
        style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none', height: '50vh' }}
        animate={{ y: sheetOpen ? 0 : 'calc(50vh - 48px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
        <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={() => setSheetOpen(o => !o)}>
          <div className="w-10 h-1 rounded-full bg-gray-600" />
        </div>
        {route && <RouteBottomSheet route={route} />}
      </motion.div>
    </div>
  );
}
