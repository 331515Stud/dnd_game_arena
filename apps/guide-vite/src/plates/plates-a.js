// Plates for classes, peoples, backgrounds.
import * as E from './engine.js';
import { figure } from './figure.js';
const { INK, PALE, RUST, W, H } = E;

const arm = (upper, fore) => ({ upper, fore });
const floorShadow = (x, y, w) => `<ellipse cx="${x}" cy="${y + 3}" rx="${w}" ry="${w * 0.16}" fill="${INK}" opacity=".22"/>`;

export const PLATES_A = {
  // ───────────────────────────── CLASSES ─────────────────────────────
  'cls-toc': (id) => {
    E.seed(11);
    let b = E.stars(40, 60, 300) + E.mountains(430) + E.ground(610);
    b += E.castle(200, 460, 170, 120);
    b += E.stroke(`M280 610 C 300 560, 240 520, 280 470`, 3);
    const kinds = [
      { body: 'plate', head: 'helm' },
      { body: 'robe', head: 'wizardhat', beard: true },
      { body: 'leather', head: 'hood', cloak: true },
      { body: 'fur', hair: 0.9, bulk: 1.25 },
      { body: 'tunic', hair: 0.5 }
    ];
    kinds.forEach((k, i) => {
      b += floorShadow(130 + i * 70, 616, 22);
      b += figure(130 + i * 70, 616, { s: 0.55, pose: 'stride', facing: 1, id, ...k }).svg;
    });
    return E.wrap(id, b, { caption: 'Codex Ordinum' });
  },
  'cls-barbarian': (id) => {
    E.seed(21);
    let b = E.mountains(380) + E.ground(640) + E.stones(640, 7);
    b += floorShadow(270, 640, 70);
    const f = figure(270, 640, { s: 1.35, facing: 1, pose: 'lunge', body: 'fur', hair: 1, beard: true, bulk: 1.3, armL: arm(-150, -20), armR: arm(-30, -70), id });
    b += f.svg;
    b += E.axe(f.hands.L[0], f.hands.L[1], -112, 170);
    // war paint & scars
    b += E.stroke(`M${f.head[0] - 10} ${f.head[1] - 2} l6 -6 M${f.head[0] + 6} ${f.head[1] + 4} l6 6`, 1.6, RUST);
    // speed lines
    for (let i = 0; i < 12; i++) b += E.stroke(`M${E.rr(60, 200)} ${E.rr(380, 560)} h${E.rr(14, 34)}`, 1.2, INK, 'opacity=".4"');
    return E.wrap(id, b, { caption: 'Barbarus' });
  },
  'cls-bard': (id) => {
    E.seed(22);
    let b = '';
    // tavern: beams, barrels, candle
    b += E.stroke(`M40 110 H520 M40 150 H520`, 7, INK, 'opacity=".45"');
    b += E.fill(`M60 650 v-90 q40 -14 80 0 v90 Z`, INK) + E.stroke(`M70 590 h60 M70 620 h60`, 2, PALE, 'opacity=".35"');
    b += `<circle cx="460" cy="440" r="70" fill="url(#glow-${id})" opacity=".8"/>` + E.fill(`M452 500 h16 v-50 h-16 Z`, PALE, `stroke="${INK}" stroke-width="2"`) + E.flames(460, 448, 14, 26);
    b += E.ground(650, { grass: false });
    b += floorShadow(270, 650, 60);
    const f = figure(270, 650, { s: 1.25, facing: -1, pose: 'stride', body: 'leather', hair: 0.7, armL: arm(-70, -60), armR: arm(-40, -95), id });
    b += f.svg;
    // lute between hands
    const lx = f.hands.R[0] - 8, ly = f.hands.R[1] + 14;
    b += `<ellipse cx="${lx}" cy="${ly}" rx="30" ry="40" fill="${PALE}" stroke="${INK}" stroke-width="2.6"/>`;
    b += E.hatched(`M${lx - 30} ${ly} a30 40 0 0 0 30 40 v-40 Z`, id, 'hatch', 'opacity=".5"');
    b += `<circle cx="${lx}" cy="${ly - 4}" r="8" fill="${INK}"/>`;
    b += E.stroke(`M${lx + 14} ${ly - 36} L${f.hands.L[0] + 14} ${f.hands.L[1] - 50}`, 7) + E.stroke(`M${lx - 6} ${ly - 24} L${f.hands.L[0] + 8} ${f.hands.L[1] - 54} M${lx + 2} ${ly - 30} L${f.hands.L[0] + 12} ${f.hands.L[1] - 56}`, 0.8, INK, 'opacity=".7"');
    // feathered hat
    b += E.fill(`M${f.head[0] - 24} ${f.head[1] - 14} q24 -22 48 0 l-6 6 q-18 -10 -36 0 Z`, INK);
    b += E.stroke(`M${f.head[0] + 16} ${f.head[1] - 20} q30 -34 50 -20`, 3) + E.stroke(`M${f.head[0] + 22} ${f.head[1] - 26} q10 -10 22 -6 M${f.head[0] + 30} ${f.head[1] - 32} q10 -8 20 -6`, 1.2);
    // notes
    for (let i = 0; i < 6; i++) {
      const nx = 320 + i * 30 + E.rr(-6, 6);
      const ny = 330 - i * 28 + E.rr(-8, 8);
      b += `<ellipse cx="${nx}" cy="${ny}" rx="7" ry="5" fill="${INK}" transform="rotate(-20 ${nx} ${ny})"/>` + E.stroke(`M${nx + 6} ${ny - 2} V${ny - 30}`, 2);
    }
    return E.wrap(id, b, { caption: 'Bardus' });
  },
  'cls-cleric': (id) => {
    E.seed(23);
    let b = `<circle cx="280" cy="280" r="200" fill="url(#glow-${id})" opacity=".85"/>`;
    // chapel arch
    b += E.stroke(`M150 650 V300 A130 130 0 0 1 410 300 V650`, 6);
    b += E.hatched(`M160 650 V300 A120 120 0 0 1 400 300 V650 Z`, id, 'hatch2', 'opacity=".25"');
    b += E.ground(650, { grass: false });
    b += floorShadow(280, 650, 60);
    const f = figure(280, 650, { s: 1.3, facing: 1, body: 'plate', cloak: true, hair: 0.2, armL: arm(-165, -10), armR: arm(10, 30), id });
    b += f.svg;
    // raised holy symbol
    const [sx, sy] = f.hands.L;
    b += E.stroke(`M${sx} ${sy} v-26`, 4);
    b += E.fill(`M${sx - 18} ${sy - 56} h36 v12 h-12 v34 h-12 v-34 h-12 Z`, PALE, `stroke="${INK}" stroke-width="2.6"`);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      b += E.stroke(`M${sx + Math.cos(a) * 44} ${sy - 36 + Math.sin(a) * 44} L${sx + Math.cos(a) * 80} ${sy - 36 + Math.sin(a) * 80}`, 1.4, INK, 'opacity=".7"');
    }
    b += E.shield(f.hands.R[0] + 14, f.hands.R[1] - 16, 38, 'sun');
    // mace at belt
    b += E.stroke(`M${f.hip[0] + 24} ${f.hip[1]} l14 40`, 4) + `<circle cx="${f.hip[0] + 40}" cy="${f.hip[1] + 46}" r="9" fill="${INK}"/>`;
    return E.wrap(id, b, { caption: 'Clericus' });
  },
  'cls-druid': (id) => {
    E.seed(24);
    let b = E.moon(440, 120, 44, id) + E.stars(22, 50, 260);
    b += E.ground(650);
    // great oak
    b += E.fill(`M110 650 l18 -130 l-8 -70 l16 0 l12 70 l24 130 Z`, INK);
    b += E.fill(`M50 470 C 30 390, 110 330, 165 372 C 190 310, 285 340, 262 412 C 305 430, 285 498, 232 496 C 222 540, 114 540, 104 500 C 60 520, 32 496, 50 470 Z`, INK);
    b += E.hatched(`M50 470 C 30 390, 110 330, 165 372 C 150 420, 120 470, 104 500 C 60 520, 32 496, 50 470 Z`, id, 'hatch2', 'opacity=".3"');
    b += floorShadow(360, 650, 50);
    const f = figure(360, 650, { s: 1.2, facing: -1, body: 'robe', head: 'hood', beard: true, armL: arm(-60, -20), armR: arm(-120, -10), id });
    b += f.svg;
    b += E.staff(f.hands.R[0], f.hands.R[1], -94, 180, false, id);
    // antler crown on staff top
    b += E.stroke(`M${f.hands.R[0] - 12} ${f.hands.R[1] - 180} c-12 -14 -14 -30 -6 -44 M${f.hands.R[0] - 12} ${f.hands.R[1] - 180} c12 -14 14 -30 6 -44 M${f.hands.R[0] - 16} ${f.hands.R[1] - 200} l-10 -8 M${f.hands.R[0] - 8} ${f.hands.R[1] - 200} l10 -8`, 2.4);
    // wolf
    b += E.fill(`M430 650 l6 -36 l34 -14 l34 10 l18 -18 l6 22 l-10 12 l-4 24 l-10 0 l-6 -14 l-30 4 l-4 14 Z`, INK);
    b += `<circle cx="505" cy="606" r="1.8" fill="${PALE}"/>` + E.stroke(`M476 640 v10 M490 640 v10 M444 640 v10`, 4);
    for (let i = 0; i < 12; i++) b += E.fill(`M${E.rr(60, 500)} ${E.rr(530, 645)} q6 -10 12 0 q-6 10 -12 0 Z`, INK, 'opacity=".6"');
    return E.wrap(id, b, { caption: 'Druida' });
  },
  'cls-fighter': (id) => {
    E.seed(25);
    let b = E.castle(60, 440, 430, 150) + E.ground(650, { grass: false }) + E.stones(650, 4);
    b += floorShadow(270, 650, 62);
    const f = figure(270, 650, { s: 1.32, facing: 1, pose: 'stride', body: 'plate', head: 'helm', armL: arm(-40, -30), armR: arm(-140, -20), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -72, 160, 2.6);
    b += E.shield(f.hands.L[0] - 8, f.hands.L[1] - 10, 44, 'cross');
    b += E.stroke(`M450 650 V300`, 4) + E.fill(`M450 300 h74 l-20 30 l20 30 h-74 Z`, INK) + E.stroke(`M460 316 h40 M460 334 h30`, 1.4, PALE, 'opacity=".4"');
    return E.wrap(id, b, { caption: 'Bellator' });
  },
  'cls-monk': (id) => {
    E.seed(26);
    let b = E.moon(130, 150, 52, id) + E.mountains(400);
    b += E.ground(660, { grass: false });
    b += E.fill(`M60 250 C 160 196, 400 196, 500 250 L 480 262 C 400 230, 160 230, 80 262 Z`, INK);
    b += E.stroke(`M110 262 V660 M450 262 V660`, 9) + E.stroke(`M110 400 H450`, 2, INK, 'opacity=".4"');
    b += floorShadow(300, 660, 50);
    // leaping monk: use float pose by lifting the figure
    const f = figure(290, 600, { s: 1.2, facing: 1, pose: 'lunge', body: 'robe', head: 'bald', hair: 0, armL: arm(-150, -40), armR: arm(-10, -110), id });
    b += f.svg;
    // extra kick line & motion arcs
    for (let i = 0; i < 6; i++) b += E.stroke(`M${330 + i * 14} ${520 - i * 6} q14 -8 26 2`, 1.2, INK, 'opacity=".45"');
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} l20 -6`, 5);
    // prayer beads
    for (let i = 0; i < 9; i++) b += `<circle cx="${f.hands.L[0] - 10 + Math.cos(i * 0.7) * 16}" cy="${f.hands.L[1] + 10 + Math.sin(i * 0.7) * 16}" r="3" fill="${INK}"/>`;
    return E.wrap(id, b, { caption: 'Monachus' });
  },
  'cls-paladin': (id) => {
    E.seed(27);
    let b = `<circle cx="280" cy="250" r="210" fill="url(#glow-${id})" opacity=".8"/>`;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      b += E.stroke(`M${280 + Math.cos(a) * 110} ${300 + Math.sin(a) * 110} L${280 + Math.cos(a) * 230} ${300 + Math.sin(a) * 230}`, 1.1, INK, 'opacity=".35"');
    }
    b += E.ground(650, { grass: false });
    b += floorShadow(280, 650, 64);
    const f = figure(280, 650, { s: 1.35, facing: 1, body: 'plate', head: 'helm', cloak: true, armL: arm(-25, -20), armR: arm(-178, 0), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -90, 180, 2.8);
    b += E.shield(f.hands.L[0] - 12, f.hands.L[1] - 4, 44, 'sun');
    return E.wrap(id, b, { caption: 'Paladinus' });
  },
  'cls-ranger': (id) => {
    E.seed(28);
    let b = E.mountains(400) + E.pines(640, 8, 50, 510, 1.1);
    b += E.ground(650);
    b += floorShadow(250, 650, 56);
    const f = figure(250, 650, { s: 1.25, facing: -1, pose: 'stride', body: 'leather', head: 'hood', cloak: true, armL: arm(-110, 0), armR: arm(-95, -70), id });
    b += f.svg;
    b += E.bow(f.hands.L[0], f.hands.L[1], -100, 160);
    // quiver
    b += E.fill(`M${f.shoulder[0] + 26} ${f.shoulder[1] - 10} l10 60 h-16 Z`, INK) + E.stroke(`M${f.shoulder[0] + 24} ${f.shoulder[1] - 12} l-6 -26 M${f.shoulder[0] + 32} ${f.shoulder[1] - 12} l-2 -28`, 2);
    // hawk
    b += E.fill(`M400 250 c22 -22 54 -14 64 8 c-16 2 -28 10 -32 26 c-6 -14 -18 -24 -32 -34 Z`, INK);
    for (let i = 0; i < 6; i++) b += E.fill(`M${330 + i * 26} ${668 + (i % 2) * 8} q5 -6 10 0 q-5 6 -10 0 Z`, INK, 'opacity=".7"');
    return E.wrap(id, b, { caption: 'Venator' });
  },
  'cls-rogue': (id) => {
    E.seed(29);
    let b = E.moon(430, 120, 36, id) + E.stars(26, 50, 300);
    b += E.fill(`M40 530 L120 430 L200 530 Z M180 550 L270 450 L360 550 Z M340 530 L430 410 L520 530 Z`, INK);
    b += E.fill(`M40 530 H520 V760 H40 Z`, INK);
    b += E.stroke(`M120 430 V380 M430 410 V350`, 8);
    // windows lit
    b += E.fill(`M90 580 h22 v28 h-22 Z M300 600 h22 v28 h-22 Z`, PALE, 'opacity=".55"');
    const f = figure(285, 470, { s: 1.1, facing: 1, pose: 'kneel', body: 'leather', head: 'hood', cloak: true, armL: arm(-60, -40), armR: arm(-150, -30), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -58, 70, 1.8);
    b += E.stroke(`M${f.hands.L[0]} ${f.hands.L[1]} l-22 -14`, 3) + E.stroke(`M${f.hands.L[0] - 22} ${f.hands.L[1] - 14} l-10 -2 l2 -6`, 1.6);
    return E.wrap(id, b, { caption: 'Furax' });
  },
  'cls-sorcerer': (id) => {
    E.seed(30);
    let b = E.fill(`M60 420 C 120 300, 240 280, 290 360 C 360 280, 480 300, 500 420 C 400 400, 330 420, 290 470 C 240 420, 160 400, 60 420 Z`, INK, 'opacity=".2"');
    b += E.ground(650, { grass: false });
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.28, facing: 1, body: 'robe', hair: 0.9, armL: arm(-120, -20), armR: arm(-120, -20), id });
    b += f.svg;
    for (const h of [f.hands.L, f.hands.R]) {
      b += `<circle cx="${h[0]}" cy="${h[1]}" r="52" fill="url(#glow-${id})"/>`;
      for (let i = 0; i < 7; i++) b += E.lightning(h[0], h[1], E.rr(60, 140), 2);
    }
    // scales on cheek
    b += E.hatched(`M${f.head[0] + 6} ${f.head[1] - 2} q12 4 12 16 q-8 4 -14 -4 Z`, id, 'cross', 'opacity=".7"');
    return E.wrap(id, b, { caption: 'Veneficus' });
  },
  'cls-warlock': (id) => {
    E.seed(31);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".6"/>`;
    b += E.ground(650, { grass: false });
    b += E.eye(280, 180, 74, 'slit');
    for (let i = 0; i < 11; i++) {
      const a = Math.PI + (i / 10) * Math.PI;
      b += E.stroke(`M${280 + Math.cos(a) * 92} ${180 + Math.sin(a) * 62} C ${280 + Math.cos(a) * 160} ${180 + Math.sin(a) * 120}, ${280 + Math.cos(a) * 200} ${260}, ${280 + Math.cos(a) * 270} ${310}`, 3.2, INK, 'opacity=".85"');
    }
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.25, facing: -1, body: 'robe', head: 'hood', cloak: true, armL: arm(-160, -10), armR: arm(-10, -20), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.L[0]} ${f.hands.L[1]} L${f.hands.L[0] - 50} ${f.hands.L[1] - 220}`, 12, INK, 'opacity=".9"');
    b += E.stroke(`M${f.hands.L[0]} ${f.hands.L[1]} L${f.hands.L[0] - 50} ${f.hands.L[1] - 220}`, 4, PALE);
    b += E.book(f.hands.R[0] + 4, f.hands.R[1] + 8, 44, 34, false);
    return E.wrap(id, b, { caption: 'Pactus' });
  },
  'cls-wizard': (id) => {
    E.seed(32);
    let b = E.fill(`M150 110 h260 v320 h-260 Z`, INK, 'opacity=".92"') + E.stroke(`M280 110 V430 M150 270 H410`, 4, PALE, 'opacity=".35"');
    b += E.stars(26, 120, 420) + E.moon(340, 200, 32, id);
    b += E.ground(660, { grass: false });
    b += floorShadow(280, 660, 58);
    const f = figure(280, 660, { s: 1.3, facing: 1, body: 'robe', head: 'wizardhat', beard: true, armL: arm(-40, -70), armR: arm(-150, -30), id });
    b += f.svg;
    b += E.staff(f.hands.R[0], f.hands.R[1], -92, 210, true, id);
    b += E.book(f.hands.L[0] + 10, f.hands.L[1] + 6, 62, 46, true);
    // star embroidery on robe
    for (let i = 0; i < 6; i++) b += E.sparkle(f.hip[0] + E.rr(-40, 40), f.hip[1] + E.rr(10, 80), 4, PALE);
    return E.wrap(id, b, { caption: 'Magus' });
  },
  'cls-artificer': (id) => {
    E.seed(33);
    let b = E.ground(660, { grass: false });
    const gear = (x, y, r, teeth) => {
      let g = '';
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        g += E.fill(`M${x + Math.cos(a) * r} ${y + Math.sin(a) * r} l${Math.cos(a) * 12} ${Math.sin(a) * 12} l${Math.cos(a + 0.25) * 2} ${Math.sin(a + 0.25) * 2} Z`, INK);
      }
      return g + `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="${x}" cy="${y}" r="${r * 0.3}" fill="none" stroke="${INK}" stroke-width="5"/>`;
    };
    b += gear(120, 180, 50, 12) + gear(200, 240, 32, 9) + gear(440, 160, 42, 11) + gear(470, 250, 22, 7);
    b += floorShadow(270, 660, 54);
    const f = figure(270, 660, { s: 1.22, facing: 1, body: 'leather', hair: 0.4, armL: arm(-80, -40), armR: arm(-70, -60), id });
    b += f.svg;
    b += `<circle cx="${f.head[0] - 7}" cy="${f.head[1] - 14}" r="7" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="${f.head[0] + 9}" cy="${f.head[1] - 14}" r="7" fill="none" stroke="${INK}" stroke-width="3"/>`;
    // steel defender
    b += E.fill(`M380 660 v-44 l22 -22 h64 l22 22 v44 h-14 v-26 h-80 v26 Z`, INK) + E.stroke(`M488 596 l28 -20`, 5) + E.fill(`M478 604 h32 v14 h-32 Z`, INK) + `<circle cx="500" cy="611" r="2" fill="${PALE}"/>`;
    b += E.stroke(`M402 616 h58`, 1.4, PALE, 'opacity=".4"');
    b += E.sparkle(f.hands.R[0] + 12, f.hands.R[1] - 12, 12) + E.sparkle(f.hands.R[0] + 30, f.hands.R[1] - 4, 6);
    return E.wrap(id, b, { caption: 'Artifex' });
  },

  // ───────────────────────────── PEOPLES ─────────────────────────────
  'race-toc': (id) => {
    E.seed(40);
    let b = E.ground(650);
    const row = [
      { x: 95, o: { s: 1.0, hair: 0.4, body: 'tunic' } },
      { x: 185, o: { s: 1.06, ears: 'pointed', hair: 0.9, body: 'leather' } },
      { x: 270, o: { s: 0.86, beard: true, head: 'helm', body: 'plate', bulk: 1.3 } },
      { x: 350, o: { s: 0.66, hair: 0.5, body: 'tunic' } },
      { x: 450, o: { s: 1.05, horns: true, cloak: true, body: 'robe' } }
    ];
    for (const r of row) b += floorShadow(r.x, 650, 30) + figure(r.x, 650, { id, ...r.o }).svg;
    return E.wrap(id, b, { caption: 'Liber Sanguinis' });
  },
  'race-human': (id) => {
    E.seed(41);
    let b = E.castle(80, 470, 400, 150) + E.ground(650);
    b += floorShadow(280, 650, 58);
    const f = figure(280, 650, { s: 1.3, facing: 1, pose: 'stride', body: 'tunic', hair: 0.4, cloak: true, armL: arm(-30, -20), armR: arm(-60, -80), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} L${f.hands.R[0] + 50} ${f.hands.R[1] - 70}`, 5) + E.fill(`M${f.hands.R[0] + 50} ${f.hands.R[1] - 70} v44 l44 -22 Z`, INK);
    return E.wrap(id, b, { caption: 'Homo' });
  },
  'race-elf': (id) => {
    E.seed(42);
    let b = E.moon(120, 130, 46, id) + E.stars(30, 50, 320) + E.pines(650, 6, 60, 510, 1.2) + E.ground(650);
    b += floorShadow(300, 650, 54);
    const f = figure(300, 650, { s: 1.32, facing: -1, body: 'leather', ears: 'pointed', hair: 1, cloak: true, bulk: 0.9, armL: arm(-100, 0), armR: arm(-30, -60), id });
    b += f.svg;
    b += E.bow(f.hands.L[0], f.hands.L[1], -98, 170);
    // circlet
    b += E.stroke(`M${f.head[0] - 16} ${f.head[1] - 8} q16 -8 32 0`, 2, PALE) + `<circle cx="${f.head[0]}" cy="${f.head[1] - 12}" r="2.5" fill="${PALE}"/>`;
    return E.wrap(id, b, { caption: 'Alfar' });
  },
  'race-dwarf': (id) => {
    E.seed(43);
    let b = E.fill(`M34 34 H526 V420 C 400 360, 160 360, 34 420 Z`, INK, 'opacity=".92"');
    b += E.stroke(`M80 380 l60 -50 M470 380 l-60 -50 M200 330 l50 -40 l50 40`, 2, PALE, 'opacity=".4"');
    for (let i = 0; i < 20; i++) b += `<circle cx="${E.rr(60, 500)}" cy="${E.rr(80, 340)}" r="${E.rr(0.8, 2)}" fill="${PALE}" opacity=".4"/>`;
    b += E.ground(660, { grass: false });
    b += floorShadow(280, 660, 60);
    const f = figure(280, 660, { s: 1.05, facing: 1, body: 'plate', head: 'helm', beard: true, bulk: 1.45, armL: arm(-60, -30), armR: arm(-130, -20), id });
    b += f.svg;
    b += E.axe(f.hands.R[0], f.hands.R[1], -100, 140);
    b += E.fill(`M60 660 h130 v-20 h-30 v-18 h50 v-16 h-120 v16 h30 v18 h-60 Z`, INK) + E.flames(110, 598, 50, 40);
    b += E.hatched(`M${f.hip[0] - 20} ${f.hip[1] + 10} h40 v40 h-40 Z`, id, 'cross', 'opacity=".5"');
    return E.wrap(id, b, { caption: 'Dvergr' });
  },
  'race-halfling': (id) => {
    E.seed(44);
    let b = E.ground(650);
    b += E.fill(`M40 650 C 120 420, 440 420, 520 650 Z`, INK, 'opacity=".12"') + E.stroke(`M40 650 C 120 420, 440 420, 520 650`, 2.2);
    b += `<circle cx="300" cy="560" r="72" fill="${PALE}" stroke="${INK}" stroke-width="5"/><circle cx="332" cy="560" r="6" fill="${INK}"/>`;
    b += E.stroke(`M300 488 V632 M228 560 H372 M250 508 L350 612 M350 508 L250 612`, 1.2, INK, 'opacity=".45"');
    b += floorShadow(150, 650, 34);
    const f = figure(150, 650, { s: 0.85, facing: 1, body: 'tunic', hair: 0.6, armL: arm(-80, -60), armR: arm(-20, -100), id });
    b += f.svg;
    b += `<ellipse cx="${f.hands.L[0] + 6}" cy="${f.hands.L[1] + 2}" rx="18" ry="7" fill="${PALE}" stroke="${INK}" stroke-width="2"/>` + E.stroke(`M${f.hands.L[0] - 8} ${f.hands.L[1]} q14 -8 28 0`, 1.2);
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} l14 -6 l6 4`, 3) + E.smoke(f.hands.R[0] + 20, f.hands.R[1] - 10, 4);
    // bare hairy feet hint
    b += E.stroke(`M${f.hands.R[0] - 60} 650 l-4 -4 M${f.hands.R[0] - 40} 650 l4 -4`, 1.4);
    return E.wrap(id, b, { caption: 'Halfling' });
  },
  'race-dragonborn': (id) => {
    E.seed(45);
    let b = E.ground(650, { grass: false }) + E.stones(650, 5);
    b += floorShadow(260, 650, 64);
    const f = figure(260, 650, { s: 1.38, facing: 1, pose: 'stride', body: 'plate', head: 'bald', hair: 0, bulk: 1.2, armL: arm(-140, -30), armR: arm(-40, -40), id });
    b += f.svg;
    // snout overlay & spines
    const [hx, hy] = f.head;
    b += E.fill(`M${hx + 8} ${hy - 4} l44 12 l-8 18 l-36 -6 Z`, PALE, `stroke="${INK}" stroke-width="2.2"`);
    b += E.hatched(`M${hx + 8} ${hy - 4} l44 12 l-8 18 l-36 -6 Z`, id, 'cross', 'opacity=".45"');
    b += E.fangs(hx + 36, hy + 22, 4, 26, 7, false);
    for (let i = 0; i < 6; i++) b += E.fill(`M${hx - 4 - i * 6} ${hy - 18 - i * 3} l-12 -16 l18 6 Z`, INK);
    b += E.flames(380, 470, 140, 70) + E.flames(430, 450, 90, 44);
    // tail
    b += E.stroke(`M${f.hip[0] - 20} ${f.hip[1] + 20} C ${f.hip[0] - 90} ${f.hip[1] + 60}, ${f.hip[0] - 130} ${f.hip[1] + 10}, ${f.hip[0] - 110} ${f.hip[1] - 20}`, 9);
    return E.wrap(id, b, { caption: 'Draconis Filius' });
  },
  'race-gnome': (id) => {
    E.seed(46);
    let b = E.ground(660, { grass: false });
    b += E.fill(`M60 560 h440 v14 h-440 Z`, INK) + E.stroke(`M80 574 V660 M480 574 V660`, 6);
    b += floorShadow(300, 560, 30);
    const f = figure(300, 560, { s: 0.82, facing: 1, body: 'leather', beard: true, hair: 0.3, armL: arm(-90, -50), armR: arm(-80, -70), id });
    b += f.svg;
    b += E.fill(`M${f.head[0] - 20} ${f.head[1] - 12} L${f.head[0] + 2} ${f.head[1] - 78} L${f.head[0] + 22} ${f.head[1] - 12} Z`, INK);
    b += E.fill(`M150 530 c10 -20 40 -20 50 0 c-10 6 -16 6 -26 4 c-8 10 -20 10 -24 -4 Z`, INK) + E.stroke(`M170 512 l8 -10`, 2);
    for (let i = 0; i < 4; i++) b += `<circle cx="${380 + i * 26}" cy="${540}" r="${6 + i}" fill="none" stroke="${INK}" stroke-width="2.4"/>`;
    b += E.sparkle(f.hands.R[0] + 10, f.hands.R[1] - 10, 9);
    // magnifying glass
    b += `<circle cx="${f.hands.L[0] - 10}" cy="${f.hands.L[1] - 6}" r="12" fill="none" stroke="${INK}" stroke-width="3"/>` + E.stroke(`M${f.hands.L[0] - 2} ${f.hands.L[1] + 2} l10 10`, 4);
    return E.wrap(id, b, { caption: 'Gnomus' });
  },
  'race-halfelf': (id) => {
    E.seed(47);
    let b = E.ground(650);
    b += E.pines(650, 3, 60, 180, 1.2) + E.castle(330, 560, 170, 110);
    b += E.stroke(`M280 80 V650`, 1.2, INK, 'opacity=".35" stroke-dasharray="6 8"');
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.3, facing: 1, body: 'leather', ears: 'pointed', hair: 0.75, cloak: true, armL: arm(-40, -40), armR: arm(-40, -40), id }).svg;
    return E.wrap(id, b, { caption: 'Semi-Alfar' });
  },
  'race-halforc': (id) => {
    E.seed(48);
    let b = E.ground(650, { grass: false }) + E.stones(650, 8);
    b += floorShadow(270, 650, 66);
    const f = figure(270, 650, { s: 1.4, facing: 1, pose: 'stride', body: 'fur', hair: 0.3, tusks: true, bulk: 1.4, armL: arm(-50, -40), armR: arm(-120, -30), id });
    b += f.svg;
    b += E.stroke(`M${f.head[0] - 14} ${f.head[1] - 10} l16 22`, 2, PALE);
    b += E.axe(f.hands.R[0], f.hands.R[1], -82, 160);
    b += E.stroke(`M${f.shoulder[0] - 22} ${f.shoulder[1] + 40} q22 12 44 0 q-22 24 -44 0`, 2, PALE);
    return E.wrap(id, b, { caption: 'Semi-Orcus' });
  },
  'race-tiefling': (id) => {
    E.seed(49);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".4"/>`;
    b += E.ground(650, { grass: false });
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.32, facing: 1, body: 'robe', horns: true, cloak: true, hair: 0.8, armL: arm(-120, -30), armR: arm(-30, -20), id });
    b += f.svg;
    b += E.stroke(`M${f.hip[0] + 20} ${f.hip[1] + 40} C ${f.hip[0] + 80} ${f.hip[1] + 70}, ${f.hip[0] + 120} ${f.hip[1] + 20}, ${f.hip[0] + 100} ${f.hip[1] - 20}`, 4);
    b += E.fill(`M${f.hip[0] + 100} ${f.hip[1] - 20} l-10 -14 l16 -2 Z`, INK);
    b += `<circle cx="${f.hands.L[0]}" cy="${f.hands.L[1]}" r="42" fill="url(#glow-${id})"/>` + E.flames(f.hands.L[0], f.hands.L[1] + 4, 36, 64);
    return E.wrap(id, b, { caption: 'Tiefling' });
  },

  // ───────────────────────────── BACKGROUNDS ─────────────────────────────
  'bg-soldier': (id) => {
    E.seed(50);
    let b = E.ground(650, { grass: false });
    b += E.fill(`M60 650 L130 560 L200 650 Z M360 650 L430 560 L500 650 Z`, PALE, `stroke="${INK}" stroke-width="2.4"`);
    b += E.hatched(`M60 650 L130 560 L130 650 Z M360 650 L430 560 L430 650 Z`, id, 'hatch', 'opacity=".5"');
    b += E.stroke(`M280 650 V330`, 4) + E.fill(`M280 330 h80 l-20 26 l20 26 h-80 Z`, INK);
    b += floorShadow(280, 650, 50);
    const f = figure(280, 650, { s: 1.18, facing: 1, body: 'plate', head: 'helm', armL: arm(-20, -10), armR: arm(-60, -100), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} V${f.hands.R[1] - 150}`, 4) + E.fill(`M${f.hands.R[0]} ${f.hands.R[1] - 150} l-10 -30 h20 Z`, INK);
    return E.wrap(id, b, { caption: 'Miles' });
  },
  'bg-criminal': (id) => {
    E.seed(51);
    let b = E.fill(`M34 34 H526 V760 H34 Z`, INK, 'opacity=".12"') + E.moon(90, 110, 30, id);
    b += E.fill(`M34 34 H150 V760 H34 Z M420 34 H526 V760 H420 Z`, INK, 'opacity=".88"');
    b += E.stroke(`M60 120 h60 M60 220 h60 M60 320 h60 M440 160 h60 M440 260 h60`, 2, PALE, 'opacity=".3"');
    b += E.ground(660, { grass: false });
    b += floorShadow(280, 660, 50);
    const f = figure(280, 660, { s: 1.2, facing: -1, pose: 'stride', body: 'leather', head: 'hood', cloak: true, bulk: 0.9, armL: arm(-120, -20), armR: arm(-30, -70), id });
    b += f.svg;
    b += `<circle cx="${f.hands.L[0]}" cy="${f.hands.L[1] + 8}" r="14" fill="${PALE}" stroke="${INK}" stroke-width="2"/>` + E.stroke(`M${f.hands.L[0] - 8} ${f.hands.L[1] - 4} h16`, 3);
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} l26 -8 M${f.hands.R[0]} ${f.hands.R[1] + 4} l24 2`, 2);
    return E.wrap(id, b, { caption: 'Furtivus' });
  },
  'bg-sage': (id) => {
    E.seed(52);
    let b = '';
    for (let r = 0; r < 4; r++) {
      const y = 120 + r * 110;
      b += E.stroke(`M60 ${y} H500`, 6);
      let x = 70;
      while (x < 480) {
        const w = E.rr(10, 22);
        const h = E.rr(60, 90);
        b += E.fill(`M${x} ${y} v${-h} h${w} v${h} Z`, INK, `opacity="${E.rr(0.6, 1).toFixed(2)}"`);
        x += w + 3;
      }
    }
    b += E.ground(660, { grass: false });
    b += floorShadow(280, 660, 50);
    const f = figure(280, 660, { s: 1.18, facing: 1, body: 'robe', beard: true, hair: 0.3, armL: arm(-90, -40), armR: arm(-90, -40), id });
    b += f.svg;
    b += E.book(280, f.hands.L[1] + 6, 72, 52, true);
    b += E.fill(`M440 660 h20 v-40 h-20 Z`, PALE, `stroke="${INK}" stroke-width="2"`) + E.flames(450, 618, 14, 26) + `<circle cx="450" cy="600" r="54" fill="url(#glow-${id})" opacity=".7"/>`;
    return E.wrap(id, b, { caption: 'Sapiens' });
  },
  'bg-folk': (id) => {
    E.seed(53);
    let b = E.mountains(380) + E.ground(650);
    for (let i = 0; i < 4; i++) {
      const x = 70 + i * 120;
      b += E.fill(`M${x} 560 h60 v-40 h-60 Z M${x - 6} 520 l36 -30 l36 30 Z`, INK);
    }
    b += floorShadow(280, 650, 52);
    const f = figure(280, 650, { s: 1.22, facing: 1, body: 'tunic', hair: 0.4, armL: arm(-172, -5), armR: arm(-20, -10), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.L[0]} ${f.hands.L[1]} V${f.hands.L[1] - 160}`, 4);
    b += E.stroke(`M${f.hands.L[0] - 16} ${f.hands.L[1] - 160} h32 M${f.hands.L[0] - 16} ${f.hands.L[1] - 160} v-30 M${f.hands.L[0]} ${f.hands.L[1] - 160} v-34 M${f.hands.L[0] + 16} ${f.hands.L[1] - 160} v-30`, 3);
    for (let i = 0; i < 9; i++) b += `<circle cx="${80 + i * 50 + E.rr(-6, 6)}" cy="${640 + E.rr(-4, 4)}" r="9" fill="${PALE}" stroke="${INK}" stroke-width="1.8"/>`;
    return E.wrap(id, b, { caption: 'Heros Plebis' });
  },
  'bg-noble': (id) => {
    E.seed(54);
    let b = E.ground(660, { grass: false });
    b += E.stroke(`M90 100 V660 M470 100 V660`, 14) + E.stroke(`M60 100 H520`, 10);
    b += E.fill(`M220 660 v-200 h120 v200 Z`, INK) + E.fill(`M200 470 h160 v-30 l-20 -20 l-20 20 l-20 -30 l-20 30 l-20 -20 l-20 20 l-20 30 Z`, INK);
    b += floorShadow(280, 650, 50);
    const f = figure(280, 650, { s: 1.22, facing: 1, body: 'dress', head: 'crown', cloak: true, hair: 0.6, armL: arm(-40, -40), armR: arm(-40, -40), id });
    b += f.svg;
    b += `<circle cx="${f.hands.R[0]}" cy="${f.hands.R[1]}" r="6" fill="${PALE}" stroke="${INK}" stroke-width="2"/>`;
    return E.wrap(id, b, { caption: 'Nobilis' });
  },
  'bg-acolyte': (id) => {
    E.seed(55);
    let b = `<circle cx="280" cy="230" r="150" fill="url(#glow-${id})" opacity=".65"/>`;
    b += E.stroke(`M180 420 V250 A100 100 0 0 1 380 250 V420`, 5);
    b += E.stroke(`M280 150 V420 M200 300 H360 M220 240 H340`, 1.6, INK, 'opacity=".6"');
    b += E.ground(660, { grass: false });
    b += floorShadow(280, 660, 46);
    b += figure(280, 660, { s: 1.15, facing: 1, pose: 'kneel', body: 'robe', hair: 0.2, armL: arm(-100, -60), armR: arm(-100, -60), id }).svg;
    for (const x of [120, 160, 400, 440]) b += E.fill(`M${x - 6} 660 h12 v-30 h-12 Z`, PALE, `stroke="${INK}" stroke-width="1.6"`) + E.flames(x, 628, 10, 18);
    return E.wrap(id, b, { caption: 'Acolytus' });
  },
  'bg-artisan': (id) => {
    E.seed(56);
    let b = E.ground(660, { grass: false });
    b += E.fill(`M360 660 v-120 h120 v120 Z`, INK) + E.fill(`M380 600 h80 v40 h-80 Z`, RUST) + E.flames(420, 638, 70, 50, PALE) + E.smoke(420, 530, 5);
    b += E.fill(`M90 660 h120 v-16 h-26 v-16 h46 v-14 h-110 v14 h26 v16 h-56 Z`, INK);
    b += floorShadow(250, 660, 50);
    const f = figure(250, 660, { s: 1.18, facing: 1, body: 'leather', hair: 0.3, beard: true, bulk: 1.15, armL: arm(-60, -30), armR: arm(-160, -20), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} l10 -70`, 5) + E.fill(`M${f.hands.R[0] - 14} ${f.hands.R[1] - 86} h48 v22 h-48 Z`, INK);
    b += E.sparkle(150, 610, 7) + E.sparkle(170, 596, 5) + E.sparkle(135, 590, 5);
    return E.wrap(id, b, { caption: 'Artifex Gildae' });
  }
};
