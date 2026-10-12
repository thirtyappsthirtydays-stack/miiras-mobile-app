import { useCallback, useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold } from '@expo-google-fonts/figtree';
import { DECKS, GROUPS } from './src/content';
import { Mark, Progress, deckStatus } from './src/progress';
import { colors } from './src/theme';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AreaScreen } from './src/screens/AreaScreen';
import { IntroScreen } from './src/screens/IntroScreen';
import { CardScreen } from './src/screens/CardScreen';
import { ListScreen } from './src/screens/ListScreen';
import { DoneScreen } from './src/screens/DoneScreen';
import { AboutScreen } from './src/screens/AboutScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

type CardState = { deck: number; queue: number[]; pos: number; run: number };
type Screen =
  | { name: 'onboarding' }
  | { name: 'home' }
  | { name: 'about' }
  | { name: 'area'; group: number }
  | { name: 'intro'; deck: number }
  | ({ name: 'card' } & CardState)
  | ({ name: 'list' } & CardState)
  | { name: 'done'; deck: number };

const ALL = (n: number) => Array.from({ length: n }, (_, i) => i);
const groupIndexOf = (deck: number) => Math.max(0, GROUPS.findIndex((g) => g.id === DECKS[deck].group));

export default function App() {
  const [fontsLoaded] = useFonts({ Fraunces_500Medium, Fraunces_600SemiBold, Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold });
  // Nothing is saved on the device, so the short intro shows each time the app opens. It can be skipped.
  const [screen, setScreen] = useState<Screen>({ name: 'onboarding' });
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  const openCard = (deck: number, queue: number[], pos = 0) => setScreen({ name: 'card', deck, queue, pos, run: Date.now() });

  // Android back button and gesture go up one level instead of closing the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      switch (screen.name) {
        case 'home':
        case 'onboarding':
          return false;
        case 'area':
        case 'about':
          setScreen({ name: 'home' });
          return true;
        case 'intro':
          setScreen({ name: 'area', group: groupIndexOf(screen.deck) });
          return true;
        case 'card':
          setScreen({ name: 'done', deck: screen.deck });
          return true;
        case 'list':
          setScreen({ ...screen, name: 'card', run: Date.now() });
          return true;
        case 'done':
          setScreen({ name: 'area', group: groupIndexOf(screen.deck) });
          return true;
      }
    });
    return () => sub.remove();
  }, [screen]);

  const mark = useCallback((deckId: string, q: number, m: Mark) => {
    setProgress((p) => {
      const arr = [...(p[deckId] ?? [])];
      arr[q] = m;
      return { ...p, [deckId]: arr };
    });
  }, []);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.cream }} />;

  let content;
  switch (screen.name) {
    case 'onboarding':
      content = <OnboardingScreen onDone={() => setScreen({ name: 'home' })} />;
      break;
    case 'home':
      content = (
        <HomeScreen
          progress={progress}
          onOpenGroup={(group) => setScreen({ name: 'area', group })}
          onOpenAbout={() => setScreen({ name: 'about' })}
        />
      );
      break;
    case 'about':
      content = <AboutScreen onBack={() => setScreen({ name: 'home' })} />;
      break;
    case 'area':
      content = (
        <AreaScreen
          groupIndex={screen.group}
          progress={progress}
          onBack={() => setScreen({ name: 'home' })}
          onOpenDeck={(deck) => setScreen({ name: 'intro', deck })}
        />
      );
      break;
    case 'intro': {
      const deck = DECKS[screen.deck];
      const marks = progress[deck.id];
      const inProgress = deckStatus(marks, deck.questions.length) === 'started';
      content = (
        <IntroScreen
          deck={deck}
          inProgress={inProgress}
          onBack={() => setScreen({ name: 'area', group: groupIndexOf(screen.deck) })}
          onStart={() => {
            setProgress((p) => ({ ...p, [deck.id]: [] }));
            openCard(screen.deck, ALL(deck.questions.length));
          }}
          onContinue={() => {
            const first = deck.questions.findIndex((_, i) => !marks?.[i]);
            openCard(screen.deck, ALL(deck.questions.length), Math.max(0, first));
          }}
        />
      );
      break;
    }
    case 'card': {
      const deck = DECKS[screen.deck];
      content = (
        <CardScreen
          key={screen.run}
          deck={deck}
          queue={screen.queue}
          startPos={screen.pos}
          marks={progress[deck.id] ?? []}
          onMark={(q, m) => mark(deck.id, q, m)}
          onFinish={() => setScreen({ name: 'done', deck: screen.deck })}
          onOpenList={(pos) => setScreen({ ...screen, name: 'list', pos })}
        />
      );
      break;
    }
    case 'list': {
      const deck = DECKS[screen.deck];
      content = (
        <ListScreen
          deck={deck}
          marks={progress[deck.id] ?? []}
          current={screen.queue[screen.pos]}
          onBack={() => setScreen({ ...screen, name: 'card', run: Date.now() })}
          onPick={(q) => openCard(screen.deck, ALL(deck.questions.length), q)}
        />
      );
      break;
    }
    case 'done': {
      const deck = DECKS[screen.deck];
      content = (
        <DoneScreen
          deck={deck}
          deckIndex={screen.deck}
          marks={progress[deck.id] ?? []}
          onPick={(q) => openCard(screen.deck, ALL(deck.questions.length), q)}
          onReplay={(queue) => openCard(screen.deck, queue)}
          onOpenDeck={(d) => setScreen({ name: 'intro', deck: d })}
          onHome={() => setScreen({ name: 'home' })}
        />
      );
      break;
    }
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {content}
    </SafeAreaProvider>
  );
}
