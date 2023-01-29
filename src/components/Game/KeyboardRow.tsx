import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Layout from '../../constants/Layout';
import { getCapitalizedLetter } from '../../lib/game';
import { Text, View } from '../Themed';

interface Props {
  letters: string[];
  onKeyPress: (letter: string) => void;
}

function KeyboardRow({ letters, onKeyPress }: Props) {
  return (
    <View style={styles.keyboardRow}>
      {letters.map(letter => (
        <TouchableOpacity
          onPress={() => {
            onKeyPress(letter);
          }}
          key={letter}
        >
          <View style={[styles.key, letter.length > 1 && styles.keyWithIcon]}>
            {letter.length === 1 && (
              <Text style={styles.keyLetter}>{getCapitalizedLetter(letter)}</Text>
            )}

            {letter === 'ENTER' && <Ionicons name="return-down-back-outline" size={18} />}
            {letter === 'BACKSPACE' && <Ionicons name="backspace-outline" size={18} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default KeyboardRow;

const styles = StyleSheet.create({
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Layout.isSmallDevice ? 5 : 10,
  },
  key: {
    backgroundColor: '#d3d6da',
    paddingVertical: Layout.isSmallDevice ? 7 : 10,
    paddingHorizontal: 10,
    margin: 3,
    borderRadius: 5,
  },
  keyWithIcon: {
    marginHorizontal: 0,
    paddingHorizontal: Layout.isSmallDevice ? 10 : 20,
    alignItems: 'center',
  },
  keyLetter: {
    fontWeight: '500',
    fontSize: Layout.isSmallDevice ? 12 : 15,
  },
});
