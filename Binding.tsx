import React from 'react';
import { MetaSkill } from '../data/dndData';
import { Ear, MessageSquareShare, ShieldAlert, BookOpen, Sparkles, Timer, Users, Gavel, HeartHandshake, Compass } from 'lucide-react';

interface MetaSkillsViewProps {
  skills: MetaSkill[];
  title: string;
  subtitle: string;
  colorScheme: 'amber' | 'purple';
}

const ICON_MAP: Record<string, any> = {
  Ear,
  MessageSquareShare,
  ShieldAlert,
  BookOpen,
  Sparkles,
  Timer,
  Users,
  Gavel,
  HeartHandshake
};

export const MetaSkillsView: React.FC<MetaSkillsViewProps> = ({ skills, title, subtitle, colorScheme }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Compass className={`w-6 h-6 ${colorScheme === 'amber' ? 'text-amber-400' : 'text-purple-400'}`} />
          <h3 className="text-xl font-bold text-white font-fantasy">{title}</h3>
        </div>
        <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, idx) => {
          const IconComponent = ICON_MAP[skill.iconName] || Compass;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border bg-slate-950/70 transition-all hover:border-slate-700 flex flex-col justify-between ${
                colorScheme === 'amber' ? 'hover:border-amber-500/40' : 'hover:border-purple-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      colorScheme === 'amber' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h4 className="font-fantasy font-bold text-white text-base">{skill.name}</h4>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {skill.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {skill.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                  Как тренировать:
                </span>
                <p className={`text-xs font-medium leading-relaxed ${
                  colorScheme === 'amber' ? 'text-amber-200/90' : 'text-purple-200/90'
                }`}>
                  {skill.howToTrain}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
