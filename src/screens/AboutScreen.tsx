import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { colors, fonts } from '../theme';
import { BackIcon, Logo } from '../components/Icons';
import { Button, Card, IconButton } from '../components/ui';

const CONTACT_EMAIL = 'hello@getmiiras.com';
const PRIVACY_URL = 'https://getmiiras.com/privacy';

export function AboutScreen({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
    >
      <View style={{ minHeight: 44, justifyContent: 'center' }}>
        <IconButton label="Back" onPress={onBack}>
          <BackIcon />
        </IconButton>
      </View>
      <View style={styles.brand}>
        <Logo size={40} />
        <Text style={styles.wordmark}>miiras</Text>
      </View>
      <Text accessibilityRole="header" style={styles.title}>Conversations families keep putting off</Text>
      <Text style={styles.body}>
        Miiras gives your family a gentle, structured way to talk about money, health, care and the future, one question at a time.
      </Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Your privacy</Text>
        <Text style={styles.body}>Miiras doesn’t collect, store or send anything you say. There’s no account and no recording. What’s said at the table stays at the table.</Text>
      </Card>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Not professional advice</Text>
        <Text style={styles.body}>These questions help families talk. They aren’t medical, legal or financial advice. For decisions, speak with a qualified professional.</Text>
      </Card>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>How we wrote the questions</Text>
        <Text style={styles.body}>
          Every question is grounded in published research on how families talk about money, health and the end of life, drawing on family psychology, family wealth advising and end-of-life care guides such as The Conversation Project’s.
        </Text>
      </Card>

      <Button variant="secondary" label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
      <Button variant="secondary" label={`Contact us: ${CONTACT_EMAIL}`} onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)} />
      <Text style={styles.version}>Version {version}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 16 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordmark: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.navy, letterSpacing: -0.8 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 32, color: colors.navy },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: '#3F4B5E' },
  section: { padding: 16, gap: 6 },
  sectionTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.navy },
  version: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, textAlign: 'center' },
});
