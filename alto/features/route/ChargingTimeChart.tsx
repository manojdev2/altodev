'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, ReferenceLine } from 'recharts';

const DATA = [
  { t: '6 AM', v: 15 }, { t: '8 AM', v: 35 }, { t: '10 AM', v: 55 },
  { t: '12 PM', v: 48 }, { t: '2 PM', v: 40 }, { t: '4 PM', v: 52 },
  { t: '6 PM', v: 70 }, { t: '8 PM', v: 60 }, { t: '10 PM', v: 30 },
  { t: '12 AM', v: 90 }, { t: '2 AM', v: 82 }, { t: '4 AM', v: 45 },
  { t: '6 AM', v: 18 },
];

export function ChargingTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={130}>
      <AreaChart data={DATA} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00B894" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00B894" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" tick={{ fill: '#9CA3AF', fontSize: 10 }}
          ticks={['6 AM', '12 AM', '6 AM']} interval="preserveStartEnd" />
        <Tooltip
          contentStyle={{ background: '#FFFFFF', border: '1px solid #E8EAF0', borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: '#374151' }} itemStyle={{ color: '#00B894' }} />
        <ReferenceLine x="12 AM" stroke="#00B894" strokeDasharray="3 3" strokeOpacity={0.5} />
        <Area type="monotone" dataKey="v" stroke="#00B894" strokeWidth={2.5} fill="url(#cg)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
