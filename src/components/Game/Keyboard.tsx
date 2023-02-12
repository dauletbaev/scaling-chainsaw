import * as React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../Themed';
import KeyboardRow from './KeyboardRow';

interface Props {
  excludedLetters: Map<string, string>;
  onKeyPress: (letter: string) => void;
}

const row0 = ['á', 'ó', 'ı', 'ń', 'ú', 'ǵ'];
const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const row3 = ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'];

function Keyboard({ onKeyPress, excludedLetters }: Props) {
  return (
    <View style={styles.keyboard}>
      <KeyboardRow
        excludedLetters={excludedLetters}
        letters={row0}
        onKeyPress={onKeyPress}
      />
      <KeyboardRow
        excludedLetters={excludedLetters}
        letters={row1}
        onKeyPress={onKeyPress}
      />
      <KeyboardRow
        excludedLetters={excludedLetters}
        letters={row2}
        onKeyPress={onKeyPress}
      />
      <KeyboardRow
        excludedLetters={excludedLetters}
        letters={row3}
        onKeyPress={onKeyPress}
      />
    </View>
  );
}

export default Keyboard;

const styles = StyleSheet.create({
  keyboard: {
    flexDirection: 'column',
  },
});
