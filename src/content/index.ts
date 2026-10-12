// All conversation questions live in decks.json.
// To change a question, edit that file only. No code changes needed.
import data from './decks.json';

export type Who = 'everyone' | 'parents' | 'kids';
export type Level = 'gentle' | 'practical' | 'deeper';

export type Question = { text: string; who: Who; level: Level };
export type Group = {
  id: string;
  name: string;
  colors: { background: string; text: string; label: string };
};
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
  everyone: 'Everyone answers',
  parents: 'Parents answer',
  kids: 'Kids answer',
};

export const LEVEL_LABEL: Record<Level, string> = {
  gentle: 'Gentle',
  practical: 'Practical',
  deeper: 'Deeper',
};

export const LEVEL_HINT: Record<Level, string> = {
  gentle: 'An easy one. Anyone can start.',
  practical: 'Facts, places and people. No amounts needed.',
  deeper: 'Take your time. It’s okay to pause.',
};

export function groupOf(deck: Deck): Group {
  return GROUPS.find((g) => g.id === deck.group) ?? GROUPS[0];
}
