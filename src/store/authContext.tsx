import * as React from 'react';
import {
  type User,
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import crashlytics from '@react-native-firebase/crashlytics';

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
            crashlytics().log(
              `Sign in back: ${userInfo.user.id} - ${userInfo.user.email} - ${userInfo.user.name}`,
            );
            crashlytics().log(
              `User updated: ${userInfo.user.id} - ${userInfo.user.email} - ${userInfo.user.name}`,
            );
          })
          .catch(error => {
            crashlytics().recordError(
              new Error(
                `Error on sign in back: ${userInfo.user.id} - ${userInfo.user.email} - ${userInfo.user.name}`,
              ),
            );
            crashlytics().recordError(error);
          });
      } else {
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
              fcm_tokens: firestore.FieldValue.arrayUnion('ABCDE123456'),
              last_login: firestore.FieldValue.serverTimestamp(),
              created_at: firestore.FieldValue.serverTimestamp(),
              updated_at: firestore.FieldValue.serverTimestamp(),
            },
            {
              merge: true,
            },
          )
          .then(() => {
            crashlytics().log(
              `User added: ${userInfo.user.id} - ${userInfo.user.email} - ${userInfo.user.name}`,
            );
            void Promise.all([
              crashlytics().setUserId(userInfo.user.id),
              crashlytics().setAttributes({
                email: userInfo.user.email,
                name: userInfo.user.name ?? 'NO_NAME',
              }),
            ]);
          })
          .catch(error => {
            crashlytics().recordError(error);
          });
      }

      let logMsg = `User signed in: ${userInfo.user.id} - ${userInfo.user.email} - ${userInfo.user.name}`;
      if (document.exists) {
        logMsg += ' - Returning user';
      }
      crashlytics().log(logMsg);

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

      crashlytics().log(`User signed out: ${user?.id} - ${user?.email} - ${user?.name}`);
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
    const getUser = async () => {
      const user = await AsyncStorage.getItem('user');
      const idToken = await AsyncStorage.getItem('idToken');

      if (user != null) {
        setUser(JSON.parse(user));
      }

      if (idToken != null) {
        setIdToken(idToken);
      }
    };

    getUser().catch(crashlytics().recordError);
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
    [user, idToken, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
