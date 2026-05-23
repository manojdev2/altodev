'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Bookmark, Settings, Crown, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authSlice';
import vehiclesData from '@/data/vehicles.json';
import type { Vehicle } from '@/types/vehicle';

const ITEMS = [
  { icon: Bookmark, label: 'Saved Stations' },
  { icon: Settings, label: 'Preferences' },
  { icon: Crown, label: 'Membership' },
] as const;

export function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const vehicle = (vehiclesData as Vehicle[])[0];
  const handleLogout = () => { logout(); router.replace('/login'); };

  return (
    <div className="min-h-screen p-6 pt-10">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white mb-8">Profile</motion.h1>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-4 p-4 rounded-2xl mb-8"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)' }}>
          {user?.fullName?.charAt(0) ?? 'A'}
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{user?.fullName}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <p className="text-xs mt-0.5" style={{ color: '#00D4FF' }}>{vehicle.name} · {vehicle.plate}</p>
        </div>
      </motion.div>
      <div className="space-y-2 mb-6">
        {ITEMS.map(({ icon: Icon, label }) => (
          <motion.button key={label} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3"><Icon size={17} className="text-gray-400" /><span className="text-sm text-white">{label}</span></div>
            <ChevronRight size={15} className="text-gray-600" />
          </motion.button>
        ))}
      </div>
      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl"
        style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}>
        <LogOut size={16} style={{ color: '#FF4444' }} />
        <span className="text-sm font-medium" style={{ color: '#FF4444' }}>Sign Out</span>
      </button>
    </div>
  );
}
