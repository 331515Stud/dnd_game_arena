@import "tailwindcss";

@layer base {
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: #e2e8f0;
    background-color: #080b11;
  }

  h1, h2, h3, .font-fantasy {
    font-family: 'Cinzel', serif;
    letter-spacing: 0.02em;
  }

  .font-book {
    font-family: 'EB Garamond', Georgia, serif;
  }
}

/* ── 3D book engine ─────────────────────────────────────────── */
.perspective-book {
  perspective: 2600px;
  perspective-origin: 50% 45%;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* ── Ambient library atmosphere ─────────────────────────────── */
@keyframes candleFlicker {
  0%, 100% { opacity: .50; transform: scale(1); }
  23%      { opacity: .72; transform: scale(1.05); }
  47%      { opacity: .44; transform: scale(.97); }
  71%      { opacity: .66; transform: scale(1.03); }
}
.candle-glow {
  animation: candleFlicker 5.5s ease-in-out infinite;
}

@keyframes emberDrift {
  0%   { transform: translate3d(0, 0, 0) scale(.7); opacity: 0; }
  12%  { opacity: .85; }
  70%  { opacity: .5; }
  100% { transform: translate3d(38px, -260px, 0) scale(1.15); opacity: 0; }
}
.dust-mote {
  position: absolute;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 214, 140, .95) 0%, rgba(255, 180, 90, 0) 70%);
  animation: emberDrift linear infinite;
  pointer-events: none;
}

/* ── Parchment page faces ───────────────────────────────────── */
.parchment {
  background-color: #f6ecd7;
  background-image:
    radial-gradient(ellipse at 18% 12%, rgba(255, 252, 240, .85) 0%, rgba(255, 252, 240, 0) 55%),
    radial-gradient(ellipse at 82% 88%, rgba(160, 116, 62, .16) 0%, rgba(160, 116, 62, 0) 60%),
    url('/images/parchment-bg.jpg');
  background-size: cover, cover, cover;
  background-position: center;
}

.dropcap::first-letter {
  font-family: 'Cinzel', serif;
  float: left;
  font-size: 3.4em;
  line-height: .78;
  padding-right: .09em;
  margin-top: .04em;
  color: #8c3a1e;
  text-shadow: 0 1px 0 rgba(255, 245, 220, .8);
}

/* ── Page corner curl hint ──────────────────────────────────── */
.page-curl {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 62px;
  height: 62px;
  background: linear-gradient(315deg, rgba(255, 250, 235, .96) 0%, rgba(226, 205, 168, .9) 44%, rgba(140, 100, 55, .28) 62%, rgba(140, 100, 55, 0) 64%);
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  box-shadow: -6px -6px 14px rgba(60, 32, 10, .22);
  transition: transform .35s cubic-bezier(.34, 1.56, .64, 1), filter .35s ease;
  transform-origin: bottom right;
  pointer-events: none;
}
.group\/page:hover .page-curl {
  transform: translate3d(-9px, -9px, 22px) scale(1.14);
  filter: brightness(1.07);
}

/* ── Mobile spread transition (no 3D below lg) ──────────────── */
@keyframes spreadInNext {
  from { opacity: 0; transform: translate3d(34px, 0, 0); }
  to   { opacity: 1; transform: none; }
}
@keyframes spreadInPrev {
  from { opacity: 0; transform: translate3d(-34px, 0, 0); }
  to   { opacity: 1; transform: none; }
}
.anim-spread-next { animation: spreadInNext .5s cubic-bezier(.22, .61, .36, 1) both; }
.anim-spread-prev { animation: spreadInPrev .5s cubic-bezier(.22, .61, .36, 1) both; }

/* ── Scrollbars inside the book ─────────────────────────────── */
.book-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 94, 60, .45) rgba(180, 140, 90, .08);
  scrollbar-gutter: stable;
}
.book-scrollbar::-webkit-scrollbar { width: 5px; }
.book-scrollbar::-webkit-scrollbar-track { background: rgba(180, 140, 90, .08); border-radius: 4px; }
.book-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 94, 60, .4); border-radius: 4px; }
.book-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 94, 60, .7); }

/* Fine layered paper at the exposed edges of the open folio. */
.folio-edge {
  background-color: #e8dcc0;
  background-image:
    repeating-linear-gradient(0deg, #c8b68e 0 1px, #f3ead4 1px 3px, #d9c9a5 3px 4px),
    repeating-linear-gradient(90deg, rgba(113, 79, 39, .12) 0 1px, transparent 1px 5px),
    linear-gradient(90deg, rgba(56, 34, 14, .32), rgba(255, 248, 224, .34) 38%, rgba(70, 43, 17, .2));
  box-shadow: inset 0 1px 1px rgba(255, 245, 218, .5), 1px 3px 5px rgba(0, 0, 0, .38);
}
.folio-edge-right {
  transform: skewY(-.35deg);
  border-right: 1px solid rgba(97, 66, 31, .6);
  border-radius: 0 3px 3px 0;
}
.folio-edge-bottom {
  background-image:
    repeating-linear-gradient(0deg, #c6b38a 0 1px, #f4ead4 1px 3px, #d7c6a0 3px 4px),
    repeating-linear-gradient(90deg, rgba(113, 79, 39, .12) 0 1px, transparent 1px 5px),
    linear-gradient(90deg, rgba(255, 248, 224, .35), rgba(56, 34, 14, .32));
  transform: skewX(-1deg);
  border-bottom: 1px solid rgba(97, 66, 31, .55);
  border-radius: 0 0 4px 4px;
}

.book-zoom-cover {
  will-change: left, top, width, height, transform;
  transform-style: preserve-3d;
  backface-visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}

/* ── Ornamental divider ─────────────────────────────────────── */
@keyframes slowSpin { to { transform: rotate(360deg); } }
.slow-spin { animation: slowSpin 26s linear infinite; }

@keyframes fadeUpIn {
  from { opacity: 0; transform: translate3d(0, 14px, 0); }
  to   { opacity: 1; transform: none; }
}
.fade-up-in { animation: fadeUpIn .55s cubic-bezier(.22, .61, .36, 1) both; }

@keyframes resultPop {
  0% { opacity: 0; transform: translate3d(0, 10px, 0) scale(.92); }
  60% { opacity: 1; transform: translate3d(0, 0, 0) scale(1.03); }
  100% { opacity: 1; transform: none; }
}
.result-pop { animation: resultPop .42s cubic-bezier(.2, .8, .2, 1) both; }

/* ═══════════════════ Library: reader chrome ═══════════════════ */
.reader { max-width: 1240px; margin: 0 auto; }
.reader-chrome {
  position: relative; z-index: 50; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
  margin-bottom: 18px; padding: 10px 12px; border-radius: 12px;
  border: 1px solid rgba(180,130,60,.22);
  background: linear-gradient(90deg, rgba(32,21,12,.92), rgba(22,15,9,.92));
  box-shadow: 0 10px 30px -12px rgba(0,0,0,.7);
  transition: opacity .45s ease;
}
.chrome-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 8px;
  font-size: 12.5px; font-weight: 600; color: rgba(253,230,170,.9);
  border: 1px solid rgba(180,130,60,.3); background: rgba(80,50,20,.25); transition: background .2s, color .2s;
}
.chrome-btn:hover { background: rgba(180,120,40,.28); color: #fff3d6; }
.chrome-input {
  width: 100%; background: rgba(0,0,0,.35); border: 1px solid rgba(180,130,60,.3); border-radius: 8px;
  padding: 7px 28px 7px 31px; font-size: 12.5px; color: #fef3d6; outline: none;
}
.chrome-input::placeholder { color: rgba(253,230,170,.38); }
.chrome-input:focus { border-color: rgba(230,180,90,.7); box-shadow: 0 0 0 3px rgba(230,180,90,.12); }
.search-panel {
  position: absolute; right: 0; top: calc(100% + 8px); width: min(430px, 92vw); max-height: 62vh; overflow-y: auto;
  z-index: 60; border-radius: 10px; border: 1px solid rgba(90,58,26,.55);
  background-color: #f4e8cf; background-image: url('/images/parchment-bg.jpg'); background-size: cover;
  box-shadow: 0 26px 60px rgba(0,0,0,.65);
}
.search-row {
  display: flex; flex-direction: column; gap: 2px; width: 100%; text-align: left; padding: 10px 15px;
  border-bottom: 1px solid rgba(139,106,63,.22); transition: background .15s;
}
.search-row:hover { background: rgba(140,47,26,.08); }
.reader-footer {
  display: flex; align-items: center; gap: 14px; max-width: 860px; margin: 22px auto 0; padding: 10px 14px;
  border-radius: 12px; border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.025);
  transition: opacity .45s ease;
}
.nav-btn {
  width: 40px; height: 40px; flex: none; border-radius: 999px; display: grid; place-items: center; color: #f5d48a;
  border: 1px solid rgba(217,161,74,.42); background: radial-gradient(circle at 35% 30%, #3b2716, #1a0f06);
  box-shadow: 0 6px 16px rgba(0,0,0,.5); transition: transform .2s, opacity .2s;
}
.nav-btn:hover { transform: scale(1.06); }
.nav-btn:disabled { opacity: .28; pointer-events: none; }
.ribbon-range { width: 100%; margin-top: 7px; accent-color: #d4a24c; cursor: pointer; }
.chapter-chip {
  white-space: nowrap; padding: 6px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
  color: rgba(253,230,170,.75); border: 1px solid rgba(180,130,60,.25); background: rgba(255,255,255,.03);
}
.chapter-chip.is-active { background: #d4a24c; color: #1a1108; border-color: #d4a24c; }

/* ═══════════════════ Library: the book object ═══════════════════ */
.book-stage { position: relative; max-width: 1180px; margin: 0 auto; padding-right: 44px; }
.book { position: relative; }
.book-body {
  position: relative; z-index: 1; border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,220,160,.14), inset 0 -14px 30px rgba(0,0,0,.35);
}
.book-shadow {
  position: absolute; top: 26px; bottom: -16px; right: 2px; z-index: 0; border-radius: 18px;
  background: rgba(0,0,0,.6); filter: blur(20px); pointer-events: none;
}
.spread { position: relative; display: grid; border-radius: 7px; overflow: hidden; background: #efe2c4; z-index: 2; }
.spine-crease {
  position: absolute; top: 0; bottom: 0; left: 50%; width: 4px; transform: translateX(-50%); z-index: 20; pointer-events: none;
  background: linear-gradient(90deg, rgba(40,24,10,.0), rgba(40,24,10,.55) 45%, rgba(40,24,10,.55) 55%, rgba(40,24,10,0));
}
.gutter-shade-l { background: linear-gradient(to left, rgba(58,36,16,.45), rgba(58,36,16,.14) 32%, rgba(58,36,16,0)); }
.gutter-shade-r { background: linear-gradient(to right, rgba(58,36,16,.45), rgba(58,36,16,.14) 32%, rgba(58,36,16,0)); }
.headband {
  position: absolute; left: 50%; width: 40px; height: 8px; transform: translateX(-50%); z-index: 3; border-radius: 3px;
  background: repeating-linear-gradient(90deg, #8c1f24 0 3px, #e3c27a 3px 5px, #2c3463 5px 8px);
  box-shadow: 0 1px 2px rgba(0,0,0,.7);
}
.headband { top: 5px; }
.headband.is-bottom { top: auto; bottom: 5px; }
.cover-cast {
  position: absolute; inset: 0; z-index: 25; pointer-events: none;
  background: linear-gradient(90deg, rgba(20,10,4,.7), rgba(20,10,4,.18) 55%, rgba(20,10,4,0));
  animation: coverCastOut linear forwards;
}
.cover-cast.is-closing { animation-name: coverCastIn; }
@keyframes coverCastOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes coverCastIn { from { opacity: 0; } to { opacity: 1; } }
.folio-edge-left {
  transform: skewY(.35deg);
  border-left: 1px solid rgba(97,66,31,.6);
  border-radius: 3px 0 0 3px;
}

/* cloth bookmarks sticking out of the fore-edge */
.bookmarks {
  position: absolute; top: 60px; bottom: 60px; left: 100%; margin-left: -6px; z-index: 0;
  display: flex; flex-direction: column; justify-content: center; gap: 6px;
}
.bookmark {
  position: relative; width: 30px; min-height: 40px; max-height: 96px; flex: 1 1 0; overflow: hidden;
  border-radius: 0 6px 6px 0; color: rgba(255,240,210,.88);
  font-family: 'Cinzel', serif; font-size: 9.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  box-shadow: 2px 3px 7px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.08), inset 6px 0 6px -4px rgba(0,0,0,.45);
  transition: width .25s ease, filter .25s ease;
  background-image: repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px);
}
.bookmark span {
  display: block; margin: 0 auto; padding: 8px 0 8px 4px; max-height: 100%;
  writing-mode: vertical-rl; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.bookmark:hover { width: 36px; filter: brightness(1.15); }
.bookmark.is-active { width: 42px; filter: brightness(1.28) saturate(1.1); }
.bookmark.is-active::after { content: ''; position: absolute; right: 4px; top: 6px; bottom: 6px; width: 2px; border-radius: 2px; background: rgba(255,226,160,.75); }
.bookmark:disabled { cursor: default; }
.bookmarks-in { animation: bookmarksIn .6s .55s both; }
@keyframes bookmarksIn { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }

/* ═══════════════════ Library: page typography ═══════════════════ */
.page-sheet { box-shadow: inset 0 0 54px rgba(120,82,38,.17); }
.rubric-chip {
  display: inline-block; padding: 2px 10px; border-radius: 999px; font: 700 10px/1.6 'Plus Jakarta Sans', sans-serif;
  letter-spacing: .14em; text-transform: uppercase; color: #8c2f1a; border: 1px solid rgba(140,47,26,.35); background: rgba(140,47,26,.07);
}
.epigraph {
  font-family: 'EB Garamond', serif; font-style: italic; font-size: 15px; line-height: 1.55; color: #5c3d20;
  padding-left: 14px; border-left: 2px solid rgba(140,47,26,.4);
}
.stat-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0,1fr));
  border-top: 1px solid rgba(139,106,63,.4); border-left: 1px solid rgba(139,106,63,.4);
}
.stat-cell { padding: 7px 10px; border-right: 1px solid rgba(139,106,63,.32); border-bottom: 1px solid rgba(139,106,63,.32); background: rgba(150,105,50,.05); }
.stat-cell dt { font: 700 9.5px/1.3 'Plus Jakarta Sans', sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #7a5c38; }
.stat-cell dd { margin-top: 2px; font-family: 'EB Garamond', serif; font-size: 14.5px; font-weight: 600; line-height: 1.3; color: #3d2311; }
.page-h3 {
  display: flex; align-items: center; gap: 10px; font-family: 'Cinzel', serif; font-weight: 700; font-size: 12.5px;
  letter-spacing: .16em; text-transform: uppercase; color: #4a2e16;
}
.page-h3::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(139,106,63,.55), transparent); }
.body-text { font-family: 'EB Garamond', serif; font-size: 15.5px; line-height: 1.64; color: #2c1d11; text-align: justify; hyphens: auto; }
.page-kicker { font: 700 10px/1.4 'Plus Jakarta Sans', sans-serif; letter-spacing: .18em; text-transform: uppercase; color: #7a5c38; }
.insight { display: flex; gap: 10px; font-family: 'EB Garamond', serif; font-size: 14.8px; line-height: 1.5; color: #2c1d11; }
.insight-mark { flex: none; color: #8c2f1a; font-size: 10px; margin-top: 5px; }
.page-quote { padding: 14px 16px; border: 1px solid rgba(139,90,43,.28); background: rgba(150,105,50,.07); border-radius: 4px; }
.page-quote blockquote { font-family: 'EB Garamond', serif; font-style: italic; font-size: 15px; line-height: 1.55; color: #3d2712; }
.page-quote blockquote::before { content: '❝'; color: #8c2f1a; margin-right: 6px; }
.page-quote figcaption { margin-top: 8px; text-align: right; font: 700 10px 'Plus Jakarta Sans', sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #7a5c38; }

.plate { width: 100%; max-width: 292px; margin-left: auto; margin-right: auto; }
.plate-mat {
  padding: 8px; background: #f3e7cc; border: 1px solid rgba(90,58,26,.45);
  box-shadow: inset 0 1px 0 rgba(255,250,236,.8), 0 12px 24px -12px rgba(60,36,14,.5);
}
.plate-window { position: relative; aspect-ratio: 560 / 760; overflow: hidden; border: 1px solid rgba(90,58,26,.5); background: #efe3c8; }
.plate-pending {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(135deg, rgba(139,106,63,.09) 0 2px, transparent 2px 8px);
  animation: platePending 1.4s ease-in-out infinite;
}
@keyframes platePending { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
.plate-caption { margin-top: 8px; text-align: center; font-family: 'EB Garamond', serif; font-style: italic; font-size: 12.5px; color: #7a5c38; }

.step { display: flex; gap: 12px; padding: 10px 12px; border: 1px solid rgba(139,90,43,.2); background: rgba(150,105,50,.05); border-radius: 4px; }
.step-num {
  flex: none; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 999px;
  font: 700 11px 'Cinzel', serif; color: #8c2f1a; border: 1px solid rgba(140,47,26,.35); background: rgba(140,47,26,.08);
}
.step-title { font-family: 'Cinzel', serif; font-weight: 700; font-size: 13px; line-height: 1.3; color: #3d2311; }
.step-text { margin-top: 2px; font-family: 'EB Garamond', serif; font-size: 14.6px; line-height: 1.5; color: #4a3520; }
.page-table { width: 100%; border-collapse: collapse; font-family: 'EB Garamond', serif; font-size: 13.5px; color: #2c1d11; }
.page-table th { text-align: left; padding: 6px 8px; font: 700 10px 'Plus Jakarta Sans', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #4a2e16; background: rgba(150,100,45,.14); }
.page-table td { padding: 6px 8px; border-top: 1px solid rgba(139,90,43,.22); }
.audience-chip { font-family: 'EB Garamond', serif; font-size: 13.2px; padding: 3px 10px; border-radius: 3px; background: rgba(150,105,50,.1); border: 1px solid rgba(139,90,43,.25); color: #3b2312; }
.verdict {
  display: flex; gap: 12px; padding: 12px 14px; border-radius: 4px;
  border: 1px solid rgba(140,47,26,.28); background: linear-gradient(100deg, rgba(140,47,26,.1), rgba(150,105,50,.05));
}
.verdict-seal {
  flex: none; width: 34px; height: 34px; border-radius: 999px; display: grid; place-items: center; font-size: 15px; color: #f6dcae;
  background: radial-gradient(circle at 35% 30%, #b8432a, #6e1d10);
  box-shadow: 0 2px 4px rgba(60,20,8,.5), inset 0 0 0 2px rgba(255,210,170,.25);
}
.toc-chapter { padding-bottom: 4px; border-bottom: 1px solid rgba(139,106,63,.35); font: 700 10.5px 'Cinzel', serif; letter-spacing: .2em; text-transform: uppercase; color: #8c2f1a; }
.toc-row {
  width: 100%; display: flex; align-items: baseline; padding: 5px 4px; border-radius: 3px; text-align: left;
  font-family: 'EB Garamond', serif; font-size: 15px; color: #2c1d11; transition: background .2s, color .2s;
}
.toc-row:hover { background: rgba(140,47,26,.08); color: #8c2f1a; }
.toc-row.is-current { color: #8c2f1a; font-weight: 600; }
.toc-leader { flex: 1; min-width: 16px; margin: 0 6px 4px; border-bottom: 1px dotted rgba(122,92,56,.6); }
.search-hit { background: rgba(222,170,60,.45); color: inherit; border-radius: 2px; padding: 0 1px; }

/* ═══════════════════ Library: hall & bookcase ═══════════════════ */
.hall-bar {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px;
  border-radius: 12px; border: 1px solid rgba(180,120,50,.25); background: linear-gradient(90deg, #161009, #1d1409, #161009);
}
.hall-tool {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 7px; font-size: 11.5px; font-weight: 600;
  color: rgba(253,230,170,.82); border: 1px solid rgba(180,130,60,.25); background: rgba(255,255,255,.03); transition: background .2s;
}
.hall-tool:hover { background: rgba(180,120,40,.22); color: #fff3d6; }
.bookcase {
  position: relative; overflow: hidden; border-radius: 18px; border: 12px solid transparent;
  background: linear-gradient(#140d08, #0c0806) padding-box, linear-gradient(160deg, #7a5530, #3a2513 40%, #2a1a0c 70%, #5a3b1e) border-box;
  box-shadow: 0 40px 80px -30px rgba(0,0,0,.9), inset 0 0 70px rgba(0,0,0,.75);
}
.bookcase::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.018) 0 2px, transparent 2px 140px), radial-gradient(ellipse at 50% 0%, rgba(255,180,80,.09), transparent 55%);
}
.shelf-plank {
  position: relative; height: 18px; margin: 4px -44px 0; border-radius: 2px;
  background: linear-gradient(180deg, #8a6236 0%, #5e3e20 38%, #3a2513 100%);
  box-shadow: 0 14px 20px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,220,160,.32), inset 0 -3px 0 rgba(0,0,0,.35);
}
.hall-notice {
  position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 120; padding: 10px 18px; border-radius: 10px;
  background: #2a1a0c; color: #fde8b5; border: 1px solid rgba(217,161,74,.5); box-shadow: 0 16px 30px rgba(0,0,0,.5); font-size: 13px;
  animation: resultPop .35s both;
}

/* ═══════════════════ Library: article editor ═══════════════════ */
.editor-panel {
  position: relative; margin: 40px auto; max-width: 980px; padding: 24px 28px; border-radius: 14px; color: #2c1d11;
  background-color: #f6ecd7; background-image: url('/images/parchment-bg.jpg'); background-size: cover;
  box-shadow: 0 30px 80px rgba(0,0,0,.6), inset 0 0 0 1px rgba(90,58,26,.4);
}
.editor-label { display: block; margin-bottom: 5px; font: 700 10px 'Plus Jakarta Sans', sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #7a5c38; }
.editor-hint { display: block; margin-top: 4px; font-family: 'EB Garamond', serif; font-style: italic; font-size: 12.5px; color: #8a6a40; }
.editor-input {
  width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(139,106,63,.45); background: rgba(255,252,240,.72);
  font-family: 'EB Garamond', serif; font-size: 15px; color: #2c1d11; outline: none;
}
.editor-input:focus { border-color: #8c2f1a; box-shadow: 0 0 0 3px rgba(140,47,26,.14); }
textarea.editor-input { resize: vertical; line-height: 1.5; }
.editor-section { margin-top: 10px; padding-top: 12px; border-top: 1px solid rgba(139,106,63,.35); font: 700 12px 'Cinzel', serif; letter-spacing: .14em; text-transform: uppercase; color: #8c2f1a; }
.editor-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; border-radius: 7px;
  font-size: 13px; font-weight: 600; color: #3d2311; border: 1px solid rgba(139,106,63,.5); background: rgba(255,250,236,.6);
  transition: background .2s, color .2s;
}
.editor-btn:hover { background: rgba(255,250,236,.95); }
.editor-btn:disabled { opacity: .5; pointer-events: none; }
.editor-btn-primary { background: #8c2f1a; color: #fbeccc; border-color: #6e2414; }
.editor-btn-primary:hover { background: #a3381f; }
.editor-btn-danger { color: #8c1f1a; border-color: rgba(140,31,26,.45); }
.editor-icon { padding: 6px; border-radius: 8px; color: #5a3a1f; }
.editor-icon:hover { background: rgba(139,106,63,.15); }

@media (max-width: 1023px) {
  .book-stage { padding-right: 0; }
  .reader-chrome { gap: 8px; }
}
