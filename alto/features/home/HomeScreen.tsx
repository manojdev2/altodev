'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { BatteryRing } from '@/components/dashboard/BatteryRing';
import { RangeAnxietyGauge } from '@/components/dashboard/RangeAnxietyGauge';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { getAIInsights } from '@/services/insightService';
import { useAuthStore } from '@/store/authSlice';
import vehiclesData from '@/data/vehicles.json';
import type { Vehicle } from '@/types/vehicle';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function EnergyParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${10 + (i * 9) % 85}%`, top: `${15 + (i * 11) % 75}%`,
          animationDelay: `${i * 0.5}s`, animationDuration: `${3 + (i % 3)}s`,
        }} />
      ))}
    </div>
  );
}

export function HomeScreen() {
  const user = useAuthStore(s => s.user);
  const router = useRouter();
  const vehicle = (vehiclesData as Vehicle[])[0];
  const { data: insights = [] } = useQuery({
    queryKey: ['insights', vehicle.id],
    queryFn: () => getAIInsights(vehicle.id),
  });

  return (
    <div className="relative min-h-screen overflow-hidden p-6 pt-10">
      <EnergyParticles />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative">
        <p className="text-gray-400 text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold text-white">{user?.fullName ?? 'Driver'}</h1>
        <p className="text-sm mt-0.5" style={{ color: '#00D4FF' }}>{vehicle.name}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }} className="flex justify-center mb-8">
        <BatteryRing percentage={vehicle.currentBatteryPct} rangeKm={vehicle.currentRangeKm} size={220} />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Range Confidence</p>
        <RangeAnxietyGauge rangeKm={vehicle.currentRangeKm} maxRangeKm={vehicle.maxRangeKm} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">AI Insights</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {insights.slice(0, 4).map((ins, i) => (
            <motion.div key={ins.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}>
              <AIInsightCard {...ins} compact />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }} whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/route')}
        className="w-full py-4 rounded-2xl font-semibold text-white text-lg"
        style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}>
        Start Intelligent Route
      </motion.button>
    </div>
  );
}
