import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Database, Download, RotateCcw, Upload } from 'lucide-react';
import { BookLibrary } from './BookLibrary';
import { ArticleEditor } from './ArticleEditor';
import { CoverArt, leatherStyle } from './book/Binding';
import { useLibrary } from '../library/useLibrary';
import { plateKeyOf, warmPlates } from '../library/plates';
import { SEED_BY_ID } from '../library/seed';
import type { Article, TomeRecord } from '../library/types';
import { TOC_CHAPTER } from '../library/types';

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const LibraryHall: React.FC = () => {
  const lib = useLibrary();
  const [open, setOpen] = useState<{ tome: TomeRecord; from: DOMRect | null } | null>(null);
  const [veil, setVeil] = useState(false);
  const [editing, setEditing] = useState<{ article: Article; isNew: boolean } | null>(null);
  const [focus, setFocus] = useState<{ id: string; nonce: number } | null>(null);
  const [notice, setNotice] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const noticeTimer = useRef(0);

  const flash = (text: string) => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2600);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const choose = (tome: TomeRecord, cover: HTMLElement | null) => {
    if (open) return;
    const list = lib.byTome.get(tome.id) ?? [];
    warmPlates(list.slice(0, 3).map(plateKeyOf), 'now');
    setFocus(null);
    setOpen({ tome, from: cover ? cover.getBoundingClientRect() : null });
    requestAnimationFrame(() => requestAnimationFrame(() => setVeil(true)));
  };

  const getReturnRect = useCallback(() => {
    if (!open) return null;
    const el = document.querySelector<HTMLElement>(`[data-cover="${open.tome.id}"]`);
    return el ? el.getBoundingClientRect() : null;
  }, [open]);

  const createAfter = useCallback(
    (after: Article | null) => {
      if (!open) return;
      const list = lib.byTome.get(open.tome.id) ?? [];
      const pos = after ? list.findIndex((a) => a.id === after.id) : list.length - 1;
      const prevOrder = pos >= 0 ? list[pos].order : 0;
      const nextOrder = list[pos + 1]?.order ?? prevOrder + 200;
      const fallbackChapter = list.find((a) => a.chapter !== TOC_CHAPTER)?.chapter ?? 'Новый раздел';
      const blank: Article = {
        id: `user-${Date.now().toString(36)}`,
        tome: open.tome.id,
        order: (prevOrder + nextOrder) / 2,
        chapter: after && after.chapter !== TOC_CHAPTER ? after.chapter : fallbackChapter,
        title: 'Новая статья',
        subtitle: '',
        badge: '',
        epigraph: '',
        stats: [],
        table: null,
        lead: { heading: 'Суть', paragraphs: [], insights: [], quote: null },
        practice: { heading: 'Как применять', steps: [], audience: [], verdict: { for: 'both', text: '' } },
        plate: '',
        origin: 'user'
      };
      setEditing({ article: blank, isNew: true });
    },
    [lib.byTome, open]
  );

  const save = async (a: Article) => {
    const rec = await lib.save(a);
    setEditing(null);
    setFocus({ id: rec.id, nonce: Date.now() });
    flash('Статья сохранена в базе');
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const n = await lib.importJson(file);
      flash(`Загружено статей: ${n}`);
    } catch {
      flash('Не удалось прочитать файл базы');
    }
  };

  const top = lib.tomes.slice(0, 4);
  const bottom = lib.tomes.slice(4);

  return (
    <>
      <div className="space-y-6">
        <div className="hall-bar">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-5 h-5 text-amber-500/90 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold font-fantasy text-amber-100 leading-tight">Зал скрипториев</h2>
              <p className="text-[11px] text-amber-200/50 truncate">
                {lib.tomes.length} томов · {lib.total} {plural(lib.total, 'статья', 'статьи', 'статей')} в базе
                {lib.editedCount > 0 && ` · ваших правок: ${lib.editedCount}`}
                {!lib.persistent && ' · база только на этот сеанс'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-amber-200/45 mr-1">
              <Database className="w-3.5 h-3.5" /> База библиотеки
            </span>
            <button type="button" className="hall-tool" onClick={lib.exportJson}>
              <Download className="w-3.5 h-3.5" /> Выгрузить
            </button>
            <button type="button" className="hall-tool" onClick={() => fileRef.current?.click()}>
              <Upload className="w-3.5 h-3.5" /> Загрузить
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => importFile(e.target.files?.[0])} />
            {lib.editedCount > 0 && (
              <button
                type="button"
                className="hall-tool"
                onClick={async () => {
                  if (!window.confirm('Сбросить все правки и вернуть исходные тексты библиотеки?')) return;
                  await lib.resetAll();
                  flash('Библиотека возвращена к исходному виду');
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Сбросить правки
              </button>
            )}
          </div>
        </div>

        <div className="bookcase">
          <div className="candle-glow pointer-events-none absolute left-[10%] top-6 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,176,74,.16),transparent_70%)] blur-2xl" />
          <div className="candle-glow pointer-events-none absolute right-[8%] top-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(255,140,50,.12),transparent_70%)] blur-2xl" style={{ animationDelay: '1.6s' }} />
          <div className="relative px-4 sm:px-10 pt-8 pb-6 space-y-2">
            <p className="text-center font-book italic text-amber-200/70 max-w-2xl mx-auto text-[15px] leading-relaxed pb-4">
              Семь переплётов, семь самостоятельных томов. Снимите нужный с полки — он раскроется у вас в руках.
            </p>
            <ShelfRow tomes={top} counts={lib.byTome} onOpen={choose} hiddenId={open?.tome.id} />
            <ShelfRow tomes={bottom} counts={lib.byTome} onOpen={choose} hiddenId={open?.tome.id} />
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden"
          style={{ background: veil ? 'rgba(10,7,5,.97)' : 'rgba(10,7,5,0)', transition: 'background 650ms ease' }}
        >
          <div className="min-h-full px-3 sm:px-8 py-4 sm:py-6">
            <BookLibrary
              key={open.tome.id}
              tome={open.tome}
              articles={lib.byTome.get(open.tome.id) ?? []}
              intro={open.from}
              getReturnRect={getReturnRect}
              onLeaving={() => setVeil(false)}
              onClosed={() => {
                setOpen(null);
                setVeil(false);
              }}
              onEdit={(article) => setEditing({ article, isNew: false })}
              onCreate={createAfter}
              focus={focus}
              paused={Boolean(editing)}
            />
          </div>
        </div>
      )}

      {editing && (
        <ArticleEditor
          key={editing.article.id}
          article={editing.article}
          isNew={editing.isNew}
          chapters={(lib.byTome.get(editing.article.tome) ?? []).map((a) => a.chapter)}
          canRestore={!editing.isNew && Boolean(editing.article.edited) && SEED_BY_ID.has(editing.article.id)}
          onSave={save}
          onCancel={() => setEditing(null)}
          onDelete={async (a) => {
            await lib.remove(a);
            setEditing(null);
            flash('Статья убрана из тома');
          }}
          onRestore={async (id) => {
            await lib.restore(id);
            setEditing(null);
            setFocus({ id, nonce: Date.now() });
            flash('Возвращён исходный текст');
          }}
        />
      )}

      {notice && <div className="hall-notice">{notice}</div>}
    </>
  );
};

const ShelfRow: React.FC<{
  tomes: TomeRecord[];
  counts: Map<string, Article[]>;
  onOpen: (t: TomeRecord, cover: HTMLElement | null) => void;
  hiddenId?: string;
}> = ({ tomes, counts, onOpen, hiddenId }) => (
  <div className="pt-4">
    <div className="flex flex-wrap justify-center gap-7 sm:gap-10 px-2">
      {tomes.map((tome, i) => (
        <FolioBook
          key={tome.id}
          tome={tome}
          tilt={i % 2 === 0 ? -1 : 1}
          count={counts.get(tome.id)?.length ?? 0}
          firstPlates={(counts.get(tome.id) ?? []).slice(0, 3).map(plateKeyOf)}
          onOpen={onOpen}
          hidden={hiddenId === tome.id}
        />
      ))}
    </div>
    <div className="shelf-plank" />
  </div>
);

const FolioBook: React.FC<{
  tome: TomeRecord;
  tilt: number;
  count: number;
  firstPlates: (string | null)[];
  onOpen: (t: TomeRecord, cover: HTMLElement | null) => void;
  hidden: boolean;
}> = ({ tome, tilt, count, firstPlates, onOpen, hidden }) => {
  const coverRef = useRef<HTMLDivElement>(null);
  return (
    <button
      type="button"
      onClick={() => onOpen(tome, coverRef.current)}
      onMouseEnter={() => warmPlates(firstPlates, 'idle')}
      onFocus={() => warmPlates(firstPlates, 'idle')}
      className="group w-[150px] sm:w-[164px] text-left focus:outline-none"
      style={{ perspective: 900, visibility: hidden ? 'hidden' : 'visible' }}
      aria-label={`Открыть том «${tome.title}»`}
    >
      <div
        className="relative h-[222px] sm:h-[242px] transition-transform duration-500 ease-out group-hover:-translate-y-3 group-focus-visible:-translate-y-3"
        style={{ transform: `rotateZ(${tilt * 0.6}deg) rotateY(-17deg)`, transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-y-1.5 right-0 w-[12px] rounded-r-sm"
          style={{ background: 'repeating-linear-gradient(180deg, #efe6cf 0 2px, #d6c7a3 2px 3px)', transform: 'translateZ(-8px)', boxShadow: '2px 0 0 #bfae88' }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[24px] flex items-center justify-center overflow-hidden"
          style={{ ...leatherStyle(tome), transform: 'rotateY(-90deg) translateZ(12px)', boxShadow: 'inset -3px 0 6px rgba(0,0,0,.5)' }}
        >
          <span className="font-fantasy text-[10px] tracking-[0.2em] uppercase text-amber-200/85 whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            {tome.spine}
          </span>
        </div>
        <div
          ref={coverRef}
          data-cover={tome.id}
          className="absolute inset-0 overflow-hidden rounded-r-[5px] rounded-l-[2px]"
          style={{ boxShadow: '10px 16px 26px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.6)' }}
        >
          <CoverArt tome={tome} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,236,190,.16) 50%, transparent 70%)' }} />
        </div>
      </div>
      <div className="mt-3.5 pr-1">
        <p className="text-[11.5px] text-amber-100/90 font-semibold leading-snug group-hover:text-amber-200 transition-colors">{tome.title}</p>
        <p className="text-[10.5px] text-amber-200/45 mt-0.5">
          {count} {plural(count, 'разворот', 'разворота', 'разворотов')}
        </p>
      </div>
    </button>
  );
};
