import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';

import DrawerTopAvatar from './Avatar';
import { Text } from '../Themed';
import { useAuth } from '../../store/authContext';
import { getRandomSeed } from '../../lib/seed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generatedSeed = getRandomSeed();
let avatarUrl =
  'https://api.dicebear.com/5.x/adventurer-neutral/png?scale=80&radius=50&size=256';

function DrawerTop() {
  const { user } = useAuth();
  const navigation = useNavigation();

  function onPress() {
    navigation.navigate('Profile', { userId: user?.id });
  }

  React.useEffect(() => {
    AsyncStorage.getItem('seed')
      .then(seed => {
        if (seed != null) {
          avatarUrl += '&seed=' + seed;
        } else {
          AsyncStorage.setItem('seed', generatedSeed).catch(() => {});
          avatarUrl += '&seed=' + generatedSeed;
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <DrawerTopAvatar size={100} imageUrl={avatarUrl} />
      <Text style={styles.username}>{user?.name ?? 'Miyman'}</Text>
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
