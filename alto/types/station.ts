export interface Amenity { label: string; icon: string; }
export interface TimeSlot { startTime: string; endTime: string; isBooked: boolean; }
export interface Station {
  _id: string;
  name: string;
  address: string;
  images: string[];
  status: 'Available' | 'Unavailable' | 'Busy';
  availableIn: string;
  distanceKm: number;
  durationMins: number;
  rating: number;
  reviewCount: number;
  pricePerHour: string;
  pricePerHourValue: number;
  taxPercent: number;
  latitude: number;
  longitude: number;
  amenities: Amenity[];
  slots: TimeSlot[];
  chargingSpeedKw: number;
  waitTimeMinutes: number;
  reliability: number;
  isAIRecommended: boolean;
}
export interface Reservation {
  _id: string;
  stationId: string;
  stationName: string;
  slotStart: string;
  slotEnd: string;
  date: string;
  amountEstimation: number;
  tax: number;
  totalAmount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}
