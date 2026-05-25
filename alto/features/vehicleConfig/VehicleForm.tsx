'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Car } from 'lucide-react';
import { EV_PRESETS } from '@/services/vehicleService';
import type { Vehicle, ConnectorType } from '@/types/vehicle';
import type { VehiclePreset } from '@/services/vehicleService';

interface Props {
  editing?: Vehicle;
  onSave: (data: Omit<Vehicle, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

const CONNECTOR_TYPES: ConnectorType[] = ['CCS2', 'CHAdeMO', 'Type 2', 'GB/T'];

export function VehicleForm({ editing, onSave, onClose }: Props) {
  const [step, setStep] = useState<'preset' | 'details'>(editing ? 'details' : 'preset');
  const [selectedPreset, setSelectedPreset] = useState<VehiclePreset | null>(
    editing
      ? { name: editing.name, batteryCapacityKwh: editing.batteryCapacityKwh, maxRangeKm: editing.maxRangeKm, connectorType: editing.connectorType }
      : null
  );
  const [plate, setPlate] = useState(editing?.plate ?? '');
  const [batteryPct, setBatteryPct] = useState(editing?.currentBatteryPct ?? 72);
  const [minPct, setMinPct] = useState(editing?.preferredMinChargePct ?? 20);
  const [maxPct, setMaxPct] = useState(editing?.preferredMaxChargePct ?? 80);
  const [connector, setConnector] = useState<ConnectorType>(editing?.connectorType ?? 'CCS2');

  function handlePresetSelect(preset: VehiclePreset) {
    setSelectedPreset(preset);
    setConnector(preset.connectorType);
    setStep('details');
  }

  function handleSave() {
    if (!selectedPreset && !editing) return;
    const base = selectedPreset ?? {
      name: editing!.name,
      batteryCapacityKwh: editing!.batteryCapacityKwh,
      maxRangeKm: editing!.maxRangeKm,
      connectorType: connector,
    };
    onSave({
      id: editing?.id,
      name: base.name,
      plate: plate.toUpperCase().trim(),
      batteryCapacityKwh: base.batteryCapacityKwh,
      maxRangeKm: base.maxRangeKm,
      currentBatteryPct: batteryPct,
      currentRangeKm: Math.round((batteryPct / 100) * base.maxRangeKm),
      connectorType: connector,
      preferredMinChargePct: minPct,
      preferredMaxChargePct: maxPct,
      isActive: editing?.isActive ?? false,
    });
  }

  const canSave = plate.trim().length >= 5;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(15,15,26,0.5)' }}
        onClick={onClose}
      />

      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl"
        style={{ background: '#FFFFFF', maxHeight: '85vh', overflowY: 'auto' }}>

        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E2E8F0' }} />
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="text-lg font-bold" style={{ color: '#0F0F1A' }}>
            {editing ? 'Edit Vehicle' : step === 'preset' ? 'Choose Your EV' : 'Vehicle Details'}
          </h3>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#F1F5F9' }}>
            <X size={15} style={{ color: '#6B7280' }} />
          </motion.button>
        </div>

        <div className="px-5 pb-8">
          {step === 'preset' && (
            <div className="space-y-2">
              {EV_PRESETS.map(preset => (
                <motion.button key={preset.name} whileTap={{ scale: 0.98 }}
                  onClick={() => handlePresetSelect(preset)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
                  style={{ background: '#F8FAFC', border: '1.5px solid #F1F5F9' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(108,92,231,0.08)' }}>
                    <Car size={18} style={{ color: '#6C5CE7' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px]" style={{ color: '#0F0F1A' }}>{preset.name}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: '#6B7280' }}>
                      {preset.batteryCapacityKwh} kWh · {preset.maxRangeKm} km · {preset.connectorType}
                    </p>
                  </div>
                  <ChevronRight size={15} style={{ color: '#9CA3AF' }} />
                </motion.button>
              ))}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-5">
              {selectedPreset && (
                <div className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(108,92,231,0.06)', border: '1px solid rgba(108,92,231,0.15)' }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#0F0F1A' }}>{selectedPreset.name}</p>
                    <p className="text-[11px]" style={{ color: '#6B7280' }}>
                      {selectedPreset.batteryCapacityKwh} kWh · {selectedPreset.maxRangeKm} km
                    </p>
                  </div>
                  {!editing && (
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep('preset')}
                      className="text-[11px] font-semibold" style={{ color: '#6C5CE7' }}>
                      Change
                    </motion.button>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#374151' }}>
                  License Plate
                </label>
                <input
                  value={plate}
                  onChange={e => setPlate(e.target.value)}
                  placeholder="KA-01-AB-1234"
                  className="w-full px-4 py-3 rounded-2xl text-sm font-mono outline-none"
                  style={{ background: '#F8FAFC', border: '1.5px solid #E8EAF0', color: '#0F0F1A' }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold" style={{ color: '#374151' }}>Current Battery</label>
                  <span className="text-sm font-bold" style={{ color: '#00B894' }}>{batteryPct}%</span>
                </div>
                <input type="range" min={1} max={100} value={batteryPct}
                  onChange={e => setBatteryPct(Number(e.target.value))}
                  className="w-full accent-[#00B894]" />
              </div>

              <div>
                <label className="text-xs font-semibold mb-2 block" style={{ color: '#374151' }}>
                  Connector Type
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CONNECTOR_TYPES.map(c => (
                    <motion.button key={c} whileTap={{ scale: 0.95 }}
                      onClick={() => setConnector(c)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: connector === c ? 'rgba(108,92,231,0.1)' : '#F1F5F9',
                        border: `1.5px solid ${connector === c ? '#6C5CE7' : 'transparent'}`,
                        color: connector === c ? '#6C5CE7' : '#6B7280',
                      }}>
                      {c}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-4 space-y-4"
                style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <p className="text-xs font-bold" style={{ color: '#374151' }}>Charging Preferences</p>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px]" style={{ color: '#6B7280' }}>Stop charging below</span>
                    <span className="text-xs font-bold" style={{ color: '#0F0F1A' }}>{minPct}%</span>
                  </div>
                  <input type="range" min={5} max={30} value={minPct}
                    onChange={e => setMinPct(Number(e.target.value))}
                    className="w-full accent-[#F39C12]" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px]" style={{ color: '#6B7280' }}>Charge up to</span>
                    <span className="text-xs font-bold" style={{ color: '#0F0F1A' }}>{maxPct}%</span>
                  </div>
                  <input type="range" min={50} max={100} value={maxPct}
                    onChange={e => setMaxPct(Number(e.target.value))}
                    className="w-full accent-[#00B894]" />
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!canSave}
                className="w-full py-4 rounded-2xl text-sm font-bold"
                style={{
                  background: canSave ? '#0F0F1A' : '#E8EAF0',
                  color: canSave ? '#FFFFFF' : '#9CA3AF',
                }}>
                {editing ? 'Save Changes' : 'Add Vehicle'}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
