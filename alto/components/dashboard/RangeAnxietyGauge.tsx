'use client';
import { motion } from 'framer-motion';

interface Props { rangeKm: number; maxRangeKm: number; }

export function RangeAnxietyGauge({ rangeKm, maxRangeKm }: Props) {
  const pct = Math.min(Math.max(rangeKm / maxRangeKm, 0), 1);
  const label = pct > 0.6 ? 'High Confidence' : pct > 0.3 ? 'Moderate' : 'Range Anxiety';
  const labelColor = pct > 0.6 ? '#39FF14' : pct > 0.3 ? '#FFB800' : '#FF4444';

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Range Confidence</span>
        <span className="text-xs font-semibold" style={{ color: labelColor }}>{label}</span>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #FF4444 0%, #FFB800 45%, #39FF14 100%)',
            boxShadow: '0 0 8px currentColor',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>{rangeKm} km left</span>
        <span>{maxRangeKm} km max</span>
      </div>
    </div>
  );
}
