'use client';
import { motion } from 'framer-motion';

interface BatteryRingProps {
  percentage: number;
  size?: number;
  rangeKm?: number;
  showLabel?: boolean;
}

function getColor(p: number) {
  if (p > 60) return '#39FF14';
  if (p > 30) return '#FFB800';
  return '#FF4444';
}

function getTrackColor(p: number) {
  if (p > 60) return 'rgba(57,255,20,0.08)';
  if (p > 30) return 'rgba(255,184,0,0.08)';
  return 'rgba(255,68,68,0.08)';
}

export function BatteryRing({ percentage, size = 200, rangeKm, showLabel = true }: BatteryRingProps) {
  const strokeWidth = size * 0.055;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const color = getColor(percentage);
  const trackColor = getTrackColor(percentage);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}12 0%, transparent 70%)`,
          transform: 'scale(1.1)',
        }}
      />
      <svg width={size} height={size} className="-rotate-90" style={{ position: 'relative', zIndex: 1 }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Secondary decorative ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r - strokeWidth * 1.5}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={1}
        />
        {/* Animated fill arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - percentage / 100) }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ filter: `drop-shadow(0 0 ${strokeWidth}px ${color})` }}
        />
      </svg>

      {/* Center content */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center"
          >
            <span className="block font-bold text-white" style={{ fontSize: size * 0.18, lineHeight: 1 }}>
              {percentage}
              <span style={{ fontSize: size * 0.09, color: 'rgba(255,255,255,0.6)' }}>%</span>
            </span>
            {rangeKm !== undefined && (
              <span className="block text-gray-400 mt-1" style={{ fontSize: size * 0.075 }}>
                {rangeKm} km
              </span>
            )}
          </motion.div>
        </div>
      )}

      {/* Pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: -4, border: `1px solid ${color}30` }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
