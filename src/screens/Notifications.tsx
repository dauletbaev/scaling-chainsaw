import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import analytics from '@react-native-firebase/analytics';

import { HomeStackScreenProps } from '../types';
import { Text } from '../components/Themed';
import NotificationCard from '../components/Notification/Card';
import useNotifications from '../hooks/useNotifications';

function NotificationsScreen(props: HomeStackScreenProps<'Notifications'>) {
  const { notifications } = useNotifications();
  const noNotifications = notifications.length === 0;

  React.useEffect(() => {
    void analytics().logScreenView({
      screen_name: 'Notifications',
      screen_class: 'Notifications',
    });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[noNotifications && styles.center]}
    >
      {noNotifications && <Text style={styles.emptyText}>No notifications yet</Text>}
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          title={notification.title}
          date={notification.date}
          onPress={() => {
            props.navigation.navigate('Notification', {
              id: notification.id,
              title: notification.title,
              thumbnail: notification.thumbnail,
              date: notification.date,
              isUnread: !notification.isRead,
            });
          }}
          isUnread={!notification.isRead}
        />
      ))}
    </ScrollView>
  );
}

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 15,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
