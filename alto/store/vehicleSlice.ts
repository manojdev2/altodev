import { create } from 'zustand';
import type { Vehicle } from '@/types/vehicle';
import { getVehicles as fetchFromBackend } from '@/services/vehicleService';

interface VehicleState {
  vehicles: Vehicle[];
  activeVehicleId: string;
  loaded: boolean;
  loadVehicles: () => Promise<void>;
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (v: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  setActiveVehicle: (id: string) => void;
}

export const useVehicleStore = create<VehicleState>()((set, get) => ({
  vehicles: [],
  activeVehicleId: '',
  loaded: false,

  loadVehicles: async () => {
    if (get().loaded) return;
    const vehicles = await fetchFromBackend();
    const active = vehicles.find(v => v.isActive) ?? vehicles[0];
    set({ vehicles, activeVehicleId: active?.id ?? '', loaded: true });
  },

  addVehicle: (v) =>
    set((s) => ({ vehicles: [...s.vehicles, v] })),

  updateVehicle: (v) =>
    set((s) => ({ vehicles: s.vehicles.map((x) => (x.id === v.id ? v : x)) })),

  deleteVehicle: (id) =>
    set((s) => {
      const remaining = s.vehicles.filter((x) => x.id !== id);
      const activeVehicleId =
        s.activeVehicleId === id ? (remaining[0]?.id ?? '') : s.activeVehicleId;
      return { vehicles: remaining, activeVehicleId };
    }),

  setActiveVehicle: (id) => set({ activeVehicleId: id }),
}));
