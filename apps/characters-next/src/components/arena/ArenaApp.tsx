"use client";

import { CampaignOnePagerBuilder } from "@/components/arena/CampaignOnePagerBuilder";
import { CharacterConceptBuilder } from "@/components/arena/CharacterConceptBuilder";
import { ChecklistsView } from "@/components/arena/ChecklistsView";
import { DiceRoller } from "@/components/arena/DiceRoller";
import { LazyDmChecklist } from "@/components/arena/LazyDmChecklist";
import { LibraryHall } from "@/components/arena/LibraryHall";
import { MetaSkillsView } from "@/components/arena/MetaSkillsView";
import { ResourcesView } from "@/components/arena/ResourcesView";
import { SessionPacingTimer } from "@/components/arena/SessionPacingTimer";
import { StageCard } from "@/components/arena/StageCard";
import { SynergyView } from "@/components/arena/SynergyView";
import { DM_META_SKILLS, DM_STAGES, PLAYER_META_SKILLS, PLAYER_STAGES } from "@/data/dndData";
import type { PublicCharacter } from "@/lib/serializeCharacter";
import {
  BookOpen,
  CheckSquare,
  ChevronRight,
  Crown,
  Dices,
  Flame,
  Layers,
  Quote,
  ScrollText,
  Search,
  Shield,
  Sparkles,
  Users2,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type TabType = "library" | "characters" | "player" | "dm" | "synergy" | "tools" | "checklists" | "resources";

export function ArenaApp({ characters }: { characters: PublicCharacter[] }) {
  const [activeTab, setActiveTab] = useState<TabType>("library");
  const [selectedStage, setSelectedStage] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickDice, setShowQuickDice] = useState(false);
  const [activeToolSubtab, setActiveToolSubtab] = useState<"roller" | "character" | "sheet" | "onepager" | "lazydm" | "timer">("sheet");

  const filteredPlayerStages = useMemo(() => {
    return PLAYER_STAGES.filter((stage) => {
      const matchStage = selectedStage === "all" || stage.stageNumber === selectedStage;
      if (!matchStage) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = stage.title.toLowerCase().includes(q) || stage.subtitle.toLowerCase().includes(q);
      const matchDesc = stage.description.toLowerCase().includes(q) || stage.mindset.toLowerCase().includes(q);
      const matchSections = stage.sections.some(
        (section) =>
          section.heading.toLowerCase().includes(q) ||
          (section.items && section.items.some((item) => item.toLowerCase().includes(q))) ||
          (section.warnings && section.warnings.some((item) => item.toLowerCase().includes(q))) ||
          (section.table && section.table.rows.some((row) => row.some((cell) => cell.toLowerCase().includes(q)))),
      );
      return matchTitle || matchDesc || matchSections;
    });
  }, [selectedStage, searchQuery]);

  const filteredDmStages = useMemo(() => {
    return DM_STAGES.filter((stage) => {
      const matchStage = selectedStage === "all" || stage.stageNumber === selectedStage;
      if (!matchStage) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = stage.title.toLowerCase().includes(q) || stage.subtitle.toLowerCase().includes(q);
      const matchDesc = stage.description.toLowerCase().includes(q) || stage.mindset.toLowerCase().includes(q);
      const matchSections = stage.sections.some(
        (section) =>
          section.heading.toLowerCase().includes(q) ||
          (section.items && section.items.some((item) => item.toLowerCase().includes(q))) ||
          (section.warnings && section.warnings.some((item) => item.toLowerCase().includes(q))) ||
          (section.table && section.table.rows.some((row) => row.some((cell) => cell.toLowerCase().includes(q)))),
      );
      return matchTitle || matchDesc || matchSections;
    });
  }, [selectedStage, searchQuery]);

  const stageTabs = [
    { id: "all" as const, label: "Все этапы" },
    { id: 0 as const, label: "Этап 0: Подготовка & S0" },
    { id: 1 as const, label: "Этап 1: 1–3 ур. (Tier 1)" },
    { id: 2 as const, label: "Этап 2: 4–10 ур. (Tier 2)" },
    { id: 3 as const, label: "Этап 3: 11–16 ур. (Tier 3)" },
    { id: 4 as const, label: "Этап 4: 17–20 ур. (Tier 4)" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <header className="relative overflow-hidden border-b border-amber-500/20">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center opacity-30 mix-blend-luminosity blur-[1px]"
          style={{ backgroundImage: "url('/images/dnd-hero-banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Flame className="h-3.5 w-3.5" /> Путеводитель по D&D · 5-я редакция
              </div>
              <h1 className="font-fantasy text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Полное руководство по игре в D&D:{" "}
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  от создания персонажа до финала кампании
                </span>
              </h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
                Два взгляда на стол: глазами <strong className="text-amber-400">Игрока</strong> и глазами{" "}
                <strong className="text-purple-400">Ведущего</strong>. Плюс живые листы персонажей, которые сохраняются в архиве арены.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowQuickDice((value) => !value)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-3 font-fantasy text-sm font-black text-slate-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-0.5"
            >
              <Dices className="h-5 w-5 animate-bounce" />
              <span>{showQuickDice ? "Скрыть кубики" : "Бросить к20"}</span>
            </button>
          </div>

          {showQuickDice ? (
            <div className="mt-8">
              <DiceRoller />
            </div>
          ) : null}

          <nav className="mt-8 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4 sm:gap-3">
            <TabButton active={activeTab === "library"} onClick={() => setActiveTab("library")} icon={<BookOpen className="h-4 w-4" />} label="Библиотека" tone="gold" />
            <TabButton active={activeTab === "characters"} onClick={() => setActiveTab("characters")} icon={<ScrollText className="h-4 w-4" />} label="Листы персонажей" tone="gold" />
            <TabButton active={activeTab === "player"} onClick={() => setActiveTab("player")} icon={<Shield className="h-4 w-4" />} label="Сторона Игрока" tone="amber" />
            <TabButton active={activeTab === "dm"} onClick={() => setActiveTab("dm")} icon={<Crown className="h-4 w-4" />} label="Сторона Мастера" tone="purple" />
            <TabButton active={activeTab === "synergy"} onClick={() => setActiveTab("synergy")} icon={<Users2 className="h-4 w-4" />} label="Синергия & Стол" tone="emerald" />
            <TabButton active={activeTab === "tools"} onClick={() => setActiveTab("tools")} icon={<Wrench className="h-4 w-4" />} label="Инструментарий" tone="blue" />
            <TabButton active={activeTab === "checklists"} onClick={() => setActiveTab("checklists")} icon={<CheckSquare className="h-4 w-4" />} label="Быстрый старт" tone="rose" />
            <TabButton active={activeTab === "resources"} onClick={() => setActiveTab("resources")} icon={<BookOpen className="h-4 w-4" />} label="Ресурсы" tone="amber" />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "library" && <LibraryHall />}

        {activeTab === "characters" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-fantasy text-2xl text-amber-100">Архив героев</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Полноценный лист 5e: раса, класс, покупка характеристик, навыки, заклинания и броски прямо с листа. Всё пишется в PostgreSQL.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/characters/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-black text-slate-950"
                >
                  Создать лист <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/characters/transfer"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 px-4 py-2.5 text-sm font-bold text-amber-200"
                >
                  Мост LSS <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {characters.map((hero) => (
                <Link
                  key={hero.id}
                  href={`/characters/${hero.id}`}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 hover:border-amber-500/40"
                >
                  <div className="h-40 bg-slate-950">
                    {hero.sheet.portraitUrl ? (
                      <img src={hero.sheet.portraitUrl} alt={hero.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <p className="font-fantasy text-lg text-white">{hero.name}</p>
                    <p className="text-xs text-amber-300">
                      {hero.race} · {hero.className} {hero.level} ур.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/characters" className="inline-flex text-sm font-bold text-amber-300 hover:text-amber-100">
              Открыть полный архив →
            </Link>
          </div>
        )}

        {activeTab === "player" && (
          <div className="space-y-6">
            <FilterBar
              tabs={stageTabs}
              selected={selectedStage}
              onSelect={setSelectedStage}
              query={searchQuery}
              onQuery={setSearchQuery}
              placeholder="Поиск по советам игрока..."
              activeClass="bg-amber-500 text-slate-950"
            />
            <div className="space-y-4">
              {filteredPlayerStages.map((stage) => (
                <StageCard key={stage.id} stage={stage} isDm={false} />
              ))}
            </div>
            {(selectedStage === "all" || selectedStage === 4) && (
              <MetaSkillsView
                skills={PLAYER_META_SKILLS}
                title="Мета-навыки игрока (прокачивайте всегда)"
                subtitle="Навыки, которые делают вас желанным игроком за абсолютно любым столом мира"
                colorScheme="amber"
              />
            )}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-5 sm:flex-row">
              <div>
                <h4 className="font-fantasy text-base font-bold text-amber-200">Готовы собрать не концепцию, а настоящий лист?</h4>
                <p className="mt-0.5 text-xs text-slate-400">Раса, класс, 27 очков, навыки и заклинания — с сохранением в архиве.</p>
              </div>
              <Link href="/characters/new" className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 font-fantasy text-xs font-bold text-slate-950">
                Конструктор листа <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === "dm" && (
          <div className="space-y-6">
            <FilterBar
              tabs={stageTabs}
              selected={selectedStage}
              onSelect={setSelectedStage}
              query={searchQuery}
              onQuery={setSearchQuery}
              placeholder="Поиск по советам мастера..."
              activeClass="bg-purple-600 text-white"
            />
            <div className="space-y-4">
              {filteredDmStages.map((stage) => (
                <StageCard key={stage.id} stage={stage} isDm />
              ))}
            </div>
            {(selectedStage === "all" || selectedStage === 4) && (
              <MetaSkillsView
                skills={DM_META_SKILLS}
                title="Мета-навыки гейм-мастера (прокачивайте всегда)"
                subtitle="Импровизация, пейсинг, судейство и создание ярких NPC для незабываемой игры"
                colorScheme="purple"
              />
            )}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 p-5 sm:flex-row">
              <div>
                <h4 className="font-fantasy text-base font-bold text-purple-200">Готовите новую кампанию?</h4>
                <p className="mt-0.5 text-xs text-slate-400">Соберите одностраничник кампании для нулевой сессии.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("tools");
                  setActiveToolSubtab("onepager");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 font-fantasy text-xs font-bold text-white"
              >
                Создать One-Pager <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "synergy" && <SynergyView />}

        {activeTab === "tools" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2">
              <ToolTab active={activeToolSubtab === "sheet"} onClick={() => setActiveToolSubtab("sheet")} icon={<ScrollText className="h-4 w-4" />} label="Лист персонажа" />
              <ToolTab active={activeToolSubtab === "roller"} onClick={() => setActiveToolSubtab("roller")} icon={<Dices className="h-4 w-4" />} label="Кости к20" />
              <ToolTab active={activeToolSubtab === "character"} onClick={() => setActiveToolSubtab("character")} icon={<Shield className="h-4 w-4" />} label="Концепция" />
              <ToolTab active={activeToolSubtab === "onepager"} onClick={() => setActiveToolSubtab("onepager")} icon={<Crown className="h-4 w-4" />} label="One-Pager" />
              <ToolTab active={activeToolSubtab === "lazydm"} onClick={() => setActiveToolSubtab("lazydm")} icon={<Layers className="h-4 w-4" />} label="Ленивый мастер" />
              <ToolTab active={activeToolSubtab === "timer"} onClick={() => setActiveToolSubtab("timer")} icon={<Sparkles className="h-4 w-4" />} label="Таймер сессии" />
            </div>
            {activeToolSubtab === "sheet" && (
              <div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-6">
                <h3 className="font-fantasy text-2xl text-amber-100">Конструктор листа персонажа</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  Не только идея «кто + хочет + мешает», а полный чарлист 5e с характеристиками, навыками, бронёй и заклинаниями. Сохраняется на сервере.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/characters/new" className="inline-flex rounded-xl bg-amber-500 px-4 py-2 text-sm font-black text-slate-950">
                  Открыть мастер создания
                </Link>
                <Link href="/characters/transfer" className="inline-flex rounded-xl border border-amber-500/40 px-4 py-2 text-sm font-bold text-amber-200">
                  Перенести из Long Story Short
                </Link>
              </div>
              </div>
            )}
            {activeToolSubtab === "roller" && <DiceRoller />}
            {activeToolSubtab === "character" && <CharacterConceptBuilder />}
            {activeToolSubtab === "onepager" && <CampaignOnePagerBuilder />}
            {activeToolSubtab === "lazydm" && <LazyDmChecklist />}
            {activeToolSubtab === "timer" && <SessionPacingTimer />}
          </div>
        )}

        {activeTab === "checklists" && <ChecklistsView />}
        {activeTab === "resources" && <ResourcesView />}

        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 p-6 text-center shadow-2xl">
          <Quote className="mx-auto mb-2 h-10 w-10 text-amber-500/20" />
          <blockquote className="mx-auto max-w-2xl font-fantasy text-lg font-bold leading-relaxed tracking-wide text-amber-200 sm:text-xl">
            «D&D — это не игра в «победа/поражение». Это игра в «что случилось дальше?».»
          </blockquote>
          <p className="mt-2 text-xs font-medium text-slate-400">— Робин Лоуз («Хиты Гамлета»)</p>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-fantasy font-bold text-amber-400">Путеводитель мастера и игрока</span>
            <span>• Арена листов персонажей</span>
          </div>
          <p className="italic text-slate-400">Адаптируйте, взламывайте, делайте своим. Хорошей игры! 🎲</p>
        </div>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  tone: "gold" | "amber" | "purple" | "emerald" | "blue" | "rose";
}) {
  const activeMap = {
    gold: "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400",
    amber: "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30",
    purple: "bg-purple-600 text-white shadow-lg shadow-purple-600/30",
    emerald: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30",
    blue: "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
    rose: "bg-rose-600 text-white shadow-lg shadow-rose-600/30",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-fantasy text-sm font-bold transition-all ${
        active ? activeMap[tone] : "border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ToolTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-fantasy text-xs font-bold transition-all ${
        active ? "bg-amber-600 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function FilterBar({
  tabs,
  selected,
  onSelect,
  query,
  onQuery,
  placeholder,
  activeClass,
}: {
  tabs: { id: number | "all"; label: string }[];
  selected: number | "all";
  onSelect: (id: number | "all") => void;
  query: string;
  onQuery: (value: string) => void;
  placeholder: string;
  activeClass: string;
}) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl md:flex-row md:items-center">
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => (
          <button
            key={String(tab.id)}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold ${
              selected === tab.id ? `${activeClass} font-bold shadow-md` : "border border-slate-800 bg-slate-950/60 text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-72">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 py-1.5 pr-3 pl-9 text-xs text-slate-200 outline-none focus:border-amber-500"
        />
      </div>
    </div>
  );
}
