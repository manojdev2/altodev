import vehiclesData from '@/data/vehicles.json';
import type { Vehicle, ConnectorType } from '@/types/vehicle';
import { useAuthStore } from '@/store/authSlice';

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

function authHeaders(): Record<string, string> {
  const { token, user } = useAuthStore.getState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (user as any)?._id ?? (user as any)?.id ?? '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token)  headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['user_id'] = userId;
  return headers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromBackend(doc: any): Vehicle {
  return {
    id: doc._id,
    name: doc.name,
    plate: doc.plate ?? '',
    batteryCapacityKwh: doc.batteryCapacityKwh ?? 40,
    maxRangeKm: doc.maxRangeKm ?? 300,
    currentBatteryPct: doc.currentBatteryPct ?? 72,
    currentRangeKm: doc.currentRangeKm ?? 200,
    connectorType: (doc.connectorType as ConnectorType) ?? 'CCS2',
    preferredMinChargePct: doc.preferredMinChargePct ?? 20,
    preferredMaxChargePct: doc.preferredMaxChargePct ?? 80,
    isActive: doc.isActive ?? false,
  };
}

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch(`${BASE}/MyVehicles`, { headers: authHeaders() });
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    if (json.status !== 'Success') throw new Error(json.message);
    return (json.data as unknown[]).map(fromBackend);
  } catch {
    return vehiclesData as Vehicle[];
  }
}

export async function addVehicle(
  preset: VehiclePreset,
  plate: string,
  currentBatteryPct: number,
): Promise<Vehicle> {
  const res = await fetch(`${BASE}/MyVehicles`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      name: preset.name,
      model: '',
      plate: plate.toUpperCase().trim(),
      batteryCapacityKwh: preset.batteryCapacityKwh,
      maxRangeKm: preset.maxRangeKm,
      currentBatteryPct,
      currentRangeKm: Math.round((currentBatteryPct / 100) * preset.maxRangeKm),
      connectorType: preset.connectorType,
      preferredMinChargePct: 20,
      preferredMaxChargePct: 80,
      isActive: false,
    }),
  });
  const json = await res.json();
  if (json.status !== 'Success') throw new Error(json.message ?? 'Add vehicle failed');
  return fromBackend(json.data);
}

export async function updateVehicle(vehicle: Vehicle): Promise<Vehicle> {
  const res = await fetch(`${BASE}/MyVehicles/${vehicle.id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({
      name: vehicle.name,
      plate: vehicle.plate,
      batteryCapacityKwh: vehicle.batteryCapacityKwh,
      maxRangeKm: vehicle.maxRangeKm,
      currentBatteryPct: vehicle.currentBatteryPct,
      currentRangeKm: vehicle.currentRangeKm,
      connectorType: vehicle.connectorType,
      preferredMinChargePct: vehicle.preferredMinChargePct,
      preferredMaxChargePct: vehicle.preferredMaxChargePct,
      isActive: vehicle.isActive,
    }),
  });
  const json = await res.json();
  if (json.status !== 'Success') throw new Error(json.message ?? 'Update failed');
  return fromBackend(json.data);
}

export async function deleteVehicle(id: string): Promise<void> {
  const res = await fetch(`${BASE}/MyVehicles/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const json = await res.json();
  if (json.status !== 'Success') throw new Error(json.message ?? 'Delete failed');
}
