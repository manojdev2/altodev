'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, BarChart2, Sparkles, Clock, Wallet, Triangle } from 'lucide-react';

const TABS = [
  { href: '/home', icon: House, label: 'Home' },
  { href: '/route', icon: BarChart2, label: 'Pulse' },
  { href: '/charge', icon: Sparkles, label: 'Ask Alto' },
  { href: '/intelligence', icon: Clock, label: 'Activity' },
  { href: '/profile', icon: Wallet, label: 'Wallet' },
] as const;

export function DesktopSidebar() {
  const path = usePathname();
  const [expanded, setExpanded] = useState(false);
  return (
    <nav
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-50 py-6 px-3 transition-all duration-300"
      style={{
        width: expanded ? 200 : 68,
        background: '#FFFFFF',
        borderRight: '1px solid #E8EAF0',
        boxShadow: '2px 0 12px rgba(15,15,26,0.04)',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6C5CE7, #8B7FF0)' }}>
          <Triangle size={16} className="text-white" fill="white" />
        </div>
        {expanded && <span className="font-bold text-lg" style={{ color: '#0F0F1A' }}>Alto</span>}
      </div>
      {/* Nav items */}
      <div className="flex flex-col gap-1">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-2 py-3 rounded-xl transition-all"
              style={{
                background: active ? 'rgba(108,92,231,0.1)' : 'transparent',
              }}>
              <Icon size={20} style={{ color: active ? '#6C5CE7' : '#9CA3AF', flexShrink: 0 }} />
              {expanded && (
                <span className="text-sm font-medium whitespace-nowrap"
                  style={{ color: active ? '#6C5CE7' : '#6B7280' }}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
