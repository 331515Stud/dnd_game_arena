// Shared drawing vocabulary for the engraved plates.
// Every plate is an SVG composed from these helpers, then rasterised with resvg.

export const W = 560;
export const H = 760;

export const INK = '#2b1a0c';
export const INK_SOFT = '#4a3119';
export const RUST = '#8c3a1e';
export const GOLD = '#b8862b';
export const PALE = '#f6ecd4';

let seedState = 1;
export function seed(n) {
  seedState = n >>> 0 || 1;
}
export function rnd() {
  // mulberry32
  seedState = (seedState + 0x6d2b79f5) >>> 0;
  let t = seedState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const rr = (a, b) => a + (b - a) * rnd();

export function defs(id, { tint = '#f4e8cc', shade = '#b9a079', skyGrad } = {}) {
  return `
  <defs>
    <radialGradient id="paper-${id}" cx="50%" cy="38%" r="78%">
      <stop offset="0" stop-color="#fbf3df"/>
      <stop offset=".55" stop-color="${tint}"/>
      <stop offset="1" stop-color="${shade}"/>
    </radialGradient>
    ${
      skyGrad
        ? `<linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${skyGrad[0]}"/><stop offset="1" stop-color="${skyGrad[1]}"/>
          </linearGradient>`
        : ''
    }
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${(id.length * 7) % 97}"/>
      <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.22  0 0 0 0 0.10  0 0 0 0.16 0"/>
    </filter>
    <filter id="fox-${id}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${(id.length * 13) % 89}"/>
      <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.30  0 0 0 0 0.12  0 0 0 0.22 0"/>
    </filter>
    <pattern id="hatch-${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="${INK}" stroke-width="1.1" opacity=".55"/>
    </pattern>
    <pattern id="hatch2-${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
      <line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width=".9" opacity=".5"/>
    </pattern>
    <pattern id="cross-${id}" width="7" height="7" patternUnits="userSpaceOnUse">
      <path d="M0 0 L7 7 M7 0 L0 7" stroke="${INK}" stroke-width=".8" opacity=".55"/>
    </pattern>
    <pattern id="hatch-shared" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="${INK}" stroke-width="1.1" opacity=".55"/>
    </pattern>
    <pattern id="hatch2-shared" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)">
      <line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width=".9" opacity=".5"/>
    </pattern>
    <pattern id="cross-shared" width="7" height="7" patternUnits="userSpaceOnUse">
      <path d="M0 0 L7 7 M7 0 L0 7" stroke="${INK}" stroke-width=".8" opacity=".55"/>
    </pattern>
    <radialGradient id="glow-${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff2c2" stop-opacity=".95"/>
      <stop offset=".45" stop-color="#f2c15a" stop-opacity=".55"/>
      <stop offset="1" stop-color="#f2c15a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dark-${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#1a0f08" stop-opacity=".85"/>
      <stop offset="1" stop-color="#1a0f08" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig-${id}" cx="50%" cy="48%" r="68%">
      <stop offset=".55" stop-color="#1a0f08" stop-opacity="0"/>
      <stop offset="1" stop-color="#1a0f08" stop-opacity=".55"/>
    </radialGradient>
    <clipPath id="frame-${id}"><rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="4"/></clipPath>
  </defs>`;
}

export function paper(id, opts = {}) {
  return `
  <rect width="${W}" height="${H}" fill="url(#paper-${id})"/>
  <rect width="${W}" height="${H}" filter="url(#fox-${id})" opacity=".9"/>
  <rect width="${W}" height="${H}" filter="url(#grain-${id})"/>
  ${opts.skyGrad ? `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#sky-${id})" opacity=".55"/>` : ''}`;
}

/** Engraver's vignette: concentric hatching that darkens toward the plate edges. */
export function vignette(id, strength = 0.5) {
  let s = '';
  const bands = 6;
  for (let i = 0; i < bands; i++) {
    const inset = 34 + i * 7;
    s += `<rect x="${inset}" y="${inset}" width="${W - inset * 2}" height="${H - inset * 2}" fill="none" stroke="${INK}" stroke-width="${(1.3 - i * 0.16).toFixed(2)}" opacity="${((bands - i) / bands) * 0.28 * strength}"/>`;
  }
  return s + `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#vig-${id})" opacity="${0.55 * strength}"/>`;
}

/** Sky hatching: horizontal engraved lines that fade toward the horizon. */
export function skyLines(top = 40, bottom = 300, strength = 0.35) {
  let s = '';
  const n = Math.floor((bottom - top) / 7);
  for (let i = 0; i < n; i++) {
    const y = top + i * 7;
    const o = (1 - i / n) * strength;
    s += `<line x1="36" y1="${y}" x2="${W - 36}" y2="${y + rr(-1, 1)}" stroke="${INK}" stroke-width=".8" opacity="${o.toFixed(2)}"/>`;
  }
  return s;
}

/** Dark mass with a lit edge: fill shape, then carve a pale rim on the light side. */
export function mass(d, id, { light = 'left', rim = 1.6 } = {}) {
  const rimColor = 'rgba(246,236,212,.55)';
  const dx = light === 'left' ? -1.2 : 1.2;
  return (
    fill(d, INK) +
    `<path d="${d}" fill="none" stroke="${rimColor}" stroke-width="${rim}" transform="translate(${dx} -1)" stroke-linejoin="round"/>` +
    hatched(d, id, 'hatch2', 'opacity=".12"')
  );
}

export function frame(id, caption) {
  const cap = caption
    ? `<text x="${W / 2}" y="${H - 44}" font-family="'Cinzel','Times New Roman',serif" font-size="19" letter-spacing="3" text-anchor="middle" fill="${INK_SOFT}">${esc(caption)}</text>`
    : '';
  return `
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${INK}" stroke-width="2.4"/>
  <rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${INK}" stroke-width=".9" opacity=".7"/>
  ${corner(34, 34, 1, 1)}${corner(W - 34, 34, -1, 1)}${corner(W - 34, H - 34, -1, -1)}${corner(34, H - 34, 1, -1)}`;
}

function corner(x, y, sx, sy) {
  return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" fill="none" stroke="${INK}" stroke-width="1.2">
    <path d="M0 22 C0 8 8 0 22 0"/><path d="M4 30 C4 12 12 4 30 4" opacity=".6"/><circle cx="7" cy="7" r="2.2" fill="${INK}" stroke="none"/>
  </g>`;
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- strokes ----------------------------------------------------------------
export function stroke(d, w = 2.2, color = INK, extra = '') {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
}
export function fill(d, color = INK, extra = '') {
  const strokeAttr = /\bstroke=/.test(extra) ? '' : 'stroke="none"';
  return `<path d="${d}" fill="${color}" ${strokeAttr} ${extra}/>`;
}
export function hatched(d, id, variant = 'hatch', extra = '') {
  return `<path d="${d}" fill="url(#${variant}-${id})" stroke="none" ${extra}/>`;
}
export function outlineHatch(d, id, w = 2, variant = 'hatch') {
  return hatched(d, id, variant) + stroke(d, w);
}

// A rough, hand-drawn looking polyline through points with slight jitter.
export function wobble(points, w = 2, jitter = 1.4, color = INK, close = false) {
  const pts = points.map(([x, y]) => [x + rr(-jitter, jitter), y + rr(-jitter, jitter)]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const cx = (px + x) / 2 + rr(-jitter, jitter);
    const cy = (py + y) / 2 + rr(-jitter, jitter);
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  if (close) d += ' Z';
  return stroke(d, w, color);
}

// ---- scenery ----------------------------------------------------------------
export function ground(y = 600, opts = {}) {
  const { grass = true, color = INK } = opts;
  let s = stroke(`M40 ${y} C 140 ${y - 6}, 260 ${y + 8}, 520 ${y - 2}`, 2.2, color);
  s += stroke(`M60 ${y + 14} C 180 ${y + 20}, 300 ${y + 8}, 500 ${y + 16}`, 1.1, color, 'opacity=".6"');
  if (grass) {
    for (let i = 0; i < 46; i++) {
      const x = rr(50, 510);
      const yy = y + rr(-2, 12);
      const h = rr(5, 14);
      s += stroke(`M${x} ${yy} l${rr(-3, 3)} ${-h}`, 1, color, 'opacity=".7"');
    }
  }
  return s;
}

export function stones(y, n = 5) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rr(60, 500);
    const w = rr(14, 40);
    const h = rr(8, 18);
    s += stroke(`M${x} ${y} q${w * 0.2} ${-h} ${w * 0.55} ${-h * 0.8} q${w * 0.3} ${h * 0.1} ${w * 0.45} ${h}`, 1.4);
  }
  return s;
}

export function moon(cx, cy, r, id) {
  return `<circle cx="${cx}" cy="${cy}" r="${r * 1.9}" fill="url(#glow-${id})" opacity=".55"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f7eccb" stroke="${INK}" stroke-width="1.4"/>
  <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.2}" r="${r * 0.18}" fill="none" stroke="${INK}" stroke-width=".8" opacity=".5"/>
  <circle cx="${cx + r * 0.25}" cy="${cy + r * 0.3}" r="${r * 0.12}" fill="none" stroke="${INK}" stroke-width=".8" opacity=".5"/>`;
}

export function stars(n = 30, top = 60, bottom = 320) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rr(60, 500);
    const y = rr(top, bottom);
    const r = rr(0.6, 1.8);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${INK}" opacity="${rr(0.35, 0.8).toFixed(2)}"/>`;
  }
  return s;
}

export function mountains(y = 420) {
  let s = '';
  const peaks = [
    [40, y + 60],
    [110, y - 40],
    [160, y + 10],
    [230, y - 90],
    [300, y - 10],
    [360, y - 60],
    [430, y + 20],
    [480, y - 30],
    [520, y + 40]
  ];
  s += wobble(peaks, 1.8, 1);
  // snow hatch on slopes
  for (let i = 1; i < peaks.length - 1; i += 2) {
    const [px, py] = peaks[i];
    s += hatched(`M${px} ${py} L${px + 28} ${py + 52} L${px - 10} ${py + 48} Z`, 'shared', 'hatch2');
  }
  return s;
}

export function pines(y, n = 6, x0 = 60, x1 = 500, scale = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * i) / Math.max(1, n - 1) + rr(-12, 12);
    const h = rr(70, 120) * scale;
    s += fill(`M${x} ${y - h} L${x + 18 * scale} ${y - h * 0.55} L${x + 9 * scale} ${y - h * 0.55} L${x + 26 * scale} ${y - h * 0.2} L${x + 12 * scale} ${y - h * 0.2} L${x + 30 * scale} ${y} L${x - 30 * scale} ${y} L${x - 12 * scale} ${y - h * 0.2} L${x - 26 * scale} ${y - h * 0.2} L${x - 9 * scale} ${y - h * 0.55} L${x - 18 * scale} ${y - h * 0.55} Z`, INK);
  }
  return s;
}

export function castle(x, y, w = 160, h = 110) {
  let s = '';
  s += fill(`M${x} ${y} h${w} v${-h} h${-w} Z`, INK);
  for (let i = 0; i < 7; i++) {
    const bx = x + (i * w) / 7;
    if (i % 2 === 0) s += fill(`M${bx} ${y - h} h${w / 7} v-14 h${-w / 7} Z`, INK);
  }
  s += fill(`M${x + w * 0.42} ${y} h${w * 0.16} v${-h * 0.5} a${w * 0.08} ${w * 0.08} 0 0 0 ${-w * 0.16} 0 Z`, PALE);
  s += fill(`M${x + w * 0.72} ${y - h} h${w * 0.2} v-60 h${-w * 0.2} Z`, INK);
  s += fill(`M${x + w * 0.72} ${y - h - 60} l${w * 0.1} -34 l${w * 0.1} 34 Z`, INK);
  return s;
}

/**
 * A tongue of fire as an engraver would cut it: a solid dark outer flame, a pale inner flame,
 * and a few flicks of lighter ink. `color` INK gives dark flames on light paper; PALE inverts.
 */
export function flames(x, y, w, h, color = INK) {
  let s = '';
  const n = Math.max(3, Math.round(w / 26));
  const inner = color === INK ? PALE : INK;
  // big back tongue
  const tongue = (fx, fy, fw, fh, c, o = 1) => {
    const lean = rr(-0.18, 0.18) * fw;
    return fill(
      `M${fx - fw / 2} ${fy} C ${fx - fw * 0.85} ${fy - fh * 0.42}, ${fx - fw * 0.1 + lean} ${fy - fh * 0.62}, ${fx + lean} ${fy - fh} ` +
        `C ${fx + fw * 0.05 + lean} ${fy - fh * 0.58}, ${fx + fw * 0.85} ${fy - fh * 0.4}, ${fx + fw / 2} ${fy} Z`,
      c,
      `opacity="${o}"`
    );
  };
  for (let i = 0; i < n; i++) {
    const fx = x - w / 2 + (w * (i + 0.5)) / n + rr(-5, 5);
    const fh = h * rr(0.6, 1.1);
    const fw = (w / n) * rr(1.1, 1.5);
    s += tongue(fx, y, fw, fh, color);
  }
  for (let i = 0; i < n; i++) {
    const fx = x - w / 2 + (w * (i + 0.5)) / n + rr(-4, 4);
    const fh = h * rr(0.35, 0.7);
    const fw = (w / n) * rr(0.5, 0.8);
    s += tongue(fx, y, fw, fh, inner, 0.92);
  }
  // sparks
  for (let i = 0; i < n * 2; i++) {
    const sx = x + rr(-w * 0.6, w * 0.6);
    const sy = y - h * rr(0.7, 1.25);
    s += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${rr(1, 2.2).toFixed(1)}" fill="${color}" opacity=".75"/>`;
  }
  return s;
}

export function smoke(x, y, n = 4) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const yy = y - i * 26;
    const r = 10 + i * 6;
    s += stroke(`M${x - r} ${yy} a${r} ${r * 0.7} 0 1 1 ${r * 2} 0`, 1, INK, `opacity="${(0.6 - i * 0.1).toFixed(2)}"`);
  }
  return s;
}

export function sparkle(x, y, r = 8, color = INK) {
  return stroke(`M${x} ${y - r} L${x} ${y + r} M${x - r} ${y} L${x + r} ${y} M${x - r * 0.6} ${y - r * 0.6} L${x + r * 0.6} ${y + r * 0.6} M${x + r * 0.6} ${y - r * 0.6} L${x - r * 0.6} ${y + r * 0.6}`, 1.2, color);
}

export function runeRing(cx, cy, r, n = 12, id) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy}" r="${r - 10}" fill="none" stroke="${INK}" stroke-width=".9"/>`;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * (r - 5);
    const y = cy + Math.sin(a) * (r - 5);
    s += rune(x, y, 6, a + Math.PI / 2);
  }
  if (id) s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="url(#glow-${id})" opacity=".45"/>`;
  return s;
}

export function rune(x, y, size, angle = 0) {
  const k = Math.floor(rnd() * 6);
  const shapes = [
    `M-1 -1 L0 1 L1 -1`,
    `M0 -1 L0 1 M-1 0 L1 0`,
    `M-1 1 L0 -1 L1 1 M-0.5 0 L0.5 0`,
    `M-1 -1 L1 1 M-1 1 L1 -1`,
    `M0 -1 L0 1 M0 -1 L1 -0.3 M0 0.2 L-1 0.9`,
    `M-1 0 L0 -1 L1 0 L0 1 Z`
  ];
  return `<g transform="translate(${x} ${y}) rotate(${(angle * 180) / Math.PI}) scale(${size})">
    <path d="${shapes[k]}" fill="none" stroke="${INK}" stroke-width="${(1.6 / size).toFixed(3)}" stroke-linecap="round"/>
  </g>`;
}

export function lightning(x, y, len = 140, w = 3) {
  let d = `M${x} ${y}`;
  let cx = x;
  let cy = y;
  const steps = 6;
  for (let i = 0; i < steps; i++) {
    cx += rr(-26, 26);
    cy += len / steps;
    d += ` L${cx} ${cy}`;
  }
  return stroke(d, w, INK) + stroke(d, w * 0.35, PALE);
}

// ---- figures ----------------------------------------------------------------
// A posed humanoid built from a few shapes; options control silhouette.
export function humanoid(x, y, opts = {}) {
  const {
    scale = 1,
    hood = false,
    helm = false,
    cloak = false,
    robe = false,
    armor = false,
    beard = false,
    horns = false,
    ears = false,
    wings = false,
    hair = 0,
    armL = -20, // degrees from down
    armR = 20,
    legs = 'stand',
    face = 'front'
  } = opts;
  const g = [];
  const s = scale;
  const headR = 16 * s;
  const hy = y - 150 * s;

  if (wings) {
    g.push(fill(`M${x - 10 * s} ${hy + 50 * s} C ${x - 120 * s} ${hy - 30 * s}, ${x - 150 * s} ${hy + 60 * s}, ${x - 30 * s} ${hy + 110 * s} Z`, INK, 'opacity=".85"'));
    g.push(fill(`M${x + 10 * s} ${hy + 50 * s} C ${x + 120 * s} ${hy - 30 * s}, ${x + 150 * s} ${hy + 60 * s}, ${x + 30 * s} ${hy + 110 * s} Z`, INK, 'opacity=".85"'));
  }
  if (cloak) {
    g.push(fill(`M${x - 22 * s} ${hy + 26 * s} C ${x - 70 * s} ${hy + 90 * s}, ${x - 60 * s} ${y - 10 * s}, ${x - 48 * s} ${y} L ${x + 50 * s} ${y} C ${x + 62 * s} ${y - 10 * s}, ${x + 70 * s} ${hy + 90 * s}, ${x + 22 * s} ${hy + 26 * s} Z`, INK));
  }
  // legs
  if (legs === 'stand') {
    g.push(stroke(`M${x - 10 * s} ${hy + 96 * s} L${x - 14 * s} ${y}`, 7 * s));
    g.push(stroke(`M${x + 10 * s} ${hy + 96 * s} L${x + 16 * s} ${y}`, 7 * s));
  } else if (legs === 'stride') {
    g.push(stroke(`M${x - 8 * s} ${hy + 96 * s} L${x - 34 * s} ${y - 4 * s}`, 7 * s));
    g.push(stroke(`M${x + 8 * s} ${hy + 96 * s} L${x + 30 * s} ${y}`, 7 * s));
  } else if (legs === 'kneel') {
    g.push(stroke(`M${x - 8 * s} ${hy + 96 * s} L${x - 30 * s} ${y - 20 * s} L${x - 6 * s} ${y}`, 7 * s));
    g.push(stroke(`M${x + 8 * s} ${hy + 96 * s} L${x + 20 * s} ${y}`, 7 * s));
  }
  // torso
  if (robe) {
    g.push(fill(`M${x - 24 * s} ${hy + 28 * s} L${x + 24 * s} ${hy + 28 * s} L${x + 44 * s} ${y} L${x - 44 * s} ${y} Z`, INK));
  } else {
    g.push(fill(`M${x - 22 * s} ${hy + 28 * s} L${x + 22 * s} ${hy + 28 * s} L${x + 16 * s} ${hy + 100 * s} L${x - 16 * s} ${hy + 100 * s} Z`, INK));
  }
  if (armor) {
    g.push(stroke(`M${x - 18 * s} ${hy + 44 * s} L${x + 18 * s} ${hy + 44 * s} M${x - 16 * s} ${hy + 60 * s} L${x + 16 * s} ${hy + 60 * s} M${x - 14 * s} ${hy + 76 * s} L${x + 14 * s} ${hy + 76 * s}`, 1.4 * s, PALE));
    g.push(fill(`M${x - 30 * s} ${hy + 30 * s} a12 12 0 0 1 16 -6 l0 12 Z`, INK));
    g.push(fill(`M${x + 30 * s} ${hy + 30 * s} a12 12 0 0 0 -16 -6 l0 12 Z`, INK));
  }
  // arms
  const arm = (ang, side) => {
    const a = ((ang + 180) * Math.PI) / 180;
    const sx = x + side * 20 * s;
    const sy = hy + 34 * s;
    const ex = sx + Math.sin(a) * -58 * s;
    const ey = sy + Math.cos(a) * -58 * s;
    return { d: stroke(`M${sx} ${sy} L${ex} ${ey}`, 6.5 * s), ex, ey };
  };
  const L = arm(armL, -1);
  const R = arm(armR, 1);
  g.push(L.d, R.d);
  // head
  g.push(`<circle cx="${x}" cy="${hy}" r="${headR}" fill="${PALE}" stroke="${INK}" stroke-width="${2 * s}"/>`);
  if (face === 'front') {
    g.push(`<circle cx="${x - 5 * s}" cy="${hy - 2 * s}" r="${1.6 * s}" fill="${INK}"/><circle cx="${x + 5 * s}" cy="${hy - 2 * s}" r="${1.6 * s}" fill="${INK}"/>`);
    g.push(stroke(`M${x - 4 * s} ${hy + 7 * s} q${4 * s} ${2 * s} ${8 * s} 0`, 1.2 * s));
  }
  if (hair > 0) {
    g.push(fill(`M${x - headR} ${hy - 2 * s} C ${x - headR} ${hy - headR * 1.4}, ${x + headR} ${hy - headR * 1.4}, ${x + headR} ${hy - 2 * s} L${x + headR * 0.9} ${hy + hair * s} L${x + headR * 0.6} ${hy - 4 * s} L${x - headR * 0.6} ${hy - 4 * s} L${x - headR * 0.9} ${hy + hair * s} Z`, INK));
  }
  if (beard) {
    g.push(fill(`M${x - 11 * s} ${hy + 6 * s} C ${x - 14 * s} ${hy + 40 * s}, ${x + 14 * s} ${hy + 40 * s}, ${x + 11 * s} ${hy + 6 * s} Z`, INK));
  }
  if (ears) {
    g.push(fill(`M${x - headR + 2 * s} ${hy - 2 * s} l${-16 * s} ${-10 * s} l${10 * s} ${14 * s} Z`, PALE, `stroke="${INK}" stroke-width="${1.5 * s}"`));
    g.push(fill(`M${x + headR - 2 * s} ${hy - 2 * s} l${16 * s} ${-10 * s} l${-10 * s} ${14 * s} Z`, PALE, `stroke="${INK}" stroke-width="${1.5 * s}"`));
  }
  if (horns) {
    g.push(stroke(`M${x - 10 * s} ${hy - 12 * s} C ${x - 24 * s} ${hy - 30 * s}, ${x - 10 * s} ${hy - 46 * s}, ${x - 18 * s} ${hy - 50 * s}`, 4 * s));
    g.push(stroke(`M${x + 10 * s} ${hy - 12 * s} C ${x + 24 * s} ${hy - 30 * s}, ${x + 10 * s} ${hy - 46 * s}, ${x + 18 * s} ${hy - 50 * s}`, 4 * s));
  }
  if (hood) {
    g.push(fill(`M${x - 26 * s} ${hy + 20 * s} C ${x - 30 * s} ${hy - 30 * s}, ${x + 30 * s} ${hy - 30 * s}, ${x + 26 * s} ${hy + 20 * s} L ${x + 14 * s} ${hy + 14 * s} C ${x + 14 * s} ${hy - 8 * s}, ${x - 14 * s} ${hy - 8 * s}, ${x - 14 * s} ${hy + 14 * s} Z`, INK));
  }
  if (helm) {
    g.push(fill(`M${x - headR} ${hy + 2 * s} C ${x - headR} ${hy - headR * 1.5}, ${x + headR} ${hy - headR * 1.5}, ${x + headR} ${hy + 2 * s} L${x + headR} ${hy + 8 * s} L${x - headR} ${hy + 8 * s} Z`, INK));
    g.push(stroke(`M${x - 8 * s} ${hy + 1 * s} L${x - 3 * s} ${hy + 1 * s} M${x + 3 * s} ${hy + 1 * s} L${x + 8 * s} ${hy + 1 * s}`, 1.6 * s, PALE));
  }
  return { svg: g.join('\n'), hands: { L: [L.ex, L.ey], R: [R.ex, R.ey] }, head: [x, hy], headR };
}

// weapons & props drawn at a hand position with an angle
export function sword(x, y, angle = -90, len = 120, w = 2.4) {
  const a = (angle * Math.PI) / 180;
  const ex = x + Math.cos(a) * len;
  const ey = y + Math.sin(a) * len;
  const px = Math.cos(a + Math.PI / 2);
  const py = Math.sin(a + Math.PI / 2);
  return (
    fill(`M${x + px * 4} ${y + py * 4} L${ex} ${ey} L${x - px * 4} ${y - py * 4} Z`, PALE, `stroke="${INK}" stroke-width="${w}"`) +
    stroke(`M${x + px * 16} ${y + py * 16} L${x - px * 16} ${y - py * 16}`, 5) +
    stroke(`M${x} ${y} L${x - Math.cos(a) * 24} ${y - Math.sin(a) * 24}`, 5) +
    stroke(`M${x + Math.cos(a) * 10} ${y + Math.sin(a) * 10} L${ex - Math.cos(a) * 14} ${ey - Math.sin(a) * 14}`, 0.9, INK, 'opacity=".6"')
  );
}

export function axe(x, y, angle = -90, len = 130) {
  const a = (angle * Math.PI) / 180;
  const ex = x + Math.cos(a) * len;
  const ey = y + Math.sin(a) * len;
  const px = Math.cos(a + Math.PI / 2);
  const py = Math.sin(a + Math.PI / 2);
  const hx = ex - Math.cos(a) * 24;
  const hy = ey - Math.sin(a) * 24;
  return (
    stroke(`M${x} ${y} L${ex} ${ey}`, 6) +
    fill(`M${hx} ${hy} C ${hx + px * 44 - Math.cos(a) * 10} ${hy + py * 44 - Math.sin(a) * 10}, ${hx + px * 44 + Math.cos(a) * 44} ${hy + py * 44 + Math.sin(a) * 44}, ${hx + Math.cos(a) * 34} ${hy + Math.sin(a) * 34} Z`, INK) +
    fill(`M${hx} ${hy} C ${hx - px * 44 - Math.cos(a) * 10} ${hy - py * 44 - Math.sin(a) * 10}, ${hx - px * 44 + Math.cos(a) * 44} ${hy - py * 44 + Math.sin(a) * 44}, ${hx + Math.cos(a) * 34} ${hy + Math.sin(a) * 34} Z`, INK)
  );
}

export function staff(x, y, angle = -80, len = 190, orb = true, id) {
  const a = (angle * Math.PI) / 180;
  const ex = x + Math.cos(a) * len;
  const ey = y + Math.sin(a) * len;
  const bx = x - Math.cos(a) * 60;
  const by = y - Math.sin(a) * 60;
  let s = stroke(`M${bx} ${by} L${ex} ${ey}`, 5);
  if (orb) {
    s += `<circle cx="${ex}" cy="${ey}" r="30" fill="url(#glow-${id})"/><circle cx="${ex}" cy="${ey}" r="10" fill="${PALE}" stroke="${INK}" stroke-width="2"/>`;
    s += stroke(`M${ex - 14} ${ey + 10} q14 -22 28 0`, 2);
  }
  return s;
}

export function bow(x, y, angle = -90, size = 110) {
  const a = (angle * Math.PI) / 180;
  const px = Math.cos(a + Math.PI / 2);
  const py = Math.sin(a + Math.PI / 2);
  const t1 = [x + px * size * 0.5, y + py * size * 0.5];
  const t2 = [x - px * size * 0.5, y - py * size * 0.5];
  const bend = [x + Math.cos(a) * size * 0.35, y + Math.sin(a) * size * 0.35];
  return stroke(`M${t1[0]} ${t1[1]} Q${bend[0]} ${bend[1]} ${t2[0]} ${t2[1]}`, 4) + stroke(`M${t1[0]} ${t1[1]} L${x - Math.cos(a) * 30} ${y - Math.sin(a) * 30} L${t2[0]} ${t2[1]}`, 1.2) + stroke(`M${x - Math.cos(a) * 30} ${y - Math.sin(a) * 30} L${x + Math.cos(a) * size * 0.6} ${y + Math.sin(a) * size * 0.6}`, 2);
}

export function shield(x, y, r = 34, device = 'cross') {
  const d = `M${x - r} ${y - r * 0.9} L${x + r} ${y - r * 0.9} L${x + r} ${y + r * 0.2} Q${x} ${y + r * 1.3} ${x - r} ${y + r * 0.2} Z`;
  let s = fill(d, PALE, `stroke="${INK}" stroke-width="3"`);
  // engraved shading on the right half so the boss reads as convex
  s += `<path d="M${x} ${y - r * 0.9} L${x + r} ${y - r * 0.9} L${x + r} ${y + r * 0.2} Q${x + r * 0.5} ${y + r * 1.1} ${x} ${y + r * 1.3} Z" fill="url(#hatch2-shared)" opacity=".55"/>`;
  const ri = r * 0.82;
  s += `<path d="M${x - ri} ${y - ri * 0.9} L${x + ri} ${y - ri * 0.9} L${x + ri} ${y + ri * 0.2} Q${x} ${y + ri * 1.3} ${x - ri} ${y + ri * 0.2} Z" fill="none" stroke="${INK}" stroke-width="1" opacity=".55"/>`;
  if (device === 'cross') s += stroke(`M${x} ${y - r * 0.7} L${x} ${y + r * 0.9} M${x - r * 0.7} ${y - r * 0.1} L${x + r * 0.7} ${y - r * 0.1}`, 4);
  if (device === 'sun') s += `<circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="${INK}"/>` + stroke(`M${x} ${y - r * 0.7} L${x} ${y - r * 0.5} M${x} ${y + r * 0.5} L${x} ${y + r * 0.7} M${x - r * 0.7} ${y} L${x - r * 0.5} ${y} M${x + r * 0.5} ${y} L${x + r * 0.7} ${y}`, 2.5);
  if (device === 'tree') s += fill(`M${x} ${y + r * 0.8} L${x} ${y} M${x - r * 0.5} ${y + r * 0.1} Q${x} ${y - r * 0.9} ${x + r * 0.5} ${y + r * 0.1} Z`, INK);
  return s;
}

export function book(x, y, w = 50, h = 36, open = false) {
  if (!open) {
    return fill(`M${x - w / 2} ${y - h / 2} h${w} v${h} h${-w} Z`, INK) + stroke(`M${x - w / 2 + 6} ${y - h / 2 + 6} h${w - 12} v${h - 12} h${-w + 12} Z`, 1, PALE);
  }
  return (
    fill(`M${x} ${y} C ${x - w * 0.2} ${y - h * 0.3}, ${x - w * 0.9} ${y - h * 0.3}, ${x - w} ${y - h * 0.1} L${x - w} ${y + h * 0.6} C ${x - w * 0.8} ${y + h * 0.4}, ${x - w * 0.2} ${y + h * 0.4}, ${x} ${y + h * 0.7} Z`, PALE, `stroke="${INK}" stroke-width="2"`) +
    fill(`M${x} ${y} C ${x + w * 0.2} ${y - h * 0.3}, ${x + w * 0.9} ${y - h * 0.3}, ${x + w} ${y - h * 0.1} L${x + w} ${y + h * 0.6} C ${x + w * 0.8} ${y + h * 0.4}, ${x + w * 0.2} ${y + h * 0.4}, ${x} ${y + h * 0.7} Z`, PALE, `stroke="${INK}" stroke-width="2"`) +
    stroke(`M${x - w * 0.8} ${y + h * 0.05} h${w * 0.55} M${x - w * 0.8} ${y + h * 0.2} h${w * 0.55} M${x - w * 0.8} ${y + h * 0.35} h${w * 0.4} M${x + w * 0.25} ${y + h * 0.05} h${w * 0.55} M${x + w * 0.25} ${y + h * 0.2} h${w * 0.55} M${x + w * 0.25} ${y + h * 0.35} h${w * 0.4}`, 1, INK, 'opacity=".65"')
  );
}

// ---- creature parts ---------------------------------------------------------
export function eye(x, y, r = 10, pupil = 'round', lid = true) {
  let s = `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="${PALE}" stroke="${INK}" stroke-width="1.8"/>`;
  if (pupil === 'slit') s += `<ellipse cx="${x}" cy="${y}" rx="${r * 0.18}" ry="${r * 0.55}" fill="${INK}"/>`;
  else s += `<circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="${INK}"/>`;
  if (lid) s += stroke(`M${x - r} ${y - r * 0.3} Q${x} ${y - r * 1.1} ${x + r} ${y - r * 0.3}`, 2);
  return s;
}

export function fangs(x, y, n = 6, w = 40, h = 10, up = true) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const fx = x - w / 2 + (w * (i + 0.5)) / n;
    const dir = up ? -1 : 1;
    s += fill(`M${fx - 3} ${y} L${fx} ${y + dir * h} L${fx + 3} ${y} Z`, PALE, `stroke="${INK}" stroke-width="1"`);
  }
  return s;
}

export function claws(x, y, dir = 1, n = 4, size = 14) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const cx = x + dir * i * (size * 0.55);
    s += stroke(`M${cx} ${y} q${dir * size * 0.5} ${size * 0.4} ${dir * size * 0.3} ${size}`, 2.4);
  }
  return s;
}

export function scales(d, id) {
  return `<path d="${d}" fill="url(#scales-${id})" stroke="none"/>`;
}

export function scalePattern(id) {
  return `<pattern id="scales-${id}" width="14" height="12" patternUnits="userSpaceOnUse">
    <path d="M0 6 a7 7 0 0 1 14 0" fill="none" stroke="${INK}" stroke-width="1" opacity=".6"/>
    <path d="M-7 12 a7 7 0 0 1 14 0 M7 12 a7 7 0 0 1 14 0" fill="none" stroke="${INK}" stroke-width="1" opacity=".6"/>
  </pattern>`;
}

export function skullHead(x, y, r = 30) {
  return (
    fill(`M${x} ${y - r} C ${x + r * 1.2} ${y - r}, ${x + r * 1.1} ${y + r * 0.6}, ${x + r * 0.6} ${y + r * 0.8} L${x + r * 0.55} ${y + r * 1.25} L${x - r * 0.55} ${y + r * 1.25} L${x - r * 0.6} ${y + r * 0.8} C ${x - r * 1.1} ${y + r * 0.6}, ${x - r * 1.2} ${y - r}, ${x} ${y - r} Z`, PALE, `stroke="${INK}" stroke-width="2.2"`) +
    `<ellipse cx="${x - r * 0.4}" cy="${y + r * 0.05}" rx="${r * 0.26}" ry="${r * 0.3}" fill="${INK}"/><ellipse cx="${x + r * 0.4}" cy="${y + r * 0.05}" rx="${r * 0.26}" ry="${r * 0.3}" fill="${INK}"/>` +
    fill(`M${x} ${y + r * 0.35} l${-r * 0.14} ${r * 0.3} h${r * 0.28} Z`, INK) +
    stroke(`M${x - r * 0.4} ${y + r * 0.95} v${r * 0.28} M${x - r * 0.15} ${y + r * 0.95} v${r * 0.3} M${x + r * 0.15} ${y + r * 0.95} v${r * 0.3} M${x + r * 0.4} ${y + r * 0.95} v${r * 0.28}`, 1.4)
  );
}

export function wrap(id, body, opts = {}) {
  const { sky = true, vign = 0.6 } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(id, opts)}
  ${opts.extraDefs || ''}
  ${paper(id, opts)}
  <g clip-path="url(#frame-${id})">
  ${sky ? skyLines(40, opts.horizon ?? 300, opts.skyStrength ?? 0.22) : ''}
  ${body}
  ${vignette(id, vign)}
  </g>
  ${frame(id)}
</svg>`;
}
