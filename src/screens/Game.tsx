import * as React from 'react';
import { SafeAreaView, Button, StyleSheet } from 'react-native';

import GuessRow from '../components/Game/GuessRow';
import Keyboard from '../components/Game/Keyboard';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { getCapitalizedLetter } from '../lib/game';
import { HomeTabsScreenProps } from '../types';

const words = [
  'LIGHT',
  'TIGHT',
  'GOING',
  'WRUNG',
  'COULD',
  'PERKY',
  'MOUNT',
  'WHACK',
  'SUGAR',
];

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

  const [activeWord, setActiveWord] = React.useState(words[0]);
  const [guessIndex, setGuessIndex] = React.useState(0);
  const [guesses, setGuesses] = React.useState<IGuess>(defaultGuess);
  const [gameComplete, setGameComplete] = React.useState(false);

  const handleKeyPress = (letter: string) => {
    const guess: string = guesses[guessIndex];

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
  };

  React.useEffect(() => {
    if (!gameComplete) {
      setActiveWord(words[Math.floor(Math.random() * words.length)]);
      setGuesses(defaultGuess);
      setGuessIndex(0);
    }
  }, [gameComplete]);

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
              <Button
                title="Reset"
                onPress={() => {
                  setGameComplete(false);
                }}
              />
            </View>
          </View>
        )}
        <Keyboard onKeyPress={handleKeyPress} />
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
