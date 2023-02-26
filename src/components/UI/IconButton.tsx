import * as React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size: number;
  color: string;
  onPress: () => void;
  badgeText?: string | number;
}

function IconButton(props: Props) {
  const { name, size, color, onPress, badgeText } = props;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Ionicons style={styles.icon} name={name} size={size} color={color} />
      {badgeText !== undefined && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  badge: {
    backgroundColor: '#f00',
    borderRadius: 10,
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    bottom: -5,
    left: 0,
  },
  badgeText: {
    fontSize: 8,
    color: '#fff',
  },
});
