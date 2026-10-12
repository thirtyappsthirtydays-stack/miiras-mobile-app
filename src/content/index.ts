// All conversation questions live in decks.json.
// To change a question, its tag or its tip, edit that file only. No code changes needed.
import data from './decks.json';

export type Who = 'everyone' | 'parents' | 'kids';
export type Level = 'gentle' | 'practical' | 'deeper';

export type Question = { text: string; who: Who; level: Level; tip: string };
export type Tint = { background: string; text: string; label: string };
export type Group = { id: string; name: string; line: string; colors: Tint };
export type Deck = {
  id: string;
  group: string;
  title: string;
  blurb: string;
  why: string;
  questions: Question[];
};

export const GROUPS = data.groups as Group[];
export const DECKS = data.decks as Deck[];

export const WHO_LABEL: Record<Who, string> = {
  everyone: 'For everyone',
  parents: 'For parents',
  kids: 'For kids',
};

export const LEVEL_LABEL: Record<Level, string> = {
  gentle: 'Gentle',
  practical: 'Practical',
  deeper: 'Deeper',
};

export function groupOf(deck: Deck): Group {
  return GROUPS.find((g) => g.id === deck.group) ?? GROUPS[0];
}

export function decksIn(group: Group): number[] {
  return DECKS.map((d, i) => (d.group === group.id ? i : -1)).filter((i) => i >= 0);
}
