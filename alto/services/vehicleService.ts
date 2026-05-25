import vehiclesData from '@/data/vehicles.json';
import type { Vehicle, ConnectorType } from '@/types/vehicle';
import { sleep } from '@/lib/utils';

export interface VehiclePreset {
  name: string;
  batteryCapacityKwh: number;
  maxRangeKm: number;
  connectorType: ConnectorType;
}

export const EV_PRESETS: VehiclePreset[] = [
  { name: 'Tata Nexon EV',   batteryCapacityKwh: 40.5, maxRangeKm: 312, connectorType: 'CCS2' },
  { name: 'Tata Tiago EV',   batteryCapacityKwh: 24.0, maxRangeKm: 315, connectorType: 'CCS2' },
  { name: 'MG ZS EV',        batteryCapacityKwh: 50.3, maxRangeKm: 461, connectorType: 'CCS2' },
  { name: 'BYD Atto 3',      batteryCapacityKwh: 60.5, maxRangeKm: 521, connectorType: 'CCS2' },
  { name: 'Hyundai Ioniq 5', batteryCapacityKwh: 72.6, maxRangeKm: 631, connectorType: 'CCS2' },
  { name: 'Kia EV6',         batteryCapacityKwh: 77.4, maxRangeKm: 708, connectorType: 'CCS2' },
];

export async function getVehicles(): Promise<Vehicle[]> {
  await sleep(300);
  return vehiclesData as Vehicle[];
}

export async function addVehicle(
  preset: VehiclePreset,
  plate: string,
  currentBatteryPct: number,
): Promise<Vehicle> {
  await sleep(400);
  const currentRangeKm = Math.round((currentBatteryPct / 100) * preset.maxRangeKm);
  return {
    id: `v${Date.now()}`,
    name: preset.name,
    plate: plate.toUpperCase().trim(),
    batteryCapacityKwh: preset.batteryCapacityKwh,
    maxRangeKm: preset.maxRangeKm,
    currentBatteryPct,
    currentRangeKm,
    connectorType: preset.connectorType,
    preferredMinChargePct: 20,
    preferredMaxChargePct: 80,
    isActive: false,
  };
}

export async function updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
  await sleep(300);
  return vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  await sleep(200);
  void id;
}
