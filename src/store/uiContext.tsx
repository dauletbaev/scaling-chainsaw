import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomSeed } from '../lib/seed';

const generatedSeed = getRandomSeed();
let avatarUrlBase =
  'https://api.dicebear.com/5.x/adventurer-neutral/png?scale=80&radius=50&size=256';

interface IUiContext {
  avatarUrl: string;
  setAvatarUrl: (avatarUrl: string) => void;
}

export const AuthContext = React.createContext<IUiContext | null>(null);

export const useUi = () => {
  const context = React.useContext(AuthContext);
  if (context == null) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
};

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatarUrl, setAvatarUrl] =
    React.useState<IUiContext['avatarUrl']>(avatarUrlBase);

  React.useEffect(() => {
    AsyncStorage.getItem('avatarUrl')
      .then(storedUrl => {
        if (storedUrl != null) {
          setAvatarUrl(storedUrl);
          avatarUrlBase = storedUrl;
        } else {
          setAvatarUrl(prev => prev + '&seed=' + generatedSeed);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('avatarUrl', avatarUrl).catch(() => {});
  }, [avatarUrl]);

  const value = React.useMemo(
    () => ({
      avatarUrl,
      setAvatarUrl,
    }),
    [avatarUrl],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
