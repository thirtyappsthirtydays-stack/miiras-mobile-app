// Progress is kept in memory only, so nothing a family says or does is stored.
// It resets when the app is closed.
export type Mark = 'talked' | 'later';
export type Progress = Record<string, (Mark | undefined)[]>;

export function talkedCount(marks: (Mark | undefined)[] | undefined): number {
  return (marks ?? []).filter((m) => m === 'talked').length;
}
