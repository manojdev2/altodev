'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Shield, Leaf, Globe, ChevronDown, Users, TrendingUp, Sparkles } from 'lucide-react';

const GREEN = '#16A34A';
const DARK  = '#0F0F1A';
const GRAY  = '#6B7280';

/* ── Floating stat card ─────────────────────────────────────────── */
function StatCard({
  icon, label, value, dot,
  delay = 0,
}: {
  icon: React.ReactNode; label: string; value: string; dot: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.94)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        backdropFilter: 'blur(8px)',
        minWidth: 148,
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium" style={{ color: GRAY }}>{label}</p>
        <p className="text-sm font-bold leading-tight" style={{ color: DARK }}>{value}</p>
      </div>
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dot }} />
    </motion.div>
  );
}

/* ── Hero illustrated scene ─────────────────────────────────────── */
function HeroScene() {
  const pinPath = 'M30 5 C17 5,5 17,5 30 C5 43,30 74,30 74 C30 74,55 43,55 30 C55 17,43 5,30 5Z';

  return (
    <div className="relative w-full h-full select-none">
      <svg
        viewBox="0 0 540 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full">
        <defs>
          <linearGradient id="lssky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="55%" stopColor="#F0FDF4" />
            <stop offset="100%" stopColor="#DCFCE7" />
          </linearGradient>
          <radialGradient id="lspinG" cx="35%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="52%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#052E16" />
          </radialGradient>
          <radialGradient id="lshalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </radialGradient>
          <filter id="lsglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lsshadow" x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.11" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="540" height="520" fill="url(#lssky)" />

        {/* Distant city silhouette */}
        <g opacity="0.07" fill={DARK}>
          {[
            [295,205,26,88],[325,183,17,110],[346,198,23,94],
            [374,212,15,81],[393,198,19,94],[418,186,13,106],
            [436,202,22,90],[462,214,17,78],[484,200,24,92],
          ].map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} />
          ))}
        </g>

        {/* Wind turbine 1 */}
        <g opacity="0.32" transform="translate(415,142)">
          <rect x="-1.5" y="0" width="3" height="76" fill="#9CA3AF" />
          <circle cx="0" cy="0" r="4.5" fill="#9CA3AF" />
          <line x1="0" y1="0" x2="-24" y2="-30" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="0" x2="26" y2="-10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="0" x2="-2" y2="34" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
        </g>
        {/* Wind turbine 2 */}
        <g opacity="0.22" transform="translate(462,118)">
          <rect x="-1" y="0" width="2" height="58" fill="#9CA3AF" />
          <circle cx="0" cy="0" r="3" fill="#9CA3AF" />
          <line x1="0" y1="0" x2="-17" y2="-22" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="19" y2="-8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="-2" y2="25" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Left foreground trees */}
        <g transform="translate(52,285)">
          <rect x="10" y="82" width="10" height="44" rx="2" fill="#713F12" opacity="0.65" />
          <ellipse cx="15" cy="70" rx="32" ry="40" fill="#4ADE80" opacity="0.75" />
          <ellipse cx="15" cy="58" rx="25" ry="31" fill="#22C55E" opacity="0.85" />
          <ellipse cx="9"  cy="50" rx="17" ry="20" fill="#16A34A" opacity="0.7" />
        </g>
        <g transform="translate(14,318)">
          <rect x="8" y="68" width="8" height="32" rx="2" fill="#713F12" opacity="0.6" />
          <ellipse cx="12" cy="56" rx="25" ry="32" fill="#4ADE80" opacity="0.68" />
          <ellipse cx="12" cy="46" rx="19" ry="23" fill="#22C55E" opacity="0.78" />
        </g>
        {/* Right mid tree */}
        <g transform="translate(390,308)" opacity="0.55">
          <rect x="6" y="56" width="7" height="28" rx="2" fill="#713F12" opacity="0.6" />
          <ellipse cx="9"  cy="46" rx="20" ry="26" fill="#4ADE80" opacity="0.75" />
          <ellipse cx="9"  cy="38" rx="15" ry="19" fill="#22C55E" opacity="0.8" />
        </g>

        {/* Road base (grey tarmac in perspective) */}
        <path
          d="M120 520 Q188 408 234 326 Q268 268 298 232 Q320 206 342 190"
          stroke="#C8D2DC" strokeWidth="78" fill="none" strokeLinecap="round" />
        <path
          d="M120 520 Q188 408 234 326 Q268 268 298 232 Q320 206 342 190"
          stroke="#E2E8F0" strokeWidth="72" fill="none" strokeLinecap="round" />
        {/* Road edge markings */}
        <path
          d="M86 520 Q158 406 206 324 Q242 265 274 228 Q298 202 324 186"
          stroke="#CBD5E1" strokeWidth="1.8" fill="none" opacity="0.55" />
        <path
          d="M154 520 Q218 410 262 328 Q294 271 322 236 Q342 210 360 194"
          stroke="#CBD5E1" strokeWidth="1.8" fill="none" opacity="0.55" />
        {/* Centre dashes */}
        <path
          d="M120 520 Q188 408 234 326 Q268 268 298 232 Q320 206 342 190"
          stroke="white" strokeWidth="2.5" fill="none"
          strokeDasharray="18 14" strokeLinecap="round" opacity="0.85" />

        {/* Glowing green route line */}
        <path
          d="M132 520 Q196 406 240 324 Q273 265 302 229 Q324 203 346 188"
          stroke="#22C55E" strokeWidth="6" fill="none" strokeLinecap="round"
          filter="url(#lsglow)" opacity="0.9" />
        <path
          d="M132 520 Q196 406 240 324 Q273 265 302 229 Q324 203 346 188"
          stroke="#86EFAC" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65" />

        {/* EV car — white sedan, rear-left 3/4 view */}
        <g transform="translate(88,356)" filter="url(#lsshadow)">
          {/* Ground shadow */}
          <ellipse cx="118" cy="116" rx="114" ry="11" fill="rgba(0,0,0,0.09)" />
          {/* Lower body */}
          <rect x="8" y="52" width="208" height="54" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Wheel arches */}
          <ellipse cx="54"  cy="106" rx="33" ry="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <ellipse cx="170" cy="106" rx="33" ry="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* Cabin / roofline */}
          <path d="M42 52 Q58 16 96 10 Q142 4 180 10 Q204 16 218 52Z"
                fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Rear glass */}
          <path d="M56 50 Q72 20 100 14 Q140 9 174 14 Q198 20 210 50Z"
                fill="#BAE6FD" opacity="0.55" />
          {/* Centre pillar */}
          <line x1="136" y1="11" x2="134" y2="50" stroke="#CBD5E1" strokeWidth="1.8" />
          {/* Tail lights */}
          <rect x="8"  y="60" width="10" height="30" rx="3" fill="#FCA5A5" opacity="0.9" />
          <rect x="10" y="62" width="6"  height="12" rx="1.5" fill="#EF4444" />
          {/* Front section */}
          <rect x="208" y="58" width="22" height="40" rx="5" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
          {/* Headlight */}
          <ellipse cx="225" cy="67" rx="7" ry="4.5" fill="#FDE68A" opacity="0.9" />
          {/* Green DRL */}
          <rect x="212" y="60" width="14" height="2.5" rx="1.25" fill="#22C55E" opacity="0.85" />
          {/* Grille */}
          <rect x="214" y="76" width="12" height="14" rx="3" fill="#E2E8F0" />
          {[0,1,2].map(r => (
            <rect key={r} x="216" y={78 + r * 4} width="8" height="1.8" rx="0.9" fill="#CBD5E1" />
          ))}
          {/* Rear wheel */}
          <circle cx="54"  cy="106" r="25" fill="#1E293B" />
          <circle cx="54"  cy="106" r="19" fill="#334155" />
          <circle cx="54"  cy="106" r="10" fill="#475569" />
          <circle cx="54"  cy="106" r="5"  fill="#64748B" />
          {[0,72,144,216,288].map(a => {
            const r = a * Math.PI / 180;
            return <line key={a}
              x1={54+10*Math.cos(r)} y1={106+10*Math.sin(r)}
              x2={54+18*Math.cos(r)} y2={106+18*Math.sin(r)}
              stroke="#64748B" strokeWidth="2.5" />;
          })}
          {/* Front wheel */}
          <circle cx="170" cy="106" r="25" fill="#1E293B" />
          <circle cx="170" cy="106" r="19" fill="#334155" />
          <circle cx="170" cy="106" r="10" fill="#475569" />
          <circle cx="170" cy="106" r="5"  fill="#64748B" />
          {[0,72,144,216,288].map(a => {
            const r = a * Math.PI / 180;
            return <line key={a}
              x1={170+10*Math.cos(r)} y1={106+10*Math.sin(r)}
              x2={170+18*Math.cos(r)} y2={106+18*Math.sin(r)}
              stroke="#64748B" strokeWidth="2.5" />;
          })}
          {/* Badge */}
          <text x="124" y="85" textAnchor="middle" fontSize="10" fontWeight="700"
                fill="#94A3B8" letterSpacing="1.5">ALTO-EV</text>
        </g>

        {/* Pin glow halo */}
        <circle cx="333" cy="216" r="54" fill="url(#lshalo)" />
        <circle cx="333" cy="216" r="34" fill="rgba(34,197,94,0.14)" />

        {/* 3-D map pin */}
        <g transform="translate(303,170)" filter="url(#lsshadow)">
          {/* Depth shadow */}
          <path d={pinPath} fill="#014421" opacity="0.35" transform="translate(2 6)" />
          {/* Body */}
          <path d={pinPath} fill="url(#lspinG)" />
          {/* Specular highlights */}
          <ellipse cx="21" cy="19" rx="12" ry="8" fill="white" opacity="0.28" transform="rotate(-28 21 19)" />
          <ellipse cx="18" cy="15" rx="6"  ry="3.5" fill="white" opacity="0.52" transform="rotate(-28 18 15)" />
          {/* Rim */}
          <path d={pinPath} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Bolt */}
          <path d="M34 16 L25 32 H31 L27 44 L39 28 H33Z" fill="white" opacity="0.95" />
        </g>
      </svg>

      {/* Floating info cards — positioned over the SVG */}
      <div className="absolute flex flex-col gap-2.5"
        style={{ top: '8%', right: '2%' }}>
        <StatCard
          icon={<Zap size={13} style={{ color: GREEN }} />}
          label="Fastest"
          value="32 min"
          dot={GREEN}
          delay={0.3}
        />
        <StatCard
          icon={<TrendingUp size={13} style={{ color: '#F97316' }} />}
          label="Cheapest"
          value="₹120"
          dot="#F97316"
          delay={0.45}
        />
        <StatCard
          icon={<Users size={13} style={{ color: GREEN }} />}
          label="Low Wait"
          value="5 min"
          dot={GREEN}
          delay={0.6}
        />
      </div>
    </div>
  );
}

/* ── Bullet feature row ─────────────────────────────────────────── */
function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(22,163,74,0.1)' }}>
        {icon}
      </div>
      <span className="text-sm" style={{ color: DARK }}>{text}</span>
    </div>
  );
}

/* ── Main LandingScreen ─────────────────────────────────────────── */
export function LandingScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">

      {/* ── Navigation ── */}
      <nav className="flex items-center justify-between px-6 lg:px-14 py-5 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-bold tracking-tight" style={{ color: DARK }}>Alto</span>
          <span className="text-2xl font-bold tracking-tight" style={{ color: GREEN }}>.ev</span>
          <Sparkles size={14} style={{ color: GREEN }} className="-mt-3 -ml-0.5" />
        </div>

        {/* Language selector */}
        <button className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: GRAY }}>
          <Globe size={15} style={{ color: GRAY }} />
          English
          <ChevronDown size={13} />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="flex-1 px-6 lg:px-14 pb-12 pt-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">

          {/* Left: text */}
          <div className="flex-shrink-0 lg:w-[46%] xl:w-[42%]">

            {/* AI badge */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-xs font-semibold tracking-widest mb-4"
              style={{ color: GREEN }}>
              AI ROUTING INTELLIGENCE
            </motion.p>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold leading-tight mb-4"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                color: DARK,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
              }}>
              Smarter routes.<br />
              Better charging.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base leading-relaxed mb-8 max-w-sm"
              style={{ color: GRAY }}>
              Real-time routing, live charger updates &amp; community verified.
            </motion.p>

            {/* Feature bullets */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-col gap-3.5 mb-10">
              <Feature
                icon={<Zap size={14} style={{ color: GREEN }} />}
                text="Find the best chargers"
              />
              <Feature
                icon={<Shield size={14} style={{ color: GREEN }} />}
                text="Avoid wait &amp; save time"
              />
              <Feature
                icon={<Leaf size={14} style={{ color: GREEN }} />}
                text="Drive with confidence"
              />
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="flex gap-3">
              <Link href="/home">
                <motion.button whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 rounded-full text-sm font-bold text-white"
                  style={{ background: GREEN, boxShadow: '0 4px 18px rgba(22,163,74,0.35)' }}>
                  Get started
                </motion.button>
              </Link>
              <Link href="/home">
                <motion.button whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 rounded-full text-sm font-semibold"
                  style={{ border: '1.5px solid #E2E8F0', color: DARK }}>
                  Learn more
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right: hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="flex-1 mt-10 lg:mt-0"
            style={{ height: 'clamp(340px, 52vw, 560px)' }}>
            <HeroScene />
          </motion.div>

        </div>
      </section>

    </div>
  );
}
