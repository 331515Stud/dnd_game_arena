import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckSquare, RotateCcw, Sparkles, UserCheck, ShieldCheck, Printer } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  detail: string;
}

const PLAYER_CHECKLIST: ChecklistItem[] = [
  {
    id: 'p1',
    text: 'Придумали концепцию персонажа',
    detail: '1 чёткое предложение: кто он, чего страстно хочет и что мешает/чего боится.'
  },
  {
    id: 'p2',
    text: 'Собрали игровую механику',
    detail: 'Заполнен чарлист (бумажный, D&D Beyond или приложение): характеристики, HP, снаряжение.'
  },
  {
    id: 'p3',
    text: 'Прочитали свои способности класса',
    detail: 'Знаете все свои фичи, заклинания и спасброски хотя бы до 5-го уровня наизусть.'
  },
  {
    id: 'p4',
    text: 'Обсудили всё на нулевой сессии',
    detail: 'Утвердили тон игры, личные границы (Lines & Veils) и связи минимум с одним сопартийцем.'
  },
  {
    id: 'p5',
    text: 'Собрали походную сумку игрока',
    detail: 'Набор кубиков, карандаш, ластик, блокнот для заметок, перекус и бутылка воды.'
  }
];

const DM_CHECKLIST: ChecklistItem[] = [
  {
    id: 'dm1',
    text: 'Написали One-Pager кампании',
    detail: 'Краткая памятка: название, жанр, главная тема, конфликт, сеттинг и расписание.'
  },
  {
    id: 'dm2',
    text: 'Провели нулевую сессию с партией',
    detail: 'Зафиксировали границы (Lines & Veils), правила летальности и связки между героями.'
  },
  {
    id: 'dm3',
    text: 'Подготовили стартовый минимум (по методу «Ленивого мастера»)',
    detail: 'Стартовая локация + 3–5 ключевых NPC + сильная завязка (Hook) + 3 тайны/секрета.'
  },
  {
    id: 'dm4',
    text: 'Приготовили статблоки монстров на 1-ю сессию',
    detail: 'Открыты вкладки в браузере или распечатаны карточки врагов для первых сцен.'
  },
  {
    id: 'dm5',
    text: 'Настроили игровое пространство',
    detail: 'Ширма мастера, кубики, боевая сетка/маркеры или настроенный виртуальный стол (VTT).'
  }
];

export const ChecklistsView: React.FC = () => {
  const [playerChecks, setPlayerChecks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('dnd_player_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  const [dmChecks, setDmChecks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('dnd_dm_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('dnd_player_checklist', JSON.stringify(playerChecks));
  }, [playerChecks]);

  useEffect(() => {
    localStorage.setItem('dnd_dm_checklist', JSON.stringify(dmChecks));
  }, [dmChecks]);

  const togglePlayerCheck = (id: string) => {
    const next = { ...playerChecks, [id]: !playerChecks[id] };
    setPlayerChecks(next);
    if (Object.values(next).filter(Boolean).length === PLAYER_CHECKLIST.length) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const toggleDmCheck = (id: string) => {
    const next = { ...dmChecks, [id]: !dmChecks[id] };
    setDmChecks(next);
    if (Object.values(next).filter(Boolean).length === DM_CHECKLIST.length) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const playerDoneCount = PLAYER_CHECKLIST.filter(item => playerChecks[item.id]).length;
  const playerPercent = Math.round((playerDoneCount / PLAYER_CHECKLIST.length) * 100);

  const dmDoneCount = DM_CHECKLIST.filter(item => dmChecks[item.id]).length;
  const dmPercent = Math.round((dmDoneCount / DM_CHECKLIST.length) * 100);

  const resetAll = () => {
    if (window.confirm('Сбросить все отметки в обоих чек-листах?')) {
      setPlayerChecks({});
      setDmChecks({});
    }
  };

  const printChecklists = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-amber-100 font-fantasy">Быстрый старт: Интерактивные Чек-листы</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Отметьте готовность перед первой сессией. Данные сохраняются локально на вашем устройстве.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={printChecklists}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            title="Распечатать памятку"
          >
            <Printer className="w-3.5 h-3.5" /> Печать
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Сбросить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PLAYER CHECKLIST */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-fantasy font-bold text-lg text-amber-200">Если вы ИГРОК</h3>
                  <span className="text-xs text-slate-400">Готовность к 1-й сессии</span>
                </div>
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                playerPercent === 100
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                  : 'bg-slate-800 text-amber-400 border-slate-700'
              }`}>
                {playerPercent}% ({playerDoneCount}/{PLAYER_CHECKLIST.length})
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${playerPercent}%` }}
              />
            </div>

            {/* Items */}
            <div className="space-y-3">
              {PLAYER_CHECKLIST.map((item) => {
                const isChecked = !!playerChecks[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => togglePlayerCheck(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-600/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded text-emerald-600 accent-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className={`text-sm font-semibold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.text}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {playerPercent === 100 && (
            <div className="mt-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Вы полностью готовы к приключению! Пусть кубики будут благосклонны.</span>
            </div>
          )}
        </div>

        {/* DM CHECKLIST */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-fantasy font-bold text-lg text-rose-200">Если вы МАСТЕР (DM)</h3>
                  <span className="text-xs text-slate-400">Готовность стола к старту</span>
                </div>
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                dmPercent === 100
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                  : 'bg-slate-800 text-rose-400 border-slate-700'
              }`}>
                {dmPercent}% ({dmDoneCount}/{DM_CHECKLIST.length})
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-6 border border-slate-800">
              <div
                className="bg-gradient-to-r from-rose-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${dmPercent}%` }}
              />
            </div>

            {/* Items */}
            <div className="space-y-3">
              {DM_CHECKLIST.map((item) => {
                const isChecked = !!dmChecks[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleDmCheck(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-600/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded text-emerald-600 accent-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className={`text-sm font-semibold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {item.text}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {dmPercent === 100 && (
            <div className="mt-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Мир готов к пришествию героев! Вдохновения и отличного темпа.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
