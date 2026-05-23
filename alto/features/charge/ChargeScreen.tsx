'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChargerCard } from '@/components/dashboard/ChargerCard';
import { SmartReserveModal } from '@/components/dashboard/SmartReserveModal';
import { getNearbyStations } from '@/services/stationService';
import type { Station } from '@/types/station';

const FILTERS = ['All', 'Fast (>100kW)', 'Available', 'Nearby'] as const;
type Filter = (typeof FILTERS)[number];

export function ChargeScreen() {
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<Station | null>(null);
  const { data: stations = [], isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getNearbyStations(12.97, 77.59),
  });

  const filtered = stations.filter((s) => {
    if (filter === 'Fast (>100kW)') return s.chargingSpeedKw > 100;
    if (filter === 'Available') return s.status === 'Available';
    if (filter === 'Nearby') return s.distanceKm <= 5;
    return true;
  });

  return (
    <div className="min-h-screen p-6 pt-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-6"
      >
        Charging Hub
      </motion.h1>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full text-sm whitespace-nowrap"
            style={{
              background:
                filter === f
                  ? 'rgba(0,212,255,0.2)'
                  : 'rgba(255,255,255,0.05)',
              border: `1px solid ${
                filter === f ? '#00D4FF' : 'rgba(255,255,255,0.1)'
              }`,
              color: filter === f ? '#00D4FF' : '#9CA3AF',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl animate-pulse"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={{
            show: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filtered.map((s) => (
            <motion.div
              key={s._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <ChargerCard
                station={s}
                onReserve={() => setSelected(s)}
                onSmartReserve={() => setSelected(s)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selected && (
          <SmartReserveModal
            station={selected}
            onClose={() => setSelected(null)}
            onConfirm={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
