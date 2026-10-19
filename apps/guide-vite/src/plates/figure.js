// Engraved humanoid figure with proportions, limbs with volume and cross-hatched shading.
// Coordinates are relative: (x, y) is the point between the feet; `s` scales everything.
import { INK, PALE, rr, stroke, fill, hatched } from './engine.js';

const P = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;

function limb(ax, ay, bx, by, cx, cy, w1, w2, w3) {
  // tapered two-segment limb (shoulder->elbow->hand), with light hatching on one side
  const n1 = norm(ax, ay, bx, by);
  const n2 = norm(bx, by, cx, cy);
  const d = `M${P(ax + n1.x * w1, ay + n1.y * w1)} L${P(bx + n2.x * w2, by + n2.y * w2)} L${P(cx + n2.x * w3, cy + n2.y * w3)} L${P(cx - n2.x * w3, cy - n2.y * w3)} L${P(bx - n2.x * w2, by - n2.y * w2)} L${P(ax - n1.x * w1, ay - n1.y * w1)} Z`;
  return d;
}
function norm(ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const l = Math.hypot(dx, dy) || 1;
  return { x: -dy / l, y: dx / l };
}
function pt(x, y, ang, len) {
  const a = (ang * Math.PI) / 180;
  return [x + Math.cos(a) * len, y + Math.sin(a) * len];
}

/**
 * opts:
 *  s            scale (1 ≈ 190px tall)
 *  facing       -1 | 1   which way the body is turned (affects face & gear)
 *  pose         'stand' | 'stride' | 'kneel' | 'lunge' | 'float'
 *  head         'bare' | 'hood' | 'helm' | 'wizardhat' | 'crown' | 'bald'
 *  hair         0..1 length factor
 *  beard        bool
 *  ears         'round' | 'pointed'
 *  horns        bool
 *  tusks        bool
 *  body         'tunic' | 'robe' | 'plate' | 'leather' | 'fur' | 'dress'
 *  cloak        bool
 *  armL / armR  { upper: deg, fore: deg }   (0 = down, negative = raised forward-ish)
 *  id           pattern id for hatching
 */
export function figure(x, y, opts = {}) {
  const {
    s = 1,
    facing = 1,
    pose = 'stand',
    head = 'bare',
    hair = 0.35,
    beard = false,
    ears = 'round',
    horns = false,
    tusks = false,
    body = 'tunic',
    cloak = false,
    armL = { upper: 20, fore: 10 },
    armR = { upper: -20, fore: -10 },
    id = 'shared',
    bulk = 1 // 1 normal, 1.3 heavy, 0.85 slim
  } = opts;

  const out = { back: [], mid: [], front: [] };
  const H = 190 * s;
  const headR = 15 * s;
  const neckY = y - H + headR * 2 + 6 * s;
  const shoulderY = neckY + 8 * s;
  const shoulderW = 24 * s * bulk;
  const hipY = y - 78 * s;
  const hipW = 15 * s * bulk;
  const headX = x;
  const headY = y - H + headR;

  // ---------- cloak (behind everything) ----------
  if (cloak) {
    const d = `M${P(x - shoulderW, shoulderY)} C ${P(x - shoulderW - 30 * s, hipY)}, ${P(x - shoulderW - 44 * s, y - 20 * s)}, ${P(x - shoulderW - 30 * s, y)} L ${P(x + shoulderW + 34 * s, y)} C ${P(x + shoulderW + 42 * s, y - 30 * s)}, ${P(x + shoulderW + 26 * s, hipY)}, ${P(x + shoulderW, shoulderY)} Z`;
    out.back.push(fill(d, INK));
    // folds
    for (let i = 0; i < 5; i++) {
      const fx = x - shoulderW - 10 * s + i * 14 * s * bulk;
      out.back.push(stroke(`M${P(fx, shoulderY + 30 * s)} C ${P(fx - 8 * s, hipY + 30 * s)}, ${P(fx - 6 * s, y - 40 * s)}, ${P(fx - 10 * s, y - 4 * s)}`, 1, PALE, 'opacity=".28"'));
    }
  }

  // ---------- legs ----------
  const legW = 7 * s * bulk;
  const footL = 13 * s;
  let lk, rk, lf, rf;
  if (pose === 'stride' || pose === 'lunge') {
    lk = [x - 16 * s * facing, y - 40 * s];
    lf = [x - 30 * s * facing, y];
    rk = [x + 14 * s * facing, y - 42 * s];
    rf = [x + 26 * s * facing, y];
    if (pose === 'lunge') {
      lf = [x - 46 * s * facing, y];
      lk = [x - 28 * s * facing, y - 34 * s];
    }
  } else if (pose === 'kneel') {
    lk = [x - 18 * s * facing, y - 6 * s];
    lf = [x - 2 * s * facing, y];
    rk = [x + 18 * s * facing, y - 38 * s];
    rf = [x + 22 * s * facing, y];
  } else {
    lk = [x - 9 * s, y - 40 * s];
    lf = [x - 12 * s, y];
    rk = [x + 9 * s, y - 40 * s];
    rf = [x + 12 * s, y];
  }
  const legs = [
    [x - hipW * 0.6, hipY, ...lk, ...lf],
    [x + hipW * 0.6, hipY, ...rk, ...rf]
  ];
  for (const [ax, ay, bx, by, cx, cy] of legs) {
    out.mid.push(fill(limb(ax, ay, bx, by, cx, cy, legW, legW * 0.85, legW * 0.6), INK));
    // boot
    const dir = cx >= x ? 1 : -1;
    out.mid.push(fill(`M${P(cx - legW * 0.8, cy)} L${P(cx - legW * 0.8, cy - 10 * s)} L${P(cx + legW * 0.8, cy - 10 * s)} L${P(cx + legW * 0.8 + dir * footL, cy - 2 * s)} L${P(cx + legW * 0.8 + dir * footL, cy)} Z`, INK));
  }

  // ---------- torso ----------
  let torso;
  if (body === 'robe' || body === 'dress') {
    torso = `M${P(x - shoulderW, shoulderY)} L${P(x + shoulderW, shoulderY)} C ${P(x + shoulderW + 6 * s, hipY)}, ${P(x + hipW + 30 * s, y - 10 * s)}, ${P(x + hipW + 34 * s, y + 2 * s)} L ${P(x - hipW - 34 * s, y + 2 * s)} C ${P(x - hipW - 30 * s, y - 10 * s)}, ${P(x - shoulderW - 6 * s, hipY)}, ${P(x - shoulderW, shoulderY)} Z`;
  } else {
    torso = `M${P(x - shoulderW, shoulderY)} C ${P(x - shoulderW - 2 * s, shoulderY + 20 * s)}, ${P(x - hipW - 6 * s, hipY - 8 * s)}, ${P(x - hipW - 4 * s, hipY + 6 * s)} L ${P(x + hipW + 4 * s, hipY + 6 * s)} C ${P(x + hipW + 6 * s, hipY - 8 * s)}, ${P(x + shoulderW + 2 * s, shoulderY + 20 * s)}, ${P(x + shoulderW, shoulderY)} Z`;
  }
  out.mid.push(fill(torso, INK));
  // light side highlight hatching on torso
  out.mid.push(stroke(`M${P(x - shoulderW * 0.55, shoulderY + 16 * s)} C ${P(x - shoulderW * 0.7, hipY - 20 * s)}, ${P(x - hipW * 0.6, hipY - 10 * s)}, ${P(x - hipW * 0.5, hipY + 2 * s)}`, 1.1, PALE, 'opacity=".32"'));

  if (body === 'plate') {
    // breastplate ridge & pauldrons
    out.mid.push(stroke(`M${P(x, shoulderY + 10 * s)} L${P(x, hipY)}`, 1.4 * s, PALE, 'opacity=".55"'));
    out.mid.push(stroke(`M${P(x - shoulderW * 0.8, shoulderY + 24 * s)} Q ${P(x, shoulderY + 34 * s)} ${P(x + shoulderW * 0.8, shoulderY + 24 * s)}`, 1.2 * s, PALE, 'opacity=".5"'));
    out.mid.push(stroke(`M${P(x - shoulderW * 0.7, shoulderY + 44 * s)} Q ${P(x, shoulderY + 52 * s)} ${P(x + shoulderW * 0.7, shoulderY + 44 * s)}`, 1.2 * s, PALE, 'opacity=".45"'));
    out.front.push(fill(`M${P(x - shoulderW - 10 * s, shoulderY - 2 * s)} a${14 * s} ${12 * s} 0 0 1 ${22 * s} ${-4 * s} l${2 * s} ${16 * s} l${-24 * s} ${4 * s} Z`, INK));
    out.front.push(fill(`M${P(x + shoulderW + 10 * s, shoulderY - 2 * s)} a${14 * s} ${12 * s} 0 0 0 ${-22 * s} ${-4 * s} l${-2 * s} ${16 * s} l${24 * s} ${4 * s} Z`, INK));
    out.front.push(stroke(`M${P(x - shoulderW - 8 * s, shoulderY + 4 * s)} q${10 * s} ${-8 * s} ${18 * s} ${-2 * s}`, 1, PALE, 'opacity=".5"'));
  }
  if (body === 'leather') {
    out.mid.push(stroke(`M${P(x - shoulderW * 0.8, shoulderY + 10 * s)} L${P(x + hipW * 0.8, hipY)} M${P(x - shoulderW * 0.4, hipY - 4 * s)} L${P(x + hipW, hipY - 4 * s)}`, 1.3 * s, PALE, 'opacity=".45"'));
    for (let i = 0; i < 4; i++) out.mid.push(`<circle cx="${(x - shoulderW * 0.75 + ((shoulderW * 1.5) / 3) * i).toFixed(1)}" cy="${(shoulderY + 12 * s).toFixed(1)}" r="${1.4 * s}" fill="${PALE}" opacity=".6"/>`);
  }
  if (body === 'fur') {
    for (let i = 0; i < 14; i++) {
      const fx = x - shoulderW + rr(0, shoulderW * 2);
      const fy = shoulderY + rr(0, 30 * s);
      out.front.push(stroke(`M${P(fx, fy)} l${rr(-3, 3) * s} ${-rr(6, 12) * s}`, 1.2 * s, PALE, 'opacity=".55"'));
    }
    out.front.push(stroke(`M${P(x - shoulderW, shoulderY + 30 * s)} Q ${P(x, shoulderY + 44 * s)} ${P(x + shoulderW, shoulderY + 30 * s)}`, 2 * s, PALE, 'opacity=".4"'));
  }
  if (body === 'robe') {
    // robe folds
    for (let i = -2; i <= 2; i++) {
      const fx = x + i * 10 * s;
      out.front.push(stroke(`M${P(fx, hipY)} C ${P(fx + i * 4 * s, hipY + 30 * s)}, ${P(fx + i * 8 * s, y - 30 * s)}, ${P(fx + i * 12 * s, y)}`, 1, PALE, 'opacity=".3"'));
    }
    // belt rope
    out.front.push(stroke(`M${P(x - hipW - 6 * s, hipY - 6 * s)} Q ${P(x, hipY + 2 * s)} ${P(x + hipW + 6 * s, hipY - 6 * s)}`, 2 * s, PALE, 'opacity=".7"'));
  } else {
    // belt
    out.front.push(fill(`M${P(x - hipW - 5 * s, hipY - 2 * s)} h${(hipW * 2 + 10 * s).toFixed(1)} v${(5 * s).toFixed(1)} h${(-(hipW * 2 + 10 * s)).toFixed(1)} Z`, PALE, 'opacity=".55"'));
    out.front.push(`<rect x="${(x - 3 * s).toFixed(1)}" y="${(hipY - 3 * s).toFixed(1)}" width="${6 * s}" height="${7 * s}" fill="${INK}"/>`);
  }

  // ---------- arms ----------
  const armSeg = 30 * s;
  const foreSeg = 30 * s;
  const armW = 5.5 * s * bulk;
  const arms = [
    { side: -1, a: armL },
    { side: 1, a: armR }
  ];
  const hands = {};
  for (const { side, a } of arms) {
    const sx = x + side * shoulderW * 0.9;
    const sy = shoulderY + 4 * s;
    const [ex, ey] = pt(sx, sy, 90 + a.upper, armSeg);
    const [hx, hy] = pt(ex, ey, 90 + a.upper + a.fore, foreSeg);
    const d = fill(limb(sx, sy, ex, ey, hx, hy, armW, armW * 0.85, armW * 0.7), INK);
    // hand
    const hand = `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${(4.6 * s * bulk).toFixed(1)}" fill="${PALE}" stroke="${INK}" stroke-width="${(1.4 * s).toFixed(1)}"/>`;
    (side === facing ? out.front : out.back).push(d, hand);
    hands[side === -1 ? 'L' : 'R'] = [hx, hy];
    hands[side === -1 ? 'elbowL' : 'elbowR'] = [ex, ey];
  }

  // ---------- neck & head ----------
  out.mid.push(fill(`M${P(x - 5 * s, neckY - 6 * s)} h${10 * s} v${12 * s} h${-10 * s} Z`, PALE, `stroke="${INK}" stroke-width="${1.2 * s}"`));
  const faceD = `M${P(headX - headR, headY)} C ${P(headX - headR, headY - headR * 1.25)}, ${P(headX + headR, headY - headR * 1.25)}, ${P(headX + headR, headY)} C ${P(headX + headR, headY + headR * 0.75)}, ${P(headX + headR * 0.5, headY + headR * 1.2)}, ${P(headX, headY + headR * 1.2)} C ${P(headX - headR * 0.5, headY + headR * 1.2)}, ${P(headX - headR, headY + headR * 0.75)}, ${P(headX - headR, headY)} Z`;
  out.front.push(fill(faceD, PALE, `stroke="${INK}" stroke-width="${1.8 * s}"`));
  // shaded side of face
  out.front.push(hatched(`M${P(headX + facing * headR * 0.35, headY - headR * 1.05)} C ${P(headX + facing * headR * 1.02, headY - headR * 0.9)}, ${P(headX + facing * headR * 1.02, headY + headR * 0.6)}, ${P(headX + facing * headR * 0.2, headY + headR * 1.18)} L ${P(headX + facing * headR * 0.55, headY + headR * 0.4)} Z`, id, 'hatch2', 'opacity=".55"'));
  // features
  const ey = headY - headR * 0.1;
  out.front.push(`<ellipse cx="${(headX - headR * 0.4).toFixed(1)}" cy="${ey.toFixed(1)}" rx="${(2.4 * s).toFixed(1)}" ry="${(1.6 * s).toFixed(1)}" fill="${INK}"/>`);
  out.front.push(`<ellipse cx="${(headX + headR * 0.4).toFixed(1)}" cy="${ey.toFixed(1)}" rx="${(2.4 * s).toFixed(1)}" ry="${(1.6 * s).toFixed(1)}" fill="${INK}"/>`);
  out.front.push(stroke(`M${P(headX - headR * 0.62, ey - 4 * s)} q${headR * 0.25} ${-3 * s} ${headR * 0.5} ${-1 * s} M${P(headX + headR * 0.12, ey - 5 * s)} q${headR * 0.25} ${-2 * s} ${headR * 0.5} ${1 * s}`, 1.3 * s));
  out.front.push(stroke(`M${P(headX + facing * 1.5 * s, ey + 1 * s)} l${facing * 3 * s} ${7 * s} l${-facing * 4 * s} ${1 * s}`, 1.1 * s));
  out.front.push(stroke(`M${P(headX - headR * 0.28, headY + headR * 0.55)} q${headR * 0.28} ${2.5 * s} ${headR * 0.56} 0`, 1.2 * s));

  if (ears === 'pointed') {
    out.front.push(fill(`M${P(headX - headR + 2 * s, headY - 2 * s)} l${-20 * s} ${-12 * s} l${12 * s} ${18 * s} Z`, PALE, `stroke="${INK}" stroke-width="${1.5 * s}"`));
    out.front.push(fill(`M${P(headX + headR - 2 * s, headY - 2 * s)} l${20 * s} ${-12 * s} l${-12 * s} ${18 * s} Z`, PALE, `stroke="${INK}" stroke-width="${1.5 * s}"`));
  }
  if (hair > 0 && head !== 'helm' && head !== 'hood' && head !== 'bald') {
    const len = headR * (0.6 + hair * 2.2);
    out.back.push(fill(`M${P(headX - headR - 2 * s, headY - headR * 0.2)} C ${P(headX - headR - 2 * s, headY - headR * 1.6)}, ${P(headX + headR + 2 * s, headY - headR * 1.6)}, ${P(headX + headR + 2 * s, headY - headR * 0.2)} L ${P(headX + headR + 6 * s, headY + len)} L ${P(headX - headR - 6 * s, headY + len)} Z`, INK));
    out.front.push(fill(`M${P(headX - headR - 1 * s, headY - headR * 0.3)} C ${P(headX - headR * 0.9, headY - headR * 1.5)}, ${P(headX + headR * 0.9, headY - headR * 1.5)}, ${P(headX + headR + 1 * s, headY - headR * 0.3)} C ${P(headX + headR * 0.4, headY - headR * 0.75)}, ${P(headX - headR * 0.2, headY - headR * 0.9)}, ${P(headX - headR - 1 * s, headY - headR * 0.3)} Z`, INK));
  }
  if (beard) {
    out.front.push(fill(`M${P(headX - headR * 0.8, headY + headR * 0.3)} C ${P(headX - headR * 0.9, headY + headR * 2.2)}, ${P(headX + headR * 0.9, headY + headR * 2.2)}, ${P(headX + headR * 0.8, headY + headR * 0.3)} C ${P(headX + headR * 0.3, headY + headR * 0.9)}, ${P(headX - headR * 0.3, headY + headR * 0.9)}, ${P(headX - headR * 0.8, headY + headR * 0.3)} Z`, INK));
    out.front.push(stroke(`M${P(headX - headR * 0.3, headY + headR * 1.1)} v${headR * 0.7} M${P(headX, headY + headR * 1.2)} v${headR * 0.85} M${P(headX + headR * 0.3, headY + headR * 1.1)} v${headR * 0.7}`, 1, PALE, 'opacity=".35"'));
  }
  if (tusks) {
    out.front.push(fill(`M${P(headX - headR * 0.35, headY + headR * 0.6)} l${-2 * s} ${-9 * s} l${5 * s} ${3 * s} Z M${P(headX + headR * 0.35, headY + headR * 0.6)} l${2 * s} ${-9 * s} l${-5 * s} ${3 * s} Z`, PALE, `stroke="${INK}" stroke-width="${1.2 * s}"`));
  }
  if (horns) {
    out.front.push(stroke(`M${P(headX - headR * 0.6, headY - headR * 0.8)} C ${P(headX - headR * 1.6, headY - headR * 1.6)}, ${P(headX - headR * 0.6, headY - headR * 2.6)}, ${P(headX - headR * 1.2, headY - headR * 3)}`, 4.2 * s));
    out.front.push(stroke(`M${P(headX + headR * 0.6, headY - headR * 0.8)} C ${P(headX + headR * 1.6, headY - headR * 1.6)}, ${P(headX + headR * 0.6, headY - headR * 2.6)}, ${P(headX + headR * 1.2, headY - headR * 3)}`, 4.2 * s));
  }
  if (head === 'hood') {
    out.front.push(fill(`M${P(headX - headR * 1.7, neckY + 10 * s)} C ${P(headX - headR * 1.9, headY - headR * 0.4)}, ${P(headX - headR * 1.3, headY - headR * 2.1)}, ${P(headX, headY - headR * 2.1)} C ${P(headX + headR * 1.3, headY - headR * 2.1)}, ${P(headX + headR * 1.9, headY - headR * 0.4)}, ${P(headX + headR * 1.7, neckY + 10 * s)} L ${P(headX + headR * 0.95, neckY + 4 * s)} C ${P(headX + headR * 1.1, headY - headR * 0.2)}, ${P(headX + headR * 0.8, headY - headR * 1.2)}, ${P(headX, headY - headR * 1.25)} C ${P(headX - headR * 0.8, headY - headR * 1.2)}, ${P(headX - headR * 1.1, headY - headR * 0.2)}, ${P(headX - headR * 0.95, neckY + 4 * s)} Z`, INK));
    out.front.push(hatched(`M${P(headX - headR * 0.9, headY - headR * 0.3)} C ${P(headX - headR * 0.5, headY - headR * 1.1)}, ${P(headX + headR * 0.5, headY - headR * 1.1)}, ${P(headX + headR * 0.9, headY - headR * 0.3)} L ${P(headX + headR * 0.6, headY + headR * 0.3)} L ${P(headX - headR * 0.6, headY + headR * 0.3)} Z`, id, 'cross', 'opacity=".7"'));
  }
  if (head === 'helm') {
    out.front.push(fill(`M${P(headX - headR - 2 * s, headY + 4 * s)} C ${P(headX - headR - 2 * s, headY - headR * 1.55)}, ${P(headX + headR + 2 * s, headY - headR * 1.55)}, ${P(headX + headR + 2 * s, headY + 4 * s)} L ${P(headX + headR + 2 * s, headY + headR * 0.9)} L ${P(headX - headR - 2 * s, headY + headR * 0.9)} Z`, INK));
    out.front.push(stroke(`M${P(headX - headR * 0.75, headY - 1 * s)} h${headR * 0.5} M${P(headX + headR * 0.25, headY - 1 * s)} h${headR * 0.5}`, 2.2 * s, PALE));
    out.front.push(stroke(`M${P(headX, headY - headR * 1.5)} v${headR * 0.9}`, 2 * s, PALE, 'opacity=".5"'));
    // crest
    out.back.push(fill(`M${P(headX - 3 * s, headY - headR * 1.45)} C ${P(headX - 6 * s, headY - headR * 2.6)}, ${P(headX + 22 * s, headY - headR * 2.6)}, ${P(headX + 26 * s, headY - headR * 1.2)} L ${P(headX + 3 * s, headY - headR * 1.4)} Z`, INK));
  }
  if (head === 'wizardhat') {
    out.front.push(fill(`M${P(headX - headR * 2.2, headY - headR * 0.6)} h${headR * 4.4} l${-headR * 1.3} ${-headR * 0.5} L ${P(headX + headR * 0.4, headY - headR * 4.6)} C ${P(headX, headY - headR * 4.9)}, ${P(headX - headR * 0.9, headY - headR * 4.2)}, ${P(headX - headR * 0.3, headY - headR * 3.4)} L ${P(headX - headR * 0.9, headY - headR * 1.1)} Z`, INK));
    out.front.push(stroke(`M${P(headX - headR * 1.6, headY - headR * 0.75)} q${headR * 1.6} ${-headR * 0.35} ${headR * 3.2} 0`, 1.2 * s, PALE, 'opacity=".45"'));
  }
  if (head === 'crown') {
    out.front.push(fill(`M${P(headX - headR * 0.95, headY - headR * 0.75)} l${headR * 0.15} ${-headR * 0.9} l${headR * 0.35} ${headR * 0.5} l${headR * 0.45} ${-headR * 0.8} l${headR * 0.45} ${headR * 0.8} l${headR * 0.35} ${-headR * 0.5} l${headR * 0.15} ${headR * 0.9} Z`, PALE, `stroke="${INK}" stroke-width="${1.6 * s}"`));
  }

  let svg = [...out.back, ...out.mid, ...out.front].join('\n');
  if (opts.ghost) {
    // Outline-only rendering for invisible / illusory figures: strip fills, keep a dashed contour.
    svg = svg
      .replace(/<path d="([^"]+)" fill="[^"]*"( stroke="[^"]*")?( stroke-width="[^"]*")?([^/]*)\/>/g, (m, d, st, sw, rest) =>
        `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-dasharray="5 5"${rest.replace(/stroke(-width)?="[^"]*"/g, '')}/>`
      )
      .replace(/<(circle|ellipse|rect)([^>]*?)fill="[^"]*"([^>]*?)\/>/g, (m, tag, a, b2) => {
        const attrs = (a + b2).replace(/stroke(-width|-dasharray)?="[^"]*"/g, '');
        return `<${tag}${attrs} fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="4 4"/>`;
      });
  }
  return {
    svg,
    hands,
    head: [headX, headY],
    headR,
    shoulder: [x, shoulderY],
    hip: [x, hipY],
    height: H
  };
}
