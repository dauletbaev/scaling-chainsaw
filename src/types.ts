/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import type { ParamListBase } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DrawerScreenProps as BaseDrawerScreenProps } from '@react-navigation/drawer';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends HomeStackParamList,
        HomeTabsParamList,
        DrawerParamList {}
  }
}

export interface HomeStackParamList extends ParamListBase {
  DrawerNavigator: undefined;
  Notifications: undefined;
}

export interface HomeTabsParamList extends ParamListBase {
  Game: undefined;
  Leaderboard: undefined;
}

export interface DrawerParamList extends ParamListBase {
  Home: undefined;
  Profile: { userId: string | undefined };
  Settings: undefined;
}

export type DrawerScreenProps<Screen extends keyof DrawerParamList> =
  BaseDrawerScreenProps<DrawerParamList, Screen>;

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, Screen>;

export type HomeTabsScreenProps<Screen extends keyof HomeTabsParamList> =
  BottomTabScreenProps<HomeTabsParamList, Screen>;
