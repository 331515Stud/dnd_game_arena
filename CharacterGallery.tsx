"use client";

import { ArrowLeftRight, Flame, ScrollText } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-amber-500/20 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-fantasy text-sm font-bold text-amber-300">
            <Flame className="h-4 w-4" /> D&D Game Arena
          </Link>
          <nav className="flex items-center gap-3 text-xs font-bold">
            <Link href="/" className="text-slate-400 hover:text-white">
              Путеводитель
            </Link>
            <Link href="/characters" className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-100">
              <ScrollText className="h-3.5 w-3.5" /> Листы
            </Link>
            <Link href="/characters/transfer" className="hidden items-center gap-1 text-slate-400 hover:text-white sm:inline-flex">
              <ArrowLeftRight className="h-3.5 w-3.5" /> Мост LSS
            </Link>
            <Link href="/characters/new" className="rounded-lg bg-amber-500 px-3 py-1.5 text-slate-950">
              Новый герой
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
