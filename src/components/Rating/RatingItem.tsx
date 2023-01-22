import * as React from 'react';
import { Image, Pressable, StyleSheet, View as NativeView } from 'react-native';

import { Text, View } from '../Themed';

function RatingItem({ points, imageUri, name }: any) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        android_ripple={{ color: '#ccc', borderless: false }}
        style={styles.pressable}
      >
        <NativeView style={styles.user}>
          <Image source={{ uri: imageUri }} style={styles.avatar} />
          <Text>{name}</Text>
        </NativeView>
        <Text style={styles.points}>{points}</Text>
      </Pressable>
    </View>
  );
}

export default RatingItem;

const styles = StyleSheet.create({
  wrapper: {
    width: '99%',
    borderRadius: 15,
    overflow: 'hidden',
    margin: 5,
    elevation: 2,
    backgroundColor: '#fff',
  },
  pressable: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  points: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
