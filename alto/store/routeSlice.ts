import { create } from 'zustand';
import type { Route, LatLng } from '@/types/route';

interface RouteState {
  origin: LatLng | null;
  destination: LatLng | null;
  currentRoute: Route | null;
  batteryPct: number;
  setRoute: (r: Route) => void;
  setBatteryPct: (p: number) => void;
  clearRoute: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  origin: null,
  destination: null,
  currentRoute: null,
  batteryPct: 72,
  setRoute: (r) => set({ currentRoute: r }),
  setBatteryPct: (p) => set({ batteryPct: p }),
  clearRoute: () => set({ origin: null, destination: null, currentRoute: null }),
}));
