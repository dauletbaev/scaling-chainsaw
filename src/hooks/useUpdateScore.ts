import * as React from 'react';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../store/authContext';

export default function useUpdateScore() {
  const { user } = useAuth();
  const userId = user?.id;

  const updateScore = React.useCallback(
    (score: number) => {
      if (userId === undefined) {
        return;
      }

      const user = firestore().collection('users').doc(userId);

      void user.update({
        monthly_score: firestore.FieldValue.increment(score),
        total_score: firestore.FieldValue.increment(score),
      });
    },
    [userId],
  );

  return updateScore;
}
