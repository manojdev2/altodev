'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authSlice';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen" style={{ background: '#0a0a0a' }}>
      <DesktopSidebar />
      <main className="flex-1 lg:ml-[68px] pb-24 lg:pb-0 min-h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomTabBar />
    </div>
  );
}
