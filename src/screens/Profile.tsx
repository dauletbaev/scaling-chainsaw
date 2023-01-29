import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { Image, StyleSheet, TextInput, Pressable } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import { Text, View } from '../components/Themed';
import { RootDrawerScreenProps } from '../types';

let avatarUrl =
  'https://api.dicebear.com/5.x/adventurer-neutral/png?scale=80&radius=50&size=256';

function ProfileScreen(props: RootDrawerScreenProps<'Profile'>) {
  const { userId } = props.route.params ?? { userId: undefined };

  const [imgUrl, setImgUrl] = React.useState('https://reactnative.dev/img/tiny_logo.png');
  const [name, setName] = React.useState('Miyman');
  const [totalScore, setTotalScore] = React.useState(0);
  const [monthlyScore, setMonthlyScore] = React.useState(0);
  const [disabled] = React.useState(false);

  React.useEffect(() => {
    const getSeed = async () => {
      const seed = await AsyncStorage.getItem('seed');

      if (seed !== null) {
        avatarUrl += '&seed=' + seed;
        setImgUrl(avatarUrl);
      } else {
        throw new Error('Seed is null which should not happen.');
      }
    };

    getSeed()
      .then(() => {
        if (userId !== undefined) {
          void firestore()
            .collection('users')
            .doc(userId)
            .get({ source: 'server' })
            .then(doc => {
              const data = doc.data();

              if (doc.exists && data !== undefined) {
                setName(data.name);
                setTotalScore(data.total_score);
                setMonthlyScore(data.monthly_score);

                if (data.avatar === '') {
                  void firestore()
                    .collection('users')
                    .doc(userId)
                    .update({ avatar: avatarUrl })
                    .catch(crashlytics().recordError);
                }
              }
            })
            .catch(crashlytics().recordError);
        }
      })
      .catch(crashlytics().recordError);
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.containerItem}>
        <Image style={styles.avatar} source={{ uri: imgUrl }} />
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.info}>Usi aydagi ball: {monthlyScore}</Text>
        <Text style={styles.info}>Uliwma ball: {totalScore}</Text>
      </View>

      <View style={styles.containerItem}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Total Score:</Text>
          <TextInput style={styles.input} value={totalScore.toString()} />
        </View>

        <Pressable
          style={() => [styles.button, disabled && styles.buttonDisabled]}
          android_ripple={{ color: 'white' }}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  containerItem: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  formControl: {
    width: '80%',
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  button: {
    marginTop: 20,
    width: '50%',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: 'grey',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});
