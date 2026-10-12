import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DECKS, Deck, groupOf } from '../content';
import { Marks, talkedCount } from '../progress';
import { colors, fonts } from '../theme';
import { ChevronIcon, Logo } from '../components/Icons';
import { QuestionList } from '../components/QuestionList';
import { Body, Button, Card, Eyebrow, Title, tap } from '../components/ui';

type Props = {
  deck: Deck;
  deckIndex: number;
  marks: Marks;
  onPick: (questionIndex: number) => void;
  onReplay: (queue: number[]) => void;
  onOpenDeck: (deckIndex: number) => void;
  onHome: () => void;
};

export function DoneScreen({ deck, deckIndex, marks, onPick, onReplay, onOpenDeck, onHome }: Props) {
  const insets = useSafeAreaInsets();
  const group = groupOf(deck);
  const talked = talkedCount(marks);
  const all = deck.questions.map((_, i) => i);
  const skipped = all.filter((i) => marks[i] === 'later');
  const notYet = all.filter((i) => !marks[i]);
  const toCome = [...skipped, ...notYet];
  const nextIndex = (deckIndex + 1) % DECKS.length;
  const next = DECKS[nextIndex];
  // Skipped ones first, then the rest, so the list stays short and useful.
  const ordered = [...toCome, ...all.filter((i) => marks[i] === 'talked')];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20, paddingHorizontal: 20, gap: 16 }}
    >
      <View style={[styles.badge, { backgroundColor: group.colors.background }]}>
        <Logo size={44} />
      </View>
      <View style={{ gap: 6 }}>
        <Title size={32}>{talked > 0 ? 'You talked it through' : 'You can pick this up anytime'}</Title>
        <Body>{talked > 0 ? `${deck.title}. That took courage from everyone at the table.` : `${deck.title} will be here when you’re ready.`}</Body>
      </View>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{talked}</Text>
          <Text style={styles.statLabel}>talked through</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{toCome.length}</Text>
          <Text style={styles.statLabel}>to come back to</Text>
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={styles.listTitle}>Want to revisit anything? Tap a question to go back to it.</Text>
        <QuestionList deck={deck} marks={marks} indexes={ordered} onPick={onPick} />
      </View>

      {toCome.length > 0 && (
        <Button
          variant="secondary"
          label={toCome.length === 1 ? 'Come back to the 1 question left' : `Come back to the ${toCome.length} questions left`}
          onPress={() => onReplay(toCome)}
        />
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Up next: ${next.title}`}
        onPress={() => { tap(); onOpenDeck(nextIndex); }}
        style={({ pressed }) => [styles.next, pressed && { opacity: 0.85 }]}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Eyebrow color={colors.goldLight}>Up next</Eyebrow>
          <Text style={styles.nextTitle}>{next.title}</Text>
        </View>
        <ChevronIcon color={colors.cream} />
      </Pressable>
      <Button variant="ghost" label="Back to topics" onPress={onHome} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badge: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, padding: 14, gap: 2 },
  statNum: { fontFamily: fonts.display, fontSize: 30, color: colors.navy },
  statLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  listTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.navy },
  next: { borderRadius: 16, backgroundColor: colors.navy, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextTitle: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.cream },
});
