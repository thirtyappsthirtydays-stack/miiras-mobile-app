import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Deck } from '../content';
import { Marks } from '../progress';
import { colors, fonts } from '../theme';
import { BackIcon } from '../components/Icons';
import { QuestionList } from '../components/QuestionList';
import { Body, IconButton, Title } from '../components/ui';

type Props = {
  deck: Deck;
  marks: Marks;
  current: number;
  onBack: () => void;
  onPick: (questionIndex: number) => void;
};

export function ListScreen({ deck, marks, current, onBack, onPick }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20, paddingHorizontal: 20, gap: 14 }}
    >
      <View style={styles.top}>
        <IconButton label="Back to the card" onPress={onBack}>
          <BackIcon />
        </IconButton>
        <Text style={styles.deck} numberOfLines={1}>{deck.title}</Text>
        <View style={{ width: 44 }} />
      </View>
      <Title size={28}>All questions in this deck</Title>
      <Body>Tap any question to go back to it.</Body>
      <QuestionList deck={deck} marks={marks} indexes={deck.questions.map((_, i) => i)} current={current} onPick={onPick} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  top: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  deck: { flex: 1, textAlign: 'center', fontFamily: fonts.body, fontSize: 14, color: colors.muted },
});
