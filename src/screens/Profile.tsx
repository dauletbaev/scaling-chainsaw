import * as React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

import type { DrawerScreenProps } from '../types';
import { Text, View } from '../components/Themed';
import useProfileImage from '../hooks/useProfileImage';
import { useUi } from '../store/uiContext';
import { PROFILE_PLACEHOLDER } from '../constants/Layout';
import { useAuth } from '../store/authContext';
import Button from '../components/UI/Button';

function ProfileScreen(props: DrawerScreenProps<'Profile'>) {
  const { userId } = props.route.params ?? { userId: undefined };
  const { avatarUrl, setAvatarUrl } = useUi();
  const { user, invalidateUser } = useAuth();
  const { deleteImage, imageUploadingProgress, uploadImage } = useProfileImage();

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [saving, setSaving] = React.useState(false);
  const [name, setName] = React.useState('Miyman');
  const [totalScore, setTotalScore] = React.useState(0);
  const [monthlyScore, setMonthlyScore] = React.useState(0);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    void analytics().logScreenView({
      screen_name: 'Profile',
      screen_class: 'Profile',
    });
  }, []);

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
    bottomSheetRef.current?.close();
    // not raises an error if the file does not exist
    await deleteImage(userId);

    const imageUrl = await uploadImage(userId, uri);
    if (imageUrl !== undefined) {
      // to show the new image after the upload is finished
      setAvatarUrl(imageUrl);
    }
  };

  const deleteAvatar = () => {
    if (userId === undefined) return;
    setSaving(true);
    void deleteImage(userId)
      .then(() => {
        setAvatarUrl(PROFILE_PLACEHOLDER);
      })
      .catch(crashlytics().recordError)
      .finally(() => {
        setSaving(false);
        bottomSheetRef.current?.close();
      });
  };

  const saveChanges = () => {
    if (userId === undefined || disabled || saving) return;
    setSaving(true);
    void firestore()
      .collection('users')
      .doc(userId)
      .update({ name })
      .then(() => {
        invalidateUser({ name });
        Alert.alert('Success', 'Profile updated successfully');
      })
      .catch(crashlytics().recordError)
      .finally(() => {
        setSaving(false);
      });
  };

  React.useEffect(() => {
    if (userId === undefined) return;
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

  React.useEffect(() => {
    if (user === null) return;
    setDisabled(user.name === name);
  }, [user, name]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        bottomSheetRef.current?.close();
        if (user === null) return;
        setName(user.name ?? '');
      };
    }, [user]),
  );

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerItem}>
        <Pressable
          onPress={() => {
            bottomSheetRef.current?.expand();
          }}
        >
          <Image
            style={[styles.avatar, imageUploadingProgress > 0 && styles.avatarUploading]}
            source={{ uri: avatarUrl }}
          />
        </Pressable>
        <Text style={styles.title}>{user?.name}</Text>
        <Text style={styles.info}>Usi aydagi ball: {monthlyScore}</Text>
        <Text style={styles.info}>Uliwma ball: {totalScore}</Text>
      </View>

      <View style={styles.containerItem}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <Button
          onPress={saveChanges}
          disabled={disabled}
          title="Save"
          mode="outlined"
          loading={saving}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        style={styles.bottomSheet}
        index={-1}
        snapPoints={['25%']}
        backdropComponent={renderBackdrop}
      >
        <View>
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
          {avatarUrl !== PROFILE_PLACEHOLDER && (
            <Pressable
              style={styles.bottomSheetButton}
              onPress={() => {
                Alert.alert('Oshiriw', 'Oshiriw?', [
                  {
                    text: 'Yaq',
                    style: 'cancel',
                  },
                  {
                    text: 'Oshiriw',
                    onPress: deleteAvatar,
                  },
                ]);
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
          )}
        </View>
      </BottomSheet>
    </View>
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

  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
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
