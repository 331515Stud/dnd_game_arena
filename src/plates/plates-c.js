// Plates for the Bestiary.
import * as E from './engine.js';
import { figure } from './figure.js';
const { INK, PALE, RUST, W, H } = E;

const arm = (upper, fore) => ({ upper, fore });
const floorShadow = (x, y, w) => `<ellipse cx="${x}" cy="${y + 3}" rx="${w}" ry="${w * 0.16}" fill="${INK}" opacity=".22"/>`;

export const PLATES_C = {
  'bst-toc': (id) => {
    E.seed(301);
    let b = E.stars(30, 50, 280) + E.mountains(420) + E.ground(650);
    b += E.mass(`M130 650 L160 390 L90 250 L220 310 L280 210 L340 310 L470 250 L400 390 L430 650 Z`, id);
    b += E.eye(250, 290, 12, 'slit') + E.eye(310, 290, 12, 'slit');
    b += E.fangs(280, 355, 8, 64, 14, false);
    return E.wrap(id, b, { caption: 'Bestiarium' });
  },
  'bst-kobold': (id) => {
    E.seed(302);
    let b = E.ground(650, { grass: false }) + E.stones(650, 8);
    b += floorShadow(280, 650, 42);
    const f = figure(280, 650, { s: 0.85, facing: 1, pose: 'lunge', body: 'leather', horns: true, armL: arm(-110, -20), armR: arm(-40, -40), id });
    b += f.svg;
    b += E.stroke(`M${f.hands.L[0]} ${f.hands.L[1]} l90 -60`, 4) + E.stroke(`M${f.hip[0] - 12} ${f.hip[1] + 10} q-50 25 -75 -5`, 5);
    return E.wrap(id, b, { caption: 'Koboldus' });
  },
  'bst-goblin': (id) => {
    E.seed(303);
    let b = E.pines(650, 6, 50, 510, 1.0) + E.ground(650);
    b += floorShadow(280, 650, 44);
    const f = figure(280, 650, { s: 0.9, facing: -1, pose: 'stride', body: 'leather', ears: 'pointed', armL: arm(-100, -10), armR: arm(-40, -60), id });
    b += f.svg;
    b += E.bow(f.hands.L[0], f.hands.L[1], -95, 130);
    return E.wrap(id, b, { caption: 'Gobelinus' });
  },
  'bst-wolf': (id) => {
    E.seed(304);
    let b = E.moon(420, 130, 44, id) + E.pines(650, 7, 50, 510, 1.15) + E.ground(650);
    b += floorShadow(280, 650, 76);
    b += E.mass(`M140 650 L165 500 L120 460 L190 440 L340 430 L400 350 L450 370 L425 420 L410 510 L430 650 L395 650 L380 540 L210 540 L185 650 Z`, id);
    b += E.eye(415, 375, 7, 'slit') + E.fangs(435, 395, 4, 24, 8, false);
    return E.wrap(id, b, { caption: 'Lupus' });
  },
  'bst-skeleton': (id) => {
    E.seed(305);
    let b = E.moon(130, 130, 38, id) + E.ground(650, { grass: false });
    b += floorShadow(280, 650, 50);
    b += E.skullHead(280, 420, 28);
    b += E.stroke(`M280 455 V560 M240 475 H320 M248 495 H312 M254 515 H306 M280 560 L255 650 M280 560 L305 650 M240 475 L205 535 M320 475 L365 445`, 4.5);
    b += E.sword(365, 445, -60, 130, 2.2) + E.shield(205, 535, 36, 'cross');
    return E.wrap(id, b, { caption: 'Sceletus' });
  },
  'bst-zombie': (id) => {
    E.seed(306);
    let b = E.moon(430, 130, 36, id) + E.ground(650, { grass: false });
    b += E.fill(`M90 650 v-70 a28 28 0 0 1 56 0 v70 Z M410 650 v-65 h50 v65 Z`, INK);
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.26, facing: 1, pose: 'stride', body: 'tunic', head: 'bald', armL: arm(-95, -5), armR: arm(-85, -10), id });
    b += f.svg;
    return E.wrap(id, b, { caption: 'Cadaver Ambulans' });
  },
  'bst-bandit': (id) => {
    E.seed(307);
    let b = E.pines(650, 6, 50, 510, 1.1) + E.ground(650);
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.28, facing: 1, pose: 'stride', body: 'leather', head: 'hood', cloak: true, armL: arm(-40, -30), armR: arm(-125, -15), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -55, 135, 2.4);
    return E.wrap(id, b, { caption: 'Latro' });
  },
  'bst-owlbear': (id) => {
    E.seed(308);
    let b = E.pines(650, 7, 50, 510, 1.15) + E.ground(650);
    b += floorShadow(280, 650, 95);
    b += E.mass(`M145 650 C 120 460, 175 290, 280 270 C 385 290, 440 460, 415 650 Z`, id);
    b += E.eye(250, 330, 16, 'round') + E.eye(310, 330, 16, 'round');
    b += E.fill(`M265 350 L295 350 L280 390 Z`, PALE, `stroke="${INK}" stroke-width="2.4"`);
    b += E.claws(145, 480, -1, 4, 22) + E.claws(415, 480, 1, 4, 22);
    return E.wrap(id, b, { caption: 'Ursus Noctua' });
  },
  'bst-cube': (id) => {
    E.seed(309);
    let b = E.ground(650, { grass: false });
    b += `<polygon points="130,270 370,270 430,210 190,210" fill="${PALE}" fill-opacity=".55" stroke="${INK}" stroke-width="3"/>`;
    b += `<rect x="130" y="270" width="240" height="360" fill="${PALE}" fill-opacity=".45" stroke="${INK}" stroke-width="3"/>`;
    b += `<polygon points="370,270 430,210 430,570 370,630" fill="url(#hatch-${id})" stroke="${INK}" stroke-width="3"/>`;
    b += E.skullHead(250, 410, 26) + E.sword(230, 520, -35, 110, 2.2) + E.shield(300, 490, 32, 'cross');
    return E.wrap(id, b, { caption: 'Cubus Gelatinosus' });
  },
  'bst-troll': (id) => {
    E.seed(310);
    let b = E.mountains(410) + E.ground(650) + E.stones(650, 6);
    b += floorShadow(280, 650, 82);
    const f = figure(280, 650, { s: 1.55, facing: 1, pose: 'lunge', body: 'fur', hair: 0.9, bulk: 1.35, armL: arm(-65, -20), armR: arm(-110, -15), id });
    b += f.svg;
    b += E.claws(f.hands.L[0], f.hands.L[1], 1, 4, 18) + E.claws(f.hands.R[0], f.hands.R[1], 1, 4, 18);
    return E.wrap(id, b, { caption: 'Trollus' });
  },
  'bst-displacer': (id) => {
    E.seed(311);
    let b = E.pines(650, 6, 50, 510, 1.1) + E.ground(650);
    b += floorShadow(280, 650, 80);
    const panther = `M140 650 L165 510 L355 490 L405 420 L445 440 L415 510 L430 650 L395 650 L380 550 L195 550 L175 650 Z`;
    b += `<g opacity=".28" transform="translate(-38 -18)">${E.fill(panther, INK)}</g>`;
    b += E.mass(panther, id);
    b += E.stroke(`M250 495 C 180 370, 140 290, 210 240 M280 495 C 350 370, 390 290, 320 240`, 5);
    return E.wrap(id, b, { caption: 'Bestia Dislocans' });
  },
  'bst-ogre': (id) => {
    E.seed(312);
    let b = E.mountains(400) + E.ground(650) + E.stones(650, 8);
    b += floorShadow(280, 650, 88);
    const f = figure(280, 650, { s: 1.58, facing: 1, body: 'fur', tusks: true, bulk: 1.6, armL: arm(-40, -30), armR: arm(-135, -20), id });
    b += f.svg;
    b += E.fill(`M${f.hands.R[0]} ${f.hands.R[1]} l75 -140 l34 16 l-90 135 Z`, INK);
    return E.wrap(id, b, { caption: 'Orcus Gigas' });
  },
  'bst-mimic': (id) => {
    E.seed(313);
    let b = E.ground(650, { grass: false });
    b += floorShadow(280, 650, 95);
    b += E.fill(`M140 470 L420 470 L420 630 L140 630 Z`, INK);
    b += E.fill(`M140 470 L400 330 L435 410 L140 470 Z`, INK);
    b += E.fangs(280, 470, 9, 220, 22, true) + E.fangs(275, 415, 8, 200, 20, false);
    for (const [ex, ey] of [[210, 390], [270, 370], [330, 355]]) b += E.eye(ex, ey, 11, 'slit');
    b += E.stroke(`M280 490 C 350 470, 440 420, 485 330`, 16, RUST);
    return E.wrap(id, b, { caption: 'Mimicus' });
  },
  'bst-ghoul': (id) => {
    E.seed(314);
    let b = E.moon(130, 120, 36, id) + E.ground(650, { grass: false });
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.25, facing: 1, pose: 'lunge', body: 'tunic', head: 'bald', armL: arm(-115, -20), armR: arm(-100, -10), id });
    b += f.svg;
    b += E.claws(f.hands.L[0], f.hands.L[1], 1, 4, 16) + E.claws(f.hands.R[0], f.hands.R[1], 1, 4, 16);
    return E.wrap(id, b, { caption: 'Ghoul' });
  },
  'bst-wight': (id) => {
    E.seed(315);
    let b = E.moon(420, 130, 42, id) + E.ground(650, { grass: false });
    b += floorShadow(280, 650, 60);
    const f = figure(280, 650, { s: 1.32, facing: 1, body: 'plate', head: 'crown', cloak: true, hair: 0.8, armL: arm(-40, -20), armR: arm(-130, -15), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -65, 160, 2.6);
    return E.wrap(id, b, { caption: 'Tumularius' });
  },
  'bst-elemental': (id) => {
    E.seed(316);
    let b = E.ground(650, { grass: false });
    b += `<circle cx="280" cy="420" r="195" fill="url(#glow-${id})"/>`;
    b += E.flames(280, 650, 240, 390);
    b += E.eye(245, 360, 14, 'slit') + E.eye(315, 360, 14, 'slit');
    return E.wrap(id, b, { caption: 'Elementum Ignis' });
  },
  'bst-rust': (id) => {
    E.seed(317);
    let b = E.ground(650, { grass: false }) + E.stones(650, 6);
    b += floorShadow(280, 650, 82);
    b += E.mass(`M150 650 L170 520 C 200 440, 340 440, 390 510 L410 650 L375 650 L360 560 L200 560 L185 650 Z`, id);
    b += E.stroke(`M390 495 C 450 420, 480 360, 505 330 M390 510 C 460 460, 490 420, 515 395`, 4.5, RUST);
    b += E.sword(440, 635, -15, 95, 2.2);
    return E.wrap(id, b, { caption: 'Monstruum Ferruginis' });
  },
  'bst-mindflayer': (id) => {
    E.seed(318);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".45"/>` + E.ground(650, { grass: false });
    b += E.runeRing(280, 260, 110, 12, id);
    b += floorShadow(280, 650, 58);
    const f = figure(280, 650, { s: 1.34, facing: 1, body: 'robe', head: 'bald', cloak: true, armL: arm(-125, -20), armR: arm(-125, -20), id });
    b += f.svg;
    const [hx, hy] = f.head;
    for (const dx of [-14, -5, 5, 14]) {
      b += E.stroke(`M${hx + dx} ${hy + 10} C ${hx + dx * 2.4} ${hy + 45}, ${hx + dx * 1.5} ${hy + 75}, ${hx + dx * 2.8} ${hy + 95}`, 4.5);
    }
    return E.wrap(id, b, { caption: 'Illithid' });
  },
  'bst-vampire': (id) => {
    E.seed(319);
    let b = E.moon(420, 130, 48, id) + E.castle(70, 450, 220, 160) + E.ground(650, { grass: false });
    b += floorShadow(310, 650, 60);
    const f = figure(310, 650, { s: 1.34, facing: -1, body: 'robe', cloak: true, hair: 0.6, armL: arm(-120, -20), armR: arm(-40, -30), id });
    b += f.svg;
    for (const [bx, by] of [[180, 220], [240, 180], [320, 210]]) {
      b += E.fill(`M${bx} ${by} l-22 -12 l8 18 l14 -2 l14 2 l8 -18 Z`, INK);
    }
    return E.wrap(id, b, { caption: 'Vampirus' });
  },
  'bst-beholder': (id) => {
    E.seed(320);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".4"/>` + E.ground(650, { grass: false });
    const cx = 280, cy = 360, r = 115;
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI * 0.95 + (i / 9) * Math.PI * 0.9;
      const ex = cx + Math.cos(a) * (r + 85);
      const ey = cy + Math.sin(a) * (r + 85);
      b += E.stroke(`M${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r} Q${cx + Math.cos(a + 0.2) * (r + 45)} ${cy + Math.sin(a + 0.2) * (r + 45)} ${ex} ${ey}`, 7);
      b += E.eye(ex, ey, 14, 'round');
    }
    b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/>`;
    b += E.eye(cx, cy - 18, 46, 'slit');
    b += E.fill(`M${cx - 75} ${cy + 42} Q${cx} ${cy + 95} ${cx + 75} ${cy + 42} Z`, PALE, `stroke="${INK}" stroke-width="3"`);
    b += E.fangs(cx, cy + 44, 8, 120, 18, false);
    return E.wrap(id, b, { caption: 'Oculus Tyranni' });
  },
  'bst-red-dragon': (id) => {
    E.seed(321);
    let b = E.mountains(430) + E.ground(650, { grass: false }) + E.stones(650, 9);
    b += E.fill(`M60 430 C 130 210, 220 180, 260 320 Z M500 430 C 430 210, 340 180, 300 320 Z`, INK);
    b += E.mass(`M180 650 L210 380 L280 230 L350 380 L380 650 Z`, id);
    b += E.eye(260, 285, 11, 'slit') + E.eye(300, 285, 11, 'slit');
    b += E.flames(280, 210, 140, 120);
    return E.wrap(id, b, { caption: 'Draco Ruber' });
  },
  'bst-lich': (id) => {
    E.seed(322);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".5"/>` + E.ground(650, { grass: false });
    b += E.runeRing(280, 250, 130, 16, id);
    b += floorShadow(280, 650, 60);
    const f = figure(280, 650, { s: 1.36, facing: 1, body: 'robe', head: 'crown', cloak: true, armL: arm(-145, -15), armR: arm(-120, -20), id });
    b += f.svg;
    b += E.skullHead(f.head[0], f.head[1], 22);
    b += E.staff(f.hands.R[0], f.hands.R[1], -90, 210, true, id);
    return E.wrap(id, b, { caption: 'Lich' });
  },
  'bst-tarrasque': (id) => {
    E.seed(323);
    let b = E.mountains(470) + E.castle(370, 560, 120, 90) + E.ground(650, { grass: false });
    b += E.mass(`M80 650 L110 370 L185 240 L315 210 L420 280 L390 380 L435 650 Z`, id);
    for (let i = 0; i < 6; i++) b += E.fill(`M${170 + i * 32} ${245 - i * 4} l14 -48 l18 44 Z`, INK);
    b += E.fangs(385, 325, 7, 75, 18, false) + E.eye(355, 265, 12, 'slit');
    return E.wrap(id, b, { caption: 'Tarrasque' });
  },
  'bst-wraith': (id) => {
    E.seed(324);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".55"/>` + E.moon(130, 130, 40, id);
    b += E.fill(`M200 620 C 160 470, 190 290, 280 240 C 370 290, 400 470, 360 620 C 320 570, 240 570, 200 620 Z`, INK);
    b += `<circle cx="265" cy="295" r="5" fill="${PALE}"/><circle cx="295" cy="295" r="5" fill="${PALE}"/>`;
    b += E.sword(360, 420, -45, 145, 2.4);
    return E.wrap(id, b, { caption: 'Spectrum' });
  },
  'bst-golem': (id) => {
    E.seed(325);
    let b = E.ground(650, { grass: false });
    b += floorShadow(280, 650, 92);
    const f = figure(280, 650, { s: 1.62, facing: 1, body: 'plate', head: 'helm', bulk: 1.65, armL: arm(-35, -20), armR: arm(-115, -20), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -70, 185, 3.6);
    return E.wrap(id, b, { caption: 'Golem Ferreus' });
  },
  'bst-youngdragon': (id) => {
    E.seed(326);
    let b = E.mountains(380) + E.ground(650, { grass: false });
    b += E.fill(`M90 420 L220 260 L250 380 Z M470 420 L340 260 L310 380 Z`, PALE, `stroke="${INK}" stroke-width="2.6"`);
    b += E.mass(`M200 650 L230 390 L280 270 L330 390 L360 650 Z`, id);
    b += E.eye(265, 315, 9, 'slit') + E.eye(295, 315, 9, 'slit');
    return E.wrap(id, b, { caption: 'Draco Albus' });
  },
  'bst-hag': (id) => {
    E.seed(327);
    let b = E.moon(420, 120, 38, id) + E.pines(650, 6, 50, 510, 1.1) + E.ground(650);
    b += E.fill(`M350 650 a55 45 0 1 0 110 0 h-110 Z`, INK) + E.smoke(405, 580, 5);
    b += floorShadow(230, 650, 54);
    const f = figure(230, 650, { s: 1.22, facing: 1, body: 'robe', head: 'hood', cloak: true, hair: 0.9, armL: arm(-80, -30), armR: arm(-110, -20), id });
    b += f.svg;
    b += E.claws(f.hands.R[0], f.hands.R[1], 1, 4, 15);
    return E.wrap(id, b, { caption: 'Striga Viridis' });
  },
  'bst-balor': (id) => {
    E.seed(328);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".5"/>` + E.ground(650, { grass: false });
    b += E.fill(`M50 220 C 140 160, 220 260, 250 380 L 110 430 Z M510 220 C 420 160, 340 260, 310 380 L 450 430 Z`, INK);
    b += floorShadow(280, 650, 88);
    const f = figure(280, 650, { s: 1.55, facing: 1, body: 'plate', horns: true, bulk: 1.5, armL: arm(-135, -20), armR: arm(-125, -20), id });
    b += f.svg;
    b += E.sword(f.hands.L[0], f.hands.L[1], -120, 170, 3.2);
    b += E.stroke(`M${f.hands.R[0]} ${f.hands.R[1]} C 430 420, 490 520, 390 610`, 4, RUST);
    b += E.flames(280, 650, 220, 120);
    return E.wrap(id, b, { caption: 'Balor' });
  },
  'bst-aboleth': (id) => {
    E.seed(329);
    let b = `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="url(#dark-${id})" opacity=".45"/>`;
    b += E.mass(`M110 380 C 170 250, 390 250, 450 380 C 390 470, 170 470, 110 380 Z`, id);
    for (const cy of [335, 365, 395]) b += E.eye(280, cy, 13, 'slit');
    for (let i = 0; i < 4; i++) {
      const x = 160 + i * 80;
      b += E.stroke(`M${x} 430 C ${x - 40} 520, ${x + 40} 580, ${x} 670`, 8);
    }
    return E.wrap(id, b, { caption: 'Aboleth' });
  },
  'bst-giant': (id) => {
    E.seed(330);
    let b = E.mountains(360) + E.pines(650, 8, 50, 510, 0.75) + E.ground(650);
    b += floorShadow(280, 650, 96);
    const f = figure(280, 650, { s: 1.68, facing: 1, body: 'fur', head: 'helm', beard: true, bulk: 1.55, armL: arm(-45, -20), armR: arm(-140, -15), id });
    b += f.svg;
    b += E.axe(f.hands.R[0], f.hands.R[1], -85, 200);
    return E.wrap(id, b, { caption: 'Gigas Glacialis' });
  }
};
