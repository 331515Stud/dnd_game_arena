import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Article, TomeRecord } from '../library/types';
import { plateKeyOf, warmPlates } from '../library/plates';
import { LeftPageFace, RightPageFace, type TocItem } from './book/PageFaces';
import { CoverArt, Corner, Tooling, leatherStyle } from './book/Binding';
import { FoldSpread } from './book/FoldSpread';
import { constrainCorner, cornerOnPath, lerp, type Sign, type Vec } from './book/fold';
import { ArrowLeft, ChevronLeft, ChevronRight, PenLine, Plus, Search, X } from 'lucide-react';

type TurnDir = 'next' | 'prev';
interface Flip {
  dir: TurnDir;
  from: number;
  to: number;
  cy: number;
  P: Vec;
}
/** The book's life on screen: flies in closed → cover swings open → read → cover closes → flies back. */
type Stage = 'fly' | 'opening' | 'open' | 'closing-prep' | 'closing' | 'leaving';

const FLY_MS = 950;
const OPEN_MS = 1150;
const CLOSE_MS = 980;
const LEAVE_MS = 820;
const PAD = 18;
const TAB_COLORS = ['#7a1f24', '#2f4a3a', '#7a5418', '#2c3463', '#5b2b4f', '#3d5a64', '#6b3f22', '#4a4a2a', '#583a5e', '#244a52'];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const isNarrowNow = () => (typeof window === 'undefined' ? false : window.matchMedia('(max-width: 1023px)').matches);
const prefersReduced = () => (typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

/**
 * FLIP between a cover rectangle (shelf) and the book's right half (closed book in the reader).
 * Both lists share the same functions so the browser interpolates them smoothly.
 */
function flightTransforms(target: DOMRect, book: DOMRect) {
  const half = { width: book.width / 2, height: book.height };
  const s = Math.max(0.05, target.height / half.height);
  const cx = book.width * 0.75;
  const cy = book.height / 2;
  const tx = target.left + target.width / 2 - book.left - s * cx;
  const ty = target.top + target.height / 2 - book.top - s * cy;
  return {
    away: `translate(${tx}px, ${ty}px) scale(${s}) translate(${cx}px, ${cy}px) perspective(1400px) rotateY(-17deg) translate(${-cx}px, ${-cy}px)`,
    home: `translate(0px, 0px) scale(1) translate(${cx}px, ${cy}px) perspective(1400px) rotateY(0deg) translate(${-cx}px, ${-cy}px)`
  };
}

function excerpt(text: string, at: number, len: number) {
  const start = Math.max(0, at - 36);
  const end = Math.min(text.length, at + len + 60);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

export interface BookLibraryProps {
  tome: TomeRecord;
  articles: Article[];
  intro: DOMRect | null;
  getReturnRect: () => DOMRect | null;
  onLeaving: () => void;
  onClosed: () => void;
  onEdit: (article: Article) => void;
  onCreate: (after: Article | null) => void;
  focus?: { id: string; nonce: number } | null;
  /** true while a modal (editor) sits on top: keyboard shortcuts must not reach the book */
  paused?: boolean;
}

export const BookLibrary: React.FC<BookLibraryProps> = ({
  tome,
  articles,
  intro,
  getReturnRect,
  onLeaving,
  onClosed,
  onEdit,
  onCreate,
  focus,
  paused = false
}) => {
  const animatedIntro = useRef(Boolean(intro) && !isNarrowNow() && !prefersReduced()).current;
  const [narrow, setNarrow] = useState(isNarrowNow);
  const [stage, setStage] = useState<Stage>(animatedIntro ? 'fly' : 'open');
  const [bookStyle, setBookStyle] = useState<React.CSSProperties>(animatedIntro ? { opacity: 0 } : {});
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [mobileDir, setMobileDir] = useState<TurnDir>('next');
  const [size, setSize] = useState({ W: 0, H: 0 });
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [slider, setSlider] = useState<number | null>(null);

  const bookRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<Flip | null>(null);
  const stageRef = useRef<Stage>(stage);
  const rafRef = useRef(0);
  const indexRef = useRef(0);
  const timers = useRef<number[]>([]);
  const frames = useRef<number[]>([]);
  const focusNonce = useRef<number | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const suppressClick = useRef(false);
  const dragRef = useRef<{ startX: number; startY: number; dir: TurnDir; cy: number; axis?: 'x' | 'y'; active: boolean } | null>(null);

  stageRef.current = stage;
  indexRef.current = index;
  const len = articles.length;
  const safeIndex = len ? Math.min(index, len - 1) : 0;
  const current = articles[safeIndex] ?? null;

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const nextFrame = useCallback((fn: () => void) => {
    const a = requestAnimationFrame(() => frames.current.push(requestAnimationFrame(fn)));
    frames.current.push(a);
  }, []);
  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      frames.current.forEach(cancelAnimationFrame);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const setFlipBoth = useCallback((next: Flip | null) => {
    flipRef.current = next;
    setFlip(next);
  }, []);

  /* ───────── layout ───────── */
  useEffect(() => {
    const onResize = () => setNarrow(isNarrowNow());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useLayoutEffect(() => {
    const el = spreadRef.current;
    if (!el) return;
    const measure = () => setSize({ W: el.clientWidth / (narrow ? 1 : 2), H: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [narrow]);

  /* ───────── the book leaves the shelf and opens ───────── */
  useLayoutEffect(() => {
    if (!animatedIntro || !intro || !bookRef.current) return;
    const t = flightTransforms(intro, bookRef.current.getBoundingClientRect());
    setBookStyle({ transform: t.away, transformOrigin: '0 0', transition: 'none' });
    nextFrame(() =>
      setBookStyle({ transform: t.home, transformOrigin: '0 0', transition: `transform ${FLY_MS}ms cubic-bezier(.2,.72,.16,1)` })
    );
    later(FLY_MS + 40, () => {
      setBookStyle({});
      setStage('opening');
    });
    later(FLY_MS + 40 + OPEN_MS + 60, () => setStage('open'));
    // runs once per mount by design
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (stageRef.current !== 'open') return;
    setSearchOpen(false);
    if (narrow || prefersReduced()) {
      onLeaving();
      onClosed();
      return;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setFlipBoth(null);
    setStage('closing-prep');
    nextFrame(() => setStage('closing'));
    later(CLOSE_MS + 60, () => {
      const el = bookRef.current;
      const back = getReturnRect();
      if (!el || !back) {
        onLeaving();
        onClosed();
        return;
      }
      const t = flightTransforms(back, el.getBoundingClientRect());
      setStage('leaving');
      onLeaving();
      setBookStyle({ transform: t.home, transformOrigin: '0 0', transition: 'none' });
      nextFrame(() =>
        setBookStyle({ transform: t.away, transformOrigin: '0 0', transition: `transform ${LEAVE_MS}ms cubic-bezier(.5,.02,.42,1)` })
      );
      later(LEAVE_MS + 30, onClosed);
    });
  }, [getReturnRect, later, narrow, nextFrame, onClosed, onLeaving, setFlipBoth]);

  /* ───────── page turning ───────── */
  const { W, H } = size;
  const signOf = (dir: TurnDir): Sign => (dir === 'next' ? 1 : -1);

  const animate = useCallback(
    (update: (t: number) => Vec, duration: number, done: () => void) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const tick = (now: number) => {
        const cur = flipRef.current;
        if (!cur) return;
        const t = Math.min(1, (now - start) / duration);
        setFlipBoth({ ...cur, P: update(t) });
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
        else done();
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [setFlipBoth]
  );

  const complete = useCallback(() => {
    const cur = flipRef.current;
    if (cur) setIndex(cur.to);
    setFlipBoth(null);
  }, [setFlipBoth]);
  const cancel = useCallback(() => setFlipBoth(null), [setFlipBoth]);

  const begin = useCallback(
    (dir: TurnDir, to: number, cy = H) => {
      const from = indexRef.current;
      if (stageRef.current !== 'open' || to < 0 || to >= len || to === from) return;
      if (narrow) {
        setMobileDir(dir);
        setIndex(to);
        return;
      }
      if (flipRef.current || W <= 0) return;
      const sign = signOf(dir);
      setFlipBoth({ dir, from, to, cy, P: cornerOnPath(W, H, sign, cy, 0) });
      animate((t) => cornerOnPath(W, H, sign, cy, easeInOut(t)), 880, complete);
    },
    [H, W, animate, complete, len, narrow, setFlipBoth]
  );

  const goto = useCallback((dir: TurnDir) => begin(dir, indexRef.current + (dir === 'next' ? 1 : -1)), [begin]);
  const jump = useCallback(
    (to: number) => {
      if (to === indexRef.current) return;
      begin(to > indexRef.current ? 'next' : 'prev', to);
    },
    [begin]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        else if (tag !== 'INPUT' && tag !== 'TEXTAREA') close();
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') goto('next');
      if (e.key === 'ArrowLeft') goto('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, goto, searchOpen]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (!drag.axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (drag.axis === 'y') {
          dragRef.current = null;
          return;
        }
      }
      e.preventDefault();
      drag.active = true;
      const sign = signOf(drag.dir);
      const P = constrainCorner({ x: sign * W + dx, y: drag.cy + dy }, W, H, drag.cy);
      const from = indexRef.current;
      if (!flipRef.current) {
        const to = from + (drag.dir === 'next' ? 1 : -1);
        if (to < 0 || to >= len) return;
        setFlipBoth({ dir: drag.dir, from, to, cy: drag.cy, P });
      } else if (flipRef.current.dir === drag.dir) {
        setFlipBoth({ ...flipRef.current, P });
      }
    };
    const end = () => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag?.active) return;
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 60);
      const cur = flipRef.current;
      if (!cur) return;
      const sign = signOf(cur.dir);
      const travelled = (sign * (sign * W - cur.P.x)) / (2 * W);
      const P0 = cur.P;
      if (travelled > 0.3) {
        const T: Vec = { x: -sign * W, y: cur.cy };
        animate(
          (t) => {
            const u = easeOut(t);
            const p = lerp(P0, T, u);
            const lift = Math.sin(Math.PI * u) * Math.min(H * 0.18, 90) * (cur.cy === 0 ? 1 : -1);
            return constrainCorner({ x: p.x, y: p.y + lift * (1 - travelled) }, W, H, cur.cy);
          },
          320 + 520 * (1 - travelled),
          complete
        );
      } else {
        const C: Vec = { x: sign * W, y: cur.cy };
        animate((t) => lerp(P0, C, easeOut(t)), 360, cancel);
      }
    };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [H, W, animate, cancel, complete, len, setFlipBoth]);

  const startDrag = (dir: TurnDir) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (narrow || stageRef.current !== 'open' || flipRef.current || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;
    const to = index + (dir === 'next' ? 1 : -1);
    if (to < 0 || to >= len) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { startX: e.clientX, startY: e.clientY, dir, cy: e.clientY - rect.top < rect.height / 2 ? 0 : H, active: false };
  };

  const onPageClick = (dir: TurnDir) => (e: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current || dragRef.current?.active || flipRef.current) return;
    if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cy = e.clientY - rect.top < rect.height / 2 ? 0 : H;
    if (dir === 'next' && x > rect.width * 0.72) begin('next', index + 1, cy);
    if (dir === 'prev' && x < rect.width * 0.28) begin('prev', index - 1, cy);
  };

  /* ───────── data-driven helpers ───────── */
  useEffect(() => {
    if (len && index > len - 1) setIndex(len - 1);
  }, [index, len]);

  useEffect(() => {
    if (!focus || focus.nonce === focusNonce.current) return;
    const i = articles.findIndex((a) => a.id === focus.id);
    if (i >= 0) {
      focusNonce.current = focus.nonce;
      setFlipBoth(null);
      setIndex(i);
    }
  }, [articles, focus, setFlipBoth]);

  // Plates for the visible and neighbouring spreads are drawn right away, the rest of the tome in idle time.
  useEffect(() => {
    const near = [safeIndex, safeIndex + 1, safeIndex - 1, safeIndex + 2, safeIndex - 2]
      .map((i) => articles[i])
      .filter((a): a is Article => Boolean(a))
      .map(plateKeyOf);
    warmPlates(near, 'now');
  }, [articles, safeIndex]);
  useEffect(() => {
    if (stage === 'open') warmPlates(articles.map(plateKeyOf), 'idle');
  }, [articles, stage]);

  const toc: TocItem[] = useMemo(() => articles.map((a, i) => ({ id: a.id, title: a.title, chapter: a.chapter, index: i })), [articles]);

  const chapters = useMemo(() => {
    const list: { name: string; first: number }[] = [];
    articles.forEach((a, i) => {
      if (!list.some((c) => c.name === a.chapter)) list.push({ name: a.chapter, first: i });
    });
    return list;
  }, [articles]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: { i: number; a: Article; score: number; snippet: string }[] = [];
    articles.forEach((a, i) => {
      const fields = [
        a.subtitle,
        a.badge,
        a.epigraph,
        ...a.stats.map((s) => `${s.label}: ${s.value}`),
        a.lead.heading,
        ...a.lead.paragraphs,
        ...a.lead.insights,
        a.practice.heading,
        ...a.practice.steps.map((s) => `${s.title} — ${s.text}`),
        a.practice.verdict.text
      ];
      let score = a.title.toLowerCase().includes(q) ? 20 : 0;
      let snippet = '';
      for (const f of fields) {
        const at = f.toLowerCase().indexOf(q);
        if (at >= 0) {
          score += 1;
          if (!snippet) snippet = excerpt(f, at, q.length);
        }
      }
      if (score) out.push({ i, a, score, snippet: snippet || a.subtitle });
    });
    return out.sort((x, y) => y.score - x.score).slice(0, 12);
  }, [articles, query]);

  /* ───────── render ───────── */
  const open = stage === 'open';
  const closedLook = !open;
  const showCover = !narrow && stage !== 'open';
  const coverAngle = stage === 'opening' || stage === 'closing-prep' ? -180 : 0;
  const coverTransition =
    stage === 'opening'
      ? `transform ${OPEN_MS}ms cubic-bezier(.42,.02,.18,1)`
      : stage === 'closing'
        ? `transform ${CLOSE_MS}ms cubic-bezier(.42,.02,.18,1)`
        : 'none';
  const shadowWide = stage === 'open' || stage === 'opening' || stage === 'closing-prep';

  const active = len ? flip : null;
  const turning = Boolean(active) && !narrow && W > 0;
  const spreadIndex = active ? active.to : safeIndex;
  const progress = active && W > 0 ? Math.max(0, Math.min(1, (signOf(active.dir) * (signOf(active.dir) * W - active.P.x)) / (2 * W))) : 0;
  const settle = progress < 0.72 ? 0 : easeInOut((progress - 0.72) / 0.28);

  const leftFace = (i: number) => (articles[i] ? <LeftPageFace article={articles[i]} leaf={i + 1} total={len} query={query} tomeTitle={tome.spine} /> : null);
  const rightFace = (i: number) =>
    articles[i] ? <RightPageFace article={articles[i]} leaf={i + 1} query={query} toc={toc} current={safeIndex} onJump={jump} /> : null;

  const gutterL = <div className="pointer-events-none absolute inset-y-0 right-0 w-16 gutter-shade-l" />;
  const gutterR = <div className="pointer-events-none absolute inset-y-0 left-0 w-16 gutter-shade-r" />;
  const currentChapter = current?.chapter ?? '';
  const sliderValue = slider ?? safeIndex;

  return (
    <div className="reader">
      {/* top chrome */}
      <div className="reader-chrome" style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}>
        <button type="button" onClick={close} className="chrome-btn">
          <ArrowLeft className="w-4 h-4" />
          <span>В зал</span>
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="font-fantasy text-amber-100 text-[17px] font-bold leading-tight truncate">{tome.title}</h2>
          <p className="text-[11.5px] text-amber-200/50 truncate">
            {tome.subtitle} · {len} {plural(len, 'разворот', 'разворота', 'разворотов')}
          </p>
        </div>

        <div className="relative w-full sm:w-72 order-last sm:order-none">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-300/60" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) {
                jump(results[0].i);
                setSearchOpen(false);
              }
            }}
            placeholder="Найти в томе…"
            className="chrome-input"
          />
          {query && (
            <button
              type="button"
              aria-label="Очистить поиск"
              onClick={() => {
                setQuery('');
                setSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-300/60 hover:text-amber-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {searchOpen && query.trim().length >= 2 && (
            <div className="search-panel">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-[12.5px] text-[#6b4a24] font-book italic">В этом томе нет страниц с «{query}».</p>
              ) : (
                results.map((r) => (
                  <button
                    key={r.a.id}
                    type="button"
                    className="search-row"
                    onClick={() => {
                      jump(r.i);
                      setSearchOpen(false);
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#8b6a3f] font-bold">
                      {r.a.chapter} · стр. {r.i * 2 + 1}
                    </span>
                    <span className="font-fantasy text-[13.5px] text-[#2a170b] font-bold">{r.a.title}</span>
                    <span className="font-book text-[12.5px] text-[#4a3520] line-clamp-2">{r.snippet}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {current && (
          <button type="button" className="chrome-btn" onClick={() => onEdit(current)} title="Править эту статью">
            <PenLine className="w-4 h-4" />
            <span className="hidden md:inline">Править</span>
          </button>
        )}
        <button type="button" className="chrome-btn" onClick={() => onCreate(current)} title="Добавить статью после этой">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Статья</span>
        </button>
      </div>

      {narrow && chapters.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
          {chapters.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setIndex(c.first)}
              className={`chapter-chip ${c.name === currentChapter ? 'is-active' : ''}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* the book — one object from shelf to table */}
      <div className="book-stage">
        <div ref={bookRef} className="book" style={bookStyle}>
          <div
            className="book-shadow"
            style={{
              left: narrow || shadowWide ? 0 : '50%',
              transition: stage === 'opening' ? `left ${OPEN_MS}ms ease` : stage === 'closing' ? `left ${CLOSE_MS}ms ease` : 'none'
            }}
          />

          <div
            className="book-body"
            style={{
              ...leatherStyle(tome),
              padding: narrow ? 10 : PAD,
              clipPath: closedLook && !narrow ? 'inset(0 0 0 50% round 0 16px 16px 0)' : undefined
            }}
          >
            {!narrow && <Tooling side="full" />}
            {!narrow && (
              <>
                <Corner pos="tl" />
                <Corner pos="tr" />
                <Corner pos="bl" />
                <Corner pos="br" />
                <div className="folio-edge folio-edge-right absolute top-[22px] bottom-[16px] right-[5px] w-[10px]" />
                <div className="folio-edge folio-edge-left absolute top-[22px] bottom-[16px] left-[5px] w-[10px]" />
                <div className="folio-edge folio-edge-bottom absolute left-[28px] right-[28px] bottom-[5px] h-[9px]" />
                <div className="headband" />
                <div className="headband is-bottom" />
              </>
            )}

            <div
              ref={spreadRef}
              className={`spread ${narrow ? (mobileDir === 'next' ? 'anim-spread-next' : 'anim-spread-prev') : ''}`}
              key={narrow ? `spread-${safeIndex}` : 'spread'}
              style={{
                height: narrow ? 'auto' : 'clamp(600px, 74vh, 740px)',
                gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'repeat(2, minmax(0,1fr))'
              }}
            >
              {len === 0 ? (
                <div className="col-span-full parchment grid place-items-center p-10">
                  <p className="font-book italic text-[#6b4a24] text-center">В этом томе пока нет страниц. Добавьте первую статью.</p>
                </div>
              ) : (
                <>
                  <div
                    className="relative min-h-0 min-w-0 overflow-hidden"
                    onPointerDown={startDrag('prev')}
                    onClick={onPageClick('prev')}
                    style={{ touchAction: 'pan-y', cursor: safeIndex > 0 && !narrow ? 'w-resize' : 'default' }}
                  >
                    {leftFace(spreadIndex)}
                    {active?.dir === 'next' && settle < 1 && (
                      <div className="absolute inset-0" style={{ opacity: 1 - settle }}>
                        {leftFace(active.from)}
                      </div>
                    )}
                    {!narrow && gutterL}
                  </div>

                  <div
                    className="relative min-h-0 min-w-0 overflow-hidden"
                    onPointerDown={startDrag('next')}
                    onClick={onPageClick('next')}
                    style={{ touchAction: 'pan-y', cursor: safeIndex < len - 1 && !narrow ? 'e-resize' : 'default' }}
                  >
                    {rightFace(spreadIndex)}
                    {active?.dir === 'prev' && settle < 1 && (
                      <div className="absolute inset-0" style={{ opacity: 1 - settle }}>
                        {rightFace(active.from)}
                      </div>
                    )}
                    {!narrow && gutterR}
                    {stage === 'opening' && <div className="cover-cast" style={{ animationDuration: `${OPEN_MS}ms` }} />}
                    {stage === 'closing' && <div className="cover-cast is-closing" style={{ animationDuration: `${CLOSE_MS}ms` }} />}
                  </div>

                  {turning && active && (
                    <FoldSpread
                      W={W}
                      H={H}
                      sign={signOf(active.dir)}
                      cy={active.cy}
                      P={active.P}
                      front={
                        <div className="relative h-full">
                          {active.dir === 'next' ? rightFace(active.from) : leftFace(active.from)}
                          {active.dir === 'next' ? gutterR : gutterL}
                        </div>
                      }
                      back={
                        <div className="relative h-full">
                          {active.dir === 'next' ? leftFace(active.to) : rightFace(active.to)}
                          {active.dir === 'next' ? gutterL : gutterR}
                        </div>
                      }
                    />
                  )}
                  {!narrow && <div className="spine-crease" />}
                </>
              )}
            </div>
          </div>

          {/* front board, hinged at the spine; its inside carries the first left page */}
          {showCover && current && (
            <div
              className="absolute top-0 bottom-0 z-40"
              style={{
                left: '50%',
                width: '50%',
                transformOrigin: '0% 50%',
                transformStyle: 'preserve-3d',
                transform: `perspective(2600px) rotateY(${coverAngle}deg)`,
                transition: coverTransition
              }}
            >
              <div className="absolute inset-0 backface-hidden overflow-hidden" style={{ borderRadius: '0 16px 16px 0', boxShadow: '0 0 0 1px rgba(0,0,0,.5)' }}>
                <CoverArt tome={tome} />
              </div>
              <div
                className="absolute inset-0 backface-hidden overflow-hidden"
                style={{ transform: 'rotateY(180deg)', borderRadius: '16px 0 0 16px', ...leatherStyle(tome), padding: `${PAD}px 0 ${PAD}px ${PAD}px` }}
              >
                <Tooling side="left" />
                <Corner pos="tl" />
                <Corner pos="bl" />
                <div className="folio-edge folio-edge-left absolute top-[22px] bottom-[16px] left-[5px] w-[10px]" />
                <div className="relative h-full overflow-hidden" style={{ borderRadius: '6px 0 0 6px' }}>
                  {leftFace(safeIndex)}
                  {gutterL}
                </div>
              </div>
            </div>
          )}

          {/* cloth bookmarks on the fore-edge, one per chapter */}
          {!narrow && chapters.length > 1 && (
            <div
              className={`bookmarks ${animatedIntro && stage !== 'leaving' ? 'bookmarks-in' : ''}`}
              style={{ opacity: stage === 'leaving' ? 0 : undefined }}
            >
              {chapters.map((c, i) => {
                const isOn = c.name === currentChapter;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => jump(c.first)}
                    className={`bookmark ${isOn ? 'is-active' : ''}`}
                    style={{ background: TAB_COLORS[i % TAB_COLORS.length] }}
                    title={c.name}
                    disabled={!open}
                  >
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* bottom chrome */}
      {len > 0 && (
        <div className="reader-footer" style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}>
          <button type="button" onClick={() => goto('prev')} disabled={safeIndex === 0 || Boolean(flip)} className="nav-btn" aria-label="Предыдущий разворот">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3 text-[11.5px]">
              <span className="text-amber-200/70 truncate font-fantasy tracking-wide">
                {slider !== null ? articles[sliderValue]?.title : currentChapter}
              </span>
              <span className="text-amber-300/80 font-mono tabular-nums whitespace-nowrap">
                лист {sliderValue + 1} из {len}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(0, len - 1)}
              value={sliderValue}
              onChange={(e) => setSlider(Number(e.target.value))}
              onPointerUp={() => {
                if (slider !== null) jump(slider);
                setSlider(null);
              }}
              onKeyUp={() => {
                if (slider !== null) jump(slider);
                setSlider(null);
              }}
              className="ribbon-range"
              aria-label="Перейти к листу"
            />
          </div>
          <button type="button" onClick={() => goto('next')} disabled={safeIndex >= len - 1 || Boolean(flip)} className="nav-btn" aria-label="Следующий разворот">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BookLibrary;
