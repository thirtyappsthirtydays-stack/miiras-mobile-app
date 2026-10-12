// Progress is kept in memory only, so nothing a family says or does is stored.
// It resets when the app is closed.
export type Mark = 'talked' | 'later';
export type Marks = (Mark | undefined)[];
export type Progress = Record<string, Marks>;

export const talkedCount = (marks: Marks | undefined) => (marks ?? []).filter((m) => m === 'talked').length;
export const laterCount = (marks: Marks | undefined) => (marks ?? []).filter((m) => m === 'later').length;
export const markedCount = (marks: Marks | undefined) => (marks ?? []).filter(Boolean).length;

export type DeckStatus = 'new' | 'started' | 'done';
export function deckStatus(marks: Marks | undefined, total: number): DeckStatus {
  const n = markedCount(marks);
  if (n === 0) return 'new';
  return n >= total ? 'done' : 'started';
}

export const STATUS_LABEL: Record<Mark | 'none', string> = {
  talked: 'Talked through',
  later: 'Skipped',
  none: 'Not yet',
};
