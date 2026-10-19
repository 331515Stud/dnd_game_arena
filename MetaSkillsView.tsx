import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Wand2, User, Flame, Skull, Shield } from 'lucide-react';

interface ConceptPreset {
  identity: string;
  motivation: string;
  conflict: string;
  race: string;
  dndClass: string;
  background: string;
  quirk: string;
}

const PRESET_IDEAS: ConceptPreset[] = [
  {
    identity: 'Бывший наёмник прославленной «Стальной Роты», распущенной после предательства нанимателя',
    motivation: 'Собрать золото и выкупить родовое поместье своего погибшего командира',
    conflict: 'Страх громких взрывов (ПТСР после осады) и долг перед криминальным авторитетом',
    race: 'Человек (Variant Human)',
    dndClass: 'Воин (Мастер боевых искусств)',
    background: 'Солдат (Soldier)',
    quirk: 'Всегда точит кинжал, когда нервничает, и пересчитывает монеты перед сном'
  },
  {
    identity: 'Опальный аристократ, лишённый титула за изучение запретной магии предков',
    motivation: 'Раскрыть тайну исчезновения младшей сестры в Теневом Пределе',
    conflict: 'Родовое проклятие: каждый раз при сильном стрессе тени шепчут чужие секреты',
    race: 'Эльф (Высший / High Elf)',
    dndClass: 'Колдун (Покровитель: Великий Древний / Great Old One)',
    background: 'Дворянин (Noble)',
    quirk: 'Брезгует сидеть на немытых скамьях в таверне и носит шёлковый платок'
  },
  {
    identity: 'Искательница древних реликвий из бродячего клана ремесленников',
    motivation: 'Найти легендарный Кузнечный Молот предков и доказать клану свою ценность',
    conflict: 'Священная клятва никогда не оставлять раненого союзника позади, даже под огнём дракона',
    race: 'Дварф (Горный / Mountain Dwarf)',
    dndClass: 'Жрец (Домен Кузни / Forge Domain)',
    background: 'Ремесленник гильдии (Guild Artisan)',
    quirk: 'Оценивает прочность любой каменной кладки или металла ударом костяшек пальцев'
  },
  {
    identity: 'Беглый послушник тайного культа, осознавший ужас ритуалов своего наставника',
    motivation: 'Искупить соучастие в тёмных делах и спасти души невинных пленников',
    conflict: 'Культ охотится за ним по всему континенту, отправляя убийц-невидимок',
    race: 'Тифлинг (Tiefling)',
    dndClass: 'Паладин (Клятва Искупления / Oath of Redemption)',
    background: 'Прислужник (Acolyte)',
    quirk: 'Скрывает рога под глубоким капюшоном и не употребляет алкоголь'
  },
  {
    identity: 'Уличная воровка-карманница из портового мегаполиса с врождённым магическим даром',
    motivation: 'Обеспечить сиротский приют в трущобах и обрести настоящую семью',
    conflict: 'Не умеет доверять людям; в критический момент первой мыслью всегда идёт побег',
    race: 'Полуэльф (Half-Elf)',
    dndClass: 'Плут (Мистический ловкач / Arcane Trickster)',
    background: 'Беспризорник (Urchin)',
    quirk: 'Коллекционирует странные полированные пуговицы и цветные стёкла'
  }
];

export const CharacterConceptBuilder: React.FC = () => {
  const [identity, setIdentity] = useState(PRESET_IDEAS[0].identity);
  const [motivation, setMotivation] = useState(PRESET_IDEAS[0].motivation);
  const [conflict, setConflict] = useState(PRESET_IDEAS[0].conflict);
  const [race, setRace] = useState(PRESET_IDEAS[0].race);
  const [dndClass, setDndClass] = useState(PRESET_IDEAS[0].dndClass);
  const [background, setBackground] = useState(PRESET_IDEAS[0].background);
  const [quirk, setQuirk] = useState(PRESET_IDEAS[0].quirk);
  const [copied, setCopied] = useState(false);

  const randomizeAll = () => {
    const randomIndex = Math.floor(Math.random() * PRESET_IDEAS.length);
    const p = PRESET_IDEAS[randomIndex];
    setIdentity(p.identity);
    setMotivation(p.motivation);
    setConflict(p.conflict);
    setRace(p.race);
    setDndClass(p.dndClass);
    setBackground(p.background);
    setQuirk(p.quirk);
  };

  const formattedOutput = `🎭 КОНЦЕПЦИЯ ПЕРСОНАЖА ДЛЯ D&D 5E:
=======================================
• Кто он: ${identity}
• Мотивация (Чего хочет): ${motivation}
• Внутренний конфликт (Что мешает): ${conflict}

МЕХАНИКА:
• Раса: ${race}
• Класс: ${dndClass}
• Предыстория: ${background}
• Особенность/Привычка: ${quirk}
=======================================
Сгенерировано в Руководстве по D&D`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-100 font-fantasy">Конструктор концепции персонажа</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Соберите концепцию по формуле Этапа 0: <strong className="text-amber-300">Кто + Мотивация + Конфликт</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={randomizeAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Случайный архетип
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all active:scale-95 shadow-md shadow-amber-900/30"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input fields */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              <User className="w-3.5 h-3.5" /> 1. Кто он? (Идея / Суть)
            </label>
            <textarea
              rows={2}
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Например: Бывший капитан стражи, изгнанный по ложному обвинению..."
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
              <Flame className="w-3.5 h-3.5" /> 2. Мотивация (Чего он страстно хочет?)
            </label>
            <textarea
              rows={2}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Например: Доказать свою невиновность и спасти пленённых солдат..."
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5">
              <Skull className="w-3.5 h-3.5" /> 3. Внутренний конфликт (Что ему мешает?)
            </label>
            <textarea
              rows={2}
              value={conflict}
              onChange={(e) => setConflict(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
              placeholder="Например: Панический страх магии разума или клятва не обнажать клинок в храмах..."
            />
          </div>

          {/* Mechanical quick picks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Раса</label>
              <input
                type="text"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Класс</label>
              <input
                type="text"
                value={dndClass}
                onChange={(e) => setDndClass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Предыстория</label>
              <input
                type="text"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Запоминающаяся привычка или деталь</label>
            <input
              type="text"
              value={quirk}
              onChange={(e) => setQuirk(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500"
              placeholder="Особый акцент, трость с секретом, суеверие..."
            />
          </div>
        </div>

        {/* Live Card Preview */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="font-fantasy font-bold text-amber-200">Карточка героя (готово к нулевой сессии)</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {race || 'Раса'} • {dndClass || 'Класс'}
              </span>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block mb-1">Кто персонаж:</span>
                <p className="text-slate-200 font-medium leading-relaxed">{identity}</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 block mb-1">Главная мотивация:</span>
                <p className="text-slate-300 leading-relaxed">{motivation}</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] uppercase tracking-wider font-bold text-rose-400 block mb-1">Слабость / Конфликт:</span>
                <p className="text-slate-300 leading-relaxed">{conflict}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-slate-500 block">Предыстория:</span>
                  <span className="text-slate-300 font-semibold">{background}</span>
                </div>
                <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-slate-500 block">Привычка:</span>
                  <span className="text-slate-300 font-semibold truncate block" title={quirk}>{quirk}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Идеально для обсуждения с МД и партией</span>
            <button
              onClick={copyToClipboard}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3 h-3" /> Скопировать текст
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
