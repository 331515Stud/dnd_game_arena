// Engraved plates are drawn in the browser from the generator, rasterised once,
// cached in IndexedDB and kept decoded in memory so page turns never wait for an image.
import { useEffect, useState } from 'react';
import { hasPlate, renderPlateSvg } from '../plates/registry';
import { db } from './db';
import type { Article } from './types';

const VERSION = 'p6';
const PLATE_W = 560;
const PLATE_H = 760;

const urls = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();
const decoded = new Map<string, HTMLImageElement>();

export function plateKeyOf(a: Pick<Article, 'id' | 'plate'>): string | null {
  if (a.plate === '') return null;
  const key = a.plate || a.id;
  if (key.startsWith('user:')) return key;
  return hasPlate(key) ? key : null;
}

export const peekPlate = (key: string | null): string | null => (key ? urls.get(key) ?? null : null);

async function rasterize(svg: string): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
  const src = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = PLATE_W;
    canvas.height = PLATE_H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return svgBlob;
    ctx.drawImage(img, 0, 0, PLATE_W, PLATE_H);
    const out = await new Promise<Blob | null>((res) => {
      try {
        canvas.toBlob(res, 'image/jpeg', 0.88);
      } catch {
        res(null);
      }
    });
    return out ?? svgBlob;
  } catch {
    return svgBlob;
  } finally {
    URL.revokeObjectURL(src);
  }
}

const KEEP_DECODED = 16;

/** Keep only the most recently needed plates decoded; the rest stay as cheap blob URLs. */
function keepDecoded(key: string, url: string): Promise<void> {
  const img = new Image();
  img.src = url;
  decoded.delete(key);
  decoded.set(key, img);
  while (decoded.size > KEEP_DECODED) {
    const oldest = decoded.keys().next().value;
    if (oldest === undefined) break;
    decoded.delete(oldest);
  }
  return img.decode().catch(() => undefined);
}

export function loadPlate(key: string, decode = true): Promise<string | null> {
  const ready = urls.get(key);
  if (ready) {
    if (decode && !decoded.has(key)) return keepDecoded(key, ready).then(() => ready);
    return Promise.resolve(ready);
  }
  const pending = inflight.get(key);
  if (pending) return pending;

  const job = (async () => {
    const isUser = key.startsWith('user:');
    const dbKey = isUser ? key : `${VERSION}:${key}`;
    let blob: Blob | null | undefined = null;
    try {
      blob = await db.plates.get(dbKey);
    } catch {
      blob = null;
    }
    if (!blob && !isUser) {
      const svg = renderPlateSvg(key);
      if (!svg) return null;
      blob = await rasterize(svg);
      if (blob.type !== 'image/svg+xml') void db.plates.put(dbKey, blob);
    }
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    if (decode) await keepDecoded(key, url);
    urls.set(key, url);
    return url;
  })().finally(() => inflight.delete(key));

  inflight.set(key, job);
  return job;
}

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
const idle = (cb: () => void) => {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 700 });
  else window.setTimeout(cb, 40);
};

const queue: string[] = [];
let pumping = false;
function pump() {
  if (pumping) return;
  pumping = true;
  const step = () => {
    const key = queue.shift();
    if (!key) {
      pumping = false;
      return;
    }
    loadPlate(key, false).finally(() => idle(step));
  };
  idle(step);
}

/** 'now' renders immediately (current and neighbouring spreads); 'idle' fills the cache in the background. */
export function warmPlates(keys: (string | null | undefined)[], mode: 'now' | 'idle' = 'idle') {
  for (const key of keys) {
    if (!key) continue;
    if (mode === 'now') {
      if (!urls.has(key) || !decoded.has(key)) void loadPlate(key, true);
    } else if (!urls.has(key) && !queue.includes(key)) queue.push(key);
  }
  if (mode === 'idle' && queue.length) pump();
}

export async function storeUserPlate(articleId: string, file: Blob): Promise<string> {
  const key = `user:${articleId}`;
  await db.plates.put(key, file);
  const old = urls.get(key);
  if (old) URL.revokeObjectURL(old);
  urls.delete(key);
  decoded.delete(key);
  await loadPlate(key);
  return key;
}

export function usePlateUrl(key: string | null): string | null {
  const [state, setState] = useState<{ key: string | null; url: string | null }>(() => ({ key, url: peekPlate(key) }));
  useEffect(() => {
    if (!key) {
      setState({ key, url: null });
      return;
    }
    const hit = peekPlate(key);
    if (hit) {
      setState({ key, url: hit });
      return;
    }
    let alive = true;
    loadPlate(key).then((url) => {
      if (alive) setState({ key, url });
    });
    return () => {
      alive = false;
    };
  }, [key]);
  return state.key === key ? state.url ?? peekPlate(key) : peekPlate(key);
}
