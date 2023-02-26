import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

import { formatDate } from '../lib/date';
import type { Notification, NotificationBody } from '../store/uiContext';

export async function fetchNotifications() {
  const querySnapshot = await firestore().collection('notifications').get();
  const notifications: Notification[] = [];
  const notificationBody: NotificationBody = {};

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];
    const data = doc.data();
    const notification: Notification = {
      id: doc.id,
      title: data.title,
      thumbnail: data.thumbnail,
      date: formatDate(data.created_at.toDate()),
      isRead: false,
    };
    notifications.push(notification);
    notificationBody[notification.id] = data.body;
  }

  // set notifications to cache
  await AsyncStorage.setItem('cachedNotifications', JSON.stringify(notifications));
  await AsyncStorage.setItem('cachedNotificationBody', JSON.stringify(notificationBody));

  return [notifications, notificationBody] as const;
}
