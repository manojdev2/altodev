import type { Route, LatLng } from '@/types/route';

export async function getOptimizedRoute(
  origin: LatLng,
  destination: LatLng,
  percentRequired: number,
): Promise<Route> {
  return {
    id: `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}->${destination.lat.toFixed(4)},${destination.lng.toFixed(4)}`,
    origin,
    destination,
    waypoints: [origin, destination],
    stops: [],
    totalDistanceKm: 0,
    estimatedTimeMin: 0,
    batteryAtDestinationPct: percentRequired,
    aiInsight: '',
  };
}
