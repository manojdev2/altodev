export type ConnectorType = 'CCS2' | 'CHAdeMO' | 'Type 2' | 'GB/T';

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  batteryCapacityKwh: number;
  maxRangeKm: number;
  currentBatteryPct: number;
  currentRangeKm: number;
  connectorType: ConnectorType;
  preferredMinChargePct: number;
  preferredMaxChargePct: number;
  isActive: boolean;
}
