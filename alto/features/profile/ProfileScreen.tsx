'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Bookmark, Settings, Crown, LogOut, ChevronRight, Car } from 'lucide-react';
import { useAuthStore } from '@/store/authSlice';
import vehiclesData from '@/data/vehicles.json';
import type { Vehicle } from '@/types/vehicle';

const ITEMS = [
  { icon: Car,      label: 'My Vehicles',   color: '#00B894', href: '/vehicles' as string | null },
  { icon: Bookmark, label: 'Saved Stations', color: '#6C5CE7', href: null },
  { icon: Settings, label: 'Preferences',    color: '#374151', href: null },
  { icon: Crown,    label: 'Membership',     color: '#F59E0B', href: null },
];

export function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const vehicle = (vehiclesData as Vehicle[])[0];
  const handleLogout = () => { logout(); router.replace('/login'); };

  return (
    <div className="min-h-screen p-6 pt-12" style={{ background: '#F5F6FA' }}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
        style={{ color: '#0F0F1A' }}>
        Profile
      </motion.h1>

      {/* Avatar card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-4 p-5 rounded-2xl mb-4"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(15,15,26,0.06)' }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6C5CE7, #8B7FF0)' }}>
          {user?.fullName?.charAt(0) ?? 'A'}
        </div>
        <div>
          <p className="font-bold text-lg" style={{ color: '#0F0F1A' }}>{user?.fullName}</p>
          <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{user?.email}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: '#6C5CE7' }}>
            {vehicle.name} · {vehicle.plate}
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Sessions', value: '142' },
          { label: 'kWh Charged', value: '1,840' },
          { label: 'CO₂ Saved', value: '48 kg' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-3 text-center"
            style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(15,15,26,0.05)' }}>
            <p className="text-lg font-bold" style={{ color: '#0F0F1A' }}>{value}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div className="space-y-2 mb-4">
        {ITEMS.map(({ icon: Icon, label, color, href }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.98 }}
            onClick={() => href && router.push(href)}
            className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{ background: '#FFFFFF', boxShadow: '0 1px 6px rgba(15,15,26,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <span className="text-sm font-medium" style={{ color: '#0F0F1A' }}>{label}</span>
            </div>
            <ChevronRight size={15} style={{ color: '#9CA3AF' }} />
          </motion.button>
        ))}
      </div>

      {/* Sign out */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)' }}>
        <LogOut size={16} style={{ color: '#EF4444' }} />
        <span className="text-sm font-semibold" style={{ color: '#EF4444' }}>Sign Out</span>
      </motion.button>
    </div>
  );
}
