'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export function BatteryChart({ data }: { data: { km: number; battery: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={110}>
      <LineChart data={data}>
        <XAxis dataKey="km" tick={{ fill: '#6B7280', fontSize: 10 }} unit="km" />
        <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} unit="%" domain={[0, 100]} width={32} />
        <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#9CA3AF' }} itemStyle={{ color: '#00D4FF' }} />
        <Line type="monotone" dataKey="battery" stroke="#00D4FF" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
