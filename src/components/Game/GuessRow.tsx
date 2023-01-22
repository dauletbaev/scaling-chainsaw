import * as React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../Themed';
import Block from './Block';

interface Props {
  guess: string;
  word: string;
  guessed: boolean;
}

function GuessRow({ guess, word, guessed }: Props) {
  return (
    <View style={styles.guessRow}>
      <Block index={0} guess={guess} word={word} guessed={guessed} />
      <Block index={1} guess={guess} word={word} guessed={guessed} />
      <Block index={2} guess={guess} word={word} guessed={guessed} />
      <Block index={3} guess={guess} word={word} guessed={guessed} />
      <Block index={4} guess={guess} word={word} guessed={guessed} />
    </View>
  );
}

export default GuessRow;

const styles = StyleSheet.create({
  guessRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
