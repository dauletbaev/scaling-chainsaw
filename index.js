import { registerRootComponent } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';

import App from './App';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const data = typeof remoteMessage.data === 'object' ? remoteMessage.data : {};

  if (data.general !== 'true') {
    return;
  }

  try {
    const notificationCount = await AsyncStorage.getItem('notificationCount');
    let count = 1;
    if (notificationCount !== null) {
      count += parseInt(notificationCount);
    }
    await AsyncStorage.setItem('notificationCount', count.toString());
  } catch (e) {
    crashlytics().recordError(e);
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
