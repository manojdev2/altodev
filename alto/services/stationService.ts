import stationsData from '@/data/stations.json';
import type { Station, TimeSlot, Reservation } from '@/types/station';
import { sleep } from '@/lib/utils';

export async function getNearbyStations(lat: number, lng: number): Promise<Station[]> {
  void lat; // Reserved for geospatial filtering
  void lng; // Reserved for geospatial filtering
  await sleep(400);
  return stationsData as Station[];
}

export async function reserveStation(stationId: string, slot: TimeSlot): Promise<Reservation> {
  await sleep(800);
  const station = (stationsData as Station[]).find(s => s._id === stationId);
  if (!station) throw new Error('Station not found');
  const base = station.pricePerHourValue;
  const tax = Math.round(base * station.taxPercent / 100);
  return {
    _id: `res_${Date.now()}`,
    stationId,
    stationName: station.name,
    slotStart: slot.startTime,
    slotEnd: slot.endTime,
    date: new Date().toDateString(),
    amountEstimation: base,
    tax,
    totalAmount: base + tax,
    status: 'Upcoming',
  };
}
