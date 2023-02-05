import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet } from 'react-native';

import DrawerTopAvatar from './Avatar';
import { Text } from '../Themed';
import { useAuth } from '../../store/authContext';
import { useUi } from '../../store/uiContext';

function DrawerTop() {
  const { avatarUrl } = useUi();
  const { user, isLoggedIn } = useAuth();
  const navigation = useNavigation();

  function onPress() {
    if (isLoggedIn && user !== null) {
      navigation.navigate('Profile', { userId: user.id });
    }
  }

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
