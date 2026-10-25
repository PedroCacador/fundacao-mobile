import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Loading } from '../components/common/StateMessage';
import { Icone, NomeIcone } from '../components/common/Icon';
import { useAuth } from '../context/AuthContext';
import { cores, familia, fonte } from '../theme';
import { RootStackParamList, TabParamList } from './types';

import LoginView from '../views/auth/LoginView';
import HomeView from '../views/home/HomeView';
import WalletView from '../views/wallet/WalletView';
import HistoryView from '../views/history/HistoryView';
import ProfileView from '../views/profile/ProfileView';
import BenefitDetailsView from '../views/benefit/BenefitDetailsView';
import NotificationsView from '../views/notifications/NotificationsView';
import LocationsView from '../views/locations/LocationsView';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const cabecalhoClaro: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: cores.fundo },
  headerTintColor: cores.texto,
  headerTitleStyle: { fontFamily: familia.negrito, fontSize: fonte.xxl },
  headerShadowVisible: false,
  headerBackTitle: 'Voltar',
};

const iconesAba: Record<keyof TabParamList, NomeIcone> = {
  Home: 'house',
  Wallet: 'wallet',
  History: 'history',
  Profile: 'user',
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoFraco,
        tabBarStyle: { backgroundColor: cores.superficie, borderTopColor: cores.borda },
        tabBarLabelStyle: { fontSize: fonte.xs, fontFamily: familia.semi },
        tabBarIcon: ({ color, size }) => (
          <Icone nome={iconesAba[route.name]} tamanho={size} cor={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeView} options={{ title: 'Início' }} />
      <Tab.Screen name="Wallet" component={WalletView} options={{ title: 'Carteira' }} />
      <Tab.Screen name="History" component={HistoryView} options={{ title: 'Histórico' }} />
      <Tab.Screen name="Profile" component={ProfileView} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario, restaurando } = useAuth();

  if (restaurando) {
    return (
      <View style={styles.carregando}>
        <Loading texto="Abrindo..." />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="BenefitDetails"
            component={BenefitDetailsView}
            options={{ ...cabecalhoClaro, title: 'Detalhes do Benefício' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsView}
            options={{ ...cabecalhoClaro, title: 'Notificações' }}
          />
          <Stack.Screen
            name="Locations"
            component={LocationsView}
            options={{ ...cabecalhoClaro, title: 'Locais de Utilização' }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginView} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
});
