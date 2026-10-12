export const colors = {
  navy: '#1B2A41',
  navyDeep: '#0E1726',
  cream: '#F6F3EC',
  white: '#FFFFFF',
  gold: '#C9A04E',
  goldLight: '#E2C47F',
  goldTint: '#F3EAD6',
  goldText: '#5C4413',
  border: '#E4DED2',
  borderStrong: '#D8D1C2',
  divider: '#EDE8DD',
  muted: '#4B5566',
  mutedOnNavy: '#C3CAD5',
  pending: '#E4DED2',
  skipped: '#B8AE98',
  skipStamp: '#6B4A3A',
};

export const fonts = {
  display: 'Fraunces_500Medium',
  displayBold: 'Fraunces_600SemiBold',
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodyBold: 'Figtree_600SemiBold',
};

// Cards cycle through these tints, one per question, so each new card looks different.
export const cardTints = [
  { background: '#F3EAD6', text: '#3B2A08', label: '#6E5216' },
  { background: '#E1E7EF', text: '#1B2A41', label: '#3F4B5E' },
  { background: '#E2EAE3', text: '#1F3326', label: '#3B5544' },
  { background: '#EADFD6', text: '#3A2A22', label: '#64463A' },
  { background: '#E8E3EF', text: '#2E2440', label: '#56466E' },
];
export const tintFor = (i: number) => cardTints[((i % cardTints.length) + cardTints.length) % cardTints.length];
