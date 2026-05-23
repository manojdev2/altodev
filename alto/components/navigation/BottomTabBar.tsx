'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { House, Route, BatteryCharging, Sparkles, User } from 'lucide-react';

const TABS = [
  { href: '/home', icon: House, label: 'Home' },
  { href: '/route', icon: Route, label: 'Route' },
  { href: '/charge', icon: BatteryCharging, label: 'Charge' },
  { href: '/intelligence', icon: Sparkles, label: 'AI' },
  { href: '/profile', icon: User, label: 'Me' },
] as const;

export function BottomTabBar() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4 pt-2">
      {/* Background blur layer */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.98) 60%, transparent)',
          backdropFilter: 'blur(0px)',
        }}
      />
      <div
        className="relative flex items-center justify-around rounded-2xl px-2 py-2"
        style={{
          background: 'rgba(18,18,18,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -1px 0 rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-0"
              style={{ flex: 1 }}
            >
              {active && (
                <motion.div
                  layoutId="tab-active-bg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(0,212,255,0.1)' }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <Icon
                size={20}
                className="relative z-10 transition-all duration-200"
                style={{
                  color: active ? '#00D4FF' : '#4B5563',
                  filter: active ? 'drop-shadow(0 0 8px rgba(0,212,255,0.8))' : 'none',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              <span
                className="text-xs font-medium relative z-10 transition-colors duration-200"
                style={{ color: active ? '#00D4FF' : '#4B5563', fontSize: '10px' }}
              >
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute -bottom-1 w-1 h-1 rounded-full"
                  style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
