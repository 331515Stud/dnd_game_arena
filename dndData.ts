"use client";

import type { PublicCharacter } from "@/lib/serializeCharacter";
import { ArrowLeftRight, Plus, ScrollText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CharacterGallery({ initial }: { initial: PublicCharacter[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  async function remove(id: string, name: string) {
    if (!window.confirm(`Удалить «${name}»?`)) return;
    await fetch(`/api/characters/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
            <ScrollText className="h-3.5 w-3.5" /> Архив героев
          </p>
          <h1 className="font-fantasy text-3xl font-black text-white sm:text-4xl">Листы персонажей</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Создайте героя по правилам 5e: раса, класс, характеристики, навыки и заклинания. Лист хранится в базе арены и открывается для игры за столом.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/characters/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" /> Новый лист
          </Link>
          <Link
            href="/characters/transfer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 px-4 py-2.5 text-sm font-bold text-amber-200"
          >
            <ArrowLeftRight className="h-4 w-4" /> Мост LSS
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-500/30 bg-slate-900/60 p-12 text-center">
          <p className="font-fantasy text-xl text-amber-100">Архив пуст</p>
          <p className="mt-2 text-sm text-slate-400">Соберите первого героя — или откройте готовые примеры после обновления страницы.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/characters/new" className="inline-flex rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950">
                  Создать персонажа
                </Link>
                <Link href="/characters/transfer" className="inline-flex rounded-xl border border-amber-500/40 px-4 py-2 text-sm font-bold text-amber-200">
                  Импортировать из LSS
                </Link>
              </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((hero) => (
            <article key={hero.id} className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition hover:border-amber-500/40">
              <div className="relative h-44 overflow-hidden bg-slate-950">
                {hero.sheet.portraitUrl ? (
                  <img src={hero.sheet.portraitUrl} alt={hero.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center font-fantasy text-5xl text-amber-500/40">{hero.name.slice(0, 1)}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-black text-slate-950">
                  {hero.className} · {hero.level} ур.
                </span>
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <h2 className="font-fantasy text-xl text-white">{hero.name}</h2>
                  <p className="text-sm text-amber-200/80">
                    {hero.race}
                    {hero.subrace ? ` (${hero.subrace})` : ""} · {hero.background}
                  </p>
                </div>
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
                  {hero.sheet.identity || hero.sheet.backstory || "Концепция ещё не записана — откройте лист и допишите историю."}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/characters/${hero.id}`}
                    className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-amber-200 hover:bg-amber-500 hover:text-slate-950"
                  >
                    Открыть лист
                  </Link>
                  <button
                    type="button"
                    onClick={() => void remove(hero.id, hero.name)}
                    className="rounded-xl p-2 text-slate-500 hover:text-rose-400"
                    aria-label="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
