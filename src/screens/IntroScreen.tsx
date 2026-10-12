import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Deck, groupOf } from '../content';
import { colors, fonts } from '../theme';
import { BackIcon } from '../components/Icons';
import { Button, Card, Eyebrow, IconButton, tap } from '../components/ui';

type Props = { deck: Deck; onBack: () => void; onStart: () => void };

const STEPS = ['Read each question out loud', 'Anyone can answer, in any order', 'Skip anything you’re not ready for'];

export function IntroScreen({ deck, onBack, onStart }: Props) {
  const insets = useSafeAreaInsets();
  const group = groupOf(deck);
  const [people, setPeople] = useState([
    { name: 'Mom', on: true },
    { name: 'Dad', on: true },
    { name: 'Me', on: true },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ minHeight: 44, justifyContent: 'center' }}>
          <IconButton label="Back to topics" onPress={onBack}>
            <BackIcon />
          </IconButton>
        </View>

        <View style={[styles.hero, { backgroundColor: group.colors.background }]}>
          <Eyebrow color={group.colors.label}>{group.name}</Eyebrow>
          <Text accessibilityRole="header" style={[styles.heroTitle, { color: group.colors.text }]}>{deck.title}</Text>
          <Text style={[styles.heroMeta, { color: group.colors.label }]}>{deck.questions.length} questions · about 20 minutes</Text>
        </View>

        <Text style={styles.why}>{deck.why}</Text>

        <View style={{ gap: 8 }}>
          <Text style={styles.label}>Who’s joining?</Text>
          <View style={styles.chips}>
            {people.map((p, i) => (
              <Pressable
                key={p.name}
                accessibilityRole="button"
                accessibilityState={{ selected: p.on }}
                onPress={() => {
                  tap();
                  setPeople(people.map((x, j) => (j === i ? { ...x, on: !x.on } : x)));
                }}
                style={[styles.chip, p.on && styles.chipOn]}
              >
                <Text style={[styles.chipText, p.on && { color: colors.cream }]}>{p.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Card style={{ paddingHorizontal: 16 }}>
          {STEPS.map((s, i) => (
            <View key={s} style={[styles.step, i > 0 && { borderTopWidth: 1, borderTopColor: colors.divider }]}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <Button label="Start the conversation" onPress={onStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 18 },
  hero: { borderRadius: 24, padding: 22, gap: 10 },
  heroTitle: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34, letterSpacing: -0.3 },
  heroMeta: { fontFamily: fonts.body, fontSize: 14 },
  why: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: '#3F4B5E' },
  label: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.navy },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.navy },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.goldTint, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.goldText },
  stepText: { fontFamily: fonts.body, fontSize: 15, color: colors.navy, flex: 1 },
});
