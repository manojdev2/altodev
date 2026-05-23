'use client';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const DATA = [
  { v: 20 }, { v: 45 }, { v: 30 }, { v: 80 }, { v: 60 }, { v: 90 }, { v: 55 }, { v: 40 },
];

export function MiniSparkline() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={DATA} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke="#6C5CE7" strokeWidth={2} fill="url(#sparkGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
