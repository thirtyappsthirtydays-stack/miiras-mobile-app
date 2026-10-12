import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DECKS, Deck, groupOf } from '../content';
import { Mark } from '../progress';
import { colors, fonts } from '../theme';
import { ChevronIcon, Logo } from '../components/Icons';
import { Button, Card, Eyebrow, tap } from '../components/ui';

type Props = {
  deck: Deck;
  deckIndex: number;
  marks: (Mark | undefined)[];
  onReplay: (questionIndexes: number[]) => void;
  onOpenDeck: (index: number) => void;
  onHome: () => void;
};

export function DoneScreen({ deck, deckIndex, marks, onReplay, onOpenDeck, onHome }: Props) {
  const insets = useSafeAreaInsets();
  const group = groupOf(deck);
  const later = deck.questions.map((_, i) => i).filter((i) => marks[i] !== 'talked');
  const talked = deck.questions.length - later.length;
  const nextIndex = (deckIndex + 1) % DECKS.length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }]}
    >
      <View style={[styles.badge, { backgroundColor: group.colors.background }]}>
        <Logo size={48} />
      </View>
      <View style={{ gap: 6 }}>
        <Text accessibilityRole="header" style={styles.title}>You talked it through</Text>
        <Text style={styles.subtitle}>{deck.title}. That took courage from everyone at the table.</Text>
      </View>

      <View style={styles.stats}>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{talked}</Text>
          <Text style={styles.statLabel}>questions talked through</Text>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{later.length}</Text>
          <Text style={styles.statLabel}>to come back to</Text>
        </Card>
      </View>

      {later.length > 0 && (
        <>
          <Card style={{ paddingHorizontal: 16 }}>
            {later.map((i, n) => (
              <Text key={i} style={[styles.laterItem, n > 0 && { borderTopWidth: 1, borderTopColor: colors.divider }]}>
                {deck.questions[i].text}
              </Text>
            ))}
          </Card>
          <Button
            variant="secondary"
            label={`Come back to the ${later.length} ${later.length === 1 ? 'question' : 'questions'}`}
            onPress={() => onReplay(later)}
          />
        </>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          tap();
          onOpenDeck(nextIndex);
        }}
        style={({ pressed }) => [styles.next, pressed && { opacity: 0.9 }]}
      >
        <View style={{ gap: 3, flex: 1 }}>
          <Eyebrow color={colors.goldLight}>Up next</Eyebrow>
          <Text style={styles.nextTitle}>{DECKS[nextIndex].title}</Text>
        </View>
        <ChevronIcon color={colors.cream} />
      </Pressable>
      <Button variant="ghost" label="Start another conversation" onPress={onHome} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  badge: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 32, lineHeight: 35, color: colors.navy, letterSpacing: -0.6 },
  subtitle: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, padding: 14, gap: 2, borderRadius: 16 },
  statNum: { fontFamily: fonts.display, fontSize: 30, color: colors.navy },
  statLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  laterItem: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.navy, paddingVertical: 12 },
  next: { backgroundColor: colors.navy, borderRadius: 18, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextTitle: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.cream },
});
