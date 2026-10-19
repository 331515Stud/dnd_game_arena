import tomesJson from "@/content/tomes.json";

export interface TomeRecord {
  id: string;
  title: string;
  spine: string;
  subtitle: string;
  author: string;
  cover: string;
  leather: string;
  leatherDark: string;
  blurb: string;
}

export interface LibraryQuote {
  text: string;
  cite: string;
}

export interface LibraryArticle {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  badge: string;
  epigraph: string;
  author?: string;
  stats?: { label: string; value: string }[];
  table?: { headers: string[]; rows: string[][] } | null;
  lead: {
    heading: string;
    paragraphs: string[];
    insights: string[];
    quote?: LibraryQuote | null;
  };
  practice: {
    heading: string;
    steps: { title: string; text: string }[];
    audience: string[];
    verdict: { for: string; text: string };
  };
}

import classes from "@/content/articles/classes.json";
import races from "@/content/articles/races.json";
import feats from "@/content/articles/feats.json";
import spells from "@/content/articles/spells.json";
import bestiary from "@/content/articles/bestiary.json";
import items from "@/content/articles/items.json";
import mechanics from "@/content/articles/mechanics.json";

export const TOMES = tomesJson as TomeRecord[];

const ARTICLES_BY_TOME: Record<string, LibraryArticle[]> = {
  classes: classes as unknown as LibraryArticle[],
  races: races as unknown as LibraryArticle[],
  feats: feats as unknown as LibraryArticle[],
  spells: spells as unknown as LibraryArticle[],
  bestiary: bestiary as unknown as LibraryArticle[],
  items: items as unknown as LibraryArticle[],
  mechanics: mechanics as unknown as LibraryArticle[],
};

export function articlesForTome(tomeId: string): LibraryArticle[] {
  return ARTICLES_BY_TOME[tomeId] ?? [];
}

export function getTome(tomeId: string): TomeRecord | undefined {
  return TOMES.find((tome) => tome.id === tomeId);
}

export function getArticle(tomeId: string, articleId: string): LibraryArticle | undefined {
  return articlesForTome(tomeId).find((article) => article.id === articleId);
}
