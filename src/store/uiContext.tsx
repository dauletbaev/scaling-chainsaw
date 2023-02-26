import * as React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import { getRandomSeed } from '../lib/seed';
import { fetchNotifications } from '../lib/fetchNotifications';
import { navigationRef } from '../navigation';

const generatedSeed = getRandomSeed();
let avatarUrlBase =
  'https://api.dicebear.com/5.x/adventurer-neutral/png?scale=80&radius=50&size=256';

interface IUiContext {
  avatarUrl: string;
  setAvatarUrl: (avatarUrl: string) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  notificationBody: NotificationBody;
  setNotificationBody: (notificationBody: NotificationBody) => void;
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
}

export interface Notification {
  id: string;
  title: string;
  thumbnail?: string;
  date: string;
  isRead: boolean;
}

export type NotificationBody = Record<Notification['id'], string>;

export const AuthContext = React.createContext<IUiContext | null>(null);

export const useUi = () => {
  const context = React.useContext(AuthContext);
  if (context == null) {
    throw new Error('useUi must be used within a UiProvider');
  }
  return context;
};

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notificationBody, setNotificationBody] = React.useState<NotificationBody>({});
  const [unreadNotificationCount, setUnreadNotificationCount] = React.useState(0);
  const [avatarUrl, setAvatarUrl] = React.useState(avatarUrlBase);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { data } = remoteMessage;
      if (data !== undefined && data.general === 'true') {
        await fetchNotifications();
        navigationRef.current?.navigate('Notifications');
        setUnreadNotificationCount(prev => prev + 1);
        return;
      }

      const { title, body } = remoteMessage.notification ?? {};
      if (title !== undefined && body !== undefined) {
        Alert.alert(title, body);
      }
    });

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

    AsyncStorage.getItem('unreadNotificationCount')
      .then(storedCount => {
        if (storedCount != null) {
          setUnreadNotificationCount(parseInt(storedCount));
        }
      })
      .catch(() => {});

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('avatarUrl', avatarUrl).catch(() => {});
  }, [avatarUrl]);

  React.useEffect(() => {
    AsyncStorage.setItem(
      'unreadNotificationCount',
      unreadNotificationCount.toString(),
    ).catch(() => {});
  }, [unreadNotificationCount]);

  const value = React.useMemo(
    () => ({
      avatarUrl,
      setAvatarUrl,
      notifications,
      setNotifications,
      notificationBody,
      setNotificationBody,
      unreadNotificationCount,
      setUnreadNotificationCount,
    }),
    [avatarUrl, notifications, notificationBody, unreadNotificationCount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
