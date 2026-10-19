// The bundled content database: every tome and article lives in src/content/*.json, not in code.
import tomesJson from '../content/tomes.json';
import classes from '../content/articles/classes.json';
import races from '../content/articles/races.json';
import feats from '../content/articles/feats.json';
import spells from '../content/articles/spells.json';
import bestiary from '../content/articles/bestiary.json';
import items from '../content/articles/items.json';
import mechanics from '../content/articles/mechanics.json';
import type { Article, TomeRecord } from './types';

type RawArticle = Omit<Article, 'tome' | 'order' | 'origin' | 'edited'>;

const FILES = { classes, races, feats, spells, bestiary, items, mechanics } as unknown as Record<string, RawArticle[]>;

export const SEED_TOMES = tomesJson as TomeRecord[];

export const SEED_ARTICLES: Article[] = SEED_TOMES.flatMap((tome) =>
  (FILES[tome.id] ?? []).map((raw, i) => ({
    ...raw,
    tome: tome.id,
    order: (i + 1) * 100,
    origin: 'seed' as const,
    edited: false
  }))
);

export const SEED_BY_ID = new Map(SEED_ARTICLES.map((a) => [a.id, a]));

function hash(text: string) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Changes whenever the bundled JSON changes, so the browser database re-syncs untouched articles. */
export const SEED_VERSION = hash(JSON.stringify(SEED_ARTICLES));
