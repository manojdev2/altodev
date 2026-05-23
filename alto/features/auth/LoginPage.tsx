'use client';
import { motion } from 'framer-motion';
import { BatteryCharging } from 'lucide-react';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle,#00D4FF 0%,transparent 70%)', top: '5%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(60px)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)', boxShadow: '0 0 40px rgba(0,212,255,0.4)' }}>
            <BatteryCharging size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Alto</h1>
          <p className="text-gray-400 text-sm mt-1">EV Routing Intelligence</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
