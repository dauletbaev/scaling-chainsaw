import * as React from 'react';
import { StyleSheet } from 'react-native';
import analytics from '@react-native-firebase/analytics';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { DrawerScreenProps } from '../types';

function SettingsScreen(_: DrawerScreenProps<'Settings'>) {
  React.useEffect(() => {
    void analytics().logScreenView({
      screen_name: 'Settings',
      screen_class: 'Settings',
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="~/screens/Settings.tsx" />
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
