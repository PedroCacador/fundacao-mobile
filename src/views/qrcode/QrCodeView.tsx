import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQrCodeViewModel } from '../../viewmodels/useQrCodeViewModel';


export default function QrCodeView({ navigation }: any) {
  const { user, qrCodeData, timeLeft } = useQrCodeViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="#0D2A6B" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>QR Code</Text>

          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#0D2A6B" />
            <View>
              <Text style={styles.logoTextBold}>FCV</Text>
              <Text style={styles.logoTextSub}>Fundação{"\n"}Cristiano Varella</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.profileHeader} 
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('Profile')}
        >
          <View style={styles.avatarPlaceholder}></View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name || 'Ana Carolina Silva'}</Text>
            <Text style={styles.userRole}>{user?.role || 'Colaboradora da FCV'}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#8E99A4" />
        </TouchableOpacity>

        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#0D2A6B" />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Seu QR Code</Text>
              <Text style={styles.cardSubtitle}>
                Apresente este código no estabelecimento ou utilize para validar seu benefício.
              </Text>
            </View>
          </View>

          <View style={styles.qrCodeWrapper}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <MaterialCommunityIcons name="qrcode" size={180} color="#000000" />
          </View>

          <View style={styles.timerBadge}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#0D2A6B" />
            <Text style={styles.timerText}>Expira em 01:00</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <View style={styles.infoIconCircle}>
                <MaterialCommunityIcons name="account-outline" size={18} color="#0D2A6B" />
              </View>
              <Text style={styles.infoTitle}>Identificação</Text>
              <Text style={styles.infoDesc}>
                Use o QR Code para se identificar no estabelecimento.
              </Text>
            </View>

            <View style={styles.columnDivider} />

            <View style={styles.infoColumn}>
              <View style={styles.infoIconCircle}>
                <MaterialCommunityIcons name="shield-check-outline" size={18} color="#0D2A6B" />
              </View>
              <Text style={styles.infoTitle}>Validação de benefício</Text>
              <Text style={styles.infoDesc}>
                O QR Code também pode ser usado para validar a utilização do seu benefício.
              </Text>
            </View>

            <View style={styles.columnDivider} />

            <View style={styles.infoColumn}>
              <View style={styles.infoIconCircle}>
                <MaterialCommunityIcons name="information-outline" size={18} color="#0D2A6B" />
              </View>
              <Text style={styles.infoTitle}>Dica</Text>
              <Text style={styles.infoDesc}>
                Mantenha a tela do seu celular visível e com boa iluminação.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.reloadButton} 
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={20} color="#FFFFFF" />
          <Text style={styles.reloadButtonText}>Recarregar QR Code</Text>
          <MaterialCommunityIcons name="refresh" size={18} color="#FFFFFF" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D2A6B',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoTextBold: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0D2A6B',
    lineHeight: 14,
  },
  logoTextSub: {
    fontSize: 8,
    color: '#0D2A6B',
    lineHeight: 9,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: '#6B7B8D',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D2A6B',
  },
  userRole: {
    fontSize: 12,
    color: '#8E99A4',
    marginTop: 1,
  },
  mainCard: {
    backgroundColor: '#EDF3FC',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#DDE8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D2A6B',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7B8D',
    lineHeight: 16,
  },
  qrCodeWrapper: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: '#0D2A6B',
  },
  topLeft: {
    top: -4,
    left: -4,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: -4,
    right: -4,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: -4,
    left: -4,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: -4,
    right: -4,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#DDE8F8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D2A6B',
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: '#E4EDFB',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  infoColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  columnDivider: {
    width: 1,
    backgroundColor: '#CBDDF6',
    height: '100%',
  },
  infoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D2E2FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D2A6B',
    textAlign: 'center',
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 9,
    color: '#6B7B8D',
    textAlign: 'center',
    lineHeight: 12,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D2A6B',
    borderRadius: 14,
    paddingHorizontal: 20,
    height: 52,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});