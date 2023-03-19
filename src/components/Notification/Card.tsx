import * as React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { Text, View } from '../Themed';

interface Props {
  title: string;
  date: string;
  onPress?: () => void;
  isUnread?: boolean;
}

function NotificationCard(props: Props) {
  const { title, date, onPress, isUnread } = props;
  return (
    <View style={[styles.wrapper, isUnread === true && styles.unread]}>
      <Pressable
        android_ripple={{ color: '#eee', borderless: false }}
        onPress={onPress}
        style={styles.container}
      >
        <Text style={[styles.title, isUnread === true && styles.titleUnread]}>
          {title}
        </Text>

        <Text style={styles.date}>{date}</Text>
      </Pressable>
    </View>
  );
}

export default NotificationCard;

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
    flex: 1,
  },
  unread: {
    backgroundColor: '#F9F9F9',
  },
  container: {
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: '#fff',
    color: '#444',
  },
  titleUnread: {
    // color: '#333',
    color: '#000',
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
  },
});
