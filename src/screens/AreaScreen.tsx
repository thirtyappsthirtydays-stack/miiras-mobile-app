import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DECKS, GROUPS, decksIn } from '../content';
import { Progress, deckStatus, markedCount } from '../progress';
import { colors, fonts, tintFor } from '../theme';
import { BackIcon } from '../components/Icons';
import { Badge, Body, Eyebrow, IconButton, Title, tap } from '../components/ui';

type Props = {
  groupIndex: number;
  progress: Progress;
  onBack: () => void;
  onOpenDeck: (deckIndex: number) => void;
};

export function AreaScreen({ groupIndex, progress, onBack, onOpenDeck }: Props) {
  const insets = useSafeAreaInsets();
  const group = GROUPS[groupIndex];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20, paddingHorizontal: 20, gap: 18 }}
    >
      <View style={{ height: 44, justifyContent: 'center' }}>
        <IconButton label="Back to topics" onPress={onBack}>
          <BackIcon />
        </IconButton>
      </View>
      <View style={{ gap: 8 }}>
        <Eyebrow color={group.colors.label}>{`Area ${groupIndex + 1} of ${GROUPS.length}`}</Eyebrow>
        <Title size={32}>{group.name}</Title>
        <Body>{group.line}.</Body>
      </View>

      {decksIn(group).map((d, k) => {
        const deck = DECKS[d];
        const tint = k === 0 ? group.colors : tintFor(groupIndex + 1);
        const marks = progress[deck.id];
        const status = deckStatus(marks, deck.questions.length);
        const label = status === 'new' ? 'New' : status === 'done' ? 'Talked through' : `${deck.questions.length - markedCount(marks)} left`;
        return (
          <Pressable
            key={deck.id}
            accessibilityRole="button"
            accessibilityLabel={`${deck.title}. ${deck.blurb} ${label}.`}
            onPress={() => { tap(); onOpenDeck(d); }}
            style={({ pressed }) => [styles.deck, { backgroundColor: tint.background }, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.row}>
              <Text style={[styles.meta, { color: tint.label }]}>10 questions · about 20 minutes</Text>
              <Badge label={label} tone={status === 'new' ? 'white' : 'navy'} />
            </View>
            <Text style={[styles.deckTitle, { color: tint.text }]}>{deck.title}</Text>
            <Text style={[styles.blurb, { color: tint.label }]}>{deck.blurb}</Text>
            <View style={styles.open}>
              <Text style={styles.openText}>{status === 'new' ? 'Open deck' : 'Continue'}</Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  deck: { borderRadius: 22, padding: 20, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  meta: { fontFamily: fonts.body, fontSize: 13 },
  deckTitle: { fontFamily: fonts.display, fontSize: 26, lineHeight: 29 },
  blurb: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  open: { marginTop: 4, alignSelf: 'flex-start', minHeight: 40, borderRadius: 20, backgroundColor: colors.navy, paddingHorizontal: 16, justifyContent: 'center' },
  openText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.cream },
});
