import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  type DrawerContentComponentProps,
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { ColorSchemeName, type StyleProp, View, ViewStyle } from 'react-native';

import type { DrawerParamList, HomeStackParamList, HomeTabsParamList } from '../types';

import useColorScheme from '../hooks/useColorScheme';
import { useAuth } from '../store/authContext';
import Colors from '../constants/Colors';
import LinkingConfiguration from './LinkingConfiguration';
import TabBarIcon from './TabBarIcon';
import Layout from '../constants/Layout';
import DrawerTop from '../components/DrawerTop';
import DrawerBottom from '../components/DrawerBottom';
import IconButton from '../components/UI/IconButton';

// Screens
import AboutScreen from '../screens/About';
import GameScreen from '../screens/Game';
import LeaderboardScreen from '../screens/Leaderboard';
import NotificationsScreen from '../screens/Notifications';
import NotificationScreen from '../screens/Notification';
import ProfileScreen from '../screens/Profile';
import { useUi } from '../store/uiContext';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const BottomTab = createBottomTabNavigator<HomeTabsParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function HomeTabs() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Game"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Game"
        component={GameScreen}
        options={() => ({
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="game-controller-outline" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="medal-outline" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-between',
      }}
    >
      <View>
        <DrawerTop />
        <DrawerItemList {...props} />
      </View>
      <DrawerBottom />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const { isLoggedIn, user } = useAuth();
  const { unreadNotificationCount } = useUi();
  const colorScheme = useColorScheme();

  const drawerStyle: StyleProp<ViewStyle> = {
    backgroundColor: Colors[colorScheme].background,
  };

  if (Layout.isSmallDevice) {
    drawerStyle.width = '100%';
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: Layout.isLargeDevice ? 'permanent' : 'front',
        drawerStyle,
        drawerActiveTintColor: Colors[colorScheme].tint,
        drawerInactiveTintColor: Colors[colorScheme].text,
      }}
      drawerContent={CustomDrawerContent}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeTabs}
        options={({ navigation }) => ({
          title: 'Bas bet',
          drawerIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
          headerRight: () => (
            <IconButton
              name="notifications-outline"
              onPress={() => navigation.navigate('Notifications')}
              color="#000"
              size={24}
              badgeText={
                unreadNotificationCount > 0 ? unreadNotificationCount : undefined
              }
            />
          ),
        })}
      />
      {isLoggedIn && user !== null && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profil',
            drawerIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
          }}
          initialParams={{ userId: user.id }}
        />
      )}
      {/* <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Sazlamalar',
          drawerIcon: ({ color }) => <TabBarIcon name="settings-outline" color={color} />,
        }}
      /> */}
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Haqqinda',
          drawerIcon: ({ color }) => (
            <TabBarIcon name="information-circle-outline" color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ title: 'Bildirgi' }}
      />
    </Stack.Navigator>
  );
}

function Navigation(_: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      // theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <HomeStack />
    </NavigationContainer>
  );
}

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export default Navigation;
