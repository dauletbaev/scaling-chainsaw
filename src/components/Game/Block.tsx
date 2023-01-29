import * as React from 'react';
import { StyleSheet } from 'react-native';
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

  if (letter === wordLetter && guessed) {
    blockStyles.push(styles.guessCorrect);
    textStyles.push(styles.guessedLetter);
  } else if (word.includes(letter) && guessed) {
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
    borderColor: '#d3d6da',
    borderWidth: 2,
    width: Math.floor(Layout.window.width / 7.68),
    height: Math.floor(Layout.window.height / 16.07),
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  guessLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#878a8c',
  },
  guessedLetter: {
    color: '#fff',
  },
  guessCorrect: {
    backgroundColor: '#6aaa64',
    borderColor: '#6aaa64',
  },
  guessInWord: {
    backgroundColor: '#c9b458',
    borderColor: '#c9b458',
  },
  guessNotInWord: {
    backgroundColor: '#787c7e',
    borderColor: '#787c7e',
  },
});
