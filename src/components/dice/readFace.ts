import { Quaternion, Vector3 } from 'three';
import type { DieFace } from './geometry';

const q = new Quaternion();
const n = new Vector3();

/**
 * Which face is up: i = argmax (n_k · up), up = (0, 1, 0).
 * The value is a property of the settled orientation, not a pre-rolled number.
 */
export function readUpFace(rotation: { x: number; y: number; z: number; w: number }, faces: DieFace[]) {
  q.set(rotation.x, rotation.y, rotation.z, rotation.w);
  let best = -Infinity;
  let face = faces[0];
  for (const candidate of faces) {
    n.copy(candidate.normal).applyQuaternion(q);
    const dot = n.y;
    if (dot > best) {
      best = dot;
      face = candidate;
    }
  }
  return {
    value: face.value,
    label: face.label,
    confidence: best
  };
}

export function randomQuaternion() {
  const u1 = Math.random();
  const u2 = Math.random();
  const u3 = Math.random();
  const s1 = Math.sqrt(1 - u1);
  const s2 = Math.sqrt(u1);
  const t2 = Math.PI * 2 * u2;
  const t3 = Math.PI * 2 * u3;
  return {
    x: s1 * Math.sin(t2),
    y: s1 * Math.cos(t2),
    z: s2 * Math.sin(t3),
    w: s2 * Math.cos(t3)
  };
}
