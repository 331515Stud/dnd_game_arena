export type VerdictFor = 'player' | 'dm' | 'both';

export interface Stat {
  label: string;
  value: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface Quote {
  text: string;
  cite: string;
}

/** One spread of a tome: left page = суть, right page = практика. Stored in the content database. */
export interface Article {
  id: string;
  tome: string;
  order: number;
  chapter: string;
  title: string;
  subtitle: string;
  badge: string;
  epigraph: string;
  author?: string;
  stats: Stat[];
  table?: { headers: string[]; rows: string[][] } | null;
  lead: { heading: string; paragraphs: string[]; insights: string[]; quote?: Quote | null };
  practice: { heading: string; steps: Step[]; audience: string[]; verdict: { for: VerdictFor; text: string } };
  /** Plate key: generated engraving id, `user:<id>` for an uploaded picture, '' for none. Defaults to id. */
  plate?: string | null;
  origin?: 'seed' | 'user';
  edited?: boolean;
  deleted?: boolean;
  updatedAt?: number;
}

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

export const TOC_CHAPTER = 'Содержание';

export const VERDICT_LABEL: Record<VerdictFor, string> = {
  player: 'Игрокам',
  dm: 'Мастерам',
  both: 'Всему столу'
};
