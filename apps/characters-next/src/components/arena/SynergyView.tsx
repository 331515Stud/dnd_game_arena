"use client";

import React, { useState } from 'react';
import { SYNERGY_PRINCIPLES, HEALTHY_GROUP_ITEMS } from '@/data/dndData';
import type { LucideIcon } from 'lucide-react';
import { Users2, Compass, Scale, Smile, CheckCircle, ShieldAlert, Heart, Star, Sparkles } from 'lucide-react';

const ICON_PRINCIPLES: Record<string, LucideIcon> = {
  Compass,
  Users: Users2,
  Scale,
  Smile
};

export const SynergyView: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = HEALTHY_GROUP_ITEMS.filter(item => checkedItems[item.id]).length;

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users2 className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white font-fantasy">Синергия: Игрок + МД = История</h2>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              D&D — это не противостояние игрока и ведущего («Party vs DM»). Это совместный сторителлинг, где каждый участник одинаково важен для магии за столом.
            </p>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center sm:text-right">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest block font-bold">Главный девиз</span>
            <span className="text-sm font-bold text-amber-300 font-fantasy">«Play to see what happens»</span>
          </div>
        </div>
      </div>

      {/* Principles Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-amber-100 font-fantasy mb-2">Общие принципы хорошей игры</h3>
        <p className="text-xs text-slate-400 mb-6">Две стороны одной медали: как каждый принцип работает для обеих ролей</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYNERGY_PRINCIPLES.map((pr, idx) => {
            const IconComponent = ICON_PRINCIPLES[pr.icon] || Compass;
            return (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h4 className="font-fantasy font-bold text-white text-base">{pr.name}</h4>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30">
                    <span className="font-bold text-amber-300 block mb-0.5">🎭 Роль Игрока:</span>
                    <span className="text-slate-300 leading-relaxed">{pr.playerSide}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-900/30">
                    <span className="font-bold text-purple-300 block mb-0.5">🎪 Роль Ведущего (DM):</span>
                    <span className="text-slate-300 leading-relaxed">{pr.dmSide}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Healthy Group Checklist & Safety Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Healthy Group Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-fantasy font-bold text-lg text-white">Чек-лист здоровой группы</h3>
                <span className="text-xs text-slate-400">Маркеры зрелой и поддерживающей атмосферы</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                {completedCount} / {HEALTHY_GROUP_ITEMS.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {HEALTHY_GROUP_ITEMS.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isChecked ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className="text-xs font-medium leading-relaxed">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4 italic">
            Если в вашей группе выполняются хотя бы 4 пункта из 6, ваша кампания проживёт долгие счастливые месяцы!
          </p>
        </div>

        {/* Safety & Feedback Culture */}
        <div className="space-y-4">
          {/* Safety Tools */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-2 text-rose-400 font-fantasy font-bold">
              <ShieldAlert className="w-5 h-5" />
              <h4>Инструменты эмоциональной безопасности (Safety Tools)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              В D&D можно исследовать мрачные темы, но реальные люди за столом не должны испытывать травмирующий дискомфорт.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-amber-300">X-Card (Карта «Х»):</strong> Любой игрок может постучать по столу или написать «X» в чат без объяснения причин. Сцена немедленно останавливается или перематывается.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-amber-300">Lines & Veils:</strong> Список тем, которые никогда не поднимаются (Lines) или уходят в затемнение (Veils).
              </div>
            </div>
          </div>

          {/* Stars & Wishes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-fantasy font-bold">
              <Star className="w-5 h-5" />
              <h4>Культура обратной связи: «Stars & Wishes»</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Вместо токсичной критики в конце сессии потратьте 3 минуты на этот простой формат:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40 text-amber-200">
                <div className="flex items-center gap-1 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Star (Звезда)
                </div>
                <span>Какой момент сегодняшней игры вызвал у вас искренний восторг или мурашки?</span>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-900/40 text-purple-200">
                <div className="flex items-center gap-1 font-bold mb-1">
                  <Heart className="w-3.5 h-3.5 text-purple-400" /> Wish (Желание)
                </div>
                <span>Что вы хотите увидеть или попробовать в будущих сессиях (больше боёв, личный квест)?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
