import React, { useMemo, useRef, useState } from 'react';
import type { Article, VerdictFor } from '../library/types';
import { TOC_CHAPTER, VERDICT_LABEL } from '../library/types';
import { storeUserPlate } from '../library/plates';
import { hasPlate } from '../plates/registry';
import { PlateImage } from './book/PageFaces';
import { ImagePlus, RotateCcw, Save, Trash2, X } from 'lucide-react';

interface Props {
  article: Article;
  isNew: boolean;
  chapters: string[];
  canRestore: boolean;
  onSave: (a: Article) => void | Promise<void>;
  onCancel: () => void;
  onDelete: (a: Article) => void | Promise<void>;
  onRestore: (id: string) => void | Promise<void>;
}

const lines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block">
    <span className="editor-label">{label}</span>
    {children}
    {hint && <span className="editor-hint">{hint}</span>}
  </label>
);

export const ArticleEditor: React.FC<Props> = ({ article, isNew, chapters, canRestore, onSave, onCancel, onDelete, onRestore }) => {
  const [title, setTitle] = useState(article.title);
  const [subtitle, setSubtitle] = useState(article.subtitle);
  const [badge, setBadge] = useState(article.badge);
  const [epigraph, setEpigraph] = useState(article.epigraph);
  const [chapter, setChapter] = useState(article.chapter);
  const [stats, setStats] = useState(article.stats.map((s) => `${s.label}: ${s.value}`).join('\n'));
  const [leadHeading, setLeadHeading] = useState(article.lead.heading);
  const [leadText, setLeadText] = useState(article.lead.paragraphs.join('\n\n'));
  const [insights, setInsights] = useState(article.lead.insights.join('\n'));
  const [quote, setQuote] = useState(article.lead.quote?.text ?? '');
  const [cite, setCite] = useState(article.lead.quote?.cite ?? '');
  const [practiceHeading, setPracticeHeading] = useState(article.practice.heading);
  const [steps, setSteps] = useState(article.practice.steps.map((s) => `${s.title} — ${s.text}`).join('\n'));
  const [audience, setAudience] = useState(article.practice.audience.join('\n'));
  const [verdictFor, setVerdictFor] = useState<VerdictFor>(article.practice.verdict.for);
  const [verdict, setVerdict] = useState(article.practice.verdict.text);
  const [plate, setPlate] = useState<string>(article.plate ?? article.id);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const chapterOptions = useMemo(() => Array.from(new Set([...chapters.filter((c) => c !== TOC_CHAPTER), chapter])).filter(Boolean), [chapters, chapter]);
  const generated = hasPlate(article.id);
  const previewKey = plate === '' ? null : plate.startsWith('user:') || hasPlate(plate) ? plate : null;

  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    const next: Article = {
      ...article,
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      epigraph: epigraph.trim(),
      chapter: chapter.trim() || 'Без раздела',
      stats: lines(stats).map((l) => {
        const at = l.indexOf(':');
        return at > 0 ? { label: l.slice(0, at).trim(), value: l.slice(at + 1).trim() } : { label: l, value: '' };
      }),
      lead: {
        heading: leadHeading.trim(),
        paragraphs: paragraphs(leadText),
        insights: lines(insights),
        quote: quote.trim() ? { text: quote.trim(), cite: cite.trim() } : null
      },
      practice: {
        heading: practiceHeading.trim(),
        steps: lines(steps).map((l) => {
          const [t, ...rest] = l.split(/\s+[—–-]\s+/);
          return { title: t.trim(), text: rest.join(' — ').trim() };
        }),
        audience: lines(audience),
        verdict: { for: verdictFor, text: verdict.trim() }
      },
      plate
    };
    await onSave(next);
    setBusy(false);
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      setPlate(await storeUserPlate(article.id, file));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-[2px] overflow-y-auto" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="editor-panel" role="dialog" aria-label={isNew ? 'Новая статья' : 'Правка статьи'}>
        <div className="flex items-center justify-between gap-3 border-b border-[#8b6a3f]/30 pb-3">
          <div>
            <div className="editor-label !mb-0">{isNew ? 'Новая статья в базе' : 'Правка статьи в базе'}</div>
            <h3 className="font-fantasy text-[22px] text-[#2a170b] font-bold">{title || 'Без названия'}</h3>
          </div>
          <button type="button" onClick={onCancel} className="editor-icon" aria-label="Закрыть">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_220px] gap-6 mt-5">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Название">
                <input className="editor-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <Field label="Раздел тома" hint="Можно выбрать или вписать новый">
                <input className="editor-input" list="chapter-options" value={chapter} onChange={(e) => setChapter(e.target.value)} />
                <datalist id="chapter-options">
                  {chapterOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Подзаголовок">
                <input className="editor-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </Field>
              <Field label="Метка" hint="Например: «к12 · Сила» или «ПО 5 · великан»">
                <input className="editor-input" value={badge} onChange={(e) => setBadge(e.target.value)} />
              </Field>
            </div>
            <Field label="Эпиграф">
              <input className="editor-input" value={epigraph} onChange={(e) => setEpigraph(e.target.value)} />
            </Field>
            <Field label="Характеристики" hint="По одной на строку: «Название: значение»">
              <textarea className="editor-input min-h-[84px]" value={stats} onChange={(e) => setStats(e.target.value)} />
            </Field>

            <div className="editor-section">Левая страница — суть</div>
            <Field label="Заголовок раздела">
              <input className="editor-input" value={leadHeading} onChange={(e) => setLeadHeading(e.target.value)} />
            </Field>
            <Field label="Текст" hint="Абзацы разделяйте пустой строкой">
              <textarea className="editor-input min-h-[150px]" value={leadText} onChange={(e) => setLeadText(e.target.value)} />
            </Field>
            <Field label="Главное" hint="Одна мысль на строку">
              <textarea className="editor-input min-h-[84px]" value={insights} onChange={(e) => setInsights(e.target.value)} />
            </Field>
            <div className="grid sm:grid-cols-[1fr_200px] gap-4">
              <Field label="Цитата">
                <input className="editor-input" value={quote} onChange={(e) => setQuote(e.target.value)} />
              </Field>
              <Field label="Автор цитаты">
                <input className="editor-input" value={cite} onChange={(e) => setCite(e.target.value)} />
              </Field>
            </div>

            <div className="editor-section">Правая страница — практика</div>
            <Field label="Заголовок раздела">
              <input className="editor-input" value={practiceHeading} onChange={(e) => setPracticeHeading(e.target.value)} />
            </Field>
            <Field label="Шаги" hint="По одному на строку: «Заголовок — пояснение»">
              <textarea className="editor-input min-h-[110px]" value={steps} onChange={(e) => setSteps(e.target.value)} />
            </Field>
            <Field label="Кому пригодится" hint="По одному на строку">
              <textarea className="editor-input min-h-[70px]" value={audience} onChange={(e) => setAudience(e.target.value)} />
            </Field>
            <div className="grid sm:grid-cols-[180px_1fr] gap-4">
              <Field label="Слово библиотекаря для">
                <select className="editor-input" value={verdictFor} onChange={(e) => setVerdictFor(e.target.value as VerdictFor)}>
                  {(Object.keys(VERDICT_LABEL) as VerdictFor[]).map((k) => (
                    <option key={k} value={k}>
                      {VERDICT_LABEL[k]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Текст вывода">
                <input className="editor-input" value={verdict} onChange={(e) => setVerdict(e.target.value)} />
              </Field>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="editor-label">Иллюстрация</div>
            {previewKey ? (
              <PlateImage plateKey={previewKey} />
            ) : (
              <div className="plate-mat">
                <div className="plate-window grid place-items-center">
                  <span className="font-book italic text-[13px] text-[#7a5c38] text-center px-4">Без иллюстрации</span>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            <button type="button" className="editor-btn w-full" onClick={() => fileRef.current?.click()} disabled={busy}>
              <ImagePlus className="w-4 h-4" /> Своя картинка
            </button>
            {generated && plate !== article.id && (
              <button type="button" className="editor-btn w-full" onClick={() => setPlate(article.id)}>
                Вернуть гравюру
              </button>
            )}
            {plate !== '' && (
              <button type="button" className="editor-btn w-full" onClick={() => setPlate('')}>
                Убрать картинку
              </button>
            )}
            <p className="editor-hint">Картинка хранится в базе браузера вместе со статьёй.</p>
          </aside>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#8b6a3f]/30">
          <button type="button" className="editor-btn editor-btn-primary" onClick={submit} disabled={busy || !title.trim()}>
            <Save className="w-4 h-4" /> Сохранить
          </button>
          <button type="button" className="editor-btn" onClick={onCancel}>
            Отмена
          </button>
          <span className="flex-1" />
          {canRestore && (
            <button type="button" className="editor-btn" onClick={() => onRestore(article.id)}>
              <RotateCcw className="w-4 h-4" /> Исходный текст
            </button>
          )}
          {!isNew && (
            <button
              type="button"
              className="editor-btn editor-btn-danger"
              onClick={() => {
                if (window.confirm(`Удалить «${article.title}» из тома?`)) onDelete(article);
              }}
            >
              <Trash2 className="w-4 h-4" /> Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
