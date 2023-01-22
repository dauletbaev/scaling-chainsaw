import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import RatingList from '../components/Rating/RatingList';
import { Text } from '../components/Themed';
import { RootTabScreenProps } from '../types';

const DUMMY_RATINGDATA = [
  {
    id: 0,
    points: 100,
    imageUri:
      'https://api.dicebear.com/5.x/adventurer-neutral/png?scale=80&radius=50&size=256&eyebrows=variant01,variant02,variant03&eyes=variant01,variant02,variant03',
    name: 'Username',
  },
  // generate more dummy with a loop use other image service
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: i + 2,
    points: (100 - i * 10) * Math.floor(Math.random() * 1000 + 1 + i * 100 + 1),
    imageUri:
      'https://api.dicebear.com/5.x/adventurer-neutral/png?scale=80&radius=50&size=256&eyebrows=variant01,variant02,variant03&eyes=variant01,variant02,variant03',
    name: `Username ${i + 1}`,
  })),
].sort((a, b) => b.points - a.points);

function RatingScreen(props: RootTabScreenProps<'Rating'>) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Oyinshilar reytingi</Text>
      <RatingList data={DUMMY_RATINGDATA} />
    </ScrollView>
  );
}

export default RatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});
