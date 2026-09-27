import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

export default function ProfileView({ navigation }: any) {
  const { user } = useProfileViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <TouchableOpacity
          style={styles.profileHeader}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}
        >
          <View style={styles.avatarPlaceholder}>
            <MaterialCommunityIcons name="account" size={48} color="#8E99A4" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <View style={styles.badgeRow}>
              <MaterialCommunityIcons name="account-outline" size={16} color="#3A5A8C" />
              <Text style={styles.badgeText}>Matrícula: {user.matricula}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={26} color="#8E99A4" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EmployeeData')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardIconCircle}>
              <MaterialCommunityIcons name="account-circle-outline" size={24} color="#1B2A4A" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Dados do colaborador</Text>
              <Text style={styles.cardSubtitle}>Seus dados pessoais e profissionais.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8E99A4" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AccountInfo')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardIconCircle}>
              <MaterialCommunityIcons name="shield-account-outline" size={24} color="#1B2A4A" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Informações da conta</Text>
              <Text style={styles.cardSubtitle}>Gerencie seus dados de acesso e segurança.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8E99A4" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardIconCircle}>
              <MaterialCommunityIcons name="cog-outline" size={24} color="#1B2A4A" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Configurações</Text>
              <Text style={styles.cardSubtitle}>Personalize sua experiência no app.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8E99A4" />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7B8D',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 13,
    color: '#6B7B8D',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EDF2',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#3A5A8C',
    fontWeight: '600',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7B8D',
  },
});
