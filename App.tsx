import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation, { navigationRef } from './src/navigation';
import { AuthProvider } from './src/store/authContext';
import { UiProvider } from './src/store/uiContext';
import { fetchNotifications } from './src/lib/fetchNotifications';

messaging().onNotificationOpenedApp(async remoteMessage => {
  const { data } = remoteMessage;
  if (data !== undefined && data.general === 'true') {
    await fetchNotifications();
    navigationRef.current?.navigate('Notifications');
  }
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

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
