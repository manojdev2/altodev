import { describe, it, expect } from 'vitest';
import { getNearbyStations } from '@/services/stationService';

describe('stationService', () => {
  it('returns array of stations', async () => {
    const s = await getNearbyStations(12.97, 77.59);
    expect(Array.isArray(s)).toBe(true);
    expect(s.length).toBeGreaterThan(0);
  });
  it('each station has required fields', async () => {
    const [s] = await getNearbyStations(12.97, 77.59);
    expect(s).toHaveProperty('_id');
    expect(s).toHaveProperty('latitude');
    expect(['Available','Unavailable','Busy']).toContain(s.status);
  });
});
