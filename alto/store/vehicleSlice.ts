import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import vehiclesData from '@/data/vehicles.json';
import type { Vehicle } from '@/types/vehicle';

interface VehicleState {
  vehicles: Vehicle[];
  activeVehicleId: string;
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (v: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  setActiveVehicle: (id: string) => void;
}

const DEFAULT_VEHICLES = vehiclesData as Vehicle[];

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicles: DEFAULT_VEHICLES,
      activeVehicleId: DEFAULT_VEHICLES[0].id,

      addVehicle: (v) =>
        set((s) => ({ vehicles: [...s.vehicles, v] })),

      updateVehicle: (v) =>
        set((s) => ({
          vehicles: s.vehicles.map((x) => (x.id === v.id ? v : x)),
        })),

      deleteVehicle: (id) =>
        set((s) => {
          const remaining = s.vehicles.filter((x) => x.id !== id);
          const activeVehicleId =
            s.activeVehicleId === id
              ? (remaining[0]?.id ?? '')
              : s.activeVehicleId;
          return { vehicles: remaining, activeVehicleId };
        }),

      setActiveVehicle: (id) => set({ activeVehicleId: id }),
    }),
    {
      name: 'alto-vehicles',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
