import routesData from '@/data/routes.json';
import type { Route, LatLng } from '@/types/route';
import { sleep } from '@/lib/utils';

export async function getOptimizedRoute(_o: LatLng, _d: LatLng, _pct: number): Promise<Route> {
  await sleep(700);
  return routesData[0] as Route;
}
