import * as React from 'react';
import { StyleSheet } from 'react-native';

import { View } from '../Themed';
import RatingItem from './RatingItem';

function RatingList({ data }: any) {
  return (
    <View style={styles.wrapper}>
      {data.map((item: any, index: number) => (
        <RatingItem key={item.id} {...item} position={index + 1} />
      ))}
    </View>
  );
}

export default RatingList;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
  },
});
