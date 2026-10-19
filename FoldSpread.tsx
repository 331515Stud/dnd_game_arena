import React, { useState } from 'react';
import { DND_RESOURCES, GLOSSARY_TERMS } from '../data/dndData';
import { BookMarked, Video, Wrench, Search, HelpCircle } from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const [glossarySearch, setGlossarySearch] = useState('');

  const filteredGlossary = GLOSSARY_TERMS.filter(
    item =>
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.meaning.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <BookMarked className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100 font-fantasy">Ресурсы для глубокого погружения</h2>
        </div>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Проверенные временем книги по дизайну кампаний, обучающие каналы, генераторы контента и виртуальные столы для живой и онлайн-игры.
        </p>
      </div>

      {/* Books Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <BookMarked className="w-5 h-5 text-amber-400" />
          <h3 className="font-fantasy font-bold text-lg text-white">Книги по гейм-мастерингу</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DND_RESOURCES.books.map((book, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-amber-500/40"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-2">
                  {book.highlight}
                </span>
                <h4 className="font-fantasy font-bold text-white text-base mb-0.5">{book.title}</h4>
                <span className="text-xs text-amber-300 font-medium block mb-2">{book.author}</span>
                <p className="text-xs text-slate-300 leading-relaxed">{book.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media & Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YouTube & Podcasts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Video className="w-5 h-5 text-rose-400" />
            <h3 className="font-fantasy font-bold text-lg text-white">YouTube каналы и Подкасты</h3>
          </div>

          <div className="space-y-3">
            {DND_RESOURCES.media.map((med, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white font-fantasy">{med.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {med.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{med.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Tools */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h3 className="font-fantasy font-bold text-lg text-white">Цифровые инструменты и VTT</h3>
          </div>

          <div className="space-y-3">
            {DND_RESOURCES.tools.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white font-fantasy">{t.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini-Glossary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-fantasy font-bold text-lg text-white">Мини-Глоссарий терминов D&D</h3>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder="Поиск по терминам..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredGlossary.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-fantasy font-bold text-amber-300 text-xs block mb-1">
                {item.term}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{item.meaning}</p>
            </div>
          ))}
          {filteredGlossary.length === 0 && (
            <p className="text-xs text-slate-500 p-4 col-span-2 text-center">
              Термин не найден. Попробуйте изменить поисковый запрос.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
