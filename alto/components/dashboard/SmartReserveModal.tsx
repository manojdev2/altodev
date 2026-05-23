'use client';
import { motion } from 'framer-motion';
import { X, Zap, Clock, CreditCard } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { reserveStation } from '@/services/stationService';
import { useChargeStore } from '@/store/chargeSlice';
import toast from 'react-hot-toast';
import type { Station } from '@/types/station';

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

interface Props {
  station: Station;
  onClose: () => void;
  onConfirm: () => void;
}

export function SmartReserveModal({ station, onClose, onConfirm }: Props) {
  const slot = station.slots.find((s) => !s.isBooked) ?? station.slots[0];
  const setReservation = useChargeStore((s) => s.setReservation);

  const { mutate, isPending } = useMutation({
    mutationFn: () => reserveStation(station._id, slot),
    onSuccess: (res) => {
      setReservation(res);
      toast.success(`Reserved at ${station.name}!`);
      onConfirm();
    },
    onError: () => toast.error('Reservation failed. Try again.'),
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
        style={{ backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 pb-10"
        style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: '#00D4FF' }}
            >
              AI Smart Reserve
            </div>
            <h2 className="text-xl font-bold text-white">{station.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-1 mb-6">
          <Row
            icon={<Clock size={16} />}
            label="AI Recommended Slot"
            value={`${slot.startTime} – ${slot.endTime}`}
          />
          <Row
            icon={<Zap size={16} />}
            label="Charging Speed"
            value={`${station.chargingSpeedKw} kW`}
          />
          <Row
            icon={<CreditCard size={16} />}
            label="Estimated Cost"
            value={`${station.pricePerHour} + ${station.taxPercent}% tax`}
          />
        </div>

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base"
          style={{
            background: isPending
              ? 'rgba(0,212,255,0.3)'
              : 'linear-gradient(135deg,#00D4FF,#0088AA)',
            boxShadow: '0 0 24px rgba(0,212,255,0.2)',
          }}
        >
          {isPending ? 'Confirming...' : 'Confirm Reservation'}
        </button>
      </motion.div>
    </>
  );
}
