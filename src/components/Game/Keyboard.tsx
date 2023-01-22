import * as React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../Themed';
import KeyboardRow from './KeyboardRow';

interface Props {
  onKeyPress: (letter: string) => void;
}

function Keyboard({ onKeyPress }: Props) {
  const row0 = ['á', 'ó', 'ı', 'ń', 'ú', 'ǵ'];
  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'];

  return (
    <View style={styles.keyboard}>
      <KeyboardRow letters={row0} onKeyPress={onKeyPress} />
      <KeyboardRow letters={row1} onKeyPress={onKeyPress} />
      <KeyboardRow letters={row2} onKeyPress={onKeyPress} />
      <KeyboardRow letters={row3} onKeyPress={onKeyPress} />
    </View>
  );
}

export default Keyboard;

const styles = StyleSheet.create({
  keyboard: {
    flexDirection: 'column',
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  key: {
    backgroundColor: '#d3d6da',
    padding: 10,
    margin: 3,
    borderRadius: 5,
  },
  keyLetter: {
    fontWeight: '500',
    fontSize: 15,
  },
});
