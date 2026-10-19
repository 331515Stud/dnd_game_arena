"use client";

import { cn } from "@/lib/cn";
import { signed } from "@/lib/character";
import { Dices, RotateCcw } from "lucide-react";
import { useState } from "react";

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;

type Roll = {
  id: number;
  sides: number;
  natural: number;
  modifier: number;
  total: number;
  mode: "normal" | "adv" | "dis";
  extra?: number;
};

function rollDie(sides: number) {
  return 1 + Math.floor(Math.random() * sides);
}

function createRoll(sides: number, mode: "normal" | "adv" | "dis", modifier: number): Roll {
  const first = rollDie(sides);
  const second = rollDie(sides);
  let natural = first;
  if (sides === 20 && mode === "adv") natural = Math.max(first, second);
  if (sides === 20 && mode === "dis") natural = Math.min(first, second);
  const bonus = sides === 20 ? modifier : 0;
  return {
    id: Date.now() + first,
    sides,
    natural,
    modifier: bonus,
    total: natural + bonus,
    mode: sides === 20 ? mode : "normal",
    extra: sides === 20 && mode !== "normal" ? second : undefined,
  };
}

export function DiceRoller() {
  const [modifier, setModifier] = useState(0);
  const [mode, setMode] = useState<"normal" | "adv" | "dis">("normal");
  const [history, setHistory] = useState<Roll[]>([]);
  const [pulse, setPulse] = useState<number | null>(null);

  // All randomness lives in a module-level helper: the component itself stays pure,
  // so a double render (StrictMode) can never invent a second result for one click.
  function roll(sides: number) {
    const entry = createRoll(sides, mode, modifier);
    setHistory((prev) => [entry, ...prev].slice(0, 12));
    setPulse(entry.id);
  }

  const latest = history[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Dices className="h-6 w-6 text-amber-400" />
            <h3 className="font-fantasy text-xl font-bold text-amber-100">Кости стола</h3>
          </div>
          <p className="mt-1 text-sm text-slate-400">Бросайте прямо здесь, без физики вселенной — только честный к20.</p>
        </div>
        <button
          type="button"
          onClick={() => setHistory([])}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Очистить
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {DICE.map((sides) => (
          <button
            key={sides}
            type="button"
            onClick={() => roll(sides)}
            className="h-14 min-w-14 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-800 to-slate-950 px-3 font-fantasy text-lg font-black text-amber-200 shadow-inner transition hover:-translate-y-0.5 hover:border-amber-400"
          >
            к{sides}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="text-xs text-slate-400">
          Модификатор к20
          <input
            type="number"
            value={modifier}
            onChange={(event) => setModifier(Number(event.target.value) || 0)}
            className="ml-2 w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white"
          />
        </label>
        {(["normal", "adv", "dis"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              mode === item ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400",
            )}
          >
            {item === "normal" ? "Обычный" : item === "adv" ? "Преимущество" : "Помеха"}
          </button>
        ))}
      </div>

      {latest ? (
        <div className={cn("mb-5 rounded-2xl border border-amber-500/30 bg-slate-950 p-6 text-center", pulse === latest.id && "result-pop")}>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">к{latest.sides}</p>
          <p className="font-fantasy text-6xl text-amber-200">{latest.total}</p>
          <p className="text-sm text-slate-400">
            натура {latest.natural}
            {latest.extra ? ` / второй бросок ${latest.extra}` : ""}
            {latest.sides === 20 ? ` · итог ${latest.natural} ${signed(latest.modifier)}` : ""}
          </p>
          {latest.sides === 20 && latest.natural === 20 ? <p className="mt-2 text-sm font-bold text-emerald-400">Критический успех</p> : null}
          {latest.sides === 20 && latest.natural === 1 ? <p className="mt-2 text-sm font-bold text-rose-400">Критический провал</p> : null}
        </div>
      ) : (
        <div className="mb-5 rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
          Выберите кость — результат появится здесь.
        </div>
      )}

      <ul className="grid gap-2 sm:grid-cols-2">
        {history.slice(1).map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-xl bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
            <span>к{item.sides}</span>
            <span className="font-fantasy text-lg text-white">{item.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
