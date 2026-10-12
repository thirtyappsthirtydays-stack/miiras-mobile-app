import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DECKS, GROUPS } from '../content';
import { Progress, talkedCount } from '../progress';
import { colors, fonts } from '../theme';
import { ChevronIcon, InfoIcon, Logo } from '../components/Icons';
import { Card, Eyebrow, IconButton, tap } from '../components/ui';

type Props = {
  progress: Progress;
  onOpenDeck: (index: number) => void;
  onOpenAbout: () => void;
};

export function HomeScreen({ progress, onOpenDeck, onOpenAbout }: Props) {
  const insets = useSafeAreaInsets();
  const firstDeckStarted = talkedCount(progress[DECKS[0].id]) > 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 }]}
    >
      <View style={styles.header}>
        <View style={styles.brand}>
          <Logo />
          <Text style={styles.wordmark}>miiras</Text>
        </View>
        <IconButton label="About Miiras" onPress={onOpenAbout}>
          <InfoIcon />
        </IconButton>
      </View>

      <View style={{ gap: 8 }}>
        <Text accessibilityRole="header" style={styles.title}>Choose what to talk about</Text>
        <Text style={styles.subtitle}>
          Questions to help your family talk about what matters. Each set has 10 questions and takes about 20 minutes.
        </Text>
      </View>

      {!firstDeckStarted && (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            tap();
            onOpenDeck(0);
          }}
          style={({ pressed }) => [styles.startHere, pressed && { opacity: 0.9 }]}
        >
          <Eyebrow color={colors.goldLight}>Start here</Eyebrow>
          <Text style={styles.startTitle}>{DECKS[0].title}</Text>
          <Text style={styles.startBody}>Agree how you’ll talk together before anything hard comes up.</Text>
          <View style={styles.beginPill}>
            <Text style={styles.beginText}>Begin</Text>
          </View>
        </Pressable>
      )}

      {GROUPS.map((group) => {
        const decks = DECKS.map((d, i) => ({ d, i })).filter(({ d }) => d.group === group.id);
        return (
          <View key={group.id} style={{ gap: 8 }}>
            <Eyebrow>{group.name}</Eyebrow>
            <Card style={{ paddingHorizontal: 14 }}>
              {decks.map(({ d, i }, n) => {
                const talked = talkedCount(progress[d.id]);
                const left = d.questions.length - talked;
                const status = talked === 0 ? 'New' : left === 0 ? 'Talked' : `${left} left`;
                const started = talked > 0;
                return (
                  <Pressable
                    key={d.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${d.title}. ${d.blurb}. ${status}`}
                    onPress={() => {
                      tap();
                      onOpenDeck(i);
                    }}
                    style={({ pressed }) => [styles.row, n > 0 && styles.rowDivider, pressed && { opacity: 0.7 }]}
                  >
                    <View style={[styles.swatch, { backgroundColor: group.colors.background }]}>
                      <Text style={[styles.swatchNum, { color: group.colors.label }]}>{i + 1}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={styles.deckTitle}>{d.title}</Text>
                      <Text style={styles.deckBlurb}>{d.blurb}</Text>
                    </View>
                    <View style={[styles.status, started && { backgroundColor: colors.goldTint }]}>
                      <Text style={[styles.statusText, started && { color: colors.goldText }]}>{status}</Text>
                    </View>
                    <ChevronIcon size={16} color={colors.muted} />
                  </Pressable>
                );
              })}
            </Card>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wordmark: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.navy, letterSpacing: -0.6 },
  title: { fontFamily: fonts.display, fontSize: 32, lineHeight: 35, color: colors.navy, letterSpacing: -0.6 },
  subtitle: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted },
  startHere: { backgroundColor: colors.navy, borderRadius: 22, padding: 20, gap: 8 },
  startTitle: { fontFamily: fonts.display, fontSize: 24, lineHeight: 28, color: colors.cream },
  startBody: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.mutedOnNavy },
  beginPill: { marginTop: 6, alignSelf: 'flex-start', minHeight: 40, borderRadius: 20, backgroundColor: colors.cream, paddingHorizontal: 16, justifyContent: 'center' },
  beginText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.navy },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
  swatch: { width: 40, height: 52, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  swatchNum: { fontFamily: fonts.display, fontSize: 18 },
  deckTitle: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 20, color: colors.navy },
  deckBlurb: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted },
  status: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#F1EEE6' },
  statusText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.muted },
});
