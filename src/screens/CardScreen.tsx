import { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Deck, LEVEL_HINT, LEVEL_LABEL, WHO_LABEL, groupOf } from '../content';
import { Mark } from '../progress';
import { colors, fonts } from '../theme';
import { UndoIcon } from '../components/Icons';
import { Button, IconButton, tap } from '../components/ui';

type Props = {
  deck: Deck;
  queue: number[]; // question indexes to go through, in order
  marks: (Mark | undefined)[];
  onMark: (questionIndex: number, mark: Mark) => void;
  onFinish: () => void;
};

const SWIPE_THRESHOLD = 110;

export function CardScreen({ deck, queue, marks, onMark, onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const group = groupOf(deck);
  const [pos, setPos] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const busy = useRef(false);

  const qIndex = queue[Math.min(pos, queue.length - 1)];
  const question = deck.questions[qIndex];
  const isLast = pos >= queue.length - 1;

  // Keep the latest values available to the gesture handlers.
  const latest = useRef({ pos, queue, qIndex });
  latest.current = { pos, queue, qIndex };

  const advance = (mark: Mark) => {
    if (busy.current) return;
    busy.current = true;
    Haptics.impactAsync(mark === 'talked' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const dir = mark === 'talked' ? 1 : -1;
    Animated.timing(x, { toValue: dir * width * 1.3, duration: 220, useNativeDriver: true }).start(() => {
      const { pos: p, queue: q, qIndex: qi } = latest.current;
      onMark(qi, mark);
      if (p >= q.length - 1) {
        onFinish();
      } else {
        setPos(p + 1);
        x.setValue(0);
      }
      busy.current = false;
    });
  };
  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: (_, g) => x.setValue(g.dx),
        onPanResponderRelease: (_, g) => {
          if (g.dx > SWIPE_THRESHOLD) advanceRef.current('talked');
          else if (g.dx < -SWIPE_THRESHOLD) advanceRef.current('later');
          else Animated.spring(x, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
        },
        onPanResponderTerminate: () => Animated.spring(x, { toValue: 0, useNativeDriver: true }).start(),
      }),
    [x],
  );

  const rotate = x.interpolate({ inputRange: [-width, 0, width], outputRange: ['-18deg', '0deg', '18deg'] });
  const talkedOpacity = x.interpolate({ inputRange: [0, 90], outputRange: [0, 1], extrapolate: 'clamp' });
  const laterOpacity = x.interpolate({ inputRange: [-90, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16, paddingHorizontal: 20, gap: 14 }}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" onPress={() => { tap(); onFinish(); }} style={styles.endButton}>
          <Text style={styles.endText}>End</Text>
        </Pressable>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.counter}>Question {pos + 1} of {queue.length}</Text>
          <Text style={styles.deckName} numberOfLines={1}>{deck.title}</Text>
        </View>
        <IconButton label="Previous question" disabled={pos === 0} onPress={() => setPos(Math.max(0, pos - 1))}>
          <UndoIcon />
        </IconButton>
      </View>

      <View style={styles.segments} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {queue.map((qi, k) => {
          const m = marks[qi];
          const bg = k < pos ? (m === 'talked' ? colors.gold : colors.skipped) : k === pos ? colors.navy : colors.pending;
          return <View key={k} style={[styles.segment, { backgroundColor: bg }]} />;
        })}
      </View>

      <View style={{ flex: 1 }}>
        {!isLast && <View style={[styles.cardBehind, { backgroundColor: group.colors.background }]} />}
        <Animated.View
          {...pan.panHandlers}
          accessible
          accessibilityLabel={`${question.text}. ${WHO_LABEL[question.who]}. ${LEVEL_LABEL[question.level]}.`}
          accessibilityHint="Swipe right when you’ve talked it through, or swipe left to come back to it later."
          style={[styles.card, { backgroundColor: group.colors.background, transform: [{ translateX: x }, { rotate }] }]}
        >
          <View style={styles.cardTop}>
            <Text style={[styles.cardGroup, { color: group.colors.label }]}>{group.name}</Text>
            <View style={[styles.levelPill, { borderColor: group.colors.label }]}>
              <Text style={[styles.levelText, { color: group.colors.label }]}>{LEVEL_LABEL[question.level]}</Text>
            </View>
          </View>
          <View style={styles.stamps}>
            <Animated.Text style={[styles.stamp, styles.stampTalked, { opacity: talkedOpacity }]}>TALKED</Animated.Text>
            <Animated.Text style={[styles.stamp, styles.stampLater, { opacity: laterOpacity }]}>LATER</Animated.Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={[styles.question, { color: group.colors.text }]}>{question.text}</Text>
          </View>
          <View style={{ gap: 8 }}>
            <View style={styles.whoPill}>
              <Text style={[styles.whoText, { color: group.colors.text }]}>{WHO_LABEL[question.who]}</Text>
            </View>
            <Text style={[styles.hint, { color: group.colors.label }]}>{LEVEL_HINT[question.level]}</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <Button label="Skip for now" variant="secondary" style={{ flex: 1 }} onPress={() => advance('later')} />
        <Button label={isLast ? 'Finish' : 'Next question'} style={{ flex: 1 }} onPress={() => advance('talked')} />
      </View>
      <Text style={styles.swipeHint}>Swipe right when you’ve talked it through, left to skip</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 44 },
  endButton: { minHeight: 40, minWidth: 56, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  endText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.navy },
  counter: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.navy },
  deckName: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  segments: { flexDirection: 'row', gap: 3 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  cardBehind: { position: 'absolute', left: 12, right: 12, top: 14, bottom: 0, borderRadius: 28, opacity: 0.55 },
  card: { flex: 1, marginBottom: 12, userSelect: 'none', borderRadius: 28, padding: 24, gap: 14, shadowColor: colors.navy, shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardGroup: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  levelPill: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  levelText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  stamps: { height: 36, flexDirection: 'row', justifyContent: 'space-between' },
  stamp: { fontFamily: fonts.bodyBold, fontSize: 18, letterSpacing: 2, borderWidth: 3, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 2 },
  stampTalked: { color: colors.navy, borderColor: colors.navy, transform: [{ rotate: '-10deg' }] },
  stampLater: { color: colors.skipStamp, borderColor: colors.skipStamp, transform: [{ rotate: '10deg' }] },
  question: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  whoPill: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  whoText: { fontFamily: fonts.bodyBold, fontSize: 13 },
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10 },
  swipeHint: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
