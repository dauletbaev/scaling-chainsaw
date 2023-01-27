import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View as NativeView, Alert } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { Text, View } from '../Themed';
import { useAuth } from '../../store/authContext';

function DrawerBottom() {
  const navigation = useNavigation<any>();
  const authCtx = useAuth();
  const [isSigninInProgress, setIsSigninInProgress] = React.useState(false);

  const signOut = () => {
    Alert.alert('Shıǵıw?', 'Kiriwge qaytıp ǵana kirip kere?', [
      { text: 'Qalıw', style: 'cancel' },
      {
        text: 'Shıǵıw',
        onPress: () => {
          navigation.dispatch(DrawerActions.closeDrawer());
          authCtx.signOut().catch(() => {});
        },
      },
    ]);
  };

  const signIn = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    setIsSigninInProgress(true);

    authCtx.signIn().finally(() => {
      setIsSigninInProgress(false);
      Alert.alert('Kiriw', 'Kiriwge muvaffaqııtlı ǵana kirip kere');
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        android_ripple={{ color: 'lightgray' }}
        onPress={() => {
          authCtx.isLoggedIn ? signOut() : signIn();
        }}
        disabled={isSigninInProgress}
      >
        <NativeView style={styles.innerContainer}>
          {authCtx.isLoggedIn && <Text>Shıǵıw</Text>}
          <Ionicons
            style={styles.icon}
            name={authCtx.isLoggedIn ? 'log-out-outline' : 'logo-google'}
            size={24}
            color="black"
          />
          {!authCtx.isLoggedIn && <Text>Google arqalı kiriw</Text>}
        </NativeView>
      </Pressable>
    </View>
  );
}

export default DrawerBottom;

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    marginHorizontal: 20,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
});
