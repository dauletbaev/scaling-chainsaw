import * as React from 'react';
import { SafeAreaView, Button, StyleSheet } from 'react-native';
import analytics from '@react-native-firebase/analytics';

import type { HomeTabsScreenProps } from '../types';

import { Text, View } from '../components/Themed';
import GuessRow from '../components/Game/GuessRow';
import Keyboard from '../components/Game/Keyboard';

import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { getCapitalizedLetter, getRandomWord, WORD_OF_THE_DAY } from '../lib/game';
import { COLORS, MAX_CHALLENGES } from '../constants/Game';
import useUpdateScore from '../hooks/useUpdateScore';

type IGuess = Record<number, string>;

const defaultGuess: IGuess = {
  0: '',
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
};

function GameScreen(_: HomeTabsScreenProps<'Game'>) {
  const colorScheme = useColorScheme();
  const updateScore = useUpdateScore();

  const [score, setScore] = React.useState(0);
  const [activeWord, setActiveWord] = React.useState(WORD_OF_THE_DAY);
  const [guessIndex, setGuessIndex] = React.useState(0);
  const [guesses, setGuesses] = React.useState<IGuess>(defaultGuess);
  const [gameComplete, setGameComplete] = React.useState(false);

  React.useEffect(() => {
    void analytics().logScreenView({
      screen_name: 'Game',
      screen_class: 'Game',
    });
  }, []);

  const handleKeyPress = React.useCallback(
    (letter: string) => {
      const guess = guesses[guessIndex];

      if (letter === 'ENTER') {
        if (guess.length !== 5) {
          alert('Word too short.');
          return;
        }

        // if (!words.includes(guess)) {
        //   alert('Not a valid word.');
        //   return;
        // }

        if (guess === activeWord) {
          setScore(MAX_CHALLENGES * 20 - guessIndex * 20);
          setGuessIndex(guessIndex + 1);
          setGameComplete(true);
          alert('You win!');
          return;
        }

        if (guessIndex < 5) {
          setGuessIndex(guessIndex + 1);
        } else {
          setGameComplete(true);
          alert('You lose!');
          return;
        }
      }

      if (letter === 'BACKSPACE') {
        setGuesses({ ...guesses, [guessIndex]: guess.slice(0, -1) });
        return;
      }

      // don't add if guess is full
      if (guess.length >= 5) {
        return;
      }

      setGuesses({ ...guesses, [guessIndex]: guess + getCapitalizedLetter(letter) });
    },
    [guesses, guessIndex, activeWord],
  );

  const resetGameWithRandomWord = React.useCallback(() => {
    setActiveWord(getRandomWord());
    setGuesses(defaultGuess);
    setGuessIndex(0);
    setScore(0);
    setGameComplete(false);
  }, []);

  const excludedLetters = React.useMemo(() => {
    const letters = new Map<string, string>();

    for (let i = 0; i < guessIndex; i++) {
      const guess = guesses[i];
      for (let j = 0; j < guess.length; j++) {
        const letter = getCapitalizedLetter(activeWord[j]);
        const guessedLetter = getCapitalizedLetter(guess[j]);
        const scheme = COLORS[colorScheme];

        if (guessedLetter === letter) {
          letters.set(guessedLetter, scheme.correctGuess.background);
        } else if (activeWord.includes(guessedLetter)) {
          letters.set(guessedLetter, scheme.inGuess.background);
        } else {
          letters.set(guessedLetter, scheme.wrongGuess.background);
        }
      }
    }

    return letters;
  }, [guessIndex, guesses, activeWord, colorScheme]);

  React.useEffect(() => {
    if (gameComplete && score > 0) {
      void analytics().logEvent('game_complete', {
        score,
      });

      updateScore(score);
    }
  }, [score, gameComplete, updateScore]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme].background,
        },
      ]}
    >
      <Text style={styles.title}>SÓZLE</Text>
      <View>
        <GuessRow guess={guesses[0]} word={activeWord} guessed={guessIndex > 0} />
        <GuessRow guess={guesses[1]} word={activeWord} guessed={guessIndex > 1} />
        <GuessRow guess={guesses[2]} word={activeWord} guessed={guessIndex > 2} />
        <GuessRow guess={guesses[3]} word={activeWord} guessed={guessIndex > 3} />
        <GuessRow guess={guesses[4]} word={activeWord} guessed={guessIndex > 4} />
        <GuessRow guess={guesses[5]} word={activeWord} guessed={guessIndex > 5} />
      </View>
      <View>
        {gameComplete && (
          <View style={styles.gameCompleteWrapper}>
            <Text>
              <Text style={styles.bold}>Correct Word:</Text> {activeWord}
            </Text>
            <View>
              <Button title="Reset" onPress={resetGameWithRandomWord} />
            </View>
          </View>
        )}
        <Keyboard excludedLetters={excludedLetters} onKeyPress={handleKeyPress} />
      </View>
    </SafeAreaView>
  );
}

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  // Game complete
  gameCompleteWrapper: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});
