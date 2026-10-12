import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Deck } from '../content';
import { Marks, STATUS_LABEL } from '../progress';
import { colors, fonts } from '../theme';
import { Badge, Card, tap } from './ui';

type Props = {
  deck: Deck;
  marks: Marks;
  indexes: number[];
  current?: number;
  onPick: (questionIndex: number) => void;
};

export function QuestionList({ deck, marks, indexes, current, onPick }: Props) {
  return (
    <Card style={{ paddingHorizontal: 14 }}>
      {indexes.map((qi, k) => {
        const m = marks[qi];
        const here = qi === current;
        const label = here ? 'Here now' : STATUS_LABEL[m ?? 'none'];
        return (
          <Pressable
            key={qi}
            accessibilityRole="button"
            accessibilityLabel={`Question ${qi + 1}. ${deck.questions[qi].text}. ${label}.`}
            onPress={() => { tap(); onPick(qi); }}
            style={({ pressed }) => [styles.row, k > 0 && styles.border, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.num}>{qi + 1}</Text>
            <Text style={styles.q}>{deck.questions[qi].text}</Text>
            <Badge label={label} tone={here ? 'navy' : m === 'talked' ? 'gold' : m === 'later' ? 'clay' : 'neutral'} />
          </Pressable>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, minHeight: 48 },
  border: { borderTopWidth: 1, borderTopColor: colors.divider },
  num: { width: 20, fontFamily: fonts.bodyBold, fontSize: 13, color: '#6B7280' },
  q: { flex: 1, fontFamily: fonts.body, fontSize: 14, lineHeight: 19, color: colors.navy },
});
