import * as React from 'react';
import {
  type User,
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId: '825240899035-vic15m9sojebidki6biq2hp062ljnsnd.apps.googleusercontent.com',
});

interface IAuthContext {
  user: User['user'] | null;
  idToken: string | null;
  isLoggedIn: boolean;
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
    } catch (error) {
      console.error(error);
    }
  }, []);

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

    getUser().catch(() => {});
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      setUser,
      idToken,
      setIdToken,
      isLoggedIn: typeof idToken === 'string',
      signIn,
      signOut,
    }),
    [user, setUser, idToken, setIdToken, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
