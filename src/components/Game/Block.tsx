import * as React from 'react';
import { StyleSheet } from 'react-native';

import { COLORS } from '../../constants/Game';
import Layout from '../../constants/Layout';

import { Text, View } from '../Themed';

interface Props {
  index: number;
  guess: string;
  word: string;
  guessed: boolean;
}

function Block({ index, guess, word, guessed }: Props) {
  const letter = guess[index];
  const wordLetter = word[index];

  const blockStyles: any[] = [styles.guessSquare];
  const textStyles: any[] = [styles.guessLetter];

  const correctGuess = new Set<string>();

  if (letter === wordLetter && guessed) {
    blockStyles.push(styles.guessCorrect);
    textStyles.push(styles.guessedLetter);
    correctGuess.add(letter);
  } else if (correctGuess.has(letter) && guessed) {
    blockStyles.push(styles.guessInWord);
    textStyles.push(styles.guessedLetter);
  } else if (guessed) {
    blockStyles.push(styles.guessNotInWord);
    textStyles.push(styles.guessedLetter);
  }

  return (
    <View style={blockStyles}>
      <Text style={textStyles}>{letter}</Text>
    </View>
  );
}

export default Block;

const styles = StyleSheet.create({
  guessSquare: {
    borderColor: COLORS[Layout.colorScheme].guessSquare.background,
    borderWidth: 2,
    width: Math.floor(Layout.window.width / 7.68) - 5,
    height: Math.floor(Layout.window.height / 16.07) - 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  guessLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS[Layout.colorScheme].guessSquare.letter,
  },
  guessedLetter: {
    color: COLORS[Layout.colorScheme].guessedLetter,
  },
  guessCorrect: {
    backgroundColor: COLORS[Layout.colorScheme].correctGuess.background,
    borderColor: COLORS[Layout.colorScheme].correctGuess.border,
  },
  guessInWord: {
    backgroundColor: COLORS[Layout.colorScheme].inGuess.background,
    borderColor: COLORS[Layout.colorScheme].inGuess.border,
  },
  guessNotInWord: {
    backgroundColor: COLORS[Layout.colorScheme].wrongGuess.background,
    borderColor: COLORS[Layout.colorScheme].wrongGuess.border,
  },
});
