import React, { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { AlertTriangle, Dices, RotateCcw, Sparkles } from 'lucide-react';
import { DiceScene, type FaceRead, type ThrowSpec } from './dice/DiceScene';
import { ensureRapier } from './dice/ensureRapier';
import { randomQuaternion } from './dice/readFace';
import type { DieKind } from './dice/geometry';

type Mode = 'normal' | 'advantage' | 'disadvantage';

interface HistoryItem {
  title: string;
  faces: string[];
  kept: string;
  modifier: number;
  total: number;
  crit: boolean;
  fumble: boolean;
  time: string;
}

const DICE: { id: string; kind: DieKind; sides: number; label: string }[] = [
  { id: 'd4', kind: 'd4', sides: 4, label: 'к4' },
  { id: 'd6', kind: 'd6', sides: 6, label: 'к6' },
  { id: 'd8', kind: 'd8', sides: 8, label: 'к8' },
  { id: 'd10', kind: 'd10', sides: 10, label: 'к10' },
  { id: 'd12', kind: 'd12', sides: 12, label: 'к12' },
  { id: 'd20', kind: 'd20', sides: 20, label: 'к20' },
  { id: 'd100', kind: 'd10tens', sides: 100, label: 'к100' }
];

function makeSpec(kind: DieKind, index: number, count: number): ThrowSpec {
  const q = randomQuaternion();
  const spread = (index - (count - 1) / 2) * 1.15;
  return {
    id: `${kind}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    position: {
      x: spread + (Math.random() - 0.5) * 0.2,
      y: 2.35 + Math.random() * 0.55 + index * 0.12,
      z: (Math.random() - 0.5) * 0.35
    },
    rotation: q,
    linvel: {
      x: (Math.random() - 0.5) * 2.6,
      y: 1.1 + Math.random() * 1.7,
      z: -0.6 - Math.random() * 1.5
    },
    angvel: {
      x: (Math.random() - 0.5) * 26,
      y: (Math.random() - 0.5) * 26,
      z: (Math.random() - 0.5) * 26
    }
  };
}

class TrayErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="h-full grid place-items-center text-sm text-amber-200/80 px-6 text-center">
          WebGL недоступен в этом браузере — физический стол не запустился.
        </div>
      );
    }
    return this.props.children;
  }
}

export const DiceRoller: React.FC = () => {
  const [modifier, setModifier] = useState(0);
  const [mode, setMode] = useState<Mode>('normal');
  const [dice, setDice] = useState<ThrowSpec[]>([]);
  const [reads, setReads] = useState<Record<string, FaceRead>>({});
  const [rolling, setRolling] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [banner, setBanner] = useState<HistoryItem | null>(null);
  const expected = useRef(0);
  const specsRef = useRef<ThrowSpec[]>([]);
  const modeRef = useRef(mode);
  const finishedRef = useRef(false);
  const readyRef = useRef(false);
  modeRef.current = mode;

  React.useEffect(() => {
    let cancelled = false;
    ensureRapier()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    const t = window.setTimeout(() => {
      if (!readyRef.current) setFailed(true);
    }, 14000);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  const onReady = useCallback(() => {
    readyRef.current = true;
    setReady(true);
    setFailed(false);
  }, []);

  const finish = useCallback(
    (specs: ThrowSpec[], settled: Record<string, FaceRead>, rollMode: Mode) => {
      const faces = specs.map((s) => settled[s.id]).filter(Boolean);
      if (faces.length !== specs.length) return;

      const isD20 = specs.every((s) => s.kind === 'd20');
      const isPercentile = specs.some((s) => s.kind === 'd10tens');
      let keptValue = 0;
      let keptLabel = '';
      let keptId = specs[0].id;
      let title = 'Бросок';

      if (isPercentile) {
        const tens = specs.find((s) => s.kind === 'd10tens');
        const ones = specs.find((s) => s.kind === 'd10ones');
        const t = tens ? settled[tens.id].value : 0;
        const o = ones ? settled[ones.id].value : 0;
        keptValue = t + o === 0 ? 100 : t + o;
        keptLabel = String(keptValue).padStart(t + o === 0 ? 3 : 2, '0');
        title = 'к100';
      } else if (isD20 && specs.length === 2 && rollMode !== 'normal') {
        const a = settled[specs[0].id];
        const b = settled[specs[1].id];
        const pickA = rollMode === 'advantage' ? a.value >= b.value : a.value <= b.value;
        const kept = pickA ? a : b;
        keptValue = kept.value;
        keptLabel = kept.label;
        keptId = pickA ? specs[0].id : specs[1].id;
        title = rollMode === 'advantage' ? 'к20 с преимуществом' : 'к20 с помехой';
      } else {
        keptValue = faces.reduce((sum, f) => sum + f.value, 0);
        keptLabel = faces.map((f) => f.label).join(' + ');
        title = specs.length === 1 ? specs[0].kind.replace('d', 'к') : 'сумма';
        if (specs[0]?.kind === 'd10' && keptValue === 10) keptLabel = '10';
      }

      const mod = modifier;
      const total = keptValue + mod;
      const crit = isD20 && keptValue === 20;
      const fumble = isD20 && keptValue === 1;
      if (crit) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#f59e0b', '#ef4444', '#fde68a', '#10b981']
        });
      }
      const item: HistoryItem = {
        title,
        faces: faces.map((f) => f.label),
        kept: keptLabel,
        modifier: mod,
        total,
        crit,
        fumble,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setHighlightId(keptId);
      setBanner(item);
      setHistory((prev) => [item, ...prev].slice(0, 8));
      setRolling(false);
    },
    [modifier]
  );

  const onSettled = useCallback(
    (id: string, face: FaceRead) => {
      setReads((prev) => {
        if (prev[id]) return prev;
        const next = { ...prev, [id]: face };
        if (!finishedRef.current && Object.keys(next).length >= expected.current && expected.current > 0) {
          finishedRef.current = true;
          const specs = specsRef.current;
          const rollMode = modeRef.current;
          queueMicrotask(() => finish(specs, next, rollMode));
        }
        return next;
      });
    },
    [finish]
  );

  const throwDice = (entry: (typeof DICE)[number]) => {
    if (rolling) return;
    const specs: ThrowSpec[] =
      entry.id === 'd100'
        ? [makeSpec('d10tens', 0, 2), makeSpec('d10ones', 1, 2)]
        : entry.id === 'd20' && mode !== 'normal'
          ? [makeSpec('d20', 0, 2), makeSpec('d20', 1, 2)]
          : [makeSpec(entry.kind, 0, 1)];
    expected.current = specs.length;
    specsRef.current = specs;
    finishedRef.current = false;
    setReads({});
    setBanner(null);
    setHighlightId(null);
    setRolling(true);
    setDice(specs);
  };

  const clear = () => {
    expected.current = 0;
    setDice([]);
    setReads({});
    setBanner(null);
    setHighlightId(null);
    setRolling(false);
  };

  const confidence = useMemo(() => {
    const vals = Object.values(reads);
    if (!vals.length) return null;
    return Math.min(...vals.map((v) => v.confidence));
  }, [reads]);

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-16 -right-10 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Dices className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-100 font-fantasy">Физический стол костей</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Кость не «докручивается» до заранее выбранного числа. Rapier бросает её с импульсом, а выпавшее значение — грань, чья нормаль ближе всего к направлению вверх.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          {(
            [
              ['advantage', 'Преимущество'],
              ['normal', 'Обычный'],
              ['disadvantage', 'Помеха']
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === id
                  ? id === 'advantage'
                    ? 'bg-emerald-600 text-white'
                    : id === 'disadvantage'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-600 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_240px] gap-4">
        <div className="relative rounded-2xl overflow-hidden border border-amber-900/40 bg-[#140e0a] min-h-[420px] h-[460px] sm:h-[520px] shadow-inner">
          <TrayErrorBoundary>
            {ready && (
              <Suspense fallback={null}>
                <DiceScene dice={dice} highlightId={highlightId} onSettled={onSettled} onReady={onReady} />
              </Suspense>
            )}
          </TrayErrorBoundary>

          {!ready && !failed && (
            <div className="absolute inset-0 grid place-items-center bg-[#140e0a]/80 text-amber-200/80 text-sm">
              Разогреваем физику стола…
            </div>
          )}
          {failed && !ready && (
            <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-amber-200/80">
              Не удалось загрузить физический движок. Обновите страницу.
            </div>
          )}

          {banner && (
            <div
              className={`absolute left-3 bottom-3 right-3 sm:right-auto sm:min-w-[280px] rounded-xl border px-4 py-3 backdrop-blur-md result-pop ${
                banner.crit
                  ? 'bg-amber-950/80 border-amber-400'
                  : banner.fumble
                    ? 'bg-red-950/80 border-red-500'
                    : 'bg-slate-950/80 border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-xl grid place-items-center font-fantasy text-2xl font-black ${
                    banner.crit
                      ? 'bg-amber-400 text-slate-950'
                      : banner.fumble
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-amber-300'
                  }`}
                >
                  {banner.total}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-slate-400">{banner.title}</span>
                    {banner.crit && (
                      <span className="text-[10px] font-bold uppercase bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> нат 20
                      </span>
                    )}
                    {banner.fumble && (
                      <span className="text-[10px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> нат 1
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-200 mt-0.5">
                    грани [{banner.faces.join(', ')}] → <strong>{banner.kept}</strong>
                    {banner.modifier !== 0 && (
                      <span className="text-slate-400">
                        {' '}
                        {banner.modifier > 0 ? '+' : ''}
                        {banner.modifier}
                      </span>
                    )}
                  </p>
                  {confidence != null && (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      верхняя грань · вверх = {confidence.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {rolling && (
            <div className="absolute top-3 left-3 text-[11px] uppercase tracking-widest text-amber-200/80 bg-black/40 px-2 py-1 rounded-full">
              кости ещё катятся
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Модификатор</span>
              <span className="text-amber-300 font-bold text-sm">{modifier >= 0 ? `+${modifier}` : modifier}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModifier((m) => m - 1)}
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-lg font-bold"
              >
                −
              </button>
              <input
                type="range"
                min={-5}
                max={15}
                value={modifier}
                onChange={(e) => setModifier(parseInt(e.target.value, 10) || 0)}
                className="flex-1 accent-amber-500"
              />
              <button
                onClick={() => setModifier((m) => m + 1)}
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 xl:grid-cols-2 gap-2">
            {DICE.map((die) => (
              <button
                key={die.id}
                disabled={rolling || !ready}
                onClick={() => throwDice(die)}
                className="rounded-xl border border-amber-700/30 bg-gradient-to-b from-amber-900/40 to-slate-950 py-2.5 text-amber-100 font-fantasy font-bold disabled:opacity-40 hover:-translate-y-0.5 transition-transform"
              >
                <span className="block text-[10px] uppercase tracking-wider text-amber-400/70 font-sans font-semibold">бросить</span>
                {die.label}
              </button>
            ))}
            <button
              onClick={clear}
              className="rounded-xl border border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Очистить
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Преимущество и помеха бросают два к20 и оставляют большую или меньшую грань. Стол можно повернуть мышью, чтобы проверить число.
          </p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
          {history.map((h, i) => (
            <div
              key={`${h.time}-${i}`}
              className={`text-xs px-2.5 py-1 rounded-lg border ${
                h.crit
                  ? 'border-amber-500/50 text-amber-200 bg-amber-950/40'
                  : h.fumble
                    ? 'border-red-500/50 text-red-200 bg-red-950/40'
                    : 'border-slate-800 text-slate-400 bg-slate-950/60'
              }`}
            >
              <span className="text-slate-500">{h.title}</span>{' '}
              <span className="font-bold text-slate-100">{h.total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
