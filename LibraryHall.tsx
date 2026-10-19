import React, { useState } from 'react';
import { ScrollText, Copy, Check, Download } from 'lucide-react';

interface CampaignTemplate {
  name: string;
  genre: string;
  theme: string;
  conflict: string;
  setting: string;
  levels: string;
  frequency: string;
  duration: string;
  players: string;
  experience: string;
  linesAndVeils: string;
}

const TEMPLATES: Record<string, CampaignTemplate> = {
  heroic: {
    name: 'Падение Серебряного Пика',
    genre: 'Heroic Fantasy с элементами готического детектива',
    theme: 'Искупление, доверие сопартийцам и защита беззащитных',
    conflict: 'Древний архивампир просыпается под катакомбами Серебряного Пика, плетя сеть заговора среди знати',
    setting: 'Долина Вальдор (Homebrew) с элементами Forgotten Realms',
    levels: '1–10 уровни',
    frequency: 'Раз в 2 недели',
    duration: '3.5–4 часа',
    players: '4–5 игроков',
    experience: 'Смешанный (2 новичка + 2 опытных)',
    linesAndVeils: 'Lines (Табу): Жестокость к детям/животным, PvP без согласия. Veils (Затемнение): Детали пыток, романтика.'
  },
  dark: {
    name: 'Шёпот Увядающего Тумана',
    genre: 'Dark Fantasy / Cosmic Horror',
    theme: 'Цена человечности, выживание в безнадежности и тайные клятвы',
    conflict: 'Странный багровый туман запечатал баронство; жители обращаются в сомнамбул',
    setting: 'Домен Ужаса (вдохновлено Ravenloft / Innistrad)',
    levels: '3–11 уровни',
    frequency: 'Раз в неделю',
    duration: '3 часа',
    players: '3–4 игрока',
    experience: 'Опытные игроки (высокая летальность боев)',
    linesAndVeils: 'Lines: Сексуальное насилие, ментальные триггеры фобий. Veils: Расчленение монстров, тяжелые галлюцинации.'
  },
  intrigue: {
    name: 'Тени Золотого Сената',
    genre: 'Political Intrigue / Urban Mystery',
    theme: 'Власть, коррупция, двойные агенты и цена правды',
    conflict: 'Внезапная смерть Великого Магистра магии вызвала скрытую войну трех тайных синдикатов',
    setting: 'Торговый мегаполис Ватердип (Waterdeep)',
    levels: '5–14 уровни',
    frequency: 'Раз в 2 недели',
    duration: '4 часа',
    players: '4 игрока',
    experience: 'Любители глубокого ролеплея и детективных расследований',
    linesAndVeils: 'Lines: Внеигровые споры, пренебрежение мнением стола. Veils: Допросы с пристрастием.'
  }
};

export const CampaignOnePagerBuilder: React.FC = () => {
  const [formData, setFormData] = useState<CampaignTemplate>(TEMPLATES.heroic);
  const [copied, setCopied] = useState(false);

  const applyTemplate = (key: string) => {
    if (TEMPLATES[key]) {
      setFormData(TEMPLATES[key]);
    }
  };

  const getMarkdownOutput = () => {
    return `# 📜 ONE-PAGER КАМПАНИИ: ${formData.name}
---
**Жанр / Тон:** ${formData.genre}
**Центральная тема:** ${formData.theme}
**Главный конфликт:** ${formData.conflict}
**Сеттинг:** ${formData.setting}
**Диапазон уровней:** ${formData.levels}
**Расписание:** ${formData.frequency} по ${formData.duration}
**Состав группы:** ${formData.players} (${formData.experience})

### 🛡️ Границы безопасности (Lines & Veils):
${formData.linesAndVeils}

---
*Документ подготовлен для Session Zero согласно «Полному руководству по D&D».*`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getMarkdownOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([getMarkdownOutput()], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.name.replace(/\s+/g, '_')}_OnePager.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-100 font-fantasy">Интерактивный One-Pager кампании</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Главный документ ведущего: 1 страница перед Session Zero для синхронизации ожиданий
          </p>
        </div>

        {/* Template buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold uppercase">Шаблоны:</span>
          <button
            onClick={() => applyTemplate('heroic')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-amber-500/20"
          >
            Героический
          </button>
          <button
            onClick={() => applyTemplate('dark')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs border border-purple-500/20"
          >
            Мрачный
          </button>
          <button
            onClick={() => applyTemplate('intrigue')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs border border-cyan-500/20"
          >
            Интрига
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Название кампании
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Жанр и Тон
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Сеттинг (Мир)
              </label>
              <input
                type="text"
                value={formData.setting}
                onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Центральная тема (Что в фокусе?)
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500"
              placeholder="Искупление, цена власти, выживание..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              Главный конфликт (BBEG / Угроза)
            </label>
            <textarea
              rows={2}
              value={formData.conflict}
              onChange={(e) => setFormData({ ...formData, conflict: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="block text-slate-500 mb-0.5">Уровни</label>
              <input
                type="text"
                value={formData.levels}
                onChange={(e) => setFormData({ ...formData, levels: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Частота</label>
              <input
                type="text"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Сессия</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-0.5">Игроки</label>
              <input
                type="text"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Lines & Veils (Табу и затемнения безопасности)
            </label>
            <input
              type="text"
              value={formData.linesAndVeils}
              onChange={(e) => setFormData({ ...formData, linesAndVeils: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Live Preview Paper */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-400 font-mono">
                [ CAMPAIGN ONE-PAGER ]
              </span>
              <span className="text-xs text-slate-400 font-semibold">{formData.levels}</span>
            </div>

            <h4 className="text-2xl font-bold text-amber-200 font-fantasy mb-2">{formData.name}</h4>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-400 uppercase tracking-wide">Жанр / Сеттинг:</strong>{' '}
                <span className="text-slate-200">{formData.genre}</span> •{' '}
                <span className="text-amber-300">{formData.setting}</span>
              </p>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">ЦЕНТРАЛЬНАЯ ТЕМА:</span>
                <span className="text-slate-200">{formData.theme}</span>
              </div>

              <div className="p-3 bg-red-950/20 rounded-xl border border-red-900/30">
                <span className="text-rose-400 font-bold block mb-1">ГЛАВНЫЙ КОНФЛИКТ:</span>
                <span className="text-rose-200">{formData.conflict}</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">БЕЗОПАСНОСТЬ (LINES & VEILS):</span>
                <span className="text-slate-300">{formData.linesAndVeils}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Расписание: {formData.frequency} ({formData.duration})</span>
                <span>Группа: {formData.players}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Скопировано в буфер!' : 'Копировать One-Pager'}
            </button>
            <button
              onClick={downloadText}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1"
              title="Скачать в Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
