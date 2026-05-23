'use client';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AIInsight } from '@/types/insight';

type Props = AIInsight & { compact?: boolean; className?: string };

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: '#39FF14', bg: 'rgba(57,255,20,0.1)' },
  down: { icon: TrendingDown, color: '#FF4444', bg: 'rgba(255,68,68,0.1)' },
  neutral: { icon: Minus, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

export function AIInsightCard({ icon, title, body, trend = 'neutral', compact = false, className = '' }: Props) {
  const IconComp = ((Icons as Record<string, unknown>)[icon] as React.ComponentType<{ size?: number; style?: React.CSSProperties }>) ?? Icons.Zap;
  const { icon: TrendIcon, color: trendColor, bg: trendBg } = TREND_CONFIG[trend];

  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: '0 8px 40px rgba(0,212,255,0.15)',
        borderColor: 'rgba(0,212,255,0.2)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`rounded-2xl p-4 cursor-default ${compact ? 'min-w-[188px] max-w-[220px]' : 'w-full'} ${className}`}
      style={{
        background: 'rgba(22,22,22,0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.07)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.15)' }}
        >
          <IconComp size={16} style={{ color: '#00D4FF' }} />
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: trendBg }}>
          <TrendIcon size={13} style={{ color: trendColor }} />
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#00D4FF', opacity: 0.7 }}>{title}</p>
      <p className="text-sm text-gray-300 leading-snug">{body}</p>
    </motion.div>
  );
}
