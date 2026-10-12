import { useCallback, useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold } from '@expo-google-fonts/figtree';
import { DECKS } from './src/content';
import { Mark, Progress } from './src/progress';
import { colors } from './src/theme';
import { HomeScreen } from './src/screens/HomeScreen';
import { IntroScreen } from './src/screens/IntroScreen';
import { CardScreen } from './src/screens/CardScreen';
import { DoneScreen } from './src/screens/DoneScreen';
import { AboutScreen } from './src/screens/AboutScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Screen =
  | { name: 'home' }
  | { name: 'about' }
  | { name: 'intro'; deck: number }
  | { name: 'card'; deck: number; queue: number[]; run: number }
  | { name: 'done'; deck: number };

const ALL = (n: number) => Array.from({ length: n }, (_, i) => i);

export default function App() {
  const [fontsLoaded] = useFonts({ Fraunces_500Medium, Fraunces_600SemiBold, Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold });
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  // Android back button and gesture go up one level instead of closing the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen.name === 'home') return false;
      if (screen.name === 'card') setScreen({ name: 'done', deck: screen.deck });
      else setScreen({ name: 'home' });
      return true;
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
    case 'home':
      content = (
        <HomeScreen
          progress={progress}
          onOpenDeck={(deck) => setScreen({ name: 'intro', deck })}
          onOpenAbout={() => setScreen({ name: 'about' })}
        />
      );
      break;
    case 'about':
      content = <AboutScreen onBack={() => setScreen({ name: 'home' })} />;
      break;
    case 'intro': {
      const deck = DECKS[screen.deck];
      content = (
        <IntroScreen
          deck={deck}
          onBack={() => setScreen({ name: 'home' })}
          onStart={() => {
            setProgress((p) => ({ ...p, [deck.id]: [] }));
            setScreen({ name: 'card', deck: screen.deck, queue: ALL(deck.questions.length), run: Date.now() });
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
          marks={progress[deck.id] ?? []}
          onMark={(q, m) => mark(deck.id, q, m)}
          onFinish={() => setScreen({ name: 'done', deck: screen.deck })}
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
          onReplay={(queue) => setScreen({ name: 'card', deck: screen.deck, queue, run: Date.now() })}
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
