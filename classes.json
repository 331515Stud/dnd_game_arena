export interface Vec {
  x: number;
  y: number;
}

export type Sign = 1 | -1;

export interface FoldGeometry {
  M: Vec;
  n: Vec;
  dist: number;
  k: number;
  angleDeg: number;
  flatPoly: Vec[];
  flapPoly: Vec[];
  matrix: [number, number, number, number, number, number];
}

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: Vec, s: number): Vec => ({ x: a.x * s, y: a.y * s });
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const len = (a: Vec) => Math.hypot(a.x, a.y);

export const lerp = (a: Vec, b: Vec, t: number): Vec => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** Keep the pulled corner within reach of the spine so the paper never stretches. */
export function constrainCorner(P: Vec, W: number, H: number, cy: number): Vec {
  const near: Vec = { x: 0, y: cy };
  const far: Vec = { x: 0, y: H - cy };
  const rNear = W;
  const rFar = Math.hypot(W, H);
  let out = { ...P };
  for (let i = 0; i < 3; i++) {
    let d = sub(out, near);
    let l = len(d);
    if (l > rNear) out = add(near, mul(d, rNear / l));
    d = sub(out, far);
    l = len(d);
    if (l > rFar) out = add(far, mul(d, rFar / l));
  }
  return out;
}

function clipHalfPlane(poly: Vec[], M: Vec, n: Vec, keepPositive: boolean): Vec[] {
  const out: Vec[] = [];
  const side = (p: Vec) => {
    const s = dot(sub(p, M), n);
    return keepPositive ? s >= 0 : s <= 0;
  };
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ina = side(a);
    const inb = side(b);
    if (ina) out.push(a);
    if (ina !== inb) {
      const da = dot(sub(a, M), n);
      const db = dot(sub(b, M), n);
      const t = da / (da - db);
      out.push(lerp(a, b, t));
    }
  }
  return out;
}

function reflect(p: Vec, M: Vec, n: Vec): Vec {
  const d = dot(sub(p, M), n);
  return sub(p, mul(n, 2 * d));
}

/**
 * Fold a page of width W / height H hinged at the spine (x = 0). `sign` is +1 for
 * the right page, −1 for the left page. The corner C = (sign·W, cy) has been pulled
 * to P. The crease is the perpendicular bisector of C–P; everything on C's side
 * of the crease is folded over and shown mirrored.
 */
export function computeFold(W: number, H: number, sign: Sign, cy: number, P: Vec): FoldGeometry | null {
  const C: Vec = { x: sign * W, y: cy };
  const d = sub(P, C);
  const dist = len(d);
  if (dist < 0.75) return null;
  const n = mul(d, 1 / dist);
  const M = lerp(C, P, 0.5);

  const page: Vec[] =
    sign > 0
      ? [
          { x: 0, y: 0 },
          { x: W, y: 0 },
          { x: W, y: H },
          { x: 0, y: H }
        ]
      : [
          { x: -W, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: H },
          { x: -W, y: H }
        ];

  const flatPoly = clipHalfPlane(page, M, n, true);
  const folded = clipHalfPlane(page, M, n, false);
  const flapPoly = folded.map((p) => reflect(p, M, n));

  const a = 1 - 2 * n.x * n.x;
  const b = -2 * n.x * n.y;
  const c = b;
  const dd = 1 - 2 * n.y * n.y;
  const mn = dot(M, n);
  const e = 2 * mn * n.x;
  const f = 2 * mn * n.y;

  const travel = Math.min(1, dist / (2 * W));
  return {
    M,
    n,
    dist,
    k: Math.sin(Math.PI * travel),
    angleDeg: (Math.atan2(n.y, n.x) * 180) / Math.PI,
    flatPoly,
    flapPoly,
    matrix: [a, b, c, dd, e, f]
  };
}

export function toClipPath(poly: Vec[], W: number): string {
  if (poly.length < 3) return 'polygon(0 0, 0 0, 0 0)';
  return `polygon(${poly.map((p) => `${(p.x + W).toFixed(2)}px ${p.y.toFixed(2)}px`).join(', ')})`;
}

/** Corner path for an automatic turn: sweep to the opposite page with a lift in the middle. */
export function cornerOnPath(W: number, H: number, sign: Sign, cy: number, s: number): Vec {
  const C: Vec = { x: sign * W, y: cy };
  const T: Vec = { x: -sign * W, y: cy };
  const lift = Math.min(H * 0.42, W * 0.8);
  const dir = cy === 0 ? 1 : -1;
  const p = lerp(C, T, s);
  return constrainCorner({ x: p.x, y: p.y + dir * lift * Math.sin(Math.PI * s) }, W, H, cy);
}
