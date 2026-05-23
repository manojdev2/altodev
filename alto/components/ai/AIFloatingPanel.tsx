'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface Props { insight: string; visible: boolean; bottomOffset?: string; }

export function AIFloatingPanel({ insight, visible, bottomOffset = '52vh' }: Props) {
  const [text, setText] = useState('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!visible || dismissed) return;
    setText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < insight.length) {
        setText(insight.slice(0, ++i));
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [insight, visible, dismissed]);

  useEffect(() => { setDismissed(false); setText(''); }, [insight]);

  if (dismissed || !visible) return null;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className="absolute left-4 right-4 z-30"
      style={{ bottom: bottomOffset }}
    >
      <div
        className="flex items-start gap-3 p-4 rounded-2xl"
        style={{
          background: 'rgba(0,30,40,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,212,255,0.25)',
          boxShadow: '0 0 30px rgba(0,212,255,0.1), inset 0 1px 0 rgba(0,212,255,0.1)',
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}
        >
          <Sparkles size={14} style={{ color: '#00D4FF' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#00D4FF', opacity: 0.7 }}>
            Alto AI
          </p>
          <p className="text-sm text-white leading-relaxed">{text}<span className="inline-block w-0.5 h-3.5 bg-accent-blue ml-0.5 animate-pulse" /></p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <X size={12} className="text-gray-400" />
        </button>
      </div>
    </motion.div>
  );
}
