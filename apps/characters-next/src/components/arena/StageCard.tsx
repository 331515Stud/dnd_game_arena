"use client";

import React, { useState } from 'react';
import { StageData } from '@/data/dndData';
import { ChevronDown, ChevronUp, Quote, AlertOctagon, Lightbulb, CheckCircle2 } from 'lucide-react';

interface StageCardProps {
  stage: StageData;
  isDm?: boolean;
  defaultExpanded?: boolean;
}

export const StageCard: React.FC<StageCardProps> = ({ stage, isDm = false, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-slate-900 border transition-all rounded-2xl overflow-hidden shadow-xl ${
      isDm ? 'border-purple-500/30' : 'border-amber-500/30'
    }`}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 hover:bg-slate-800/80 transition-colors border-b border-slate-800"
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold font-fantasy border shadow-md flex-shrink-0 ${
            isDm
              ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
          }`}>
            <span className="text-[10px] uppercase tracking-tighter opacity-70">Этап</span>
            <span className="text-xl leading-none">{stage.stageNumber}</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isDm
                  ? 'bg-purple-950/80 text-purple-300 border-purple-600/40'
                  : 'bg-amber-950/80 text-amber-300 border-amber-600/40'
              }`}>
                {stage.levelRange}
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {stage.subtitle}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-fantasy">
              {stage.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hidden md:inline">
            {stage.badge}
          </span>
          <button className="text-slate-400 hover:text-white p-1">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Mindset box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDm
              ? 'bg-purple-950/20 border-purple-800/40'
              : 'bg-amber-950/20 border-amber-800/40'
          }`}>
            <Quote className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isDm ? 'text-purple-400' : 'text-amber-400'}`} />
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Майндсет {isDm ? 'ведущего (DM)' : 'игрока'}:
              </span>
              <p className={`text-sm italic font-medium leading-relaxed ${isDm ? 'text-purple-200' : 'text-amber-200'}`}>
                {stage.mindset}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {stage.description}
          </p>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {stage.sections.map((sec, idx) => (
              <div key={idx} className="bg-slate-950/60 rounded-xl p-4 sm:p-5 border border-slate-800/80 space-y-3.5">
                <h4 className="text-base font-bold text-amber-300 font-fantasy flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {sec.heading}
                </h4>

                {/* Bullet items */}
                {sec.items && (
                  <ul className="space-y-2">
                    {sec.items.map((item, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Numbered items */}
                {sec.numbered && (
                  <ol className="space-y-2.5">
                    {sec.numbered.map((item, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {/* Tables */}
                {sec.table && (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
                        <tr>
                          {sec.table.headers.map((h, i) => (
                            <th key={i} className="p-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-3 align-top leading-relaxed ${
                                  cIdx === 0 ? 'font-bold text-amber-200 sm:w-1/3' : 'text-slate-300'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Warnings list */}
                {sec.warnings && (
                  <div className="space-y-2 pt-1">
                    {sec.warnings.map((warn, wIdx) => (
                      <div
                        key={wIdx}
                        className="p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-xs text-rose-200 flex items-start gap-2.5 leading-relaxed"
                      >
                        <AlertOctagon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {sec.tips && (
                  <div className="space-y-2 pt-1">
                    {sec.tips.map((tip, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-200 flex items-start gap-2.5 leading-relaxed"
                      >
                        <Lightbulb className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quote block */}
                {sec.quote && (
                  <div className="p-3 rounded-lg bg-slate-900 border-l-4 border-amber-500 text-xs italic text-amber-200">
                    {sec.quote}
                  </div>
                )}

                {/* Code block */}
                {sec.codeBlock && (
                  <pre className="p-3.5 rounded-lg bg-slate-900 font-mono text-xs text-amber-200/90 overflow-x-auto border border-slate-800 leading-relaxed whitespace-pre-wrap">
                    {sec.codeBlock}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
