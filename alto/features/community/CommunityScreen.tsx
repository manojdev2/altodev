'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Search, Users, Clock, TrendingUp,
  ThumbsUp, ThumbsDown, UserCircle2, CheckCircle2, Zap,
} from 'lucide-react';

/* ── Station charger icon (matches map marker style) ─────────────── */
function ChargerIcon() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: '#0F0F1A' }}>
        <Zap size={24} color="#FFFFFF" />
      </div>
      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white"
        style={{ background: '#16A34A' }} />
    </div>
  );
}

/* ── Trust score badge ───────────────────────────────────────────── */
function TrustBadge({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center justify-center px-3 py-2 rounded-2xl"
      style={{ background: 'rgba(22,163,74,0.1)', minWidth: 72 }}>
      <div className="flex items-center gap-1 mb-0.5">
        <Shield size={13} style={{ color: '#16A34A' }} />
        <span className="text-base font-bold" style={{ color: '#16A34A' }}>{score}</span>
      </div>
      <span className="text-[10px] font-medium" style={{ color: '#16A34A' }}>Driver rating</span>
    </div>
  );
}

/* ── Stat column ─────────────────────────────────────────────────── */
function StatCol({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center py-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-base font-bold" style={{ color: '#0F0F1A' }}>{value}</span>
      </div>
      <span className="text-xs text-center" style={{ color: '#9CA3AF' }}>{label}</span>
    </div>
  );
}

/* ── Vote button ─────────────────────────────────────────────────── */
function VoteBtn({
  icon, label, bg, color, selected, onSelect,
}: {
  icon: React.ReactNode; label: string; bg: string; color: string;
  selected: boolean; onSelect: () => void;
}) {
  return (
    <motion.button whileTap={{ scale: 0.94 }}
      onClick={onSelect}
      className="flex flex-col items-center gap-2">
      <div className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: bg,
          boxShadow: selected ? `0 0 0 3px ${color}` : 'none',
          transition: 'box-shadow 0.2s',
        }}>
        {icon}
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </motion.button>
  );
}

/* ── Community update row ────────────────────────────────────────── */
function UpdateRow({ name, status, time, likes, verified }: {
  name: string; status: string; time: string; likes: number; verified: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(22,163,74,0.12)' }}>
        <UserCircle2 size={22} style={{ color: '#16A34A' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold" style={{ color: '#0F0F1A' }}>{name}</span>
          {verified && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(22,163,74,0.12)', color: '#16A34A' }}>
              Verified
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: '#374151' }}>{status}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{time}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <ThumbsUp size={16} style={{ color: '#16A34A' }} />
        <span className="text-sm font-semibold" style={{ color: '#0F0F1A' }}>{likes}</span>
      </div>
    </div>
  );
}

/* ── Main screen ─────────────────────────────────────────────────── */
export function CommunityScreen() {
  const [vote, setVote] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F5F6FA' }}>

      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-white">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0F0F1A' }}>Community</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Live updates from drivers near you</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(22,163,74,0.1)' }}>
            <Shield size={20} style={{ color: '#16A34A' }} />
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white"
          style={{ boxShadow: '0 1px 6px rgba(15,15,26,0.06)' }}>
          <Search size={17} style={{ color: '#9CA3AF' }} />
          <span className="text-sm" style={{ color: '#9CA3AF' }}>Search charger or location</span>
        </div>

        {/* Station card */}
        <div className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(15,15,26,0.07)' }}>

          {/* Station info */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-4">
            <ChargerIcon />
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold" style={{ color: '#0F0F1A' }}>Blue Tokai Hypercharger</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                Indiranagar, Bengaluru &nbsp;•&nbsp; 1.2 km
              </p>
            </div>
            <TrustBadge score={4.6} />
          </div>

          {/* Divider */}
          <div className="mx-4 h-px" style={{ background: '#F1F5F9' }} />

          {/* Stats row */}
          <div className="flex items-stretch divide-x" style={{ borderColor: '#F1F5F9' }}>
            <StatCol
              icon={<Users size={14} style={{ color: '#6B7280' }} />}
              value="18"
              label="Drivers here now"
            />
            <StatCol
              icon={<Clock size={14} style={{ color: '#6B7280' }} />}
              value="< 8 min"
              label="Avg. wait time"
            />
            <StatCol
              icon={<TrendingUp size={14} style={{ color: '#16A34A' }} />}
              value="High"
              label="Reliability"
            />
          </div>
        </div>

        {/* Voting card */}
        <div className="bg-white rounded-3xl px-5 py-5"
          style={{ boxShadow: '0 2px 12px rgba(15,15,26,0.07)' }}>
          <p className="text-base font-bold mb-0.5" style={{ color: '#0F0F1A' }}>
            How is this charger right now?
          </p>
          <p className="text-xs mb-6" style={{ color: '#9CA3AF' }}>Your feedback is anonymous</p>

          <div className="flex items-start justify-around">
            <VoteBtn
              icon={<ThumbsUp size={28} style={{ color: '#16A34A' }} />}
              label="Working well"
              bg="rgba(22,163,74,0.12)"
              color="#16A34A"
              selected={vote === 'good'}
              onSelect={() => setVote(v => v === 'good' ? null : 'good')}
            />
            <VoteBtn
              icon={<Clock size={28} style={{ color: '#D97706' }} />}
              label="Busy / Slow"
              bg="rgba(217,119,6,0.1)"
              color="#92400E"
              selected={vote === 'slow'}
              onSelect={() => setVote(v => v === 'slow' ? null : 'slow')}
            />
            <VoteBtn
              icon={<ThumbsDown size={28} style={{ color: '#DC2626' }} />}
              label="Not working"
              bg="rgba(220,38,38,0.1)"
              color="#DC2626"
              selected={vote === 'bad'}
              onSelect={() => setVote(v => v === 'bad' ? null : 'bad')}
            />
          </div>

          {vote && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 py-2.5 rounded-2xl text-center text-sm font-semibold text-white"
              style={{ background: vote === 'good' ? '#16A34A' : vote === 'slow' ? '#D97706' : '#DC2626' }}>
              Thanks for your update!
            </motion.div>
          )}
        </div>

        {/* Recent community updates */}
        <div className="bg-white rounded-3xl px-5 py-5"
          style={{ boxShadow: '0 2px 12px rgba(15,15,26,0.07)' }}>
          <p className="text-sm font-bold mb-4" style={{ color: '#0F0F1A' }}>What drivers are saying</p>

          <div className="space-y-4">
            <UpdateRow
              name="Anonymous driver"
              status="Charger working well"
              time="5 min ago"
              likes={12}
              verified
            />
            <div className="h-px" style={{ background: '#F1F5F9' }} />
            <UpdateRow
              name="Anonymous driver"
              status="Slight queue, ~10 min wait"
              time="18 min ago"
              likes={5}
              verified={false}
            />
            <div className="h-px" style={{ background: '#F1F5F9' }} />
            <UpdateRow
              name="Anonymous driver"
              status="All chargers available"
              time="32 min ago"
              likes={9}
              verified
            />
          </div>
        </div>

      </div>
    </div>
  );
}
