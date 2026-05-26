'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, LocateFixed, MapPin } from 'lucide-react';

export interface LocationResult { lat: number; lng: number; label: string; }

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  onLocation: (loc: LocationResult) => void;
  onUseCurrentLocation?: () => void;
  placeholder?: string;
  dark?: boolean;
}

export function LocationSearchBar({ onLocation, onUseCurrentLocation, placeholder = 'Search location…', dark = false }: Props) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef          = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=0`,
        { headers: { 'Accept-Language': 'en' } },
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(r: NominatimResult) {
    const short = r.display_name.split(',').slice(0, 3).join(',').trim();
    setQuery(short);
    setOpen(false);
    onLocation({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name });
  }

  function clear() { setQuery(''); setResults([]); setOpen(false); }

  const bg      = dark ? 'rgba(255,255,255,0.08)' : '#FFFFFF';
  const border  = dark ? 'rgba(255,255,255,0.12)' : '#E8EAF0';
  const textClr = dark ? '#FFFFFF' : '#0F0F1A';
  const dropBg  = dark ? '#1E1E30'  : '#FFFFFF';

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#9CA3AF' }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-8 pr-8 py-2.5 rounded-2xl text-[13px] outline-none transition-all"
          style={{ background: bg, border: `1.5px solid ${border}`, color: textClr, caretColor: '#6C5CE7' }}
        />
        {query && (
          <button onClick={clear} className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <X size={13} style={{ color: '#9CA3AF' }} />
          </button>
        )}

        {/* Suggestions dropdown */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl overflow-hidden z-[200] shadow-xl"
            style={{ background: dropBg, border: `1px solid ${border}` }}>
            {loading && (
              <div className="px-4 py-3 text-[12px]" style={{ color: '#9CA3AF' }}>Searching…</div>
            )}
            {results.map((r, i) => (
              <button key={r.place_id}
                onMouseDown={e => e.preventDefault()}
                onClick={() => select(r)}
                className="w-full text-left flex items-start gap-2.5 px-4 py-2.5 transition-colors"
                style={{ borderTop: i > 0 ? `1px solid ${border}` : 'none' }}>
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#6C5CE7' }} />
                <span className="text-[12px] leading-snug line-clamp-2" style={{ color: textClr }}>
                  {r.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {onUseCurrentLocation && (
        <button onClick={onUseCurrentLocation} title="Use my location"
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 flex-none"
          style={{ background: bg, border: `1.5px solid ${border}` }}>
          <LocateFixed size={16} style={{ color: '#6C5CE7' }} />
        </button>
      )}
    </div>
  );
}
