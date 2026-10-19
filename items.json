"use client";

import { articlesForTome, TOMES, type LibraryArticle, type TomeRecord } from "@/data/articles";
import { cn } from "@/lib/cn";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useMemo, useState } from "react";

export function LibraryHall() {
  const [tomeId, setTomeId] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);

  const tome = TOMES.find((item) => item.id === tomeId) ?? null;
  const articles = useMemo(() => (tomeId ? articlesForTome(tomeId) : []), [tomeId]);
  const article = articles.find((item) => item.id === articleId) ?? null;
  const chapters = useMemo(() => Array.from(new Set(articles.map((item) => item.chapter))), [articles]);

  if (article && tome) {
    return <ArticleReader tome={tome} article={article} onBack={() => setArticleId(null)} />;
  }

  if (tome) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => setTomeId(null)}
          className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-100"
        >
          <ArrowLeft className="h-4 w-4" /> К полкам
        </button>
        <header className="rounded-3xl border border-amber-500/20 bg-slate-900 p-6">
          <p className="text-xs uppercase tracking-widest text-amber-400">{tome.author}</p>
          <h2 className="font-fantasy text-3xl text-white">{tome.title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">{tome.blurb}</p>
        </header>
        {chapters.map((chapter) => (
          <section key={chapter}>
            <h3 className="mb-3 font-fantasy text-lg text-amber-200">{chapter}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {articles
                .filter((item) => item.chapter === chapter)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setArticleId(item.id)}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left hover:border-amber-500/40"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">{item.badge}</p>
                    <p className="font-fantasy text-lg text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-amber-500/20 bg-slate-900 p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-amber-400" />
          <h2 className="font-fantasy text-2xl text-amber-100">Библиотека скриптория</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Семь томов арены: классы, расы, заклинания, бестиарий и механика стола. Откройте книгу — внутри практика для игрока и мастера.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOMES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTomeId(item.id)}
            className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-left shadow-xl transition hover:-translate-y-1 hover:border-amber-500/40"
          >
            <div className="relative h-52">
              <img src={item.cover} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <span className="absolute bottom-3 left-4 font-fantasy text-xl text-white">{item.spine}</span>
            </div>
            <div className="p-4">
              <p className="font-fantasy text-lg text-amber-100">{item.title}</p>
              <p className="mt-1 text-xs text-slate-400">{item.blurb}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ArticleReader({
  tome,
  article,
  onBack,
}: {
  tome: TomeRecord;
  article: LibraryArticle;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-100">
        <ArrowLeft className="h-4 w-4" /> {tome.title}
      </button>
      <article className="overflow-hidden rounded-3xl border border-amber-900/20 shadow-2xl">
        <div className="parchment px-6 py-8 text-stone-900 sm:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">{article.badge} · {article.chapter}</p>
          <h2 className="font-fantasy mt-2 text-3xl">{article.title}</h2>
          <p className="mt-1 text-sm italic text-stone-600">{article.subtitle}</p>
          {article.epigraph ? <p className="mt-4 border-l-4 border-amber-800/50 pl-4 font-book text-sm italic">{article.epigraph}</p> : null}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-fantasy text-xl text-amber-900">{article.lead.heading}</h3>
              <div className="mt-3 space-y-3 font-book text-[17px] leading-relaxed">
                {article.lead.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="dropcap">{paragraph}</p>
                ))}
              </div>
              {article.lead.insights?.length ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {article.lead.insights.map((insight) => (
                    <li key={insight} className="rounded-xl bg-amber-950/10 px-3 py-2">{insight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div>
              <h3 className="font-fantasy text-xl text-amber-900">{article.practice.heading}</h3>
              <ol className="mt-3 space-y-3">
                {article.practice.steps.map((step, index) => (
                  <li key={step.title} className="rounded-xl bg-white/40 p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{index + 1}. {step.title}</p>
                    <p className="mt-1 font-book text-sm leading-relaxed">{step.text}</p>
                  </li>
                ))}
              </ol>
              <div className={cn("mt-4 rounded-xl border border-amber-900/20 p-3 text-sm", "bg-amber-950/10")}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{article.practice.verdict.for}</p>
                <p className="mt-1 font-book">{article.practice.verdict.text}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
