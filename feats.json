"use client";

import React, { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { Feather, CheckCircle2, RotateCcw, Sparkles, Copy, Check } from 'lucide-react';

interface LazyDmData {
  strongStart: string;
  scenes: string;
  secrets: string;
  locations: string;
  npcs: string;
  monsters: string;
}

const DEFAULT_PREP: LazyDmData = {
  strongStart: 'Партия просыпается в таверне от колокольного набата: городская стража оцепила причал, где из воды вынесло пустой корабль с оборванными парусами.',
  scenes: '1. Осмотр брошенного судна и следы когтей.\n2. Допрос портового смотрителя в трактире.\n3. Спуск в затопленные дренажные тоннели под доками.\n4. Засада культистов глубинных вод.',
  secrets: '• Старый маячник продавал ключи от ворот контрабандистам.\n• Корабль прибыл из порта, который был уничтожен штормом неделю назад.\n• Капитан судна жив и скрывается в доме городского лекаря.',
  locations: '1. Дрейфующая каравелла «Морской шёпот» (кренится набок, пахнет озоном и серой).\n2. Затопленный склеп Святого Эльма (зелёное фосфорное свечение водорослей).',
  npcs: '• Смотритель Горн: одноглазый, нервно теребит монету, боится темноты.\n• Лекарь Матильда: спокойный голос, пахнет мятой, укрывает раненого чужака.',
  monsters: '4 Глубинных кутиста (Cultist CR 1/8) + 1 Морской хряк/Гхул (Ghoul CR 1) со щупальцами.'
};

export const LazyDmChecklist: React.FC = () => {
  const [prep, setPrep] = useLocalStorage<LazyDmData>('dnd_lazy_dm_prep', DEFAULT_PREP);
  const [copied, setCopied] = useState(false);

  const resetToSample = () => {
    setPrep(DEFAULT_PREP);
  };

  const clearAll = () => {
    setPrep({
      strongStart: '',
      scenes: '',
      secrets: '',
      locations: '',
      npcs: '',
      monsters: ''
    });
  };

  const copyPrep = () => {
    const text = `📋 ПРЕП СЕССИИ (LAZY DM ЧЕКЛИСТ):
====================================
1. СИЛЬНЫЙ СТАРТ:
${prep.strongStart}

2. ПОТЕНЦИАЛЬНЫЕ СЦЕНЫ:
${prep.scenes}

3. СЕКРЕТЫ И УЛИКИ:
${prep.secrets}

4. ФАНТАСТИЧЕСКИЕ ЛОКАЦИИ:
${prep.locations}

5. ВАЖНЫЕ NPC:
${prep.npcs}

6. МОНСТРЫ И СТОЛКНОВЕНИЯ:
${prep.monsters}
====================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Feather className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-100 font-fantasy">Подготовка сессии по методу «Ленивого мастера»</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Знаменитый 6-шаговый метод Майка Шея (Sly Flourish): готовьте за 30 минут самое главное!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-amber-500/20"
            title="Загрузить пример готового препа"
          >
            <Sparkles className="w-3.5 h-3.5" /> Пример
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
            title="Очистить поля"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Очистить
          </button>
          <button
            onClick={copyPrep}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/30"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Strong Start */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 focus-within:border-amber-500 transition-colors">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
            Сильный старт (Strong Start)
          </label>
          <p className="text-[11px] text-slate-500 mb-2">Начните прямо с действия или острой интриги, без долгого чаепития</p>
          <textarea
            rows={3}
            value={prep.strongStart}
            onChange={(e) => setPrep({ ...prep, strongStart: e.target.value })}
            className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
            placeholder="Что происходит в первые 5 минут сессии?"
          />
        </div>

        {/* 2. Scenes */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 focus-within:border-amber-500 transition-colors">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
            3–5 возможных сцен (Potential Scenes)
          </label>
          <p className="text-[11px] text-slate-500 mb-2">Наброски ситуаций, не жесткий сюжет</p>
          <textarea
            rows={3}
            value={prep.scenes}
            onChange={(e) => setPrep({ ...prep, scenes: e.target.value })}
            className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
            placeholder="1. Сцена в порту&#10;2. Разговор с алхимиком&#10;3. Засада..."
          />
        </div>

        {/* 3. Secrets & Clues */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 focus-within:border-amber-500 transition-colors">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
            Секреты и улики (Secrets & Clues)
          </label>
          <p className="text-[11px] text-slate-500 mb-2">Кусочки лора, которые игроки могут найти в ЛЮБОМ месте</p>
          <textarea
            rows={3}
            value={prep.secrets}
            onChange={(e) => setPrep({ ...prep, secrets: e.target.value })}
            className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
            placeholder="• Секрет 1&#10;• Секрет 2..."
          />
        </div>

        {/* 4. Fantastic Locations */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 focus-within:border-amber-500 transition-colors">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">4</span>
            Фантастические локации
          </label>
          <p className="text-[11px] text-slate-500 mb-2">1–2 запоминающихся места с интересным рельефом или магией</p>
          <textarea
            rows={3}
            value={prep.locations}
            onChange={(e) => setPrep({ ...prep, locations: e.target.value })}
            className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
            placeholder="Название места + 2 яркие сенсорные детали"
          />
        </div>

        {/* 5. NPCs */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 focus-within:border-amber-500 transition-colors">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">5</span>
            Ключевые NPC
          </label>
          <p className="text-[11px] text-slate-500 mb-2">Имя, манера речи/жест, тайное желание или страх</p>
          <textarea
            rows={3}
            value={prep.npcs}
            onChange={(e) => setPrep({ ...prep, npcs: e.target.value })}
            className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
            placeholder="Имя + голос + мотив"
          />
        </div>

        {/* 6. Monsters */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 focus-within:border-amber-500 transition-colors">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">6</span>
            Монстры и встречи
          </label>
          <p className="text-[11px] text-slate-500 mb-2">Только статблоки, которые могут понадобиться на сессии</p>
          <textarea
            rows={3}
            value={prep.monsters}
            onChange={(e) => setPrep({ ...prep, monsters: e.target.value })}
            className="w-full bg-transparent border-0 text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
            placeholder="Тип врагов, число, ключевые опасные особенности"
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Автоматически сохраняется в вашем браузере
        </span>
        <span className="text-slate-400 italic">«Готовьте ровно столько, сколько нужно для следующей сессии.»</span>
      </div>
    </div>
  );
};
