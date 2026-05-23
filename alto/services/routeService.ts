import routesData from '@/data/routes.json';
import type { Route, LatLng } from '@/types/route';
import { sleep } from '@/lib/utils';

export async function getOptimizedRoute(origin: LatLng, destination: LatLng, percentRequired: number): Promise<Route> {
  void origin; // Reserved for routing algorithm
  void destination; // Reserved for routing algorithm
  void percentRequired; // Reserved for range calculation
  await sleep(700);
  return routesData[0] as Route;
}
