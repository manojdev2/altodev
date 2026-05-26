'use client';
import { useState, useEffect, useCallback } from 'react';

const FALLBACK = { lat: 12.97, lng: 77.59 }; // Bangalore fallback

export interface GeoState {
  lat: number;
  lng: number;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useGeolocation(): GeoState {
  const [state, setState] = useState<Omit<GeoState, 'retry'>>({
    ...FALLBACK,
    loading: true,
    error: null,
  });

  const locate = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({ ...FALLBACK, loading: false, error: 'Geolocation not supported' });
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      pos => setState({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        loading: false,
        error: null,
      }),
      err => setState(s => ({
        ...s,
        loading: false,
        error: err.code === 1 ? 'Location access denied' : 'Could not get location',
      })),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => { locate(); }, [locate]);

  return { ...state, retry: locate };
}
