export interface LatLng { lat: number; lng: number; }
export interface ChargingStop {
  stationId: string;
  stationName: string;
  arrivalBatteryPct: number;
  chargeDurationMin: number;
  chargeToPercent: number;
  coordinates: LatLng;
}
export interface Route {
  id: string;
  origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
  stops: ChargingStop[];
  totalDistanceKm: number;
  estimatedTimeMin: number;
  batteryAtDestinationPct: number;
  aiInsight: string;
}
