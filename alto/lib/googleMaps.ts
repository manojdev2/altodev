export const SILVER_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
] as const;

export const LIGHT_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#EEF2FF' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F8FAFC' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#C7D2FE' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#EEF2FF' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#D1FAE5' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#A7F3D0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#E0E7FF' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#E0E7FF' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#BAE6FD' }] },
] as const;

export const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
export const DEFAULT_ZOOM = 13;
