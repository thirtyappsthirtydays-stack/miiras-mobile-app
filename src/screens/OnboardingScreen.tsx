import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cardTints, colors, fonts } from '../theme';
import { CheckIcon, InfoIcon, LockIcon, Logo } from '../components/Icons';
import { Body, Button, Card, Eyebrow, Title, tap } from '../components/ui';

const TOPICS: [string, number, number][] = [
  ['Money', 0, -4],
  ['Health', 2, 3],
  ['Care', 1, -2],
  ['Wills', 3, 4],
  ['What’s fair', 4, -3],
  ['Inheritance', 1, 2],
  ['Getting older', 0, -4],
  ['End of life', 2, 3],
  ['Legacy', 3, -2],
];

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const last = step === 3;
  const next = () => (last ? onDone() : setStep(step + 1));

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16, paddingHorizontal: 20 }}>
      <View style={styles.top}>
        <View style={styles.dots} accessibilityLabel={`Step ${step + 1} of 4`}>
          {[0, 1, 2, 3].map((k) => (
            <View key={k} style={[styles.dot, k === step && styles.dotOn]} />
          ))}
        </View>
        {!last && (
          <Pressable accessibilityRole="button" onPress={() => { tap(); onDone(); }} hitSlop={8} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
        {step === 0 && <Topics />}
        {step === 1 && <Research />}
        {step === 2 && <HowItWorks />}
        {step === 3 && <Privacy />}
      </ScrollView>

      <Button label={last ? 'Let’s begin' : 'Next'} onPress={next} />
    </View>
  );
}

function Topics() {
  return (
    <View style={{ gap: 30 }}>
      <View style={styles.chips}>
        {TOPICS.map(([t, c, r]) => (
          <View key={t} style={[styles.chip, { backgroundColor: cardTints[c].background, transform: [{ rotate: `${r}deg` }] }]}>
            <Text style={[styles.chipText, { color: cardTints[c].text }]}>{t}</Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 10 }}>
        <Title size={34}>The talks every family puts off.</Title>
        <Body>Miiras gives you the questions to finally start.</Body>
      </View>
    </View>
  );
}

function Research() {
  return (
    <View style={{ gap: 28 }}>
      <View style={{ height: 220 }}>
        <View style={[styles.miniCard, { left: 30, top: 30, backgroundColor: cardTints[1].background, transform: [{ rotate: '-8deg' }] }]} />
        <View style={[styles.miniCard, { right: 30, top: 18, backgroundColor: cardTints[2].background, transform: [{ rotate: '7deg' }] }]} />
        <View style={[styles.miniCard, styles.miniCardFront]}>
          <Logo size={72} color={colors.cream} />
        </View>
      </View>
      <View style={{ gap: 12 }}>
        <Eyebrow color="#7A5C1C">Grounded in research</Eyebrow>
        <Title size={32}>Built on research, not guesswork</Title>
        <Body>
          Miiras is grounded in published research from family psychology, financial socialization and end-of-life care. Every question is designed to help families talk openly, start gently and plan ahead together.
        </Body>
      </View>
    </View>
  );
}

function Step({ n, title, text, tint }: { n: string; title: string; text: string; tint: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 14 }}>
      <View style={[styles.stepNum, { backgroundColor: tint }]}>
        <Text style={styles.stepNumText}>{n}</Text>
      </View>
      <View style={{ flex: 1, gap: 3, paddingTop: 6 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Body size={14}>{text}</Body>
      </View>
    </View>
  );
}

function HowItWorks() {
  return (
    <View style={{ gap: 18 }}>
      <View style={{ height: 200 }}>
        <View style={[styles.demoCard, { backgroundColor: cardTints[2].background, transform: [{ rotate: '-6deg' }], top: 14 }]} />
        <View style={[styles.demoCard, { backgroundColor: cardTints[0].background, transform: [{ rotate: '4deg' }], padding: 18, justifyContent: 'space-between' }]}>
          <Eyebrow color={cardTints[0].label}>Starting well</Eyebrow>
          <Text style={[styles.demoQ, { color: cardTints[0].text }]}>What does a good life look like to you right now?</Text>
          <View style={styles.demoTag}>
            <Text style={[styles.demoTagText, { color: cardTints[0].text }]}>For everyone</Text>
          </View>
        </View>
        <View style={styles.demoCheck}>
          <CheckIcon />
        </View>
      </View>
      <Title size={30}>A deck of cards and a quiet table</Title>
      <View style={{ gap: 14 }}>
        <Step n="1" title="Choose a topic" text="Five areas, from everyday money to end-of-life wishes." tint={cardTints[0].background} />
        <Step n="2" title="Read each card out loud" text="The tag shows who it’s for: everyone, parents or kids." tint={cardTints[1].background} />
        <Step n="3" title="Swipe right once you’ve talked it through" text="Or left to skip. You can always go back." tint={cardTints[2].background} />
      </View>
      <Text style={styles.small}>Each deck has 10 questions and takes about 20 minutes. Start gently and go deeper as you’re ready.</Text>
    </View>
  );
}

function Promise({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <Card style={{ padding: 18, flexDirection: 'row', gap: 14 }}>
      <View style={styles.promiseIcon}>{icon}</View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Body size={14}>{text}</Body>
      </View>
    </Card>
  );
}

function Privacy() {
  return (
    <View style={{ gap: 22 }}>
      <View style={styles.logoCircle}>
        <Logo size={48} color={colors.cream} />
      </View>
      <Title size={32}>What’s said at the table stays at the table</Title>
      <Promise icon={<LockIcon />} title="Nothing is collected" text="No account, no recordings, no answers saved." />
      <Promise
        icon={<InfoIcon size={22} color={colors.goldText} />}
        title="Not professional advice"
        text="These questions help families talk. For medical, legal or financial decisions, speak with a qualified professional."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderStrong },
  dotOn: { width: 22, backgroundColor: colors.navy },
  skip: { minHeight: 44, justifyContent: 'center', paddingLeft: 12 },
  skipText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, rowGap: 10 },
  chip: { borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8 },
  chipText: { fontFamily: fonts.display, fontSize: 22 },
  miniCard: { position: 'absolute', width: 160, height: 190, borderRadius: 18 },
  miniCardFront: { left: '50%', marginLeft: -85, width: 170, height: 200, top: 0, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  stepNum: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.navy },
  stepTitle: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.navy },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: '#6B7280' },
  demoCard: { position: 'absolute', left: 40, right: 60, top: 0, height: 175, borderRadius: 22 },
  demoQ: { fontFamily: fonts.display, fontSize: 19, lineHeight: 23 },
  demoTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  demoTagText: { fontFamily: fonts.bodyBold, fontSize: 11 },
  demoCheck: { position: 'absolute', right: 14, top: 74, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  promiseIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.goldTint, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
});
