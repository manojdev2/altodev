'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Route, BatteryCharging, Sparkles, User, Zap } from 'lucide-react';

const TABS = [
  { href: '/home', icon: House, label: 'Home' },
  { href: '/route', icon: Route, label: 'Route' },
  { href: '/charge', icon: BatteryCharging, label: 'Charge' },
  { href: '/intelligence', icon: Sparkles, label: 'Intelligence' },
  { href: '/profile', icon: User, label: 'Profile' },
] as const;

export function DesktopSidebar() {
  const path = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.nav
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-50 py-6"
      animate={{ width: expanded ? 200 : 68 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        background: 'rgba(12,12,12,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #0077AA 100%)',
            boxShadow: '0 0 16px rgba(0,212,255,0.4)',
          }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-white text-lg tracking-tight"
            >
              Alto
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 px-2">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all group"
              style={{
                background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
                border: active ? '1px solid rgba(0,212,255,0.18)' : '1px solid transparent',
              }}
            >
              <Icon
                size={20}
                style={{
                  color: active ? '#00D4FF' : '#4B5563',
                  filter: active ? 'drop-shadow(0 0 6px rgba(0,212,255,0.7))' : 'none',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.12 }}
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: active ? '#00D4FF' : '#6B7280' }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                  layoutId="sidebar-indicator"
                  style={{ background: '#00D4FF', boxShadow: '0 0 8px #00D4FF' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
