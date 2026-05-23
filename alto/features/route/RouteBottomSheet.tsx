'use client';
import dynamic from 'next/dynamic';
import { MapPin, Clock, Zap } from 'lucide-react';
import type { Route } from '@/types/route';

const BatteryChart = dynamic(() => import('./BatteryChart').then(m => ({ default: m.BatteryChart })), { ssr: false });

function buildProjection(route: Route) {
  return Array.from({ length: 11 }, (_, i) => {
    const km = Math.round((route.totalDistanceKm / 10) * i);
    const base = 72 - (i / 10) * 38;
    const bump = route.stops.some(s => Math.abs(s.arrivalBatteryPct - (72 - (i/10)*38)) < 10) ? 30 : 0;
    return { km, battery: Math.max(5, Math.round(base + (bump && i > 3 ? bump : 0))) };
  });
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
      <div className="flex justify-center text-gray-400 mb-1">{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export function RouteBottomSheet({ route }: { route: Route }) {
  return (
    <div className="overflow-y-auto px-4 pb-4" style={{ height: 'calc(50vh - 48px)' }}>
      <div className="flex gap-3 mb-4">
        <Stat icon={<MapPin size={13} />} label="Distance" value={`${route.totalDistanceKm} km`} />
        <Stat icon={<Clock size={13} />} label="ETA" value={`${route.estimatedTimeMin} min`} />
        <Stat icon={<Zap size={13} />} label="Arrival" value={`${route.batteryAtDestinationPct}%`} />
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Battery Projection</p>
      <BatteryChart data={buildProjection(route)} />
      {route.stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl mt-3"
          style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.15)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(57,255,20,0.15)' }}>
            <Zap size={14} style={{ color: '#39FF14' }} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{stop.stationName}</p>
            <p className="text-xs text-gray-400">Charge {stop.arrivalBatteryPct}% → {stop.chargeToPercent}% · {stop.chargeDurationMin} min</p>
          </div>
        </div>
      ))}
    </div>
  );
}
