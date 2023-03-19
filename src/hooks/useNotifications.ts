import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Notification, NotificationBody, useUi } from '../store/uiContext';
import { fetchNotifications } from '../lib/fetchNotifications';

export default function useNotifications() {
  const { notifications, setNotifications, notificationBody, setNotificationBody } =
    useUi();

  React.useEffect(() => {
    async function effect() {
      const cachedNotifications = await AsyncStorage.getItem('cachedNotifications');
      const cachedNotificationBody = await AsyncStorage.getItem('cachedNotificationBody');

      if (cachedNotifications != null && cachedNotificationBody != null) {
        const notifications = JSON.parse(cachedNotifications) as Notification[];
        const notificationBody = JSON.parse(cachedNotificationBody) as NotificationBody;

        setNotifications(notifications);
        setNotificationBody(notificationBody);
      } else {
        void fetchNotifications().then(([notifications, notificationBody]) => {
          setNotifications(notifications);
          setNotificationBody(notificationBody);
        });
      }
    }

    void effect();
  }, [setNotifications, setNotificationBody]);

  const markAsRead = React.useCallback(
    (id: Notification['id']) => {
      let update: Notification[] = [];
      setNotifications(prev => {
        update = prev.map(notification => ({
          ...notification,
          isRead: notification.id === id,
        }));
        return update;
      });

      if (update.length > 0) {
        void AsyncStorage.setItem('cachedNotifications', JSON.stringify(update));
      }
    },
    [setNotifications],
  );

  const refetchNotifications = React.useCallback(async () => {
    const [notifications, notificationBody] = await fetchNotifications();
    setNotifications(notifications);
    setNotificationBody(notificationBody);
  }, [setNotifications, setNotificationBody]);

  return {
    notifications,
    body: notificationBody,
    markAsRead,
    refetchNotifications,
  } as const;
}
