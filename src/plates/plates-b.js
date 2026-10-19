// Plates for feats and spells.
import * as E from './engine.js';
import { figure } from './figure.js';
const { INK, INK_SOFT, PALE, RUST, W, H } = E;

const arm = (upper, fore) => ({ upper, fore });
const floorShadow = (x, y, w) => `<ellipse cx="${x}" cy="${y + 3}" rx="${w}" ry="${w * 0.16}" fill="${INK}" opacity=".22"/>`;

export const PLATES_B = {
  // ───────────────────────────── FEATS ─────────────────────────────
  'feat-toc': (id) => {
    E.seed(101);
    let b = E.stars(30, 50, 260) + E.ground(650);
    b += `<circle cx="280" cy="240" r="110" fill="url(#glow-${id})" opacity=".75"/>`;
    b += E.runeRing(280, 240, 88, 12, id);
    b += E.sword(280, 320, -90, 170, 2.8);
    b += floorShadow(180, 650, 48) + floorShadow(380, 650, 48);
    const f1 = figure(180, 650, { s: 1.15, facing: 1, pose: 'stride', body: 'plate', head: 'helm', armL: arm(-40, -30), armR: arm(-130, -20), id });
    const f2 = figure(380, 650, { s: 1.15, facing: -1, pose: 'stride', body: 'leather', head: 'hood', cloak: true, armL: arm(-120, -20), armR: arm(-40, -30), id });
    b += f1.svg + f2.svg;
    return E.wrap(id, b, { caption: 'Liber Virtutum' });
  },
  'feat-lucky': (id) => {
    E.seed(102);
    let b = E.stars(36, 50, 320) + E.ground(650);
    b += `<circle cx="280" cy="220" r="130" fill="url(#glow-${id})" opacity=".85"/>`;
    for (const [cx, cy] of [[200, 210], [280, 170], [360, 210]]) {
      b += `<polygon points="${cx},${cy - 32} ${cx + 28},${cy - 10} ${cx + 18},${cy + 26} ${cx - 18},${cy + 26} ${cx - 28},${cy - 10}" fill="${PALE}" stroke="${INK}" stroke-width="2.4"/>`;
      b += `<text x="${cx}" y="${cy + 7}" font-family="'Cinzel',serif" font-size="18" text-anchor="middle" fill="${INK}">20</text>`;
      b += E.sparkle(cx, cy - 42, 8);
    }
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.25, facing: 1, body: 'leather', cloak: true, hair: 0.6, armL: arm(-140, -20), armR: arm(-140, -20), id });
    b += f.svg;
    return E.wrap(id, b, { caption: 'Fortunatus' });
  },
  'feat-alert': (id) => {
    E.seed(103);
    let b = E.moon(430, 120, 38, id) + E.pines(650, 7, 50, 510, 1.1) + E.ground(650);
    b += E.eye(280, 170, 56, 'round');
    b += floorShadow(280, 650, 58);
    const f = figure(280, 650, { s: 1.28, facing: -1, pose: 'stride', body: 'leather', cloak: true, hair: 0.5, armL: arm(-100, -20), armR: arm(-150, -10), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -45, 135, 2.4);
    b += E.stroke(`M70 360 L210 430 M490 340 L350 420`, 2, INK, 'stroke-dasharray="6 6"');
    return E.wrap(id, b, { caption: 'Vigilans' });
  },
  'feat-war-caster': (id) => {
    E.seed(104);
    let b = E.ground(650, { grass: false });
    b += E.runeRing(280, 380, 150, 14, id);
    b += floorShadow(280, 650, 62);
    const f = figure(280, 650, { s: 1.32, facing: 1, body: 'plate', cloak: true, hair: 0.4, armL: arm(-40, -20), armR: arm(-155, -15), id });
    b += f.svg;
    b += E.shield(f.hands.L[0] - 10, f.hands.L[1], 42, 'sun');
    b += `<circle cx="${f.hands.R[0]}" cy="${f.hands.R[1]}" r="46" fill="url(#glow-${id})"/>`;
    b += E.flames(f.hands.R[0], f.hands.R[1] + 8, 42, 68) + E.lightning(f.hands.R[0], f.hands.R[1] - 90, 90, 2.5);
    return E.wrap(id, b, { caption: 'Magus Belli' });
  },
  'feat-gwm': (id) => {
    E.seed(105);
    let b = E.mountains(400) + E.ground(650, { grass: false }) + E.stones(650, 8);
    b += floorShadow(260, 650, 68);
    const f = figure(260, 650, { s: 1.38, facing: 1, pose: 'lunge', body: 'plate', head: 'helm', bulk: 1.3, armL: arm(-145, -20), armR: arm(-130, -30), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -55, 220, 3.6);
    for (let i = 0; i < 8; i++) b += E.stroke(`M${140 + i * 24} ${260 + i * 16} q80 -40 180 30`, 1.4, INK, 'opacity=".45"');
    return E.wrap(id, b, { caption: 'Impetus Magnus' });
  },
  'feat-sharpshooter': (id) => {
    E.seed(106);
    let b = E.mountains(390) + E.pines(650, 5, 60, 300, 1.0) + E.ground(650);
    b += `<circle cx="430" cy="240" r="56" fill="${PALE}" stroke="${INK}" stroke-width="2.6"/><circle cx="430" cy="240" r="34" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="430" cy="240" r="12" fill="${INK}"/>`;
    b += floorShadow(190, 650, 54);
    const f = figure(190, 650, { s: 1.28, facing: 1, body: 'leather', head: 'hood', cloak: true, armL: arm(-115, 0), armR: arm(-95, -60), id });
    b += f.svg;
    b += E.bow(f.hands.L[0], f.hands.L[1], -28, 175);
    b += E.stroke(`M${f.hands.L[0]} ${f.hands.L[1]} L430 240`, 2.2, RUST, 'stroke-dasharray="8 5"');
    return E.wrap(id, b, { caption: 'Sagittarius' });
  },
  'feat-polearm': (id) => {
    E.seed(107);
    let b = E.castle(70, 460, 420, 140) + E.ground(650, { grass: false });
    b += floorShadow(270, 650, 60);
    const f = figure(270, 650, { s: 1.32, facing: 1, pose: 'stride', body: 'plate', head: 'helm', armL: arm(-75, -30), armR: arm(-135, -20), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.L[0] - 50} ${f.hands.L[1] + 90} L${f.hands.R[0] + 90} ${f.hands.R[1] - 180}`, 5.5);
    const tx = f.hands.R[0] + 90, ty = f.hands.R[1] - 180;
    b += E.fill(`M${tx} ${ty} l18 -38 l12 42 l-26 22 Z`, INK) + E.fill(`M${tx - 6} ${ty + 12} c-36 -18 -42 18 -8 28 Z`, INK);
    return E.wrap(id, b, { caption: 'Hastatus' });
  },
  'feat-sentinel': (id) => {
    E.seed(108);
    let b = E.stroke(`M110 650 V220 A170 170 0 0 1 450 220 V650`, 8) + E.ground(650, { grass: false });
    b += floorShadow(280, 650, 66);
    const f = figure(280, 650, { s: 1.36, facing: 1, body: 'plate', head: 'helm', cloak: true, bulk: 1.25, armL: arm(-35, -15), armR: arm(-110, -10), id });
    b += f.svg;
    b += E.shield(f.hands.L[0] - 14, f.hands.L[1], 48, 'cross');
    b += E.sword(f.hands.R[0], f.hands.R[1], -15, 165, 2.8);
    return E.wrap(id, b, { caption: 'Custos Liminis' });
  },
  'feat-resilient': (id) => {
    E.seed(109);
    let b = E.ground(650, { grass: false });
    b += `<circle cx="280" cy="370" r="165" fill="url(#glow-${id})" opacity=".7"/>`;
    for (let i = 0; i < 8; i++) b += E.lightning(80 + i * 56, 70, 210, 2.4);
    b += floorShadow(280, 650, 60);
    const f = figure(280, 650, { s: 1.3, facing: 1, body: 'plate', cloak: true, hair: 0.5, armL: arm(-120, -40), armR: arm(-120, -40), id });
    b += f.svg;
    b += `<path d="M150 420 A140 140 0 0 1 410 420" fill="none" stroke="${INK}" stroke-width="3.5"/>`;
    return E.wrap(id, b, { caption: 'Indomitus' });
  },
  'feat-tough': (id) => {
    E.seed(110);
    let b = E.mountains(380) + E.ground(650, { grass: false }) + E.stones(650, 7);
    b += floorShadow(280, 650, 72);
    const f = figure(280, 650, { s: 1.42, facing: 1, body: 'fur', beard: true, hair: 0.8, bulk: 1.45, armL: arm(-45, -60), armR: arm(-45, -60), id });
    b += f.svg;
    for (let i = 0; i < 5; i++) {
      const ax = 170 + i * 16, ay = 390 + i * 22;
      b += E.stroke(`M${ax - 55} ${ay - 25} L${ax} ${ay}`, 2.5);
    }
    return E.wrap(id, b, { caption: 'Robur' });
  },
  'feat-magic-initiate': (id) => {
    E.seed(111);
    let b = E.stars(32, 60, 320) + E.ground(650, { grass: false });
    b += E.runeRing(280, 250, 95, 10, id);
    b += floorShadow(280, 650, 52);
    const f = figure(280, 650, { s: 1.24, facing: 1, body: 'tunic', cloak: true, hair: 0.5, armL: arm(-85, -45), armR: arm(-150, -20), id });
    b += f.svg;
    b += E.book(f.hands.L[0], f.hands.L[1] + 6, 56, 42, true);
    b += `<circle cx="${f.hands.R[0]}" cy="${f.hands.R[1]}" r="38" fill="url(#glow-${id})"/>` + E.sparkle(f.hands.R[0], f.hands.R[1], 14);
    return E.wrap(id, b, { caption: 'Initiatus' });
  },
  'feat-inspiring': (id) => {
    E.seed(112);
    let b = `<circle cx="280" cy="240" r="180" fill="url(#glow-${id})" opacity=".8"/>` + E.ground(650);
    for (const x of [120, 200, 360, 440]) {
      b += floorShadow(x, 650, 34) + figure(x, 650, { s: 0.92, facing: x < 280 ? 1 : -1, body: 'plate', head: 'helm', id }).svg;
    }
    b += floorShadow(280, 650, 58);
    const f = figure(280, 650, { s: 1.32, facing: 1, body: 'plate', cloak: true, head: 'crown', armL: arm(-30, -20), armR: arm(-165, -10), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} V${f.hands.R[1] - 190}`, 4.5) + E.fill(`M${f.hands.R[0]} ${f.hands.R[1] - 190} h95 l-24 28 l24 28 h-95 Z`, INK);
    return E.wrap(id, b, { caption: 'Dux Vocis' });
  },
  'feat-mobile': (id) => {
    E.seed(113);
    let b = E.ground(650);
    for (let i = 0; i < 14; i++) b += E.stroke(`M${60 + i * 18} ${360 + (i % 5) * 48} h${60 + (i % 3) * 35}`, 1.6, INK, 'opacity=".45"');
    b += floorShadow(310, 650, 54);
    const f = figure(310, 650, { s: 1.28, facing: 1, pose: 'lunge', body: 'leather', cloak: true, hair: 0.7, armL: arm(-140, -30), armR: arm(-40, -80), id });
    b += f.svg;
    b += E.sword(f.hands.L[0], f.hands.L[1], -35, 110, 2.0);
    return E.wrap(id, b, { caption: 'Celeritas' });
  },
  'feat-observant': (id) => {
    E.seed(114);
    let b = E.ground(660, { grass: false });
    b += E.eye(280, 175, 64, 'round');
    b += E.runeRing(280, 175, 96, 12, id);
    b += floorShadow(280, 660, 52);
    const f = figure(280, 660, { s: 1.25, facing: 1, body: 'robe', cloak: true, hair: 0.4, armL: arm(-95, -55), armR: arm(-40, -30), id });
    b += f.svg;
    b += `<circle cx="${f.hands.L[0] + 10}" cy="${f.hands.L[1] - 12}" r="18" fill="${PALE}" stroke="${INK}" stroke-width="3"/>` + E.stroke(`M${f.hands.L[0]} ${f.hands.L[1]} l-12 16`, 4);
    return E.wrap(id, b, { caption: 'Perspicax' });
  },
  'feat-shield-master': (id) => {
    E.seed(115);
    let b = E.ground(650, { grass: false }) + E.stones(650, 6);
    b += floorShadow(260, 650, 64);
    const f = figure(260, 650, { s: 1.34, facing: 1, pose: 'lunge', body: 'plate', head: 'helm', armL: arm(-115, -10), armR: arm(-30, -40), id });
    b += f.svg;
    b += E.shield(f.hands.L[0] + 28, f.hands.L[1] - 6, 52, 'sun');
    for (let i = 0; i < 7; i++) b += E.stroke(`M${360} ${460} L${430 + E.rr(-10, 30)} ${380 + i * 28}`, 2.2);
    return E.wrap(id, b, { caption: 'Scutum Impetus' });
  },
  'feat-mage-slayer': (id) => {
    E.seed(116);
    let b = E.ground(650, { grass: false });
    b += E.runeRing(370, 420, 95, 10, id);
    b += floorShadow(210, 650, 58) + floorShadow(390, 650, 50);
    const f1 = figure(210, 650, { s: 1.3, facing: 1, pose: 'lunge', body: 'plate', cloak: true, armL: arm(-40, -30), armR: arm(-115, -10), id });
    const f2 = figure(390, 650, { s: 1.2, facing: -1, body: 'robe', head: 'wizardhat', beard: true, armL: arm(-130, -20), armR: arm(-60, -20), id });
    b += f1.svg + f2.svg;
    b += E.sword(f1.hands.R[0], f1.hands.R[1], -18, 160, 2.8);
    return E.wrap(id, b, { caption: 'Venator Magorum' });
  },

  // ───────────────────────────── SPELLS ─────────────────────────────
  'sp-toc': (id) => {
    E.seed(201);
    let b = E.stars(45, 50, 360) + E.moon(280, 160, 46, id) + E.ground(660, { grass: false });
    b += E.runeRing(280, 340, 150, 16, id);
    b += E.book(280, 340, 110, 80, true);
    b += floorShadow(280, 660, 58);
    const f = figure(280, 660, { s: 1.25, facing: 1, body: 'robe', head: 'wizardhat', beard: true, cloak: true, armL: arm(-140, -20), armR: arm(-140, -20), id });
    b += f.svg;
    return E.wrap(id, b, { caption: 'Grimorium Scriptorii' });
  },
  'sp-predig': (id) => {
    E.seed(202);
    let b = E.ground(650, { grass: false });
    b += floorShadow(280, 650, 54);
    const f = figure(280, 650, { s: 1.26, facing: 1, body: 'robe', hair: 0.6, armL: arm(-125, -25), armR: arm(-110, -40), id });
    b += f.svg;
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      b += E.sparkle(280 + Math.cos(a) * 110, 310 + Math.sin(a) * 80, 10);
    }
    b += E.flames(f.hands.L[0], f.hands.L[1], 24, 38);
    return E.wrap(id, b, { caption: 'Praestigiae' });
  },
  'sp-eb': (id) => {
    E.seed(203);
    let b = E.stars(30, 50, 320) + E.ground(650, { grass: false });
    b += floorShadow(180, 650, 54);
    const f = figure(180, 650, { s: 1.28, facing: 1, body: 'robe', head: 'hood', cloak: true, armL: arm(-30, -20), armR: arm(-110, -5), id });
    b += f.svg;
    const [hx, hy] = f.hands.R;
    b += `<circle cx="${hx}" cy="${hy}" r="45" fill="url(#glow-${id})"/>`;
    for (const dy of [-55, 0, 55]) {
      b += E.stroke(`M${hx} ${hy} Q340 ${hy + dy * 0.5} 495 ${280 + dy}`, 6, INK) + E.stroke(`M${hx} ${hy} Q340 ${hy + dy * 0.5} 495 ${280 + dy}`, 2, PALE);
      b += E.sparkle(495, 280 + dy, 14);
    }
    return E.wrap(id, b, { caption: 'Ictus Arcanus' });
  },
  'sp-guidance': (id) => {
    E.seed(204);
    let b = `<circle cx="280" cy="220" r="160" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(650);
    b += floorShadow(220, 650, 52) + floorShadow(340, 650, 52);
    const f1 = figure(220, 650, { s: 1.24, facing: 1, body: 'robe', cloak: true, armL: arm(-40, -20), armR: arm(-125, -20), id });
    const f2 = figure(340, 650, { s: 1.22, facing: -1, body: 'leather', hair: 0.5, id });
    b += f1.svg + f2.svg;
    b += E.sparkle(340, 420, 18) + E.runeRing(340, 420, 48, 8, id);
    return E.wrap(id, b, { caption: 'Ductus Divinus' });
  },
  'sp-firebolt': (id) => {
    E.seed(205);
    let b = E.ground(650, { grass: false });
    b += floorShadow(185, 650, 54);
    const f = figure(185, 650, { s: 1.28, facing: 1, pose: 'stride', body: 'robe', hair: 0.7, armL: arm(-40, -30), armR: arm(-115, -10), id });
    b += f.svg;
    b += `<circle cx="420" cy="270" r="85" fill="url(#glow-${id})"/>`;
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} L420 270`, 5, RUST);
    b += E.flames(420, 300, 74, 96);
    return E.wrap(id, b, { caption: 'Telum Ignis' });
  },
  'sp-minorillusion': (id) => {
    E.seed(206);
    let b = E.ground(650, { grass: false });
    b += floorShadow(190, 650, 50);
    const f = figure(190, 650, { s: 1.22, facing: 1, body: 'leather', cloak: true, hair: 0.6, armL: arm(-90, -30), armR: arm(-120, -20), id });
    b += f.svg;
    b += `<g opacity=".48">` + figure(380, 630, { s: 1.35, facing: -1, body: 'plate', head: 'crown', id }).svg + `</g>`;
    b += E.smoke(380, 630, 6);
    return E.wrap(id, b, { caption: 'Imago Minor' });
  },
  'sp-shield': (id) => {
    E.seed(207);
    let b = E.ground(650, { grass: false });
    b += floorShadow(230, 650, 56);
    const f = figure(230, 650, { s: 1.28, facing: 1, body: 'robe', cloak: true, hair: 0.5, armL: arm(-30, -20), armR: arm(-120, -10), id });
    b += f.svg;
    b += `<path d="M310 210 A210 210 0 0 1 310 610" fill="none" stroke="${INK}" stroke-width="5"/>`;
    b += `<path d="M300 225 A195 195 0 0 1 300 595" fill="url(#glow-${id})" stroke="${INK}" stroke-width="1.6" stroke-dasharray="8 6"/>`;
    for (let i = 0; i < 6; i++) {
      const y = 270 + i * 52;
      b += E.stroke(`M490 ${y - 20} L348 ${y}`, 3) + E.sparkle(348, y, 8);
    }
    return E.wrap(id, b, { caption: 'Scutum Arcanum' });
  },
  'sp-hword': (id) => {
    E.seed(208);
    let b = `<circle cx="340" cy="360" r="150" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(650);
    b += floorShadow(180, 650, 52) + floorShadow(360, 650, 52);
    const f1 = figure(180, 650, { s: 1.24, facing: 1, body: 'plate', cloak: true, armL: arm(-30, -20), armR: arm(-130, -10), id });
    const f2 = figure(360, 650, { s: 1.18, facing: -1, pose: 'kneel', body: 'leather', id });
    b += f1.svg + f2.svg;
    for (let i = 0; i < 10; i++) b += E.sparkle(360 + E.rr(-60, 60), 420 + E.rr(-90, 60), 9);
    return E.wrap(id, b, { caption: 'Verbum Salutis' });
  },
  'sp-bless': (id) => {
    E.seed(209);
    let b = `<circle cx="280" cy="220" r="190" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(650);
    for (const x of [150, 280, 410]) {
      b += floorShadow(x, 650, 46);
      b += figure(x, 650, { s: 1.15, facing: 1, body: x === 280 ? 'plate' : 'leather', cloak: true, id }).svg;
      b += `<circle cx="${x}" cy="390" r="28" fill="none" stroke="${INK}" stroke-width="2"/>` + E.sparkle(x, 355, 8);
    }
    return E.wrap(id, b, { caption: 'Benedictio' });
  },
  'sp-magearmor': (id) => {
    E.seed(210);
    let b = E.ground(650, { grass: false });
    b += `<ellipse cx="280" cy="470" rx="115" ry="175" fill="url(#glow-${id})" stroke="${INK}" stroke-width="2.6" stroke-dasharray="10 6"/>`;
    b += E.runeRing(280, 470, 135, 12, id);
    b += floorShadow(280, 650, 54);
    b += figure(280, 650, { s: 1.28, facing: 1, body: 'robe', hair: 0.7, armL: arm(-110, -20), armR: arm(-110, -20), id }).svg;
    return E.wrap(id, b, { caption: 'Lorica Magi' });
  },
  'sp-hex': (id) => {
    E.seed(211);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".45"/>` + E.ground(650, { grass: false });
    b += E.skullHead(280, 210, 54);
    b += E.runeRing(280, 210, 105, 12, id);
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.24, facing: 1, pose: 'kneel', body: 'plate', id }).svg;
    return E.wrap(id, b, { caption: 'Maleficium' });
  },
  'sp-faerie': (id) => {
    E.seed(212);
    let b = E.pines(650, 6, 60, 500, 1.1) + E.ground(650);
    b += `<circle cx="280" cy="450" r="140" fill="url(#glow-${id})" opacity=".8"/>`;
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.28, facing: 1, pose: 'stride', body: 'leather', head: 'hood', cloak: true, id }).svg;
    for (let i = 0; i < 18; i++) b += E.sparkle(280 + E.rr(-85, 85), 470 + E.rr(-120, 120), E.rr(5, 11));
    return E.wrap(id, b, { caption: 'Ignis Fatuus' });
  },
  'sp-sleep': (id) => {
    E.seed(213);
    let b = E.moon(280, 140, 48, id) + E.stars(35, 50, 320) + E.ground(650);
    for (const [x, fdir] of [[150, 1], [280, -1], [410, 1]]) {
      b += floorShadow(x, 650, 44);
      b += figure(x, 650, { s: 1.05, facing: fdir, pose: 'kneel', body: 'leather', id }).svg;
      b += E.smoke(x, 480, 4);
    }
    return E.wrap(id, b, { caption: 'Somnus' });
  },
  'sp-misty': (id) => {
    E.seed(214);
    let b = E.ground(650, { grass: false });
    b += `<g opacity=".35">` + figure(150, 650, { s: 1.22, facing: 1, pose: 'stride', body: 'robe', cloak: true, id }).svg + `</g>`;
    b += E.smoke(150, 620, 7) + E.smoke(390, 620, 7);
    b += floorShadow(390, 650, 54);
    b += figure(390, 650, { s: 1.26, facing: 1, pose: 'stride', body: 'robe', cloak: true, armL: arm(-110, -20), armR: arm(-60, -30), id }).svg;
    return E.wrap(id, b, { caption: 'Gradus Nebulae' });
  },
  'sp-holdperson': (id) => {
    E.seed(215);
    let b = E.ground(650, { grass: false });
    b += E.runeRing(280, 460, 140, 12, id);
    b += floorShadow(280, 650, 58);
    b += figure(280, 650, { s: 1.3, facing: 1, body: 'plate', head: 'helm', armL: arm(-70, 0), armR: arm(-70, 0), id }).svg;
    for (let y = 380; y <= 600; y += 44) b += E.stroke(`M150 ${y} Q280 ${y + 18} 410 ${y}`, 3.5);
    return E.wrap(id, b, { caption: 'Vinculum' });
  },
  'sp-spiritualweapon': (id) => {
    E.seed(216);
    let b = E.ground(650, { grass: false });
    b += `<circle cx="380" cy="270" r="110" fill="url(#glow-${id})" opacity=".9"/>`;
    b += E.sword(380, 350, -90, 175, 3.2);
    b += floorShadow(180, 650, 54);
    const f = figure(180, 650, { s: 1.25, facing: 1, body: 'plate', cloak: true, armL: arm(-30, -20), armR: arm(-135, -15), id });
    b += f.svg;
    return E.wrap(id, b, { caption: 'Telum Spirituale' });
  },
  'sp-invisibility': (id) => {
    E.seed(217);
    let b = E.moon(420, 120, 38, id) + E.castle(70, 460, 420, 150) + E.ground(650, { grass: false });
    b += `<g opacity=".28">` + figure(280, 650, { s: 1.3, facing: 1, pose: 'stride', body: 'leather', head: 'hood', cloak: true, id }).svg + `</g>`;
    b += E.runeRing(280, 470, 120, 10, id);
    return E.wrap(id, b, { caption: 'Invisibilitas' });
  },
  'sp-web': (id) => {
    E.seed(218);
    let b = E.ground(650, { grass: false });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      b += E.stroke(`M280 390 L${280 + Math.cos(a) * 230} ${390 + Math.sin(a) * 230}`, 1.8);
    }
    for (let r = 40; r <= 200; r += 40) b += `<circle cx="280" cy="390" r="${r}" fill="none" stroke="${INK}" stroke-width="1.4"/>`;
    b += floorShadow(280, 650, 54);
    b += figure(280, 650, { s: 1.22, facing: 1, body: 'plate', head: 'helm', armL: arm(-110, -30), armR: arm(-110, -30), id }).svg;
    return E.wrap(id, b, { caption: 'Tela Araneae' });
  },
  'sp-passwithout': (id) => {
    E.seed(219);
    let b = E.moon(120, 120, 40, id) + E.pines(650, 8, 50, 510, 1.15) + E.ground(650);
    for (const x of [170, 280, 390]) {
      b += `<g opacity=".65">` + figure(x, 650, { s: 1.12, facing: 1, pose: 'stride', body: 'leather', head: 'hood', cloak: true, id }).svg + `</g>`;
    }
    return E.wrap(id, b, { caption: 'Sine Vestigio' });
  },
  'sp-fireball': (id) => {
    E.seed(220);
    let b = E.ground(650, { grass: false }) + E.stones(650, 7);
    b += `<circle cx="280" cy="310" r="185" fill="url(#glow-${id})"/>`;
    b += `<circle cx="280" cy="310" r="115" fill="${PALE}" stroke="${INK}" stroke-width="3"/>`;
    b += E.flames(280, 410, 220, 210);
    for (const x of [120, 440]) {
      b += floorShadow(x, 650, 44) + figure(x, 650, { s: 1.08, facing: x < 280 ? -1 : 1, pose: 'lunge', body: 'plate', id }).svg;
    }
    return E.wrap(id, b, { caption: 'Globus Ignis' });
  },
  'sp-counterspell': (id) => {
    E.seed(221);
    let b = E.ground(650, { grass: false });
    b += floorShadow(170, 650, 52) + floorShadow(390, 650, 52);
    const f1 = figure(170, 650, { s: 1.24, facing: 1, body: 'robe', cloak: true, armL: arm(-30, -20), armR: arm(-115, -10), id });
    const f2 = figure(390, 650, { s: 1.24, facing: -1, body: 'robe', head: 'wizardhat', beard: true, armL: arm(-115, -10), armR: arm(-30, -20), id });
    b += f1.svg + f2.svg;
    b += E.runeRing(280, 410, 68, 10, id);
    b += E.stroke(`M220 350 L340 470 M340 350 L220 470`, 4, RUST);
    return E.wrap(id, b, { caption: 'Contradictio' });
  },
  'sp-spirit-g': (id) => {
    E.seed(222);
    let b = `<circle cx="280" cy="430" r="185" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(650, { grass: false });
    b += E.runeRing(280, 430, 155, 16, id);
    b += floorShadow(280, 650, 58);
    const f = figure(280, 650, { s: 1.28, facing: 1, body: 'plate', cloak: true, armL: arm(-40, -20), armR: arm(-150, -10), id });
    b += f.svg;
    b += E.shield(f.hands.L[0] - 10, f.hands.L[1], 40, 'sun');
    for (const [gx, gy] of [[150, 320], [410, 320]]) {
      b += E.humanoid(gx, gy, { scale: 0.75, robe: true, wings: true, armL: -120, armR: 120 }).svg;
    }
    return E.wrap(id, b, { caption: 'Custodes Spirituales' });
  },
  'sp-hypno': (id) => {
    E.seed(223);
    let b = E.stars(35, 50, 350) + E.ground(650, { grass: false });
    for (let r = 20; r <= 160; r += 22) {
      b += `<circle cx="280" cy="270" r="${r}" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="10 8"/>`;
    }
    for (const x of [150, 280, 410]) {
      b += floorShadow(x, 650, 46) + figure(x, 650, { s: 1.12, facing: 1, body: 'leather', id }).svg;
    }
    return E.wrap(id, b, { caption: ' Vortex Hypnoticus' });
  },
  'sp-revivify': (id) => {
    E.seed(224);
    let b = `<circle cx="280" cy="300" r="190" fill="url(#glow-${id})" opacity=".9"/>` + E.ground(650, { grass: false });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      b += E.stroke(`M280 260 L${280 + Math.cos(a) * 190} ${260 + Math.sin(a) * 190}`, 1.6, INK, 'opacity=".5"');
    }
    b += `<polygon points="280,210 315,260 280,310 245,260" fill="${PALE}" stroke="${INK}" stroke-width="2.6"/>`;
    b += floorShadow(280, 650, 58);
    b += figure(280, 650, { s: 1.24, facing: 1, pose: 'kneel', body: 'plate', cloak: true, armL: arm(-135, -15), armR: arm(-135, -15), id }).svg;
    return E.wrap(id, b, { caption: 'Revivificatio' });
  },
  'sp-dispel': (id) => {
    E.seed(225);
    let b = E.ground(650, { grass: false });
    b += `<circle cx="280" cy="310" r="110" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="14 12"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      b += E.rune(280 + Math.cos(a) * 135, 310 + Math.sin(a) * 135, 9, a);
    }
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.28, facing: 1, body: 'robe', cloak: true, armL: arm(-140, -10), armR: arm(-140, -10), id }).svg;
    return E.wrap(id, b, { caption: 'Dissipatio Magiae' });
  },
  'sp-fly': (id) => {
    E.seed(226);
    let b = E.stars(30, 50, 280) + E.mountains(560) + E.ground(660);
    const f = figure(280, 390, { s: 1.26, facing: 1, pose: 'stride', body: 'robe', cloak: true, armL: arm(-130, -10), armR: arm(-50, -20), id });
    b += f.svg;
    return E.wrap(id, b, { caption: 'Volatus' });
  },
  'sp-animatedead': (id) => {
    E.seed(227);
    let b = E.moon(430, 120, 40, id) + E.ground(650, { grass: false });
    b += E.skullHead(160, 470, 24) + E.skullHead(400, 470, 24);
    b += E.stroke(`M160 500 V650 M135 540 H185 M400 500 V650 M375 540 H425`, 4);
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.28, facing: 1, body: 'robe', head: 'hood', cloak: true, armL: arm(-135, -15), armR: arm(-135, -15), id });
    b += f.svg;
    return E.wrap(id, b, { caption: 'Exsuscitatio Mortuorum' });
  },
  'sp-ddoor': (id) => {
    E.seed(228);
    let b = E.stars(32, 50, 300) + E.ground(650, { grass: false });
    b += E.fill(`M185 650 V240 A95 95 0 0 1 375 240 V650 Z`, INK);
    b += `<path d="M200 650 V245 A80 80 0 0 1 360 245 V650 Z" fill="url(#glow-${id})"/>`;
    b += floorShadow(250, 650, 50);
    b += figure(250, 650, { s: 1.24, facing: 1, pose: 'stride', body: 'robe', cloak: true, id }).svg;
    return E.wrap(id, b, { caption: 'Ianua Dimensionis' });
  },
  'sp-polymorph': (id) => {
    E.seed(229);
    let b = E.ground(650);
    b += E.runeRing(280, 430, 155, 14, id);
    b += E.mass(`M160 650 L180 420 L250 310 L360 280 L430 340 L380 410 L420 650 Z`, id);
    b += E.fangs(385, 345, 5, 42, 12, false) + E.eye(345, 310, 10, 'slit');
    return E.wrap(id, b, { caption: 'Metamorphosis' });
  },
  'sp-banishment': (id) => {
    E.seed(230);
    let b = E.stars(40, 50, 380) + E.ground(650, { grass: false });
    b += E.runeRing(280, 300, 135, 16, id);
    b += `<polygon points="280,165 400,370 160,370" fill="none" stroke="${INK}" stroke-width="2.6"/>`;
    b += `<polygon points="280,435 400,230 160,230" fill="none" stroke="${INK}" stroke-width="2.6"/>`;
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.26, facing: 1, body: 'robe', cloak: true, armL: arm(-150, -10), armR: arm(-30, -20), id }).svg;
    return E.wrap(id, b, { caption: 'Exsilium' });
  },
  'sp-greaterinvis': (id) => {
    E.seed(231);
    let b = E.ground(650, { grass: false });
    b += E.runeRing(280, 440, 145, 14, id);
    const f = figure(280, 650, { s: 1.32, facing: 1, pose: 'lunge', body: 'leather', head: 'hood', cloak: true, armL: arm(-120, -20), armR: arm(-140, -10), id });
    b += `<g opacity=".32">${f.svg}</g>`;
    b += E.sword(f.hands.R[0], f.hands.R[1], -45, 140, 2.4);
    return E.wrap(id, b, { caption: 'Invisibilitas Maior' });
  },
  'sp-wof': (id) => {
    E.seed(232);
    let b = E.ground(650, { grass: false });
    b += `<rect x="265" y="140" width="30" height="510" fill="url(#glow-${id})" stroke="${INK}" stroke-width="3"/>`;
    b += floorShadow(160, 650, 50) + floorShadow(400, 650, 56);
    b += figure(160, 650, { s: 1.22, facing: 1, body: 'robe', cloak: true, armL: arm(-120, -10), armR: arm(-120, -10), id }).svg;
    b += figure(400, 650, { s: 1.3, facing: -1, pose: 'lunge', body: 'plate', head: 'helm', id }).svg;
    return E.wrap(id, b, { caption: 'Murus Vis' });
  },
  'sp-forcecage': (id) => {
    E.seed(233);
    let b = E.ground(650, { grass: false });
    b += `<rect x="140" y="250" width="280" height="400" fill="none" stroke="${INK}" stroke-width="4"/>`;
    for (let x = 180; x < 420; x += 40) b += E.stroke(`M${x} 250 V650`, 2.4);
    for (let y = 330; y < 650; y += 80) b += E.stroke(`M140 ${y} H420`, 2.0);
    b += floorShadow(280, 650, 58);
    b += figure(280, 650, { s: 1.25, facing: 1, body: 'robe', horns: true, cloak: true, id }).svg;
    return E.wrap(id, b, { caption: 'Cavea Arcana' });
  },
  'sp-wish': (id) => {
    E.seed(234);
    let b = E.stars(60, 40, 420) + `<circle cx="280" cy="240" r="210" fill="url(#glow-${id})" opacity=".95"/>` + E.ground(660, { grass: false });
    b += E.runeRing(280, 240, 145, 18, id) + E.runeRing(280, 240, 90, 12, id);
    b += E.sparkle(280, 240, 36);
    b += floorShadow(280, 660, 58);
    b += figure(280, 660, { s: 1.3, facing: 1, body: 'robe', head: 'crown', cloak: true, armL: arm(-155, -10), armR: arm(-155, -10), id }).svg;
    return E.wrap(id, b, { caption: 'Optatum' });
  },
  'sp-truepolymorph': (id) => {
    E.seed(235);
    let b = E.stars(40, 50, 320) + E.ground(650, { grass: false });
    b += E.runeRing(280, 340, 165, 16, id);
    b += E.mass(`M120 420 C 160 220, 280 160, 440 240 C 380 310, 350 380, 410 650 L 170 650 Z`, id);
    b += E.eye(330, 240, 12, 'slit') + E.flames(430, 290, 80, 60);
    return E.wrap(id, b, { caption: 'Forma Vera' });
  },
  'sp-meteor': (id) => {
    E.seed(236);
    let b = E.mountains(480) + E.castle(180, 520, 200, 120) + E.ground(650, { grass: false });
    for (const [mx, my] of [[140, 210], [270, 160], [410, 230], [330, 310]]) {
      b += E.stroke(`M${mx - 90} ${my - 120} L${mx} ${my}`, 8, RUST);
      b += `<circle cx="${mx}" cy="${my}" r="42" fill="url(#glow-${id})"/>`;
      b += `<circle cx="${mx}" cy="${my}" r="18" fill="${INK}"/>` + E.flames(mx, my, 44, 52);
    }
    return E.wrap(id, b, { caption: 'Imber Meteorum' });
  }
};
