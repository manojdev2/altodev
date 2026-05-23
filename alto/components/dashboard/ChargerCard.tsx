'use client';
import { motion } from 'framer-motion';
import { Zap, Clock, MapPin, Shield, Star } from 'lucide-react';
import { LiveBadge } from './LiveBadge';
import type { Station } from '@/types/station';

interface Props {
  station: Station;
  onReserve: () => void;
  onSmartReserve: () => void;
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-gray-400">{icon}</div>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-white">{value}</span>
    </div>
  );
}

export function ChargerCard({ station, onReserve, onSmartReserve }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-sm">{station.name}</h3>
            {station.isAIRecommended && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(0,212,255,0.15)',
                  color: '#00D4FF',
                  border: '1px solid rgba(0,212,255,0.3)',
                }}
              >
                AI Pick
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} />
            <span>{station.distanceKm} km</span>
          </div>
        </div>
        <LiveBadge status={station.status} />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <Stat icon={<Clock size={13} />} label="Wait" value={`${station.waitTimeMinutes}m`} />
        <Stat icon={<Zap size={13} />} label="Speed" value={`${station.chargingSpeedKw}kW`} />
        <Stat icon={<Shield size={13} />} label="Score" value={`${station.reliability}%`} />
        <Stat icon={<Star size={13} />} label="Cost" value={station.pricePerHour} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onReserve}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-colors"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          Reserve
        </button>
        <button
          onClick={onSmartReserve}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{
            background: 'linear-gradient(135deg,#00D4FF,#0088AA)',
          }}
        >
          AI Smart Reserve
        </button>
      </div>
    </motion.div>
  );
}
