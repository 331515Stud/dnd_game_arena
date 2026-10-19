import React from 'react';
import type { Article } from '../../library/types';
import { TOC_CHAPTER, VERDICT_LABEL } from '../../library/types';
import { plateKeyOf, usePlateUrl } from '../../library/plates';

const ink = '#2c1d11';
const inkSoft = '#4a3520';
const inkFaded = '#7a5c38';
const rubric = '#8c2f1a';

/** Wide outer margins, wider still at the gutter — like a printed folio. */
const PAD_LEFT = 'pl-7 pr-7 lg:pl-12 lg:pr-[60px] pt-8 lg:pt-10 pb-14';
const PAD_RIGHT = 'pl-7 pr-7 lg:pl-[60px] lg:pr-12 pt-8 lg:pt-10 pb-14';

export interface TocItem {
  id: string;
  title: string;
  chapter: string;
  index: number;
}

/** Highlight search hits inside page text. */
const Mark: React.FC<{ text: string; q?: string }> = ({ text, q }) => {
  const needle = q?.trim().toLowerCase();
  if (!needle || needle.length < 2) return <>{text}</>;
  const out: React.ReactNode[] = [];
  let rest = text;
  let k = 0;
  let at = rest.toLowerCase().indexOf(needle);
  while (at !== -1) {
    out.push(rest.slice(0, at));
    out.push(
      <mark key={k++} className="search-hit">
        {rest.slice(at, at + needle.length)}
      </mark>
    );
    rest = rest.slice(at + needle.length);
    at = rest.toLowerCase().indexOf(needle);
  }
  out.push(rest);
  return <>{out}</>;
};

const Fleuron: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`} aria-hidden>
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8b6a3f]/50 to-[#8b6a3f]/50" />
    <svg viewBox="0 0 40 12" className="w-9 h-3 text-[#8b6a3f]">
      <path d="M2 6 C10 0 14 0 20 6 C26 12 30 12 38 6 M20 6 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
    <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#8b6a3f]/50 to-[#8b6a3f]/50" />
  </div>
);

const RunningHead: React.FC<{ left: string; right: string }> = ({ left, right }) => (
  <div className="flex items-baseline justify-between gap-4 pb-2 border-b border-[#8b6a3f]/35">
    <span className="font-fantasy text-[10px] uppercase tracking-[0.2em] font-bold truncate" style={{ color: inkFaded }}>
      {left}
    </span>
    <span className="font-book italic text-[11.5px] whitespace-nowrap" style={{ color: '#9a7a4f' }}>
      {right}
    </span>
  </div>
);

const Folio: React.FC<{ n: number }> = ({ n }) => (
  <div className="mt-auto pt-6 text-center font-book text-[12px] tracking-[0.3em]" style={{ color: '#9a7a4f' }}>
    — {n} —
  </div>
);

/** An engraved plate rendered in the browser and cached; never a stand-in cover. */
export const PlateImage: React.FC<{ plateKey: string | null; caption?: string; className?: string }> = React.memo(
  ({ plateKey, caption, className = '' }) => {
    const url = usePlateUrl(plateKey);
    if (!plateKey) return null;
    return (
      <figure className={`plate ${className}`}>
        <div className="plate-mat">
          <div className="plate-window">
            {url ? (
              <img src={url} alt="" draggable={false} decoding="sync" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="plate-pending" />
            )}
          </div>
        </div>
        {caption && <figcaption className="plate-caption">{caption}</figcaption>}
      </figure>
    );
  }
);

interface FaceProps {
  article: Article;
  leaf: number;
  total?: number;
  query?: string;
  tomeTitle?: string;
}

/* ══════════════ ЛЕВАЯ СТРАНИЦА — суть ══════════════ */
const LeftPageView: React.FC<FaceProps> = ({ article: a, leaf, total = 0, query, tomeTitle }) => {
  const isToc = a.chapter === TOC_CHAPTER;
  return (
    <article lang="ru" className="parchment page-sheet h-full relative">
      <div className={`relative h-full flex flex-col overflow-y-auto book-scrollbar ${PAD_LEFT}`}>
        <RunningHead left={`${tomeTitle ? tomeTitle + ' · ' : ''}${a.chapter}`} right={`лист ${leaf}${total ? ` из ${total}` : ''}`} />

        <header className="mt-6">
          {a.badge && <span className="rubric-chip">{a.badge}</span>}
          <h2 className="font-fantasy font-black text-[27px] lg:text-[31px] leading-[1.08] mt-3" style={{ color: '#2a170b' }}>
            <Mark text={a.title} q={query} />
          </h2>
          {a.subtitle && (
            <p className="font-book italic text-[15px] mt-1.5 leading-snug" style={{ color: inkSoft }}>
              <Mark text={a.subtitle} q={query} />
            </p>
          )}
        </header>

        {a.epigraph && <p className="epigraph mt-4">{a.epigraph}</p>}

        {isToc && <PlateImage plateKey={plateKeyOf(a)} caption={`Фронтиспис. ${a.title}`} className="mt-5" />}

        {a.stats.length > 0 && (
          <dl className="stat-grid mt-5">
            {a.stats.map((s) => (
              <div key={s.label} className="stat-cell">
                <dt>{s.label}</dt>
                <dd>
                  <Mark text={s.value} q={query} />
                </dd>
              </div>
            ))}
          </dl>
        )}

        <Fleuron className="my-5" />

        <section>
          {a.lead.heading && <h3 className="page-h3">{a.lead.heading}</h3>}
          <div className="mt-3 space-y-3">
            {a.lead.paragraphs.map((p, i) => (
              <p key={i} className={`body-text ${i === 0 ? 'dropcap' : ''}`}>
                <Mark text={p} q={query} />
              </p>
            ))}
          </div>

          {a.lead.insights.length > 0 && (
            <div className="mt-5">
              <div className="page-kicker">Главное</div>
              <ul className="mt-2 space-y-2">
                {a.lead.insights.map((t, i) => (
                  <li key={i} className="insight">
                    <span className="insight-mark">✦</span>
                    <span>
                      <Mark text={t} q={query} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {a.lead.quote && (
          <figure className="page-quote mt-6">
            <blockquote>{a.lead.quote.text}</blockquote>
            <figcaption>— {a.lead.quote.cite}</figcaption>
          </figure>
        )}

        <Folio n={leaf * 2 - 1} />
      </div>
    </article>
  );
};

export const LeftPageFace = React.memo(LeftPageView);

/* ══════════════ ПРАВАЯ СТРАНИЦА — гравюра и практика / указатель ══════════════ */
interface RightProps extends FaceProps {
  toc?: TocItem[];
  current?: number;
  onJump?: (index: number) => void;
}

const TocList: React.FC<{ toc: TocItem[]; current?: number; onJump?: (i: number) => void }> = ({ toc, current, onJump }) => {
  const groups: { chapter: string; items: TocItem[] }[] = [];
  for (const item of toc) {
    if (item.chapter === TOC_CHAPTER) continue;
    const last = groups[groups.length - 1];
    if (last && last.chapter === item.chapter) last.items.push(item);
    else groups.push({ chapter: item.chapter, items: [item] });
  }
  return (
    <nav className="mt-5 space-y-5" aria-label="Оглавление тома">
      {groups.map((g) => (
        <div key={g.chapter}>
          <div className="toc-chapter">{g.chapter}</div>
          <ul className="mt-1.5">
            {g.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`toc-row ${item.index === current ? 'is-current' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onJump?.(item.index);
                  }}
                >
                  <span className="truncate">{item.title}</span>
                  <span className="toc-leader" />
                  <span className="tabular-nums">{item.index * 2 + 1}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

const RightPageView: React.FC<RightProps> = ({ article: a, leaf, query, toc, current, onJump }) => {
  const isToc = a.chapter === TOC_CHAPTER;
  return (
    <article lang="ru" className="parchment page-sheet h-full relative">
      <div className={`relative h-full flex flex-col overflow-y-auto book-scrollbar ${PAD_RIGHT}`}>
        <RunningHead left={isToc ? 'Оглавление' : 'Практика за столом'} right={`стр. ${leaf * 2}`} />

        {isToc && toc ? (
          <TocList toc={toc} current={current} onJump={onJump} />
        ) : (
          <>
            <PlateImage plateKey={plateKeyOf(a)} caption={`Табл. ${leaf}. ${a.title}`} className="mt-6" />

            <section className="mt-6">
              {a.practice.heading && <h3 className="page-h3">{a.practice.heading}</h3>}
              <ol className="mt-3 space-y-2.5">
                {a.practice.steps.map((s, i) => (
                  <li key={i} className="step">
                    <span className="step-num">{i + 1}</span>
                    <div>
                      <div className="step-title">
                        <Mark text={s.title} q={query} />
                      </div>
                      <p className="step-text">
                        <Mark text={s.text} q={query} />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {a.table && a.table.headers.length > 0 && (
              <table className="page-table mt-5">
                <thead>
                  <tr>
                    {a.table.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {a.table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {a.practice.audience.length > 0 && (
              <div className="mt-5">
                <div className="page-kicker">Кому пригодится</div>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {a.practice.audience.map((r, i) => (
                    <li key={i} className="audience-chip">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {a.practice.verdict.text && (
          <div className="verdict mt-6">
            <div className="verdict-seal" aria-hidden>
              ✠
            </div>
            <div>
              <div className="page-kicker" style={{ color: rubric }}>
                Слово библиотекаря · {VERDICT_LABEL[a.practice.verdict.for] ?? 'Всему столу'}
              </div>
              <p className="mt-1 font-book text-[14px] leading-[1.55]" style={{ color: ink }}>
                {a.practice.verdict.text}
              </p>
            </div>
          </div>
        )}

        <Folio n={leaf * 2} />
      </div>
    </article>
  );
};

export const RightPageFace = React.memo(RightPageView);
