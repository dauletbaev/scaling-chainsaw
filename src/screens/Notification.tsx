import * as React from 'react';
import { ScrollView, StyleSheet, Image, Text } from 'react-native';
import analytics from '@react-native-firebase/analytics';

import { HomeStackScreenProps } from '../types';
import { View } from '../components/Themed';
import useNotifications from '../hooks/useNotifications';

function NotificationScreen(props: HomeStackScreenProps<'Notification'>) {
  const params = props.route.params;
  const { id, isUnread } = params;
  const { body, markAsRead } = useNotifications();
  const notificationBody = body[params.id];

  React.useEffect(() => {
    void analytics().logScreenView({
      screen_name: 'Notification',
      screen_class: 'Notification',
    });
  }, []);

  React.useEffect(() => {
    if (isUnread === true) {
      console.log('Marking as read');
      markAsRead(id);
    }
  }, [id, isUnread, markAsRead]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{params.title}</Text>

      <Image
        source={{ uri: params.thumbnail }}
        style={{ width: '100%', height: 200 }}
        resizeMode="cover"
      />

      <View style={styles.separator} />

      <View style={styles.body}>
        <Text>{notificationBody}</Text>

        <Text style={styles.date}>{params.date}</Text>
      </View>
    </ScrollView>
  );
}

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  separator: {
    marginTop: 15,
    marginHorizontal: '5%',
    width: '90%',
    height: 1,
    backgroundColor: '#eee',
  },
  body: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  date: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 15,
  },
});
