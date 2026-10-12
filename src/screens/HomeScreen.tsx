import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DECKS, GROUPS, decksIn } from '../content';
import { Progress, deckStatus } from '../progress';
import { colors, fonts } from '../theme';
import { Logo } from '../components/Icons';
import { Badge, Body, Title, tap } from '../components/ui';

type Props = {
  progress: Progress;
  onOpenGroup: (groupIndex: number) => void;
  onOpenAbout: () => void;
};

export function HomeScreen({ progress, onOpenGroup, onOpenAbout }: Props) {
  const insets = useSafeAreaInsets();
  const anyStarted = Object.values(progress).some((m) => m && m.some(Boolean));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20, paddingHorizontal: 20, gap: 18 }}
    >
      <View style={styles.top}>
        <View style={styles.brand}>
          <Logo size={26} />
          <Text style={styles.wordmark}>miiras</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => { tap(); onOpenAbout(); }} hitSlop={8} style={styles.about}>
          <Text style={styles.aboutText}>About</Text>
        </Pressable>
      </View>

      <View style={{ gap: 8 }}>
        <Title size={30}>What would you like to talk about?</Title>
        <Body>Pick an area. Each one has two decks of 10 questions.</Body>
      </View>

      <View style={{ gap: 10 }}>
        {GROUPS.map((g, i) => {
          const decks = decksIn(g);
          const done = decks.filter((d) => deckStatus(progress[DECKS[d].id], DECKS[d].questions.length) === 'done').length;
          let badge = <Badge label={`${decks.length * 10} questions`} tone="white" />;
          if (done === decks.length) badge = <Badge label="Done" tone="gold" />;
          else if (done > 0) badge = <Badge label={`${done} of ${decks.length} done`} tone="gold" />;
          else if (i === 0 && !anyStarted) badge = <Badge label="Start here" tone="navy" />;
          return (
            <Pressable
              key={g.id}
              accessibilityRole="button"
              accessibilityLabel={`${g.name}. ${g.line}`}
              onPress={() => { tap(); onOpenGroup(i); }}
              style={({ pressed }) => [styles.tile, { backgroundColor: g.colors.background }, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.num}>
                <Text style={[styles.numText, { color: g.colors.label }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={[styles.tileTitle, { color: g.colors.text }]}>{g.name}</Text>
                <Text style={[styles.tileLine, { color: g.colors.label }]}>{g.line}</Text>
              </View>
              <View style={{ alignSelf: 'flex-start' }}>{badge}</View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  top: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wordmark: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.navy, letterSpacing: -0.6 },
  about: { minHeight: 44, justifyContent: 'center', paddingLeft: 12 },
  aboutText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.navy },
  tile: { minHeight: 90, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  num: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.displayBold, fontSize: 18 },
  tileTitle: { fontFamily: fonts.display, fontSize: 19, lineHeight: 22 },
  tileLine: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
});
