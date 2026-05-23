import { create } from 'zustand';
import type { Station, Reservation } from '@/types/station';

interface ChargeState {
  nearbyStations: Station[];
  selectedStation: Station | null;
  activeReservation: Reservation | null;
  setStations: (s: Station[]) => void;
  selectStation: (s: Station | null) => void;
  setReservation: (r: Reservation) => void;
}

export const useChargeStore = create<ChargeState>((set) => ({
  nearbyStations: [],
  selectedStation: null,
  activeReservation: null,
  setStations: (s) => set({ nearbyStations: s }),
  selectStation: (s) => set({ selectedStation: s }),
  setReservation: (r) => set({ activeReservation: r }),
}));
