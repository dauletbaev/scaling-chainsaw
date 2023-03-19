import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation, { navigationRef } from './src/navigation';
import { AuthProvider } from './src/store/authContext';
import { UiProvider } from './src/store/uiContext';
import { fetchNotifications } from './src/lib/fetchNotifications';
import { onCreateTriggerNotification } from './src/lib/notifications';

messaging().onNotificationOpenedApp(async remoteMessage => {
  const { data } = remoteMessage;
  if (data !== undefined && data.general === 'true') {
    await fetchNotifications();
    navigationRef.current?.navigate('Notifications');
  }
});

void onCreateTriggerNotification();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });

    return unsubscribe;
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UiProvider>
        <AuthProvider>
          <Navigation colorScheme={colorScheme} />
        </AuthProvider>
      </UiProvider>
      <StatusBar />
    </SafeAreaProvider>
  );
}
