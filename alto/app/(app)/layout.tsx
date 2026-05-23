'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authSlice';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.replace('/login'); }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;
  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6FA' }}>
      <DesktopSidebar />
      <main className="flex-1 lg:ml-16 pb-24 lg:pb-0 overflow-y-auto">{children}</main>
      <BottomTabBar />
    </div>
  );
}
