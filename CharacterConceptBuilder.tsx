import React, { useState, useMemo } from 'react';
import {
  PLAYER_STAGES,
  PLAYER_META_SKILLS,
  DM_STAGES,
  DM_META_SKILLS
} from './data/dndData';
import { StageCard } from './components/StageCard';
import { MetaSkillsView } from './components/MetaSkillsView';
import { SynergyView } from './components/SynergyView';
import { ResourcesView } from './components/ResourcesView';
import { ChecklistsView } from './components/ChecklistsView';
import { DiceRoller } from './components/DiceRoller';
import { CharacterConceptBuilder } from './components/CharacterConceptBuilder';
import { CampaignOnePagerBuilder } from './components/CampaignOnePagerBuilder';
import { LazyDmChecklist } from './components/LazyDmChecklist';
import { SessionPacingTimer } from './components/SessionPacingTimer';
import {
  Shield,
  Crown,
  Users2,
  Wrench,
  CheckSquare,
  BookOpen,
  Dices,
  Search,
  Quote,
  Sparkles,
  Layers,
  ChevronRight,
  Flame
} from 'lucide-react';

import { LibraryHall } from './components/LibraryHall';

type TabType = 'library' | 'player' | 'dm' | 'synergy' | 'tools' | 'checklists' | 'resources';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('library');
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickDice, setShowQuickDice] = useState(false);
  const [activeToolSubtab, setActiveToolSubtab] = useState<'roller' | 'character' | 'onepager' | 'lazydm' | 'timer'>('roller');

  // Filter stages based on selectedStage and searchQuery
  const filteredPlayerStages = useMemo(() => {
    return PLAYER_STAGES.filter(stage => {
      const matchStage = selectedStage === 'all' || stage.stageNumber === selectedStage;
      if (!matchStage) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = stage.title.toLowerCase().includes(q) || stage.subtitle.toLowerCase().includes(q);
      const matchDesc = stage.description.toLowerCase().includes(q) || stage.mindset.toLowerCase().includes(q);
      const matchSections = stage.sections.some(s =>
        s.heading.toLowerCase().includes(q) ||
        (s.items && s.items.some(i => i.toLowerCase().includes(q))) ||
        (s.warnings && s.warnings.some(w => w.toLowerCase().includes(q))) ||
        (s.table && s.table.rows.some(r => r.some(c => c.toLowerCase().includes(q))))
      );
      return matchTitle || matchDesc || matchSections;
    });
  }, [selectedStage, searchQuery]);

  const filteredDmStages = useMemo(() => {
    return DM_STAGES.filter(stage => {
      const matchStage = selectedStage === 'all' || stage.stageNumber === selectedStage;
      if (!matchStage) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = stage.title.toLowerCase().includes(q) || stage.subtitle.toLowerCase().includes(q);
      const matchDesc = stage.description.toLowerCase().includes(q) || stage.mindset.toLowerCase().includes(q);
      const matchSections = stage.sections.some(s =>
        s.heading.toLowerCase().includes(q) ||
        (s.items && s.items.some(i => i.toLowerCase().includes(q))) ||
        (s.warnings && s.warnings.some(w => w.toLowerCase().includes(q))) ||
        (s.table && s.table.rows.some(r => r.some(c => c.toLowerCase().includes(q))))
      );
      return matchTitle || matchDesc || matchSections;
    });
  }, [selectedStage, searchQuery]);

  const stageTabs = [
    { id: 'all', label: 'Все этапы' },
    { id: 0, label: 'Этап 0: Подготовка & S0' },
    { id: 1, label: 'Этап 1: 1–3 ур. (Tier 1)' },
    { id: 2, label: 'Этап 2: 4–10 ур. (Tier 2)' },
    { id: 3, label: 'Этап 3: 11–16 ур. (Tier 3)' },
    { id: 4, label: 'Этап 4: 17–20 ур. (Tier 4)' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col font-sans">
      {/* Top Banner Hero */}
      <header className="relative border-b border-amber-500/20 overflow-hidden">
        {/* Background image & gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform blur-[1px]"
          style={{ backgroundImage: `url('/images/dnd-hero-banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Flame className="w-3.5 h-3.5" /> Путеводитель по D&D · 5-я редакция
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-fantasy tracking-tight leading-tight">
                Полное руководство по игре в D&D: <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  от создания персонажа до финала кампании
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Два неразрывных взгляда на великую настольную ролевую игру: глазами <strong className="text-amber-400">Игрока</strong> и глазами <strong className="text-purple-400">Ведущего</strong> с практическими техниками, чек-листами и инструментами для каждого этапа.
              </p>
            </div>

            {/* Quick action: floating dice roller button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQuickDice(!showQuickDice)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-black text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Dices className="w-5 h-5 text-slate-950 animate-bounce" />
                <span>{showQuickDice ? 'Скрыть кубики' : 'Бросить к20'}</span>
              </button>
            </div>
          </div>

          {/* Quick Dice Floating Panel (Toggleable from header) */}
          {showQuickDice && (
            <div className="mt-8 transition-all">
              <DiceRoller />
            </div>
          )}

          {/* Main Navigation Tabs */}
          <nav className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-fantasy text-sm font-bold transition-all ${
                activeTab === 'library'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400'
                  : 'bg-slate-900/80 text-amber-300 hover:bg-slate-800 border border-amber-600/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Библиотека</span>
            </button>

            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-fantasy text-sm font-bold transition-all ${
                activeTab === 'player'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Сторона Игрока</span>
            </button>

            <button
              onClick={() => setActiveTab('dm')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-fantasy text-sm font-bold transition-all ${
                activeTab === 'dm'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Сторона Мастера (DM)</span>
            </button>

            <button
              onClick={() => setActiveTab('synergy')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-fantasy text-sm font-bold transition-all ${
                activeTab === 'synergy'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Users2 className="w-4 h-4" />
              <span>Синергия & Стол</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-fantasy text-sm font-bold transition-all ${
                activeTab === 'tools'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Инструментарий</span>
            </button>

            <button
              onClick={() => setActiveTab('checklists')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-fantasy text-sm font-bold transition-all ${
                activeTab === 'checklists'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Быстрый старт</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-fantasy text-sm font-bold transition-all ${
                activeTab === 'resources'
                  ? 'bg-amber-700 text-white shadow-lg shadow-amber-800/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ресурсы & Глоссарий</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* LIBRARY BOOK SPREAD TAB */}
        {activeTab === 'library' && <LibraryHall />}

        {/* PLAYER TAB */}
        {activeTab === 'player' && (
          <div className="space-y-6">
            {/* Stage filter & Search Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {stageTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedStage(t.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedStage === t.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по советам игрока..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Stage Cards */}
            <div className="space-y-4">
              {filteredPlayerStages.map((stage) => (
                <StageCard key={stage.id} stage={stage} isDm={false} />
              ))}
              {filteredPlayerStages.length === 0 && (
                <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
                  По вашему запросу ничего не найдено. Попробуйте сбросить фильтры.
                </div>
              )}
            </div>

            {/* Player Meta Skills */}
            {(selectedStage === 'all' || selectedStage === 4) && (
              <MetaSkillsView
                skills={PLAYER_META_SKILLS}
                title="Мета-навыки игрока (прокачивайте всегда)"
                subtitle="Навыки, которые делают вас желанным игроком за абсолютно любым столом мира"
                colorScheme="amber"
              />
            )}

            {/* Quick link to concept generator */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-amber-200 font-fantasy">Хотите сразу создать концепцию персонажа?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Воспользуйтесь нашим интерактивным генератором по формуле «Кто + Мотивация + Конфликт»</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('tools');
                  setActiveToolSubtab('character');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold font-fantasy flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-amber-900/30"
              >
                <span>Открыть конструктор</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* DM TAB */}
        {activeTab === 'dm' && (
          <div className="space-y-6">
            {/* Stage filter & Search Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {stageTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedStage(t.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedStage === t.id
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по советам мастера..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Stage Cards */}
            <div className="space-y-4">
              {filteredDmStages.map((stage) => (
                <StageCard key={stage.id} stage={stage} isDm={true} />
              ))}
              {filteredDmStages.length === 0 && (
                <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
                  По вашему запросу ничего не найдено. Попробуйте сбросить фильтры.
                </div>
              )}
            </div>

            {/* DM Meta Skills */}
            {(selectedStage === 'all' || selectedStage === 4) && (
              <MetaSkillsView
                skills={DM_META_SKILLS}
                title="Мета-навыки гейм-мастера (прокачивайте всегда)"
                subtitle="Импровизация, пейсинг, судейство и создание ярких NPC для незабываемой игры"
                colorScheme="purple"
              />
            )}

            {/* Quick link to One-Pager generator */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-purple-200 font-fantasy">Готовите новую кампанию?</h4>
                <p className="text-xs text-slate-400 mt-0.5">Соберите и скачайте аккуратный одностраничник кампании для нулевой сессии с готовыми шаблонами</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('tools');
                  setActiveToolSubtab('onepager');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-fantasy flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-purple-900/30"
              >
                <span>Создать One-Pager</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SYNERGY TAB */}
        {activeTab === 'synergy' && <SynergyView />}

        {/* TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {/* Subtabs for tools */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveToolSubtab('roller')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-fantasy transition-all ${
                  activeToolSubtab === 'roller'
                    ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dices className="w-4 h-4" />
                <span>Кости к20</span>
              </button>

              <button
                onClick={() => setActiveToolSubtab('character')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-fantasy transition-all ${
                  activeToolSubtab === 'character'
                    ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Концепция персонажа</span>
              </button>

              <button
                onClick={() => setActiveToolSubtab('onepager')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-fantasy transition-all ${
                  activeToolSubtab === 'onepager'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>One-Pager кампании</span>
              </button>

              <button
                onClick={() => setActiveToolSubtab('lazydm')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-fantasy transition-all ${
                  activeToolSubtab === 'lazydm'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Подготовка «Ленивого мастера»</span>
              </button>

              <button
                onClick={() => setActiveToolSubtab('timer')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-fantasy transition-all ${
                  activeToolSubtab === 'timer'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Ритм & Таймер сессии</span>
              </button>
            </div>

            {/* Active tool view */}
            {activeToolSubtab === 'roller' && <DiceRoller />}
            {activeToolSubtab === 'character' && <CharacterConceptBuilder />}
            {activeToolSubtab === 'onepager' && <CampaignOnePagerBuilder />}
            {activeToolSubtab === 'lazydm' && <LazyDmChecklist />}
            {activeToolSubtab === 'timer' && <SessionPacingTimer />}
          </div>
        )}

        {/* CHECKLISTS TAB */}
        {activeTab === 'checklists' && <ChecklistsView />}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && <ResourcesView />}

        {/* Master Quote Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-center relative overflow-hidden">
          <Quote className="w-10 h-10 text-amber-500/20 mx-auto mb-2" />
          <blockquote className="text-lg sm:text-xl font-fantasy font-bold text-amber-200 tracking-wide max-w-2xl mx-auto leading-relaxed">
            «D&D — это не игра в «победа/поражение». Это игра в «что случилось дальше?».»
          </blockquote>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            — Робин Лоуз (<cite className="italic">«Хиты Гамлета»</cite>)
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fantasy font-bold text-amber-400">Путеводитель мастера и игрока</span>
            <span>• Создано для вашей легендарной кампании</span>
          </div>
          <p className="text-slate-400 italic">
            Адаптируйте, взламывайте, делайте своим. Хорошей игры! 🎲
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
