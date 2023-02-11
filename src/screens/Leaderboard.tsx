import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import RatingList from '../components/Rating/RatingList';
import { Text } from '../components/Themed';
import type { HomeTabsScreenProps } from '../types';
import { useFocusEffect } from '@react-navigation/native';

interface LeaderBoardUser {
  id: string;
  imageUri: string;
  name: string;
  points: number;
}

function LeaderboardScreen(_: HomeTabsScreenProps<'Leaderboard'>) {
  const [users, setUsers] = React.useState<LeaderBoardUser[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = firestore()
        .collection('users')
        .orderBy('total_score', 'desc')
        .limit(10)
        .onSnapshot(querySnapshot => {
          const users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              imageUri: data.avatar,
              name: data.name,
              points: data.total_score,
            };
          }, crashlytics().recordError);

          setUsers(users);
        });

      return unsubscribe;
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Oyinshilar reytingi</Text>
      <RatingList data={users} />
    </ScrollView>
  );
}

export default LeaderboardScreen;

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
