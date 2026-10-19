import { PLATES_A } from './plates-a.js';
import { PLATES_B } from './plates-b.js';
import { PLATES_C } from './plates-c.js';
import { PLATES_D } from './plates-d.js';

const PLATES = {
  ...PLATES_A,
  ...PLATES_B,
  ...PLATES_C,
  ...PLATES_D,
};

export function hasPlate(key) {
  return Boolean(key && Object.prototype.hasOwnProperty.call(PLATES, key));
}

export function renderPlateSvg(key) {
  const fn = key ? PLATES[key] : undefined;
  return typeof fn === 'function' ? fn(key) : null;
}
