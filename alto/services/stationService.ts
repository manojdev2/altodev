import type { Station, TimeSlot, Reservation } from '@/types/station';
import { useAuthStore } from '@/store/authSlice';

const BASE     = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

function authHeaders(): Record<string, string> {
  const { token, user } = useAuthStore.getState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (user as any)?._id ?? (user as any)?.id ?? '';
  const headers: Record<string, string> = {};
  if (token)  headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['user_id'] = userId;
  return headers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromBackend(doc: any): Station {
  return {
    _id:               String(doc._id ?? doc.id ?? ''),
    name:              doc.name ?? '',
    address:           doc.address ?? '',
    images:            doc.images ?? [],
    status:            doc.status ?? 'Available',
    availableIn:       doc.availableIn ?? '',
    distanceKm:        doc.distanceKm ?? 0,
    durationMins:      doc.durationMins ?? 0,
    rating:            doc.rating ?? 4.0,
    reviewCount:       doc.reviewCount ?? 0,
    pricePerHour:      doc.pricePerHour ?? '₹0/hr',
    pricePerHourValue: doc.pricePerHourValue ?? 0,
    taxPercent:        doc.taxPercent ?? 5,
    latitude:          doc.latitude ?? 0,
    longitude:         doc.longitude ?? 0,
    amenities:         doc.amenities ?? [],
    slots:             doc.slots ?? [],
    chargingSpeedKw:   doc.chargingSpeedKw ?? 50,
    waitTimeMinutes:   doc.waitTimeMinutes ?? 5,
    reliability:       doc.reliability ?? 90,
    isAIRecommended:   doc.isAIRecommended ?? false,
  };
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Google Maps Places API (New) — REST fetch, no JS library needed */
async function fetchGoogleEVStations(lat: number, lng: number): Promise<Station[]> {
  if (!MAPS_KEY) return [];
  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': MAPS_KEY,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.location',
        'places.rating',
        'places.userRatingCount',
        'places.evChargeOptions',
        'places.regularOpeningHours',
        'places.photos',
      ].join(','),
    },
    body: JSON.stringify({
      includedTypes: ['electric_vehicle_charging_station'],
      maxResultCount: 10,
      locationRestriction: {
        circle: { center: { latitude: lat, longitude: lng }, radius: 5000 },
      },
    }),
  });
  if (!res.ok) return [];
  const json = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const places: any[] = json.places ?? [];
  // Sort by real distance from search point (Places API returns by prominence, not distance)
  const sorted = places
    .map(p => ({ p, dist: haversineKm(lat, lng, p.location?.latitude ?? lat, p.location?.longitude ?? lng) }))
    .sort((a, b) => a.dist - b.dist)
    .map(({ p, dist }) => ({ p, dist: parseFloat(dist.toFixed(1)) }));

  return sorted.map(({ p, dist }, i) => {
    const pLat = p.location?.latitude ?? lat;
    const pLng = p.location?.longitude ?? lng;
    const connectors: number = p.evChargeOptions?.connectorCount ?? 2;
    const kw = connectors >= 6 ? 150 : connectors >= 3 ? 75 : 50;
    const isOpen: boolean = p.regularOpeningHours?.openNow ?? true;
    return {
      _id:               p.id ?? `gp_${i}`,
      name:              p.displayName?.text ?? 'EV Charging Station',
      address:           p.formattedAddress ?? '',
      images:            [],
      status:            isOpen ? 'Available' : 'Unavailable',
      availableIn:       '',
      distanceKm:        dist,
      durationMins:      Math.round(dist * 3),
      rating:            p.rating ?? 4.0,
      reviewCount:       p.userRatingCount ?? 0,
      pricePerHour:      '₹0/hr',
      pricePerHourValue: 0,
      taxPercent:        5,
      latitude:          pLat,
      longitude:         pLng,
      amenities:         [],
      slots:             [],
      chargingSpeedKw:   kw,
      waitTimeMinutes:   0,
      reliability:       Math.min(98, Math.round((p.rating ?? 4) * 20)),
      isAIRecommended:   i === 0,
    } satisfies Station;
  });
}

export async function getNearbyStations(lat: number, lng: number): Promise<Station[]> {
  // 1. Try Express backend (MongoDB stations)
  try {
    const res = await fetch(
      `${BASE}/NearestStations?latitude=${lat}&longitude=${lng}`,
      { headers: authHeaders() },
    );
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    if (json.status !== 'Success') throw new Error(json.message);
    const stations = (json.data as unknown[]).map(fromBackend);
    if (stations.length > 0) return stations;
  } catch { /* fall through */ }

  // 2. Fallback: real Google Maps EV charging stations
  return fetchGoogleEVStations(lat, lng);
}

export async function reserveStation(stationId: string, slot: TimeSlot): Promise<Reservation> {
  return {
    _id:               `res_${Date.now()}`,
    stationId,
    stationName:       '',
    slotStart:         slot.startTime,
    slotEnd:           slot.endTime,
    date:              new Date().toDateString(),
    amountEstimation:  0,
    tax:               0,
    totalAmount:       0,
    status:            'Upcoming',
  };
}
