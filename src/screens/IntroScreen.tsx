import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Deck, groupOf } from '../content';
import { colors, fonts } from '../theme';
import { BackIcon } from '../components/Icons';
import { Body, Button, Card, Eyebrow, IconButton } from '../components/ui';

const STEPS = [
  'Read each card out loud',
  'The tag on each card shows who it’s for: everyone, parents or kids',
  'Skip anything you’re not ready for. You can always go back',
];

type Props = {
  deck: Deck;
  inProgress: boolean;
  onBack: () => void;
  onStart: () => void;
  onContinue: () => void;
};

export function IntroScreen({ deck, inProgress, onBack, onStart, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const group = groupOf(deck);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16, paddingHorizontal: 20, gap: 12 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 18, paddingBottom: 12 }}>
        <View style={{ height: 44, justifyContent: 'center' }}>
          <IconButton label="Back" onPress={onBack}>
            <BackIcon />
          </IconButton>
        </View>
        <View style={[styles.hero, { backgroundColor: group.colors.background }]}>
          <Eyebrow color={group.colors.label}>{group.name}</Eyebrow>
          <Text accessibilityRole="header" style={[styles.title, { color: group.colors.text }]}>{deck.title}</Text>
          <Text style={[styles.meta, { color: group.colors.label }]}>10 questions · about 20 minutes</Text>
        </View>
        <Body color="#3F4B5E">{deck.why}</Body>
        <Card style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          {STEPS.map((s, i) => (
            <View key={s} style={[styles.step, i > 0 && styles.stepBorder]}>
              <View style={styles.num}>
                <Text style={styles.numText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
      {inProgress ? (
        <>
          <Button label="Pick up where you left off" onPress={onContinue} />
          <Button label="Start over" variant="ghost" onPress={onStart} />
        </>
      ) : (
        <Button label="Start the conversation" onPress={onStart} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 24, padding: 22, gap: 10 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  meta: { fontFamily: fonts.body, fontSize: 14 },
  step: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  stepBorder: { borderTopWidth: 1, borderTopColor: colors.divider },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.goldTint, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.goldText },
  stepText: { flex: 1, fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.navy, paddingTop: 2 },
});
