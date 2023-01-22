import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';

import DrawerTopAvatar from './Avatar';
import { Text } from '../Themed';

function DrawerTop() {
  const navigation = useNavigation();

  function onPress() {
    navigation.navigate('Profile');
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <DrawerTopAvatar
        size={100}
        imageUrl="https://api.dicebear.com/5.x/adventurer-neutral/png?scale=80&radius=50&size=256"
      />
      <Text style={styles.username}>Username</Text>
    </Pressable>
  );
}

export default DrawerTop;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pressed: {
    backgroundColor: 'rgba(0, 0, 0, .05)',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
