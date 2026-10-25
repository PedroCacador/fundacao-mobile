import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const abas: Record<keyof TabParamList, { icone: NomeIcone; titulo: string }> = {
  Home: { icone: 'house', titulo: 'Início' },
  Wallet: { icone: 'wallet', titulo: 'Carteira' },
  History: { icone: 'history', titulo: 'Histórico' },
  Profile: { icone: 'user', titulo: 'Perfil' },
};

function RotuloAba({ titulo, ativo }: { titulo: string; ativo: boolean }) {
  return (
    <View style={styles.rotulo}>
      <Text style={[styles.rotuloTexto, ativo && styles.rotuloAtivo]}>{titulo}</Text>
      <View style={[styles.indicador, ativo && styles.indicadorAtivo]} />
    </View>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        title: abas[route.name].titulo,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
          height: 70 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom + 6,
        },
        tabBarIcon: ({ color, focused }) => (
          <Icone
            nome={abas[route.name].icone}
            tamanho={24}
            cor={color}
            espessura={focused ? 2 : 1.6}
          />
        ),
        tabBarLabel: ({ focused }) => (
          <RotuloAba titulo={abas[route.name].titulo} ativo={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeView} />
      <Tab.Screen name="Wallet" component={WalletView} />
      <Tab.Screen name="History" component={HistoryView} />
      <Tab.Screen name="Profile" component={ProfileView} />
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
          <Stack.Screen name="BenefitDetails" component={BenefitDetailsView} />
          <Stack.Screen name="Notifications" component={NotificationsView} />
          <Stack.Screen name="Locations" component={LocationsView} />
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
  rotulo: {
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rotuloTexto: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  rotuloAtivo: {
    fontFamily: familia.semi,
    color: cores.primaria,
  },
  indicador: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicadorAtivo: {
    backgroundColor: cores.primaria,
  },
});
