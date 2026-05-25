'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useVehicleStore } from '@/store/vehicleSlice';
import { VehicleCard } from './VehicleCard';
import { VehicleForm } from './VehicleForm';
import type { Vehicle } from '@/types/vehicle';

export function VehicleConfigScreen() {
  const router = useRouter();
  const { vehicles, activeVehicleId, addVehicle, updateVehicle, deleteVehicle, setActiveVehicle } =
    useVehicleStore();

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);

  function handleSave(data: Omit<Vehicle, 'id'> & { id?: string }) {
    if (data.id) {
      updateVehicle({ ...data, id: data.id });
    } else {
      addVehicle({ ...data, id: `v${Date.now()}` });
    }
    setShowForm(false);
    setEditingVehicle(undefined);
  }

  function handleEdit(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (vehicles.length <= 1) return;
    deleteVehicle(id);
  }

  function handleClose() {
    setShowForm(false);
    setEditingVehicle(undefined);
  }

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId);

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F5F6FA' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,15,26,0.1)' }}>
            <ArrowLeft size={17} style={{ color: '#0F0F1A' }} />
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold"
            style={{ color: '#0F0F1A' }}>
            My Vehicles
          </motion.h1>
        </div>
        <motion.button whileTap={{ scale: 0.94 }}
          onClick={() => { setEditingVehicle(undefined); setShowForm(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white"
          style={{ background: '#0F0F1A' }}>
          <Plus size={15} />
          Add
        </motion.button>
      </div>

      <div className="px-5 space-y-3">
        {/* Active vehicle hero */}
        {activeVehicle && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, #0F0F1A 0%, #12122A 100%)',
              boxShadow: '0 8px 24px rgba(15,15,26,0.2)',
            }}>
            <p className="text-[10px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: 'rgba(255,255,255,0.45)' }}>
              Active Vehicle
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg leading-tight">{activeVehicle.name}</p>
                <p className="text-[12px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {activeVehicle.plate}
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <div className="rounded-full px-3 py-1 text-[11px] font-bold"
                    style={{ background: 'rgba(0,184,148,0.2)', color: '#00B894' }}>
                    {activeVehicle.currentBatteryPct}% battery
                  </div>
                  <div className="rounded-full px-3 py-1 text-[11px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                    {activeVehicle.currentRangeKm} km range
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-5xl font-black leading-none" style={{ color: '#00B894' }}>
                  {activeVehicle.currentBatteryPct}
                  <span className="text-2xl font-bold">%</span>
                </p>
                <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {activeVehicle.batteryCapacityKwh} kWh
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section label */}
        <p className="text-[11px] font-semibold px-1 pt-2" style={{ color: '#9CA3AF' }}>
          GARAGE ({vehicles.length})
        </p>

        {/* Vehicle cards */}
        <AnimatePresence mode="popLayout">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isActive={vehicle.id === activeVehicleId}
              onSetActive={() => setActiveVehicle(vehicle.id)}
              onEdit={() => handleEdit(vehicle)}
              onDelete={() => handleDelete(vehicle.id)}
            />
          ))}
        </AnimatePresence>

        {vehicles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(108,92,231,0.08)' }}>
              <Plus size={28} style={{ color: '#6C5CE7' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#0F0F1A' }}>No vehicles yet</p>
            <p className="text-[12px]" style={{ color: '#9CA3AF' }}>Tap "Add" to add your EV</p>
          </div>
        )}
      </div>

      {showForm && (
        <VehicleForm
          editing={editingVehicle}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
