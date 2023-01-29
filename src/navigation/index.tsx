import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ColorSchemeName, type StyleProp, View, ViewStyle } from 'react-native';

import { RootDrawerParamList, RootTabParamList, RootTabScreenProps } from '../types';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import SettingsScreen from '../screens/Settings';
import GameScreen from '../screens/Game';
import RatingScreen from '../screens/Rating';
import LinkingConfiguration from './LinkingConfiguration';
import TabBarIcon from './TabBarIcon';
import Layout from '../constants/Layout';
import DrawerTop from '../components/DrawerTop';
import ProfileScreen from '../screens/Profile';
import DrawerBottom from '../components/DrawerBottom';

const BottomTab = createBottomTabNavigator<RootTabParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

function BottomTabNavigator() {
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
        options={(_: RootTabScreenProps<'Game'>) => ({
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="game-controller-outline" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Rating"
        component={RatingScreen}
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

function RootNavigator() {
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
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          title: 'Bas bet',
          drawerIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          drawerIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Sazlamalar',
          drawerIcon: ({ color }) => <TabBarIcon name="settings-outline" color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

function Navigation(_: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      // theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

export default Navigation;
