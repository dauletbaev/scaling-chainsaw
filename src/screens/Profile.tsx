import * as React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image, StyleSheet, TextInput, Pressable } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import { Text, View } from '../components/Themed';
import { DrawerScreenProps } from '../types';
import useProfileImage from '../hooks/useProfileImage';
import { useUi } from '../store/uiContext';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

function ProfileScreen(props: DrawerScreenProps<'Profile'>) {
  const { userId } = props.route.params ?? { userId: undefined };
  const { avatarUrl, setAvatarUrl } = useUi();
  const { deleteImage, imageUploadingProgress, uploadImage } = useProfileImage();

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const [name, setName] = React.useState('Miyman');
  const [totalScore, setTotalScore] = React.useState(0);
  const [monthlyScore, setMonthlyScore] = React.useState(0);
  const [disabled] = React.useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (result.canceled || userId === undefined) {
      return;
    }

    const uri = result.assets[0].uri;
    // to show instantly the new image
    setAvatarUrl(uri);
    // not raises an error if the file does not exist
    await deleteImage(userId);

    const imageUrl = await uploadImage(userId, uri);
    if (imageUrl !== undefined) {
      // to show the new image after the upload is finished
      setAvatarUrl(imageUrl);
    }
  };

  // const handlePresentModalPress = React.useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  React.useEffect(() => {
    if (userId === undefined) {
      return;
    }

    void firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        const data = doc.data();

        if (doc.exists && data !== undefined) {
          setName(data.name);
          setTotalScore(data.total_score);
          setMonthlyScore(data.monthly_score);
        }
      })
      .catch(crashlytics().recordError);
  }, [userId]);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={styles.containerItem}>
          <Pressable
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}
          >
            <Image
              style={[
                styles.avatar,
                imageUploadingProgress > 0 && styles.avatarUploading,
              ]}
              source={{ uri: avatarUrl }}
            />
          </Pressable>
          {imageUploadingProgress > 0 && (
            <Text style={styles.info}>
              Juklenbekte kutin {imageUploadingProgress}%...
            </Text>
          )}
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.info}>Usi aydagi ball: {monthlyScore}</Text>
          <Text style={styles.info}>Uliwma ball: {totalScore}</Text>
        </View>

        <View style={styles.containerItem}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Name:</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <Pressable
            style={() => [styles.button, disabled && styles.buttonDisabled]}
            android_ripple={{ color: 'white' }}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>

        <BottomSheetModal ref={bottomSheetModalRef} snapPoints={['25%']}>
          <View style={styles.bottomSheet}>
            <Pressable
              style={styles.bottomSheetButton}
              onPress={() => {
                pickImage().catch(crashlytics().recordError);
              }}
            >
              <Ionicons
                style={styles.bottomSheetButtonIcon}
                name="images-outline"
                size={24}
                color="black"
              />
              <Text>Gallereya</Text>
            </Pressable>
            <Pressable
              style={styles.bottomSheetButton}
              onPress={() => {
                if (userId === undefined) return;
                deleteImage(userId).catch(crashlytics().recordError);
              }}
            >
              <Ionicons
                style={styles.bottomSheetButtonIcon}
                name="trash-outline"
                size={24}
                color="black"
              />
              <Text>Oshiriw</Text>
            </Pressable>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  containerItem: {
    alignItems: 'center',
    marginVertical: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarUploading: {
    opacity: 0.5,
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderColor: '#ccc',
    borderWidth: 1,
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

  bottomSheet: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  bottomSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  bottomSheetButtonIcon: {
    marginRight: 8,
  },
});
