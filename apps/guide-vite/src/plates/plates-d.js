// Plates for magic items and game mechanics.
import * as E from './engine.js';
import { figure } from './figure.js';
const { INK, PALE, RUST, W, H } = E;

const arm = (upper, fore) => ({ upper, fore });
const floorShadow = (x, y, w) => `<ellipse cx="${x}" cy="${y + 3}" rx="${w}" ry="${w * 0.16}" fill="${INK}" opacity=".22"/>`;

export const PLATES_D = {
  // ───────────────────────────── ITEMS ─────────────────────────────
  'it-toc': (id) => {
    E.seed(401);
    let b = `<circle cx="280" cy="340" r="185" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(640, { grass: false });
    b += E.runeRing(280, 340, 145, 14, id);
    b += E.sword(280, 440, -90, 220, 3.2);
    b += E.shield(280, 360, 56, 'sun');
    return E.wrap(id, b, { caption: 'Index Mirabilium' });
  },
  'it-bag': (id) => {
    E.seed(402);
    let b = `<circle cx="280" cy="390" r="160" fill="url(#glow-${id})" opacity=".8"/>` + E.ground(640, { grass: false });
    b += E.fill(`M180 410 C 140 520, 160 620, 280 625 C 400 620, 420 520, 380 410 Z`, INK);
    b += E.fill(`M205 410 Q280 385 355 410 L340 435 Q280 420 220 435 Z`, PALE, `stroke="${INK}" stroke-width="2.5"`);
    b += E.sword(255, 405, -105, 160, 2.6) + E.staff(305, 405, -75, 175, true, id);
    for (let i = 0; i < 12; i++) b += E.sparkle(280 + E.rr(-110, 110), 280 + E.rr(-80, 90), 8);
    return E.wrap(id, b, { caption: 'Saccus Capax' });
  },
  'it-elvenkind': (id) => {
    E.seed(403);
    let b = E.moon(420, 130, 42, id) + E.pines(650, 7, 50, 510, 1.15) + E.ground(650);
    b += floorShadow(280, 650, 54);
    const f = figure(280, 650, { s: 1.32, facing: 1, body: 'leather', head: 'hood', cloak: true, ears: 'pointed', id });
    b += f.svg;
    return E.wrap(id, b, { caption: 'Pallium Alfarum' });
  },
  'it-boots': (id) => {
    E.seed(404);
    let b = E.ground(630);
    for (const [bx, by] of [[190, 580], [340, 540]]) {
      b += E.fill(`M${bx} ${by} v-130 h55 v95 l50 20 v15 Z`, INK);
      b += E.fill(`M${bx - 5} ${by - 110} l-45 -35 l15 45 l30 10 Z`, PALE, `stroke="${INK}" stroke-width="2.2"`);
    }
    for (let i = 0; i < 12; i++) b += E.stroke(`M${70 + i * 16} ${430 + (i % 4) * 35} h70`, 1.8, INK, 'opacity=".5"');
    return E.wrap(id, b, { caption: 'Caligae Celeritatis' });
  },
  'it-flame': (id) => {
    E.seed(405);
    let b = `<circle cx="280" cy="340" r="190" fill="url(#glow-${id})"/>` + E.ground(650, { grass: false });
    b += E.flames(280, 480, 130, 290);
    b += E.sword(280, 540, -90, 340, 3.6);
    return E.wrap(id, b, { caption: 'Lingua Flammae' });
  },
  'it-vorpal': (id) => {
    E.seed(406);
    let b = E.runeRing(280, 340, 150, 16, id) + E.ground(650, { grass: false });
    b += E.sword(280, 550, -90, 360, 3.8);
    for (let i = 0; i < 10; i++) b += E.sparkle(280 + E.rr(-90, 90), 320 + E.rr(-140, 120), 10);
    return E.wrap(id, b, { caption: 'Gladius Vorpalis' });
  },
  'it-holyav': (id) => {
    E.seed(407);
    let b = `<circle cx="280" cy="300" r="210" fill="url(#glow-${id})" opacity=".9"/>` + E.ground(650, { grass: false });
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      b += E.stroke(`M280 300 L${280 + Math.cos(a) * 220} ${300 + Math.sin(a) * 220}`, 1.4, INK, 'opacity=".4"');
    }
    b += E.sword(280, 540, -90, 350, 3.8);
    b += E.shield(280, 360, 52, 'sun');
    return E.wrap(id, b, { caption: 'Ultor Sanctus' });
  },
  'it-luckblade': (id) => {
    E.seed(408);
    let b = E.stars(40, 50, 380) + `<circle cx="280" cy="330" r="165" fill="url(#glow-${id})"/>` + E.ground(650, { grass: false });
    b += E.sword(280, 540, -90, 330, 3.4);
    for (const [cx, cy] of [[210, 260], [280, 210], [350, 260]]) {
      b += `<circle cx="${cx}" cy="${cy}" r="14" fill="${PALE}" stroke="${INK}" stroke-width="2.4"/>` + E.sparkle(cx, cy, 22);
    }
    return E.wrap(id, b, { caption: 'Lamina Fortunae' });
  },
  'it-displace': (id) => {
    E.seed(409);
    let b = E.ground(650, { grass: false });
    const f = figure(280, 650, { s: 1.3, facing: 1, body: 'leather', head: 'hood', cloak: true, id });
    b += `<g opacity=".28" transform="translate(-42 -12)">${f.svg}</g>`;
    b += `<g opacity=".28" transform="translate(42 8)">${f.svg}</g>`;
    b += floorShadow(280, 650, 56) + f.svg;
    return E.wrap(id, b, { caption: 'Pallium Dislocationis' });
  },
  'it-invisring': (id) => {
    E.seed(410);
    let b = `<circle cx="280" cy="360" r="170" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(650, { grass: false });
    b += `<ellipse cx="280" cy="360" rx="88" ry="52" fill="none" stroke="${INK}" stroke-width="14"/>`;
    b += `<ellipse cx="280" cy="360" rx="88" ry="52" fill="none" stroke="${PALE}" stroke-width="4"/>`;
    b += E.runeRing(280, 360, 145, 14, id);
    return E.wrap(id, b, { caption: 'Anulus Invisibilitatis' });
  },
  'it-wandf': (id) => {
    E.seed(411);
    let b = `<circle cx="340" cy="240" r="160" fill="url(#glow-${id})"/>` + E.ground(650, { grass: false });
    b += E.stroke(`M160 560 L340 240`, 9) + E.stroke(`M160 560 L340 240`, 2.5, PALE);
    b += `<circle cx="340" cy="240" r="24" fill="${PALE}" stroke="${INK}" stroke-width="3"/>`;
    b += E.flames(340, 240, 95, 110);
    return E.wrap(id, b, { caption: 'Virga Ignis' });
  },
  'it-staffpower': (id) => {
    E.seed(412);
    let b = E.stars(38, 50, 360) + `<circle cx="280" cy="220" r="175" fill="url(#glow-${id})"/>` + E.ground(650, { grass: false });
    b += E.runeRing(280, 220, 110, 14, id);
    b += E.staff(280, 440, -90, 220, true, id);
    b += E.lightning(280, 220, 140, 2.8);
    return E.wrap(id, b, { caption: 'Baculus Potentiae' });
  },
  'it-pearl': (id) => {
    E.seed(413);
    let b = `<circle cx="280" cy="350" r="175" fill="url(#glow-${id})" opacity=".9"/>` + E.ground(650, { grass: false });
    b += `<circle cx="280" cy="350" r="68" fill="${PALE}" stroke="${INK}" stroke-width="3.2"/>`;
    b += `<path d="M240 320 A45 45 0 0 1 310 305" fill="none" stroke="${INK}" stroke-width="2"/>`;
    b += E.runeRing(280, 350, 125, 12, id);
    return E.wrap(id, b, { caption: 'Margarita Potentiae' });
  },
  'it-ioun': (id) => {
    E.seed(414);
    let b = E.ground(650, { grass: false });
    b += floorShadow(280, 650, 56);
    const f = figure(280, 650, { s: 1.3, facing: 1, body: 'robe', cloak: true, hair: 0.6, id });
    b += f.svg;
    b += `<ellipse cx="280" cy="405" rx="95" ry="28" fill="none" stroke="${INK}" stroke-width="1.8" stroke-dasharray="6 6"/>`;
    for (const [sx, sy] of [[190, 405], [280, 377], [370, 405]]) {
      b += `<polygon points="${sx},${sy - 14} ${sx + 12},${sy} ${sx},${sy + 14} ${sx - 12},${sy}" fill="${PALE}" stroke="${INK}" stroke-width="2.2"/>`;
      b += E.sparkle(sx, sy - 20, 6);
    }
    return E.wrap(id, b, { caption: 'Lapis Ioun' });
  },
  'it-deck': (id) => {
    E.seed(415);
    let b = E.stars(45, 50, 420) + `<circle cx="280" cy="340" r="185" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(650, { grass: false });
    for (const [ang, dx, dy] of [[-22, -75, 15], [0, 0, 0], [22, 75, 15]]) {
      b += `<g transform="translate(${280 + dx} ${350 + dy}) rotate(${ang})">
        <rect x="-48" y="-72" width="96" height="144" rx="6" fill="${PALE}" stroke="${INK}" stroke-width="3"/>
        <rect x="-38" y="-62" width="76" height="124" fill="none" stroke="${INK}" stroke-width="1.2"/>
        ${E.sparkle(0, 0, 22)}
      </g>`;
    }
    return E.wrap(id, b, { caption: 'Chartae Fati' });
  },

  // ───────────────────────────── MECHANICS ─────────────────────────────
  'mx-toc': (id) => {
    E.seed(501);
    let b = `<circle cx="280" cy="330" r="185" fill="url(#glow-${id})" opacity=".85"/>` + E.ground(650, { grass: false });
    b += E.runeRing(280, 330, 150, 12, id);
    b += `<polygon points="280,210 385,270 385,390 280,450 175,390 175,270" fill="${PALE}" stroke="${INK}" stroke-width="3.2"/>`;
    b += E.stroke(`M280 210 L280 330 M385 270 L280 330 M175 270 L280 330 M385 390 L280 330 M175 390 L280 330 M280 450 L280 330`, 2);
    b += `<text x="280" y="315" font-family="'Cinzel',serif" font-size="32" text-anchor="middle" fill="${INK}">20</text>`;
    return E.wrap(id, b, { caption: 'Tractatus De Alea' });
  },
  'mx-scores': (id) => {
    E.seed(502);
    let b = E.ground(650, { grass: false });
    b += E.runeRing(280, 370, 175, 12, id);
    b += `<rect x="155" y="245" width="250" height="250" fill="none" stroke="${INK}" stroke-width="2"/>`;
    b += figure(280, 520, { s: 1.15, facing: 1, body: 'tunic', armL: arm(-110, 0), armR: arm(-110, 0), id }).svg;
    return E.wrap(id, b, { caption: 'Sex Mensurae' });
  },
  'mx-checks': (id) => {
    E.seed(503);
    let b = `<circle cx="280" cy="260" r="145" fill="url(#glow-${id})"/>` + E.ground(650, { grass: false });
    b += `<polygon points="280,170 350,215 350,295 280,340 210,295 210,215" fill="${PALE}" stroke="${INK}" stroke-width="3"/>`;
    b += `<text x="280" y="266" font-family="'Cinzel',serif" font-size="28" text-anchor="middle" fill="${INK}">20</text>`;
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.24, facing: 1, body: 'leather', cloak: true, armL: arm(-135, -15), armR: arm(-40, -30), id }).svg;
    return E.wrap(id, b, { caption: 'Probatio' });
  },
  'mx-adv': (id) => {
    E.seed(504);
    let b = `<circle cx="280" cy="320" r="175" fill="url(#glow-${id})"/>` + E.ground(650, { grass: false });
    for (const [cx, cy, num] of [[195, 320, '7'], [365, 320, '20']]) {
      b += `<polygon points="${cx},${cy - 65} ${cx + 58},${cy - 25} ${cx + 38},${cy + 55} ${cx - 38},${cy + 55} ${cx - 58},${cy - 25}" fill="${PALE}" stroke="${INK}" stroke-width="3"/>`;
      b += `<text x="${cx}" y="${cy + 12}" font-family="'Cinzel',serif" font-size="28" text-anchor="middle" fill="${INK}">${num}</text>`;
    }
    b += E.sparkle(365, 230, 16);
    return E.wrap(id, b, { caption: 'Duae Sortes' });
  },
  'mx-cover': (id) => {
    E.seed(505);
    let b = E.ground(650, { grass: false });
    b += E.fill(`M250 380 h65 v270 h-65 Z`, INK);
    b += floorShadow(190, 650, 54);
    b += figure(190, 650, { s: 1.24, facing: 1, pose: 'kneel', body: 'plate', head: 'helm', id }).svg;
    for (let y = 410; y <= 550; y += 45) b += E.stroke(`M480 ${y - 20} L315 ${y}`, 3);
    return E.wrap(id, b, { caption: 'Praesidium' });
  },
  'mx-combat': (id) => {
    E.seed(506);
    let b = E.ground(650, { grass: false });
    b += `<path d="M210 190 H350 L300 280 L350 370 H210 L260 280 Z" fill="${PALE}" stroke="${INK}" stroke-width="3"/>`;
    b += floorShadow(180, 650, 52) + floorShadow(380, 650, 52);
    const f1 = figure(180, 650, { s: 1.24, facing: 1, pose: 'lunge', body: 'plate', head: 'helm', armR: arm(-120, -10), id });
    const f2 = figure(380, 650, { s: 1.24, facing: -1, pose: 'lunge', body: 'leather', cloak: true, armL: arm(-120, -10), id });
    b += f1.svg + f2.svg;
    b += E.sword(f1.hands.R[0], f1.hands.R[1], -35, 130, 2.5) + E.sword(f2.hands.L[0], f2.hands.L[1], -145, 130, 2.5);
    return E.wrap(id, b, { caption: 'Tempus Pugnae' });
  },
  'mx-actions': (id) => {
    E.seed(507);
    let b = E.ground(650, { grass: false });
    b += E.runeRing(280, 260, 110, 12, id);
    b += E.sword(280, 320, -45, 130, 2.5) + E.sword(280, 320, -135, 130, 2.5);
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.28, facing: 1, pose: 'stride', body: 'plate', cloak: true, id }).svg;
    return E.wrap(id, b, { caption: 'Actio' });
  },
  'mx-attack': (id) => {
    E.seed(508);
    let b = E.ground(650, { grass: false });
    b += E.shield(280, 340, 110, 'sun');
    b += E.sword(150, 460, -35, 260, 3.4);
    b += E.sparkle(280, 340, 26);
    return E.wrap(id, b, { caption: 'Ictus Et Lorica' });
  },
  'mx-hp': (id) => {
    E.seed(509);
    let b = E.moon(420, 130, 40, id) + E.ground(650, { grass: false });
    b += E.skullHead(280, 250, 48);
    b += E.runeRing(280, 250, 105, 6, id);
    b += floorShadow(280, 650, 58);
    b += figure(280, 650, { s: 1.24, facing: 1, pose: 'kneel', body: 'plate', cloak: true, id }).svg;
    return E.wrap(id, b, { caption: 'Limen Mortis' });
  },
  'mx-rest': (id) => {
    E.seed(510);
    let b = E.moon(130, 120, 42, id) + E.stars(38, 50, 320) + E.pines(650, 6, 50, 510, 1.1) + E.ground(650);
    b += `<circle cx="280" cy="580" r="95" fill="url(#glow-${id})"/>`;
    b += E.stones(645, 6) + E.flames(280, 640, 68, 95);
    b += floorShadow(170, 650, 48) + floorShadow(390, 650, 48);
    b += figure(170, 650, { s: 1.15, facing: 1, pose: 'kneel', body: 'plate', cloak: true, id }).svg;
    b += figure(390, 650, { s: 1.15, facing: -1, pose: 'kneel', body: 'robe', head: 'wizardhat', beard: true, id }).svg;
    return E.wrap(id, b, { caption: 'Quies' });
  },
  'mx-spellcast': (id) => {
    E.seed(511);
    let b = E.stars(36, 50, 340) + E.ground(650, { grass: false });
    b += E.runeRing(280, 270, 130, 16, id);
    b += E.book(280, 270, 90, 66, true);
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.28, facing: 1, body: 'robe', cloak: true, armL: arm(-140, -15), armR: arm(-140, -15), id }).svg;
    return E.wrap(id, b, { caption: 'Ars Incantandi' });
  },
  'mx-conditions': (id) => {
    E.seed(512);
    let b = E.ground(650, { grass: false });
    b += E.runeRing(280, 380, 145, 12, id);
    b += floorShadow(280, 650, 56);
    b += figure(280, 650, { s: 1.26, facing: 1, pose: 'kneel', body: 'leather', armL: arm(-80, -30), armR: arm(-80, -30), id }).svg;
    for (let y = 430; y <= 590; y += 50) b += E.stroke(`M170 ${y} Q280 ${y + 20} 390 ${y}`, 3.2);
    return E.wrap(id, b, { caption: 'Afflictiones' });
  },
  'mx-insp': (id) => {
    E.seed(513);
    let b = `<circle cx="280" cy="240" r="195" fill="url(#glow-${id})" opacity=".9"/>` + E.ground(650);
    b += E.sparkle(280, 220, 42) + E.runeRing(280, 220, 95, 12, id);
    b += floorShadow(280, 650, 58);
    const f = figure(280, 650, { s: 1.32, facing: 1, body: 'plate', cloak: true, armL: arm(-40, -20), armR: arm(-160, -10), id });
    b += f.svg;
    b += E.sword(f.hands.R[0], f.hands.R[1], -90, 175, 2.8);
    return E.wrap(id, b, { caption: 'Inspiratio' });
  }
};
