'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import insightsData from '@/data/aiInsights.json';
import type { AIInsight } from '@/types/insight';

const EnergyChart = dynamic(() => import('./EnergyChart').then(m => ({ default: m.EnergyChart })), { ssr: false });

export function IntelligenceScreen() {
  const insights = insightsData as AIInsight[];
  return (
    <div className="min-h-screen p-6 pt-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Intelligence</h1>
        <p className="text-sm text-gray-400 mt-1">Powered by Alto AI</p>
      </motion.div>
      <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show"
        className="grid grid-cols-2 gap-3 mb-6">
        {insights.slice(0, 4).map(ins => (
          <motion.div key={ins.id} variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}>
            <AIInsightCard {...ins} />
          </motion.div>
        ))}
      </motion.div>
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Weekly Energy Spending (₹)</p>
        <EnergyChart />
      </div>
    </div>
  );
}
