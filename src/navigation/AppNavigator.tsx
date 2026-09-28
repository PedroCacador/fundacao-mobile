import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LoginView from '../views/auth/LoginView';
import RegisterView from '../views/auth/RegisterView';
import HomeView from '../views/home/HomeView';
import ProfileView from '../views/profile/ProfileView';
import EditProfileView from '../views/profile/EditProfileView';
import EmployeeDataView from '../views/profile/EmployeeDataView';
import AccountInfoView from '../views/profile/AccountInfoView';
import SettingsView from '../views/profile/SettingsView';
import QrCodeView from '../views/qrcode/QrCodeView';
import WalletView from '../views/wallet/WalletView';
import NotificationsView from '../views/notifications/NotificationsView';
import HistoryView from '../views/history/HistoryView';
import LocationsView from '../views/locations/LocationsView';

const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const darkHeaderOptions = {
  headerStyle: { backgroundColor: '#1B2A4A' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '600' as const },
};

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={darkHeaderOptions}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileView} options={{ title: 'Perfil' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileView} options={{ title: 'Editar Perfil' }} />
      <ProfileStack.Screen name="EmployeeData" component={EmployeeDataView} options={{ title: 'Dados do Colaborador' }} />
      <ProfileStack.Screen name="AccountInfo" component={AccountInfoView} options={{ title: 'Informações da Conta' }} />
      <ProfileStack.Screen name="Settings" component={SettingsView} options={{ title: 'Configurações' }} />
    </ProfileStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1B2A4A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        tabBarActiveTintColor: '#1B2A4A',
        tabBarInactiveTintColor: '#8E99A4',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeView}
        options={{
          title: 'Início',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletView}
        options={{
          title: 'Carteira',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="wallet" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="QrCode"
        component={QrCodeView}
        options={{
          title: 'QR Code',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryView}
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginView} />
      <Stack.Screen name="Register" component={RegisterView} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsView}
        options={{
          headerShown: true,
          ...darkHeaderOptions,
          title: 'Notificações',
        }}
      />
      <Stack.Screen
        name="Locations"
        component={LocationsView}
        options={{
          headerShown: true,
          ...darkHeaderOptions,
          title: 'Locais de Utilização',
        }}
      />
    </Stack.Navigator>
  );
}
