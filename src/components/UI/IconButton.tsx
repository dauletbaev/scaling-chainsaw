import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size: number;
  color: string;
  onPress: () => void;
}

function IconButton(props: Props) {
  const { name, size, color, onPress } = props;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
