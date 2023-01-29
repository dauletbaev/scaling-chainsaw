/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
  ParamListBase,
} from '@react-navigation/native';
import type { DrawerScreenProps } from '@react-navigation/drawer';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootDrawerParamList {}
  }
}

export interface RootDrawerParamList extends ParamListBase {
  Home: NavigatorScreenParams<RootTabParamList> | undefined;
  Profile: {
    userId: string | undefined;
  };
  Settings: undefined;
}

export type RootDrawerScreenProps<Screen extends keyof RootDrawerParamList> =
  DrawerScreenProps<RootDrawerParamList, Screen>;

export interface RootTabParamList extends ParamListBase {
  Game: undefined;
  Rating: undefined;
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    // @ts-expect-error: this is a bug in react-navigation
    BottomTabScreenProps<RootTabParamList, Screen>,
    DrawerScreenProps<RootDrawerParamList>
  >;
