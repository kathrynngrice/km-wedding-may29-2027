// botanicals.jsx — delicate LINE-SKETCH flora, in the spirit of Ilex Garden's
// seedling.svg: thin strokes, fill:none or very light tinted fills, few circles.
// Every piece takes a `stroke` color so it reads on both the light dusk card
// and the dark "factory dusk" card. Exported to window.

const FLORA = {
  blue:  '#8d80c4',
  lav:   '#a99cd4',
  pink:  '#dda1b4',
  cream: '#e6d29a',
  green: '#7e8b63',
  rose:  '#d18a98',
  terracotta: '#c0764e',
};
const TINT = { blue: '#9a8fc4', lav: '#bcb0dd', pink: '#e3b3c1', cream: '#ecdca4', rose: '#dda1b4', terracotta: '#d99a72', green: '#9bab7e' };

function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// almond / leaflet outline path centered at origin, pointing up, of length L, width Wd
function almond(L, Wd) {
  return `M0 0 C ${Wd} ${-L * 0.3}, ${Wd} ${-L * 0.72}, 0 ${-L} C ${-Wd} ${-L * 0.72}, ${-Wd} ${-L * 0.3}, 0 0 Z`;
}

// ---- LUPIN — slender tapering spike of small open florets, palmate leaves ----
function Lupin({ height = 320, tone = 'blue', seed = 7, sway = 0, stroke = '#3b3659', style }) {
  const rand = rng(seed * 97 + 13);
  const w = height * 0.38;
  const vbH = height + 30;
  const spikeH = height * 0.6;
  const stemTop = height * 0.08;
  const baseY = height * 0.95;
  const cx0 = w / 2;
  const k = height / 320;
  const tint = TINT[tone] || TINT.blue;

  const rows = 10;
  const florets = [];
  for (let i = 0; i < rows; i++) {
    const t = i / (rows - 1);
    const y = stemTop + t * spikeH;
    const rowW = (0.06 + t * 0.9) * (w * 0.5);
    const r = (2.1 + t * 5.4) * k;
    const per = t < 0.2 ? 1 : (t < 0.6 ? 2 : 3);
    const isBud = t < 0.14;
    for (let s = -per; s <= per; s++) {
      if (s === 0 && per > 1) continue;
      const jx = (rand() - 0.5) * r * 0.6;
      const jy = (rand() - 0.5) * r * 0.8;
      const fx = cx0 + (per === 0 ? 0 : (s / per) * rowW * (0.6 + rand() * 0.45)) + jx;
      const fy = y + jy;
      florets.push({ fx, fy, r: r * (0.85 + rand() * 0.3), bud: isBud });
    }
  }

  const leaf = (lx, ly, scale, rot) => {
    const n = 5;
    const parts = [];
    for (let j = 0; j < n; j++) {
      const a = -90 + (j - (n - 1) / 2) * 28;
      parts.push(<path key={j} d={almond(40 * scale, 7 * scale)} transform={`rotate(${a})`}
        fill={TINT.green} fillOpacity="0.16" stroke={stroke} strokeWidth={1.1} strokeOpacity="0.85" />);
    }
    return <g key={lx + '-' + ly} transform={`translate(${lx} ${ly}) rotate(${rot})`}>{parts}</g>;
  };

  return (
    <svg viewBox={`0 0 ${w} ${vbH}`} width={w * (height / vbH)} height={height} style={style}
         preserveAspectRatio="xMidYMax meet" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g transform={`rotate(${sway} ${cx0} ${baseY})`}>
        <path d={`M${cx0} ${baseY} C ${cx0 - sway * 0.6} ${baseY * 0.6}, ${cx0} ${spikeH}, ${cx0} ${stemTop + spikeH * 0.45}`}
              stroke={stroke} strokeWidth={1.7} />
        {leaf(cx0 - w * 0.17, baseY - 1, k, -20)}
        {leaf(cx0 + w * 0.17, baseY - 1, k * 0.92, 18)}
        {leaf(cx0, baseY + 3, k * 1.05, 2)}
        {florets.map((f, i) => (
          <circle key={i} cx={f.fx} cy={f.fy} r={f.r}
            fill={f.bud ? 'none' : tint} fillOpacity={f.bud ? 1 : 0.22}
            stroke={stroke} strokeWidth={1.25} strokeOpacity="0.9" />
        ))}
      </g>
    </svg>
  );
}

// ---- LAVENDER — thin stem, alternating small bud outlines ----
function Lavender({ height = 140, tone = 'lav', seed = 3, stroke = '#3b3659', style }) {
  const w = height * 0.3;
  const cx = w / 2;
  const tint = TINT[tone] || TINT.lav;
  const buds = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const y = height * 0.07 + t * height * 0.52;
    const side = i % 2 ? 1 : -1;
    const off = (1 - t) * w * 0.16 * side;
    const r = (0.55 + t * 0.7) * w * 0.15;
    buds.push(<ellipse key={i} cx={cx + off} cy={y} rx={r} ry={r * 1.7}
      transform={`rotate(${off * 2} ${cx + off} ${y})`}
      fill={tint} fillOpacity="0.2" stroke={stroke} strokeWidth={1.1} strokeOpacity="0.85" />);
  }
  return (
    <svg viewBox={`0 0 ${w} ${height}`} width={w} height={height} style={style}
         preserveAspectRatio="xMidYMax meet" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx} ${height} C ${cx + w * 0.1} ${height * 0.7}, ${cx} ${height * 0.52}, ${cx} ${height * 0.5}`}
            stroke={stroke} strokeWidth={1.4} />
      {buds}
    </svg>
  );
}

// ---- YARROW — flat umbel as a dome of small circle outlines ----
function Yarrow({ size = 110, tone = 'cream', seed = 9, stroke = '#3b3659', style }) {
  const rand = rng(seed * 53 + 2);
  const cx = size / 2, topY = size * 0.3;
  const tint = TINT[tone] || TINT.cream;
  const spread = size * 0.34;
  const dots = [];
  for (let i = 0; i < 15; i++) {
    const a = rand() * Math.PI * 2;
    const rr = Math.sqrt(rand()) * spread;
    dots.push(<circle key={i} cx={cx + Math.cos(a) * rr} cy={topY + Math.sin(a) * rr * 0.55}
      r={size * (0.026 + rand() * 0.02)} fill={tint} fillOpacity="0.22" stroke={stroke} strokeWidth={1} strokeOpacity="0.8" />);
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={style}
         preserveAspectRatio="xMidYMax meet" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx} ${size} C ${cx - size * 0.04} ${size * 0.62}, ${cx} ${topY + size * 0.1}, ${cx} ${topY + size * 0.05}`}
            stroke={stroke} strokeWidth={1.3} />
      {dots}
    </svg>
  );
}

// ---- ROSE — open rosette of nested petal outlines ----
function Rose({ size = 90, tone = 'pink', seed = 4, stroke = '#3b3659', style }) {
  const cx = size / 2, cy = size / 2;
  const tint = TINT[tone] || TINT.rose;
  const ring = (n, len, wid, rad, op, phase) =>
    Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * 360 + phase;
      return <g key={n + '-' + i} transform={`translate(${cx} ${cy}) rotate(${a}) translate(0 ${-rad})`}>
        <path d={almond(len, wid)} fill={tint} fillOpacity={op} stroke={stroke} strokeWidth={1.1} strokeOpacity="0.85" />
      </g>;
    });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={style}
         fill="none" strokeLinecap="round" strokeLinejoin="round">
      {ring(6, size * 0.34, size * 0.1, size * 0.16, 0.14, 0)}
      {ring(5, size * 0.24, size * 0.085, size * 0.1, 0.2, 36)}
      <circle cx={cx} cy={cy} r={size * 0.07} fill={tint} fillOpacity="0.3" stroke={stroke} strokeWidth={1.1} strokeOpacity="0.85" />
    </svg>
  );
}

// ---- GREENERY — eucalyptus-style sprig, leaf outlines along a stem ----
function Greenery({ length = 180, seed = 6, flip = false, stroke = '#586848', style }) {
  const h = length * 0.5;
  const leaves = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = length * 0.08 + t * length * 0.86;
    const y = h - Math.sin(t * Math.PI) * h * 0.34 - t * h * 0.18;
    const side = i % 2 ? 1 : -1;
    const L = (8 + Math.sin(t * Math.PI) * 14);
    leaves.push(<g key={i} transform={`translate(${x} ${y + side * L * 0.3}) rotate(${side * 64})`}>
      <path d={almond(L, L * 0.42)} fill={TINT.green} fillOpacity="0.16" stroke={stroke} strokeWidth={1} strokeOpacity="0.85" />
    </g>);
  }
  return (
    <svg viewBox={`0 0 ${length} ${h}`} width={length} height={h}
         style={{ ...style, transform: `${style?.transform || ''} ${flip ? 'scaleX(-1)' : ''}` }}
         fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${length * 0.06} ${h * 0.92} C ${length * 0.35} ${h * 0.5}, ${length * 0.7} ${h * 0.35}, ${length * 0.96} ${h * 0.2}`}
            stroke={stroke} strokeWidth={1.2} />
      {leaves}
    </svg>
  );
}

Object.assign(window, { FLORA, Lupin, Lavender, Yarrow, Rose, Greenery });
