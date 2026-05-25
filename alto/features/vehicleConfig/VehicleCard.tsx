'use client';
import { motion } from 'framer-motion';
import { Edit3, Trash2, CheckCircle2, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Vehicle } from '@/types/vehicle';

const BatteryRing = dynamic(
  () => import('@/components/dashboard/BatteryRing').then(m => ({ default: m.BatteryRing })),
  { ssr: false, loading: () => <div className="w-16 h-16" /> }
);

interface Props {
  vehicle: Vehicle;
  isActive: boolean;
  onSetActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function VehicleCard({ vehicle, isActive, onSetActive, onEdit, onDelete }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${isActive ? '#00B894' : '#F1F5F9'}`,
        boxShadow: isActive
          ? '0 4px 16px rgba(0,184,148,0.12)'
          : '0 2px 10px rgba(15,15,26,0.06)',
      }}>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <BatteryRing
            percentage={vehicle.currentBatteryPct}
            size={64}
            rangeKm={vehicle.currentRangeKm}
            showLabel
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-[15px] truncate" style={{ color: '#0F0F1A' }}>
              {vehicle.name}
            </p>
            {isActive && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(0,184,148,0.1)' }}>
                <CheckCircle2 size={10} style={{ color: '#00B894' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#00B894' }}>Active</span>
              </div>
            )}
          </div>
          <p className="text-[12px] font-mono mb-2" style={{ color: '#6B7280' }}>{vehicle.plate}</p>
          <div className="flex flex-wrap gap-1.5">
            {[`${vehicle.batteryCapacityKwh} kWh`, `${vehicle.maxRangeKm} km`, vehicle.connectorType].map(chip => (
              <span key={chip} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background: '#F1F5F9', color: '#374151' }}>{chip}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onEdit}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(108,92,231,0.08)' }}>
            <Edit3 size={14} style={{ color: '#6C5CE7' }} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onDelete}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.08)' }}>
            <Trash2 size={14} style={{ color: '#EF4444' }} />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
        <Zap size={12} style={{ color: '#9CA3AF' }} />
        <span className="text-[11px]" style={{ color: '#6B7280' }}>
          Charge {vehicle.preferredMinChargePct}% → {vehicle.preferredMaxChargePct}%
        </span>
        <div className="flex-1" />
        {!isActive && (
          <motion.button whileTap={{ scale: 0.96 }} onClick={onSetActive}
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,184,148,0.1)', color: '#00B894' }}>
            Set active
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
