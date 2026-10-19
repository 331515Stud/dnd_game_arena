import React, { useState } from 'react';
import { Clock, Coffee, Play, Award, Zap, BookMarked } from 'lucide-react';

interface Phase {
  timing: string;
  name: string;
  icon: any;
  color: string;
  goal: string;
  tips: string[];
}

const PHASES: Phase[] = [
  {
    timing: '0:00 – 0:15 (15 мин)',
    name: 'Recap & Перевод дыхания',
    icon: BookMarked,
    color: 'from-amber-600 to-amber-800',
    goal: 'Включить память игроков и настроиться на роли',
    tips: [
      'Попросите игроков сделать пересказ («Кто помнит, на чём мы остановились?»).',
      'Если забыли важную зацепку, мягко напомните сами.',
      'Наградите того, кто пересказывает, Вдохновением (Inspiration)!'
    ]
  },
  {
    timing: '0:15 – 1:30 (75 мин)',
    name: '1-я крупная сцена (Сильный старт)',
    icon: Zap,
    color: 'from-blue-600 to-blue-800',
    goal: 'Захватить внимание через бой, расследование или драму',
    tips: [
      'Начинайте сразу с действия: звон колокола, нападение, важное известие.',
      'Дайте каждому игроку бросить кубик хотя бы раз в этот час.',
      'Следите за временем: не давайте сцене топтаться на одном месте.'
    ]
  },
  {
    timing: '1:30 – 1:40 (10 мин)',
    name: 'Перерыв (Bio-break & чай)',
    icon: Coffee,
    color: 'from-emerald-600 to-emerald-800',
    goal: 'Разгрузить мозг, попить воды, обсудить мемы',
    tips: [
      'Обязательно ставьте таймер на 10 минут, иначе перерыв растянется на 40.',
      'Пока игроки на кухне, пересмотрите свои секреты и монстров для второй половины.'
    ]
  },
  {
    timing: '1:40 – 3:00 (80 мин)',
    name: '2-я крупная сцена & Развитие',
    icon: Play,
    color: 'from-purple-600 to-purple-800',
    goal: 'Кульминация сессии и раскрытие главной тайны дня',
    tips: [
      'Усложняйте обстановку: добавляйте тикающие таймеры или горящие балки.',
      'Если партия запуталась, выдайте подсказку через окружение или раненого NPC.'
    ]
  },
  {
    timing: '3:00 – 3:10 (10 мин)',
    name: 'Клиффхэнгер сессии',
    icon: Clock,
    color: 'from-rose-600 to-rose-800',
    goal: 'Закончить на самой интригующей ноте («И тут дверь распахивается...»)',
    tips: [
      'Не бойтесь обрывать сцену на самом интересном месте — игроки будут считать дни до следующей встречи!',
      'Зафиксируйте позиции и оставшиеся ячейки заклинаний.'
    ]
  },
  {
    timing: '3:10 – 3:15 (5 мин)',
    name: 'Награды & Stars and Wishes',
    icon: Award,
    color: 'from-amber-500 to-yellow-600',
    goal: 'Раздать опыт/лут и собрать теплый фидбек',
    tips: [
      'Спросите каждого: «Что тебе больше всего понравилось сегодня?» (Star).',
      'Спросите: «Что ты хочешь увидеть на следующей сессии?» (Wish).'
    ]
  }
];

export const SessionPacingTimer: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const activePhase = PHASES[activePhaseIndex];
  const IconComponent = activePhase.icon;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-100 font-fantasy">Ритм сессии: Шкала 3.5–4 часов</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Как держать темп, избежать затягивания и закончить на захватывающем клиффхэнгере
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-amber-500/20 font-semibold">
          Оптимальный хронометраж
        </span>
      </div>

      {/* Timeline Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {PHASES.map((p, idx) => {
          const PhaseIcon = p.icon;
          const isActive = idx === activePhaseIndex;
          return (
            <button
              key={idx}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1">
                <PhaseIcon className="w-3.5 h-3.5" />
                <span className="truncate">{p.timing.split(' ')[0]}</span>
              </div>
              <p className={`text-xs font-semibold leading-tight line-clamp-2 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {p.name.split(' (')[0]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Phase Details */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activePhase.color} text-white flex items-center justify-center shadow-md`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">{activePhase.timing}</span>
              </div>
              <h4 className="text-lg font-bold text-white font-fantasy">{activePhase.name}</h4>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">Цель фазы</span>
            <span className="text-xs text-emerald-400 font-medium">{activePhase.goal}</span>
          </div>
        </div>

        <div className="sm:hidden mb-4 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Цель фазы:</span>
          <span className="text-xs text-emerald-400 font-medium">{activePhase.goal}</span>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Практические советы для ведущего:
          </span>
          <ul className="space-y-1.5">
            {activePhase.tips.map((tip, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
