'use client';

const DATA = [20, 45, 30, 80, 60, 90, 55, 40];
const W = 112, H = 64;
const max = Math.max(...DATA), min = Math.min(...DATA);
const px = (i: number) => (i / (DATA.length - 1)) * W;
const py = (v: number) => H - 8 - ((v - min) / (max - min)) * (H - 16);
const linePath = DATA.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(v)}`).join(' ');
const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

export function MiniSparkline() {
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#6C5CE7" stopOpacity="0.3" />
          <stop offset="95%" stopColor="#6C5CE7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <path d={linePath} fill="none" stroke="#6C5CE7" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
