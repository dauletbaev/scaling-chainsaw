import * as React from 'react';
import {
  type User,
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

GoogleSignin.configure({
  webClientId: '825240899035-vic15m9sojebidki6biq2hp062ljnsnd.apps.googleusercontent.com',
});

interface IAuthContext {
  user: User['user'] | null;
  idToken: string | null;
  isLoggedIn: boolean;
  invalidateUser: (user: Partial<IAuthContext['user']>) => void;
  setIdToken: (idToken: string | null) => void;
  setUser: (user: IAuthContext['user']) => void;
  signIn: () => Promise<FirebaseAuthTypes.UserCredential | undefined>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<IAuthContext | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context == null) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [idToken, setIdToken] = React.useState<IAuthContext['idToken']>(null);
  const [user, setUser] = React.useState<IAuthContext['user']>(null);

  const signIn = React.useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).catch(
        () => {},
      );
      const userInfo = await GoogleSignin.signIn();

      setUser(userInfo.user);
      setIdToken(userInfo.idToken);

      await AsyncStorage.setItem('user', JSON.stringify(userInfo.user));
      if (userInfo.idToken != null) {
        await AsyncStorage.setItem('idToken', userInfo.idToken);
      }

      const document = await firestore().collection('users').doc(userInfo.user.id).get();

      if (document.exists) {
        void document.ref
          .update({
            last_login: firestore.FieldValue.serverTimestamp(),
            updated_at: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            void analytics().logLogin({
              method: 'Google',
            });
          })
          .catch(crashlytics().recordError);
      } else {
        await messaging().requestPermission();
        const token = await messaging().getToken();

        void document.ref
          .set(
            {
              familyName: userInfo.user.familyName,
              givenName: userInfo.user.givenName,
              name: userInfo.user.name,
              avatar: '',
              email: userInfo.user.email,
              total_score: 0,
              monthly_score: 0,
              fcm_tokens: firestore.FieldValue.arrayUnion(token),
              last_login: firestore.FieldValue.serverTimestamp(),
              created_at: firestore.FieldValue.serverTimestamp(),
              updated_at: firestore.FieldValue.serverTimestamp(),
            },
            {
              merge: true,
            },
          )
          .then(() => {
            void analytics().logSignUp({
              method: 'Google',
            });
            void Promise.all([
              crashlytics().setUserId(userInfo.user.id),
              crashlytics().setAttributes({
                email: userInfo.user.email,
                name: userInfo.user.name ?? 'NO_NAME',
              }),
            ]);
          })
          .catch(crashlytics().recordError);
      }

      let logMsg = `User signed in: ${userInfo.user.id} - ${userInfo.user.email} - ${userInfo.user.name}`;
      if (document.exists) {
        logMsg += ' - Returning user';
      }

      void analytics().logEvent('login', {
        method: 'Google',
        message: logMsg,
      });

      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      return await auth().signInWithCredential(googleCredential);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }

      crashlytics().recordError(error);

      throw new Error(error.code);
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
      setIdToken(null);

      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('idToken');
      await auth().signOut();

      void analytics().logEvent('logout', {
        method: 'Google',
        message: 'User signed out',
      });
    } catch (error: any) {
      crashlytics().recordError(error);
    }
  }, []);

  const invalidateUser = React.useCallback(
    async (user: Partial<IAuthContext['user']>) => {
      try {
        const currentUser = await AsyncStorage.getItem('user');
        if (currentUser != null) {
          const parsedUser = JSON.parse(currentUser);
          const updatedUser = {
            ...parsedUser,
            ...user,
          };
          setUser(updatedUser);
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error: any) {
        crashlytics().recordError(error);
      }
    },
    [],
  );

  React.useEffect(() => {
    let unsubscribe: () => void;
    const getUser = async () => {
      const user = await AsyncStorage.getItem('user');
      const idToken = await AsyncStorage.getItem('idToken');

      if (user != null) {
        const parsedUser = JSON.parse(user) as NonNullable<IAuthContext['user']>;
        setUser(parsedUser);
        unsubscribe = messaging().onTokenRefresh(async fcmToken => {
          console.log('FCM token refreshed', fcmToken);

          await firestore()
            .collection('users')
            .doc(parsedUser.id)
            .update({
              fcm_tokens: firestore.FieldValue.arrayUnion(fcmToken),
            });
        });
      }

      if (idToken != null) {
        setIdToken(idToken);
      }
    };

    getUser().catch(crashlytics().recordError);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      setUser,
      idToken,
      setIdToken,
      isLoggedIn: typeof idToken === 'string',
      invalidateUser,
      signIn,
      signOut,
    }),
    [user, idToken, signIn, signOut, invalidateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
