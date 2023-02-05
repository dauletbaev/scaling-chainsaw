import { useCallback, useState } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default function useProfileImage() {
  const [imageUploadingProgress, setImageUploadingProgress] = useState(0);

  const deleteImage = useCallback(async (userId: string) => {
    const storageRef = storage().ref();
    const imageRef = storageRef.child(`profile/${userId}`);

    // this is not a real error, so we don't want to report it to crashlytics
    const result = await imageRef.getDownloadURL().catch(() => {});

    if (typeof result !== 'string') {
      return;
    }

    try {
      await imageRef.delete();
    } catch (error: any) {
      crashlytics().recordError(error);
    }
  }, []);

  const uploadImage = useCallback(
    async (userId: string, uri: string) => {
      const storageRef = storage().ref();

      await deleteImage(userId);

      const newImageRef = storageRef.child(`profile/${userId}`);
      const uploadTask = newImageRef.putFile(uri);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );

          setImageUploadingProgress(progress);
        },
        crashlytics().recordError,
      );

      try {
        await uploadTask;

        const downloadUrl = await newImageRef.getDownloadURL();
        setImageUploadingProgress(0);

        await firestore().collection('users').doc(userId).update({ avatar: downloadUrl });

        return downloadUrl;
      } catch (error: any) {
        crashlytics().recordError(error);
      }
    },
    [deleteImage],
  );

  return {
    deleteImage,
    uploadImage,
    imageUploadingProgress,
  };
}
