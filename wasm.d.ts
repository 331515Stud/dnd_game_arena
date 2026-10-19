import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from './db';
import { SEED_ARTICLES, SEED_BY_ID, SEED_TOMES, SEED_VERSION } from './seed';
import type { Article, TomeRecord } from './types';

/** Bring the browser database in line with the bundled JSON, never touching articles the user edited. */
async function syncSeed(): Promise<Article[]> {
  const stored = await db.articles.all();
  const byId = new Map(stored.map((a) => [a.id, a]));
  const version = await db.meta.get<string>('seedVersion');
  if (version === SEED_VERSION && stored.length > 0) return stored;

  const fresh = SEED_ARTICLES.filter((seed) => {
    const mine = byId.get(seed.id);
    return !mine || (!mine.edited && !mine.deleted);
  });
  await db.articles.putMany(fresh);
  for (const a of stored) {
    if (a.origin === 'seed' && !a.edited && !SEED_BY_ID.has(a.id)) await db.articles.remove(a.id);
  }
  await db.meta.set('seedVersion', SEED_VERSION);
  return db.articles.all();
}

export function useLibrary() {
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);

  useEffect(() => {
    let alive = true;
    db.persistent().then((p) => alive && setPersistent(p));
    syncSeed()
      .then((list) => {
        if (!alive) return;
        if (list.length) setArticles(list);
        setReady(true);
      })
      .catch(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(() => articles.filter((a) => !a.deleted), [articles]);

  const byTome = useMemo(() => {
    const map = new Map<string, Article[]>();
    for (const t of SEED_TOMES) map.set(t.id, []);
    for (const a of visible) {
      if (!map.has(a.tome)) map.set(a.tome, []);
      map.get(a.tome)!.push(a);
    }
    for (const list of map.values()) list.sort((x, y) => x.order - y.order);
    return map;
  }, [visible]);

  const upsertLocal = useCallback((rec: Article) => {
    setArticles((prev) => {
      const i = prev.findIndex((a) => a.id === rec.id);
      if (i < 0) return [...prev, rec];
      const next = prev.slice();
      next[i] = rec;
      return next;
    });
  }, []);

  const save = useCallback(
    async (a: Article) => {
      const rec: Article = { ...a, edited: true, deleted: false, updatedAt: Date.now(), origin: a.origin ?? 'user' };
      upsertLocal(rec);
      await db.articles.put(rec);
      return rec;
    },
    [upsertLocal]
  );

  const remove = useCallback(
    async (a: Article) => {
      if (a.origin === 'seed') {
        const rec: Article = { ...a, deleted: true, edited: true, updatedAt: Date.now() };
        upsertLocal(rec);
        await db.articles.put(rec);
      } else {
        setArticles((prev) => prev.filter((x) => x.id !== a.id));
        await db.articles.remove(a.id);
      }
    },
    [upsertLocal]
  );

  const restore = useCallback(
    async (id: string) => {
      const seed = SEED_BY_ID.get(id);
      if (!seed) return null;
      upsertLocal(seed);
      await db.articles.put(seed);
      return seed;
    },
    [upsertLocal]
  );

  const resetAll = useCallback(async () => {
    await db.articles.clear();
    await db.meta.set('seedVersion', '');
    const list = await syncSeed().catch(() => SEED_ARTICLES);
    setArticles(list.length ? list : SEED_ARTICLES);
  }, []);

  const exportJson = useCallback(() => {
    const payload = {
      format: 'biblioteka-gildii',
      version: 1,
      exportedAt: new Date().toISOString(),
      tomes: SEED_TOMES,
      articles: visible.map((a) => {
        const copy: Article = { ...a };
        delete copy.edited;
        delete copy.deleted;
        return copy;
      })
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'biblioteka-gildii.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  }, [visible]);

  const importJson = useCallback(async (file: File) => {
    const data = JSON.parse(await file.text());
    const list: Article[] = Array.isArray(data) ? data : data?.articles;
    if (!Array.isArray(list)) throw new Error('В файле нет списка статей');
    const recs = list
      .filter((a) => a && a.id && a.tome && a.title && a.lead && a.practice)
      .map((a) => ({ ...a, edited: true, deleted: false, updatedAt: Date.now() }));
    await db.articles.putMany(recs);
    setArticles((prev) => {
      const map = new Map(prev.map((a) => [a.id, a]));
      for (const r of recs) map.set(r.id, r);
      return [...map.values()];
    });
    return recs.length;
  }, []);

  const editedCount = useMemo(() => articles.filter((a) => a.edited).length, [articles]);

  return {
    tomes: SEED_TOMES as TomeRecord[],
    byTome,
    ready,
    persistent,
    save,
    remove,
    restore,
    resetAll,
    exportJson,
    importJson,
    editedCount,
    total: visible.length
  };
}

export type LibraryApi = ReturnType<typeof useLibrary>;
