interface Props { status: 'Available' | 'Unavailable' | 'Busy'; }

const CONFIG = {
  Available: { color: '#39FF14', bg: 'rgba(57,255,20,0.1)', border: 'rgba(57,255,20,0.25)', label: 'Available' },
  Busy: { color: '#FFB800', bg: 'rgba(255,184,0,0.1)', border: 'rgba(255,184,0,0.25)', label: 'Busy' },
  Unavailable: { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)', label: 'Unavailable' },
};

export function LiveBadge({ status }: Props) {
  const { color, bg, border, label } = CONFIG[status];
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full availability-pulse flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 4px ${color}` }}
      />
      <span className="text-xs font-medium" style={{ color }}>{label}</span>
    </div>
  );
}
