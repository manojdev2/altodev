export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  batteryCapacityKwh: number;
  maxRangeKm: number;
  currentBatteryPct: number;
  currentRangeKm: number;
}
