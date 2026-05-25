'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Zap, ArrowRight, Clock,
  TrendingUp, TrendingDown, Navigation,
} from 'lucide-react';

interface Props {
  open: boolean;
  onSwitch: () => void;
  onKeep: () => void;
}

const TOTAL = 30;

export function PredictiveSwitchModal({ open, onSwitch, onKeep }: Props) {
  const [seconds, setSeconds] = useState(TOTAL);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (!open) { setSeconds(TOTAL); setSwitching(false); return; }
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { onKeep(); return TOTAL; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [open, onKeep]);

  const handleSwitch = () => {
    setSwitching(true);
    setTimeout(onSwitch, 1400);
  };

  const pct = (seconds / TOTAL) * 100;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(3px)' }}
            onClick={onKeep}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
            style={{ background: '#FFFFFF' }}>

            {/* Countdown progress bar */}
            <motion.div
              className="h-1 origin-left"
              style={{ background: '#00B894' }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: pct / 100 }}
              transition={{ duration: 1, ease: 'linear' }}
            />

            <div className="px-5 pt-4 pb-8">

              {/* AI badge row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(0,184,148,0.1)' }}>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-2 h-2 rounded-full inline-block" style={{ background: '#00B894' }} />
                  <Sparkles size={12} style={{ color: '#00B894' }} />
                  <span className="text-xs font-semibold" style={{ color: '#00B894' }}>Smarter Route Found</span>
                </div>
                <button onClick={onKeep}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#F1F5F9' }}>
                  <X size={14} style={{ color: '#6B7280' }} />
                </button>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold mb-1" style={{ color: '#0F0F1A' }}>
                Quicker Charger Nearby!
              </h2>
              <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
                Your current charger now has{' '}
                <span className="font-bold" style={{ color: '#EF4444' }}>8 cars waiting</span>
                {' '}· We found a better one{' '}
                <span className="font-semibold" style={{ color: '#0F0F1A' }}>just 2 min away</span>
              </p>

              {/* Charger comparison */}
              <div className="flex items-stretch gap-3 mb-4">

                {/* Current — bad */}
                <div className="flex-1 rounded-2xl p-3.5"
                  style={{ background: 'rgba(239,68,68,0.05)', border: '1.5px solid rgba(239,68,68,0.2)' }}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#0F0F1A' }}>
                      <Zap size={13} color="white" />
                    </div>
                    <p className="text-xs font-bold leading-tight" style={{ color: '#0F0F1A' }}>EvoltZ Hypercharger</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp size={11} style={{ color: '#EF4444' }} />
                      <span className="text-xs font-bold" style={{ color: '#EF4444' }}>8 waiting</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: '#9CA3AF' }} />
                      <span className="text-xs" style={{ color: '#6B7280' }}>~24 min wait</span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: '#6B7280' }}>₹280/hr</p>
                  </div>
                  <div className="mt-3 py-1 rounded-xl text-center"
                    style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <span className="text-[10px] font-bold" style={{ color: '#EF4444' }}>Current</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
                  <motion.div
                    animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,184,148,0.15)' }}>
                    <ArrowRight size={16} style={{ color: '#00B894' }} />
                  </motion.div>
                  <span className="text-[9px] font-medium" style={{ color: '#9CA3AF' }}>+2 min</span>
                </div>

                {/* Suggested — good */}
                <div className="flex-1 rounded-2xl p-3.5"
                  style={{ background: 'rgba(0,184,148,0.06)', border: '1.5px solid rgba(0,184,148,0.35)' }}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#00B894' }}>
                      <Zap size={13} color="white" />
                    </div>
                    <p className="text-xs font-bold leading-tight" style={{ color: '#0F0F1A' }}>BluSmart Fast Charge</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <TrendingDown size={11} style={{ color: '#00B894' }} />
                      <span className="text-xs font-bold" style={{ color: '#00B894' }}>1 waiting</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: '#9CA3AF' }} />
                      <span className="text-xs" style={{ color: '#6B7280' }}>~3 min wait</span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: '#6B7280' }}>₹194/hr</p>
                  </div>
                  <div className="mt-3 py-1 rounded-xl text-center"
                    style={{ background: 'rgba(0,184,148,0.15)' }}>
                    <span className="text-[10px] font-bold" style={{ color: '#00B894' }}>Recommended ✓</span>
                  </div>
                </div>
              </div>

              {/* Savings summary */}
              <div className="flex items-center justify-center gap-3 py-3 rounded-2xl mb-5"
                style={{ background: 'rgba(0,184,148,0.08)' }}>
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: '#00B894' }}>Save 21 min</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF' }}>wait time</p>
                </div>
                <div className="w-px h-8" style={{ background: 'rgba(0,184,148,0.2)' }} />
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: '#00B894' }}>Save ₹86</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF' }}>per charge</p>
                </div>
                <div className="w-px h-8" style={{ background: 'rgba(0,184,148,0.2)' }} />
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: '#6B7280' }}>+2 min</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF' }}>detour only</p>
                </div>
              </div>

              {/* Switching animation */}
              <AnimatePresence>
                {switching && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl mb-4"
                    style={{ background: 'rgba(0,184,148,0.1)' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                      <Navigation size={14} style={{ color: '#00B894' }} />
                    </motion.div>
                    <span className="text-sm font-semibold" style={{ color: '#00B894' }}>
                      Updating your route…
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              {!switching && (
                <div className="flex gap-3">
                  <button onClick={onKeep}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
                    style={{ border: '1.5px solid #E2E8F0', color: '#6B7280', background: '#F8FAFC' }}>
                    Stay on route
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={handleSwitch}
                    className="flex-[1.6] py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    style={{ background: '#0F0F1A' }}>
                    <Sparkles size={14} />
                    Take me there
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              )}

              {/* Countdown hint */}
              <p className="text-center text-xs mt-3" style={{ color: '#C4C9D4' }}>
                Staying on current route in {seconds}s
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
