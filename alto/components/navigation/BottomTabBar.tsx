'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { House, BarChart2, Sparkles, Clock, Wallet } from 'lucide-react';

const LEFT_TABS = [
  { href: '/home', icon: House, label: 'Home' },
  { href: '/route', icon: BarChart2, label: 'Pulse' },
] as const;

const RIGHT_TABS = [
  { href: '/intelligence', icon: Clock, label: 'Activity' },
  { href: '/profile', icon: Wallet, label: 'Wallet' },
] as const;

export function BottomTabBar() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ background: '#FFFFFF', borderTop: '1px solid #E8EAF0', boxShadow: '0 -4px 20px rgba(15,15,26,0.06)' }}>
      <div className="flex items-end justify-around px-2 pb-safe">
        {LEFT_TABS.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-4 py-3 min-w-0">
              <Icon size={18} style={{ color: active ? '#6C5CE7' : '#9CA3AF' }} />
              <span className="text-xs" style={{ color: active ? '#6C5CE7' : '#9CA3AF', fontWeight: active ? 600 : 400 }}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Ask Alto center button */}
        <Link href="/charge" className="flex flex-col items-center gap-1 px-2 -mt-5">
          <motion.div
            whileTap={{ scale: 0.93 }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6C5CE7, #8B7FF0)',
              boxShadow: '0 4px 16px rgba(108,92,231,0.4)',
            }}>
            <Sparkles size={20} className="text-white" />
          </motion.div>
          <span className="text-xs font-semibold" style={{ color: '#6C5CE7' }}>Ask Alto</span>
        </Link>

        {RIGHT_TABS.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-4 py-3 min-w-0">
              <Icon size={18} style={{ color: active ? '#6C5CE7' : '#9CA3AF' }} />
              <span className="text-xs" style={{ color: active ? '#6C5CE7' : '#9CA3AF', fontWeight: active ? 600 : 400 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
