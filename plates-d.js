// Minimal IndexedDB layer for the library: articles, rendered plates, meta.
// Falls back to in-memory maps when the browser blocks storage (private mode, sandboxed frames).
import type { Article } from './types';

type StoreName = 'articles' | 'plates' | 'meta';

const DB_NAME = 'grimoire-library';
const DB_VERSION = 1;

const memory: Record<StoreName, Map<string, unknown>> = {
  articles: new Map(),
  plates: new Map(),
  meta: new Map()
};

let opening: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (opening) return opening;
  opening = new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains('articles')) d.createObjectStore('articles', { keyPath: 'id' }).createIndex('tome', 'tome');
        if (!d.objectStoreNames.contains('plates')) d.createObjectStore('plates');
        if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return opening;
}

function request<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => {
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

function finished(tx: IDBTransaction): Promise<void> {
  return new Promise((res, rej) => {
    tx.oncomplete = () => res();
    tx.onabort = () => rej(tx.error);
    tx.onerror = () => rej(tx.error);
  });
}

const memKey = (store: StoreName, value: unknown, key?: string) =>
  key ?? (store === 'articles' ? (value as Article).id : '');

async function getAll<T>(store: StoreName): Promise<T[]> {
  const d = await openDb();
  if (d) {
    try {
      return (await request(d.transaction(store).objectStore(store).getAll())) as T[];
    } catch {
      /* fall through to memory */
    }
  }
  return [...memory[store].values()] as T[];
}

async function get<T>(store: StoreName, key: string): Promise<T | undefined> {
  const d = await openDb();
  if (d) {
    try {
      return (await request(d.transaction(store).objectStore(store).get(key))) as T | undefined;
    } catch {
      /* fall through */
    }
  }
  return memory[store].get(key) as T | undefined;
}

async function putMany(store: StoreName, values: { value: unknown; key?: string }[]): Promise<void> {
  for (const { value, key } of values) memory[store].set(memKey(store, value, key), value);
  const d = await openDb();
  if (!d || values.length === 0) return;
  try {
    const tx = d.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    for (const { value, key } of values) (store === 'articles' ? os.put(value) : os.put(value, key));
    await finished(tx);
  } catch {
    /* memory copy already updated */
  }
}

async function remove(store: StoreName, key: string): Promise<void> {
  memory[store].delete(key);
  const d = await openDb();
  if (!d) return;
  try {
    const tx = d.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    await finished(tx);
  } catch {
    /* ignore */
  }
}

async function clear(store: StoreName): Promise<void> {
  memory[store].clear();
  const d = await openDb();
  if (!d) return;
  try {
    const tx = d.transaction(store, 'readwrite');
    tx.objectStore(store).clear();
    await finished(tx);
  } catch {
    /* ignore */
  }
}

export const db = {
  /** true when data survives a reload (real IndexedDB), false in memory-only mode */
  persistent: async () => Boolean(await openDb()),
  articles: {
    all: () => getAll<Article>('articles'),
    put: (a: Article) => putMany('articles', [{ value: a }]),
    putMany: (list: Article[]) => putMany('articles', list.map((value) => ({ value }))),
    remove: (id: string) => remove('articles', id),
    clear: () => clear('articles')
  },
  plates: {
    get: (key: string) => get<Blob>('plates', key),
    put: (key: string, blob: Blob) => putMany('plates', [{ value: blob, key }]),
    remove: (key: string) => remove('plates', key)
  },
  meta: {
    get: <T>(key: string) => get<T>('meta', key),
    set: (key: string, value: unknown) => putMany('meta', [{ value, key }])
  }
};
