'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const DATA = [{ w: 'W1', v: 320 }, { w: 'W2', v: 480 }, { w: 'W3', v: 290 }, { w: 'W4', v: 650 }, { w: 'W5', v: 410 }, { w: 'W6', v: 380 }];

export function EnergyChart() {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={DATA}>
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="w" tick={{ fill: '#6B7280', fontSize: 11 }} />
        <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} unit="₹" width={40} />
        <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#9CA3AF' }} itemStyle={{ color: '#00D4FF' }} />
        <Area type="monotone" dataKey="v" stroke="#00D4FF" strokeWidth={2} fill="url(#eg)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
