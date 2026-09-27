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
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

export default function HomeView({ navigation }: any) {
  const { user, benefitSummary } = useHomeViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => navigation.getParent()?.navigate('Notifications')}
            style={styles.bellButton}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color="#1B2A4A" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <MaterialCommunityIcons name="account" size={40} color="#8E99A4" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={26} color="#8E99A4" />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo dos seus benefícios</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconCircle}>
                <MaterialCommunityIcons name="gift-outline" size={22} color="#3A5A8C" />
              </View>
              <Text style={styles.summaryValue}>{benefitSummary.totalBeneficios}</Text>
              <Text style={styles.summaryLabel}>Benefícios{'\n'}disponíveis</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconCircle}>
                <MaterialCommunityIcons name="ticket-outline" size={22} color="#3A5A8C" />
              </View>
              <Text style={styles.summaryValue}>{benefitSummary.utilizacoesRestantes}</Text>
              <Text style={styles.summaryLabel}>Utilizações{'\n'}restantes</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconCircle}>
                <MaterialCommunityIcons name="calendar-outline" size={22} color="#3A5A8C" />
              </View>
              <Text style={styles.summaryValue}>{benefitSummary.proximaRenovacao}</Text>
              <Text style={styles.summaryLabel}>Próxima{'\n'}renovação</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsRow}
        >
          <View style={[styles.actionCard, styles.actionCardActive]}>
            <View style={styles.actionCardTop}>
              <MaterialCommunityIcons name="wallet-outline" size={28} color="#FFFFFF" />
              <MaterialCommunityIcons name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.actionTitleActive}>Minha Carteira</Text>
            <Text style={styles.actionSubtitleActive}>Veja seus benefícios</Text>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionCardTop}>
              <MaterialCommunityIcons name="qrcode-scan" size={28} color="#1B2A4A" />
              <MaterialCommunityIcons name="chevron-right" size={18} color="#C0C8D1" />
            </View>
            <Text style={styles.actionTitle}>QR Code</Text>
            <Text style={styles.actionSubtitle}>Apresente no{'\n'}conveniado</Text>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionCardTop}>
              <MaterialCommunityIcons name="history" size={28} color="#1B2A4A" />
              <MaterialCommunityIcons name="chevron-right" size={18} color="#C0C8D1" />
            </View>
            <Text style={styles.actionTitle}>Histórico</Text>
            <Text style={styles.actionSubtitle}>Suas utilizações</Text>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionCardTop}>
              <MaterialCommunityIcons name="map-marker" size={28} color="#1B2A4A" />
              <MaterialCommunityIcons name="chevron-right" size={18} color="#C0C8D1" />
            </View>
            <Text style={styles.actionTitle}>Locais de utilização</Text>
            <Text style={styles.actionSubtitle}>Encontre estabelecimentos perto de você</Text>
          </View>
        </ScrollView>

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
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 8,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
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
  },
  userRole: {
    fontSize: 13,
    color: '#6B7B8D',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#8E99A4',
    textAlign: 'center',
    lineHeight: 15,
  },
  actionsRow: {
    paddingHorizontal: 20,
    gap: 12,
    flexDirection: 'row',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardActive: {
    backgroundColor: '#1B2A4A',
  },
  actionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B2A4A',
    marginBottom: 4,
  },
  actionTitleActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#8E99A4',
    lineHeight: 16,
  },
  actionSubtitleActive: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
  },
});
