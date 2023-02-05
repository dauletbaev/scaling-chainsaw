import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import crashlytics from '@react-native-firebase/crashlytics';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (error: any) {
        crashlytics().recordError(error);
      } finally {
        setLoadingComplete(true);
        await SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync().catch(crashlytics().recordError);
  }, []);

  return isLoadingComplete;
}
