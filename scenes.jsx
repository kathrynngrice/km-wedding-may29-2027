// scenes.jsx — larger scene elements shared by the directions:
// layered rolling hills, warm string lights, a Shaker ladder-back chair,
// and the timber chair-factory silhouette. Exported to window.

// ---- Layered rolling blue-purple hills (fills its container) ----
function rngS(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = s * 16807 % 2147483647) / 2147483647;
}

// soft layered ridges that follow the same angular profile as Mountains.
// variant 'light' (bluer day card). Each layer is the same peak waveform,
// offset down the canvas, lightest (far) to deepest (near).
function Hills({ width = 600, height = 426, variant = 'light', style }) {
  const W = 620;
  // shared peak waveform: x position + how far each vertex rises (0..1)
  const xs = [0, 0.12, 0.22, 0.34, 0.45, 0.55, 0.67, 0.78, 0.88, 1.0];
  const rises = [0, 0.64, 0.21, 0.86, 0.29, 0.71, 1.0, 0.36, 0.71, 0.21];
  const phase = (arr, k) => arr.map((_, i) => arr[(i + k) % arr.length]);

  const palettes = {
    light: { stroke: '#3f5096', layers: [
      { base: 248, amp: 66, k: 0, g: ['#b3c0e6', '#9caad9'], op: 0.29, s: 0.38 },
      { base: 330, amp: 74, k: 3, g: ['#8fa0d8', '#7686c8'], op: 0.41, s: 0.47 },
      { base: 412, amp: 82, k: 6, g: ['#6c80c6', '#5a6eb2'], op: 0.51, s: 0.56 }]
    }
  };
  const set = palettes[variant] || palettes.light;

  const mkPath = (base, amp, k, close) => {
    const r = phase(rises, k);
    let d = (close ? `M0 480 L0 ` : `M0 `) + (base - r[0] * amp);
    for (let i = 1; i < xs.length; i++) d += ` L ${xs[i] * W} ${base - r[i] * amp}`;
    if (close) d += ` L ${W} 480 Z`;
    return d;
  };

  return (
    <svg viewBox="0 0 620 480" preserveAspectRatio="xMidYMax slice" width={width} height={height}
    style={{ width: '100%', display: 'block', ...style, height: "40px" }}
    fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        {set.layers.map((l, i) =>
        <linearGradient key={i} id={`hl-${variant}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={l.g[0]} /><stop offset="1" stopColor={l.g[1]} />
          </linearGradient>
        )}
      </defs>
      {set.layers.map((l, i) =>
      <g key={i}>
          <path d={mkPath(l.base, l.amp, l.k, true)} fill={`url(#hl-${variant}-${i})`} fillOpacity={l.op} />
          <path d={mkPath(l.base, l.amp, l.k, false)} stroke={set.stroke} strokeWidth={1.4} strokeOpacity={l.s} />
        </g>
      )}
    </svg>);

}

// ---- GRASSES — a meadow fringe of slender tapering blades ----
function Grasses({ width = 620, height = 150, seed = 5, outline = false, stroke = '#6b5a3f', style }) {
  const rand = rngS(seed * 37 + 11);
  const greens = ['#6f815c', '#8a9c75', '#586848', '#7e8b63', '#9bab7e', '#647453'];
  const blades = [];
  const n = Math.round(width / 8);
  for (let i = 0; i < n; i++) {
    const x = i / n * width + (rand() - 0.5) * 9;
    const h = height * (0.4 + rand() * 0.58);
    const lean = (rand() - 0.5) * height * 0.55;
    const w = 1.8 + rand() * 2.6;
    const tipx = x + lean;
    blades.push({ x, h, tipx, w, col: greens[Math.floor(rand() * greens.length)], op: 0.45 + rand() * 0.45 });
  }
  blades.sort((a, b) => b.h - a.h); // tall blades behind, short in front
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
    preserveAspectRatio="xMidYMax slice"
    style={{ width: '100%', height: '100%', display: 'block', ...style }}>
      {blades.map((b, i) => {
        const y0 = height,ty = height - b.h,midY = height - b.h * 0.55;
        const cx = (b.x + b.tipx) / 2;
        return (
          <path key={i}
          d={`M${b.x - b.w / 2} ${y0} Q ${cx - b.w * 0.4} ${midY}, ${b.tipx} ${ty} Q ${cx + b.w * 0.4} ${midY}, ${b.x + b.w / 2} ${y0} Z`}
          fill={outline ? 'none' : b.col} fillOpacity={outline ? 1 : b.op}
          stroke={outline ? stroke : 'none'} strokeWidth={outline ? 1.1 : 0}
          strokeOpacity={outline ? b.op * 0.85 : 1} strokeLinejoin="round" />);

      })}
    </svg>);

}

// ---- Warm string lights drooping across the top (fire-pit / Edison glow) ----
function StringLights({ width = 620, drops = 9, y = 30, style }) {
  const bulbs = [];
  const sag = 26;
  for (let i = 0; i <= drops; i++) {
    const t = i / drops;
    const x = 10 + t * (width - 20);
    const yy = y + Math.sin(t * Math.PI) * sag + (i % 2 ? 10 : 18);
    bulbs.push(
      <g key={i}>
        <line x1={x} y1={y + Math.sin(t * Math.PI) * sag} x2={x} y2={yy - 6} stroke="#6b5a3f" strokeWidth="1" opacity="0.5" />
        <circle cx={x} cy={yy} r="9" fill="#f6c976" opacity="0.28" />
        <circle cx={x} cy={yy} r="4.6" fill="#ffd98a" />
        <circle cx={x} cy={yy} r="2" fill="#fff3d4" />
      </g>
    );
  }
  return (
    <svg viewBox={`0 0 ${width} 90`} width={width} height={90} style={{ display: 'block', width: '100%', ...style }}>
      <path d={`M0 ${y} Q ${width / 2} ${y + sag + 8} ${width} ${y}`} stroke="#5a4a33" strokeWidth="1.4" fill="none" opacity="0.6" />
      {bulbs}
    </svg>);

}

// ---- Shaker ladder-back chair, line-art (history nod) ----
function ShakerChair({ size = 120, color = '#6b5a3f', style }) {
  return (
    <svg viewBox="0 0 100 150" width={size * (100 / 150)} height={size} style={style}
    fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      {/* back posts */}
      <path d="M30 14 L34 92" /><path d="M70 14 L66 92" />
      {/* finials */}
      <circle cx="30" cy="11" r="3.2" fill={color} stroke="none" />
      <circle cx="70" cy="11" r="3.2" fill={color} stroke="none" />
      {/* ladder slats */}
      <path d="M31 30 Q50 25 69 30" /><path d="M32 46 Q50 41 68 46" /><path d="M33 62 Q50 57 67 62" />
      {/* seat */}
      <path d="M22 92 L78 92 L74 104 L26 104 Z" />
      {/* woven seat hint */}
      <path d="M30 96 L70 96" strokeWidth="1.2" opacity="0.5" /><path d="M28 100 L72 100" strokeWidth="1.2" opacity="0.5" />
      {/* legs */}
      <path d="M26 104 L22 144" /><path d="M74 104 L78 144" />
      <path d="M34 104 L33 140" /><path d="M66 104 L67 140" />
      {/* stretcher */}
      <path d="M24 124 L76 124" strokeWidth="1.8" />
    </svg>);

}

// ---- Timber chair-factory silhouette (long building, peaked roof, posts) ----
function FactoryRuin({ width = 560, color = '#2c2742', style }) {
  return (
    <svg viewBox="0 0 560 150" width={width} height={150} preserveAspectRatio="xMidYMax meet"
    style={{ display: 'block', width: '100%', ...style }} fill="none" stroke={color} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
      {/* roofline */}
      <path d="M20 70 L120 30 L220 60 L320 28 L420 58 L520 32 L548 56" />
      {/* eave */}
      <path d="M14 92 L548 92" />
      {/* posts (timber frame) */}
      <g opacity="0.9">
        <path d="M40 92 L40 150" /><path d="M110 92 L110 150" /><path d="M180 92 L180 150" />
        <path d="M250 92 L250 150" /><path d="M320 92 L320 150" /><path d="M390 92 L390 150" />
        <path d="M460 92 L460 150" /><path d="M520 92 L520 150" />
      </g>
      {/* diagonal braces */}
      <g opacity="0.55" strokeWidth="1.4">
        <path d="M40 120 L110 92" /><path d="M180 120 L250 92" /><path d="M320 120 L390 92" /><path d="M460 120 L520 92" />
      </g>
      {/* ground line */}
      <path d="M0 150 L560 150" strokeWidth="1.2" opacity="0.4" />
    </svg>);

}

// ---- MOUNTAINS — a single low, gentle ridge silhouette (distant range) ----
// `fade` dissolves the base of the silhouette to transparent so it melts into
// whatever glow sits behind it (no hard horizontal edge). `ridge` toggles the
// faint crease lines (off for distant/atmospheric ranges).
let _mtnUid = 0;
function Mountains({ width = 620, height = 150, color = '#241a35', fade = false, ridge = true, style }) {
  const [uid] = React.useState(() => ++_mtnUid);
  const h = height;
  const d = `M0 ${h} L0 ${h * 0.60}
    L ${width * 0.12} ${h * 0.42} L ${width * 0.22} ${h * 0.54}
    L ${width * 0.34} ${h * 0.36} L ${width * 0.45} ${h * 0.52}
    L ${width * 0.55} ${h * 0.40} L ${width * 0.67} ${h * 0.32}
    L ${width * 0.78} ${h * 0.50} L ${width * 0.88} ${h * 0.40}
    L ${width} ${h * 0.54} L ${width} ${h} Z`;
  const ridgeD = `M${width * 0.34} ${h * 0.36} L ${width * 0.40} ${h * 0.46}
    M ${width * 0.67} ${h * 0.32} L ${width * 0.73} ${h * 0.44}`;
  const fillRef = fade ? `url(#mtn-fade-${uid})` : color;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
    preserveAspectRatio="xMidYMax slice"
    style={{ width: '100%', height: '100%', display: 'block', ...style }}>
      {fade &&
      <defs>
          <linearGradient id={`mtn-fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="1" />
            <stop offset="0.5" stopColor={color} stopOpacity="1" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      }
      <path d={d} fill={fillRef} />
      {ridge &&
      <path d={ridgeD} stroke="#3a2c52" strokeWidth="1.2" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
      }
    </svg>);

}

// ---- STARS — scattered faint dots for a dusk sky ----
function Stars({ width = 1400, height = 460, count = 70, seed = 7, color = '#fdf3df', style }) {
  const rand = rngS(seed * 91 + 17);
  const stars = [];
  for (let i = 0; i < count; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const big = rand() > 0.84;
    const r = big ? 1.3 + rand() * 0.9 : 0.5 + rand() * 0.9;
    const op = (big ? 0.62 : 0.32) + rand() * 0.4;
    stars.push({ x, y, r, op, big });
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
    preserveAspectRatio="xMidYMid slice"
    style={{ width: '100%', height: '100%', display: 'block', ...style }}>
      {stars.map((s, i) =>
      <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={color} opacity={s.op}>
          {s.big &&
        <animate attributeName="opacity" values={`${s.op};${s.op * 0.4};${s.op}`}
          dur={`${3 + i % 4}s`} repeatCount="indefinite" begin={`${i % 5 * 0.6}s`} />
        }
        </circle>
      )}
    </svg>);

}

Object.assign(window, { Hills, Grasses, Mountains, Stars, StringLights, ShakerChair, FactoryRuin });