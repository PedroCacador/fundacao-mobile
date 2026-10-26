import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AbaDetalhe } from '../models/Catalog';

export type TabParamList = {
  Home: undefined;
  Wallet: undefined;
  History: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Main: NavigatorScreenParams<TabParamList> | undefined;
  BenefitDetails: { beneficioId: number; aba?: AbaDetalhe };
  Notifications: undefined;
  Locations: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
