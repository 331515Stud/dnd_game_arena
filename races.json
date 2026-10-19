import * as THREE from 'three';

export type DieKind = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd10ones' | 'd10tens';

export interface DieFace {
  normal: THREE.Vector3;
  center: THREE.Vector3;
  value: number;
  label: string;
  labelSize: number;
  quaternion: THREE.Quaternion;
}

export interface DieModel {
  kind: DieKind;
  geometry: THREE.BufferGeometry;
  faces: DieFace[];
  hull: Float32Array;
  radius: number;
}

const RADIUS = 0.48;

function ensureOutward(geo: THREE.BufferGeometry) {
  const src = geo.index ? geo.toNonIndexed() : geo;
  const pos = src.getAttribute('position');
  const va = new THREE.Vector3();
  const vb = new THREE.Vector3();
  const vc = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const n = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    va.fromBufferAttribute(pos, i);
    vb.fromBufferAttribute(pos, i + 1);
    vc.fromBufferAttribute(pos, i + 2);
    n.crossVectors(ab.subVectors(vb, va), ac.subVectors(vc, va));
    c.copy(va).add(vb).add(vc);
    if (n.dot(c) < 0) {
      pos.setXYZ(i + 1, vc.x, vc.y, vc.z);
      pos.setXYZ(i + 2, vb.x, vb.y, vb.z);
    }
  }
  pos.needsUpdate = true;
  src.computeVertexNormals();
  return src;
}

function fitRadius(geo: THREE.BufferGeometry, radius: number) {
  geo.computeBoundingSphere();
  const r = geo.boundingSphere?.radius || 1;
  const s = radius / r;
  geo.scale(s, s, s);
  geo.computeBoundingSphere();
  return geo;
}

interface RawFace {
  normal: THREE.Vector3;
  center: THREE.Vector3;
  area: number;
}

function groupFaces(geo: THREE.BufferGeometry): RawFace[] {
  const pos = geo.getAttribute('position');
  const groups: { normal: THREE.Vector3; acc: THREE.Vector3; weight: number }[] = [];
  const va = new THREE.Vector3();
  const vb = new THREE.Vector3();
  const vc = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const n = new THREE.Vector3();
  const c = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    va.fromBufferAttribute(pos, i);
    vb.fromBufferAttribute(pos, i + 1);
    vc.fromBufferAttribute(pos, i + 2);
    n.crossVectors(ab.subVectors(vb, va), ac.subVectors(vc, va));
    const area = n.length() * 0.5;
    if (area < 1e-8) continue;
    n.normalize();
    c.copy(va).add(vb).add(vc).multiplyScalar(1 / 3);
    if (n.dot(c) < 0) n.negate();
    const found = groups.find((g) => g.normal.dot(n) > 0.992);
    if (!found) {
      groups.push({ normal: n.clone(), acc: c.clone().multiplyScalar(area), weight: area });
    } else {
      found.acc.add(c.multiplyScalar(area));
      found.weight += area;
    }
  }

  return groups.map((g) => ({
    normal: g.normal.normalize(),
    center: g.acc.multiplyScalar(1 / g.weight),
    area: g.weight
  }));
}

function faceQuaternion(normal: THREE.Vector3) {
  const z = normal.clone().normalize();
  const hint = Math.abs(z.z) > 0.82 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, -1);
  const x = new THREE.Vector3().crossVectors(hint, z);
  if (x.lengthSq() < 1e-8) x.crossVectors(new THREE.Vector3(1, 0, 0), z);
  x.normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

function pairValues(faces: RawFace[], start: number, step: number, sum: number) {
  const used = new Array(faces.length).fill(false);
  const values = new Array(faces.length).fill(0);
  let n = start;
  for (let i = 0; i < faces.length; i++) {
    if (used[i]) continue;
    let opp = -1;
    let best = -0.55;
    for (let j = 0; j < faces.length; j++) {
      if (i === j || used[j]) continue;
      const d = faces[i].normal.dot(faces[j].normal);
      if (d < best) {
        best = d;
        opp = j;
      }
    }
    values[i] = n;
    used[i] = true;
    if (opp >= 0) {
      values[opp] = sum - n;
      used[opp] = true;
    }
    n += step;
  }
  return values;
}

function labelFor(kind: DieKind, value: number) {
  if (kind === 'd10tens') return String(value).padStart(2, '0');
  if (kind === 'd10' && value === 10) return '10';
  return String(value);
}

function toModel(kind: DieKind, geo: THREE.BufferGeometry, values: number[]): DieModel {
  const raw = groupFaces(geo);
  if (raw.length !== values.length) {
    console.warn(`[dice] ${kind}: expected ${values.length} faces, got ${raw.length}`);
  }
  const faces: DieFace[] = raw.map((f, i) => {
    const value = values[i] ?? i + 1;
    const label = labelFor(kind, value);
    const labelSize = THREE.MathUtils.clamp(Math.sqrt(f.area) * 0.62, 0.11, 0.36);
    return {
      normal: f.normal,
      center: f.center,
      value,
      label,
      labelSize,
      quaternion: faceQuaternion(f.normal)
    };
  });
  const pos = geo.getAttribute('position');
  return {
    kind,
    geometry: geo,
    faces,
    hull: new Float32Array(pos.array as ArrayLike<number>),
    radius: geo.boundingSphere?.radius ?? RADIUS
  };
}

function prepare(geo: THREE.BufferGeometry) {
  return fitRadius(ensureOutward(geo), RADIUS);
}

/** Fair 10-sided solid: pentagonal bipyramid, all faces congruent by symmetry. */
function d10Geometry() {
  const n = 5;
  const ringR = 1;
  const apexH = 0.86;
  const ring: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    ring.push(new THREE.Vector3(Math.cos(a) * ringR, 0, Math.sin(a) * ringR));
  }
  const top = new THREE.Vector3(0, apexH, 0);
  const bot = new THREE.Vector3(0, -apexH, 0);
  const positions: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };
  for (let i = 0; i < n; i++) {
    const i1 = (i + 1) % n;
    push(top, ring[i], ring[i1]);
    push(bot, ring[i1], ring[i]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

function build(kind: DieKind): DieModel {
  if (kind === 'd4') {
    const geo = prepare(new THREE.TetrahedronGeometry(1));
    const raw = groupFaces(geo);
    return toModel(kind, geo, raw.map((_, i) => i + 1));
  }
  if (kind === 'd6') {
    const geo = prepare(new THREE.BoxGeometry(1, 1, 1));
    const raw = groupFaces(geo);
    return toModel(kind, geo, pairValues(raw, 1, 1, 7));
  }
  if (kind === 'd8') {
    const geo = prepare(new THREE.OctahedronGeometry(1, 0));
    const raw = groupFaces(geo);
    return toModel(kind, geo, pairValues(raw, 1, 1, 9));
  }
  if (kind === 'd12') {
    const geo = prepare(new THREE.DodecahedronGeometry(1, 0));
    const raw = groupFaces(geo);
    return toModel(kind, geo, pairValues(raw, 1, 1, 13));
  }
  if (kind === 'd20') {
    const geo = prepare(new THREE.IcosahedronGeometry(1, 0));
    const raw = groupFaces(geo);
    return toModel(kind, geo, pairValues(raw, 1, 1, 21));
  }
  const geo = prepare(d10Geometry());
  const raw = groupFaces(geo);
  if (kind === 'd10tens') return toModel(kind, geo, pairValues(raw, 0, 10, 90));
  if (kind === 'd10ones') return toModel(kind, geo, pairValues(raw, 0, 1, 9));
  return toModel(kind, geo, pairValues(raw, 1, 1, 11));
}

const cache = new Map<DieKind, DieModel>();

export function getDieModel(kind: DieKind): DieModel {
  let model = cache.get(kind);
  if (!model) {
    model = build(kind);
    cache.set(kind, model);
  }
  return model;
}

export function selfCheckDice() {
  const expected: Record<DieKind, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
    d10ones: 10,
    d10tens: 10
  };
  const report: string[] = [];
  (Object.keys(expected) as DieKind[]).forEach((kind) => {
    const model = getDieModel(kind);
    const values = model.faces.map((f) => f.value).sort((a, b) => a - b);
    const unique = new Set(values);
    let inward = 0;
    model.faces.forEach((f) => {
      if (f.normal.dot(f.center) <= 0) inward++;
    });
    report.push(
      `${kind}: faces=${model.faces.length}/${expected[kind]} unique=${unique.size} inward=${inward} values=${values.join(',')}`
    );
  });
  return report;
}
