import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icone, NomeIcone } from '../components/common/Icon';
import { cores, familia, fonte } from '../theme';
import { PartnerTabParamList } from './types';

import PartnerScannerView from '../views/partner/PartnerScannerView';
import PartnerPendingView from '../views/partner/PartnerPendingView';
import PartnerHistoryView from '../views/partner/PartnerHistoryView';
import ProfileView from '../views/profile/ProfileView';

const Tab = createBottomTabNavigator<PartnerTabParamList>();

const abasParceiro: Record<keyof PartnerTabParamList, { icone: NomeIcone; titulo: string }> = {
  PartnerScanner: { icone: 'qr-code', titulo: 'Validar' },
  PartnerPending: { icone: 'clock', titulo: 'Pendentes' },
  PartnerHistory: { icone: 'history', titulo: 'Histórico' },
  PartnerProfile: { icone: 'store', titulo: 'Perfil' },
};

function RotuloAba({ titulo, ativo }: { titulo: string; ativo: boolean }) {
  return (
    <View style={styles.rotulo}>
      <Text style={[styles.rotuloTexto, ativo && styles.rotuloAtivo]}>{titulo}</Text>
      <View style={[styles.indicador, ativo && styles.indicadorAtivo]} />
    </View>
  );
}

export default function PartnerTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        title: abasParceiro[route.name].titulo,
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
            nome={abasParceiro[route.name].icone}
            tamanho={24}
            cor={color}
            espessura={focused ? 2 : 1.6}
          />
        ),
        tabBarLabel: ({ focused }) => (
          <RotuloAba titulo={abasParceiro[route.name].titulo} ativo={focused} />
        ),
      })}
    >
      <Tab.Screen name="PartnerScanner" component={PartnerScannerView} />
      <Tab.Screen name="PartnerPending" component={PartnerPendingView} />
      <Tab.Screen name="PartnerHistory" component={PartnerHistoryView} />
      <Tab.Screen name="PartnerProfile" component={ProfileView} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
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
