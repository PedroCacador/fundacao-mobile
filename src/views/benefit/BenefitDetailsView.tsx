import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ItemBeneficioCarteira } from '../../components/benefit/BenefitCard';

type AbaDetalhe = 'ONDE_USAR' | 'REGRAS' | 'QUANTIDADE' | 'ESTABELECIMENTOS';

export default function BenefitDetailsView({ route, navigation }: any) {
  const beneficio: ItemBeneficioCarteira = route.params?.beneficio ?? {
    id: 1,
    nome: 'Alimentação',
    descricao: 'Restaurantes e estabelecimentos conveniados.',
    categoria: 'Alimentação',
    status: 'DISPONIVEL',
    utilizacoesFeitas: 5,
    utilizacoesMaximas: 8,
    dataRenovacao: '12/11/2025',
    icone: 'silverware-fork-knife',
    corIcone: '#EF4444',
    fundoIcone: '#FEE2E2',
  };

  const [abaAtiva, setAbaAtiva] = useState<AbaDetalhe>('ONDE_USAR');

  const estabelecimentos = [
    {
      id: 1,
      nome: 'Restaurante Sabor & Cia',
      endereco: 'Av. Brasil, 123 - Centro',
      tipo: 'Restaurante',
      icone: 'silverware-fork-knife',
    },
    {
      id: 2,
      nome: 'Padaria do Povo',
      endereco: 'Rua das Flores, 45 - Centro',
      tipo: 'Padaria',
      icone: 'bread-slice-outline',
    },
    {
      id: 3,
      nome: 'Café e Sabor',
      endereco: 'Av. Paulista, 890 - Bela Vista',
      tipo: 'Cafeteria',
      icone: 'coffee-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Banner do Benefício com Badge de Status */}
        <View style={styles.bannerCard}>
          <View style={[styles.iconeGrande, { backgroundColor: beneficio.fundoIcone }]}>
            <MaterialCommunityIcons name={beneficio.icone} size={42} color={beneficio.corIcone} />
          </View>
          <View style={styles.bannerInfo}>
            <StatusBadge status={beneficio.status} />
            <Text style={styles.bannerTitulo}>{beneficio.nome}</Text>
            <Text style={styles.bannerSubtitulo}>{beneficio.descricao}</Text>
          </View>
        </View>

        {/* Três Métricas Chave (Fiel ao Protótipo da Pág 4) */}
        <View style={styles.metricasContainer}>
          <View style={styles.metricaCard}>
            <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#64748B" />
            <Text style={styles.metricaRotulo}>Próxima renovação</Text>
            <Text style={styles.metricaValor}>{beneficio.dataRenovacao}</Text>
            <Text style={styles.metricaObs}>(em 45 dias)</Text>
          </View>

          <View style={styles.metricaCard}>
            <MaterialCommunityIcons name="tag-outline" size={20} color="#64748B" />
            <Text style={styles.metricaRotulo}>Usos permitidos</Text>
            <Text style={styles.metricaValor}>{beneficio.utilizacoesMaximas} por mês</Text>
            <Text style={styles.metricaObs}>renovável</Text>
          </View>

          <View style={styles.metricaCard}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#64748B" />
            <Text style={styles.metricaRotulo}>Utilizações restantes</Text>
            <Text style={styles.metricaValor}>
              {beneficio.utilizacoesFeitas} de {beneficio.utilizacoesMaximas}
            </Text>
            <Text style={styles.metricaObs}>ativas</Text>
          </View>
        </View>

        {/* Abas em Pílula */}
        <View style={styles.abasContainer}>
          <TouchableOpacity
            style={[styles.abaPill, abaAtiva === 'ONDE_USAR' && styles.abaPillAtiva]}
            onPress={() => setAbaAtiva('ONDE_USAR')}
          >
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color={abaAtiva === 'ONDE_USAR' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.abaTexto, abaAtiva === 'ONDE_USAR' && styles.abaTextoAtivo]}>
              Onde usar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.abaPill, abaAtiva === 'REGRAS' && styles.abaPillAtiva]}
            onPress={() => setAbaAtiva('REGRAS')}
          >
            <MaterialCommunityIcons
              name="file-document-outline"
              size={16}
              color={abaAtiva === 'REGRAS' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.abaTexto, abaAtiva === 'REGRAS' && styles.abaTextoAtivo]}>
              Regras
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.abaPill, abaAtiva === 'QUANTIDADE' && styles.abaPillAtiva]}
            onPress={() => setAbaAtiva('QUANTIDADE')}
          >
            <MaterialCommunityIcons
              name="counter"
              size={16}
              color={abaAtiva === 'QUANTIDADE' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.abaTexto, abaAtiva === 'QUANTIDADE' && styles.abaTextoAtivo]}>
              Quantidade
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.abaPill, abaAtiva === 'ESTABELECIMENTOS' && styles.abaPillAtiva]}
            onPress={() => setAbaAtiva('ESTABELECIMENTOS')}
          >
            <MaterialCommunityIcons
              name="store-outline"
              size={16}
              color={abaAtiva === 'ESTABELECIMENTOS' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[styles.abaTexto, abaAtiva === 'ESTABELECIMENTOS' && styles.abaTextoAtivo]}
            >
              Locais
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Onde Pode Utilizar */}
        <View style={styles.secaoCard}>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoIcone}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#2563EB" />
            </View>
            <Text style={styles.secaoTitulo}>Onde pode utilizar</Text>
          </View>
          <Text style={styles.secaoCorpo}>
            Em restaurantes, lanchonetes, padarias e outros estabelecimentos conveniados da FCV.
          </Text>
          <View style={styles.dicaCard}>
            <MaterialCommunityIcons name="information-outline" size={18} color="#2563EB" />
            <Text style={styles.dicaTexto}>
              Apresente seu QR Code ou realize a validação no terminal do estabelecimento para
              efetuar a utilização.
            </Text>
          </View>
        </View>

        {/* Seção: Regras de Utilização */}
        <View style={styles.secaoCard}>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoIcone}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color="#2563EB" />
            </View>
            <Text style={styles.secaoTitulo}>Regras de utilização</Text>
          </View>
          <View style={styles.regraItem}>
            <MaterialCommunityIcons name="check" size={18} color="#059669" />
            <Text style={styles.regraTexto}>Válido apenas em estabelecimentos conveniados.</Text>
          </View>
          <View style={styles.regraItem}>
            <MaterialCommunityIcons name="check" size={18} color="#059669" />
            <Text style={styles.regraTexto}>
              Não é permitido o uso para compras de bebidas alcoólicas e cigarros.
            </Text>
          </View>
          <View style={styles.regraItem}>
            <MaterialCommunityIcons name="check" size={18} color="#059669" />
            <Text style={styles.regraTexto}>O benefício é pessoal e intransferível.</Text>
          </View>
          <View style={styles.regraItem}>
            <MaterialCommunityIcons name="check" size={18} color="#059669" />
            <Text style={styles.regraTexto}>
              Em caso de perda ou uso indevido, entre em contato com o RH.
            </Text>
          </View>
        </View>

        {/* Seção: Estabelecimentos Conveniados */}
        <View style={styles.secaoCard}>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoIcone}>
              <MaterialCommunityIcons name="storefront-outline" size={20} color="#2563EB" />
            </View>
            <Text style={styles.secaoTitulo}>Estabelecimentos conveniados</Text>
          </View>
          <Text style={styles.secaoCorpo}>
            Confira os estabelecimentos onde você pode utilizar seu benefício:
          </Text>

          <View style={styles.estabelecimentosLista}>
            {estabelecimentos.map((est) => (
              <View key={est.id} style={styles.estItem}>
                <View style={styles.estIconeBox}>
                  <MaterialCommunityIcons name={est.icone as any} size={20} color="#1B2A4A" />
                </View>
                <View style={styles.estInfo}>
                  <Text style={styles.estNome}>{est.nome}</Text>
                  <Text style={styles.estEndereco}>{est.endereco}</Text>
                  <Text style={styles.estTipo}>{est.tipo}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  iconeGrande: {
    width: 68,
    height: 68,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    flex: 1,
    gap: 4,
  },
  bannerTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B2A4A',
  },
  bannerSubtitulo: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  metricasContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  metricaCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricaRotulo: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
  },
  metricaValor: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B2A4A',
    textAlign: 'center',
  },
  metricaObs: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  abasContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  abaPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  abaPillAtiva: {
    backgroundColor: '#1B2A4A',
    borderColor: '#1B2A4A',
  },
  abaTexto: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  abaTextoAtivo: {
    color: '#FFFFFF',
  },
  secaoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  secaoIcone: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2A4A',
  },
  secaoCorpo: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  dicaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0F7FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  dicaTexto: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 16,
  },
  regraItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  regraTexto: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  estabelecimentosLista: {
    gap: 10,
    marginTop: 6,
  },
  estItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
  },
  estIconeBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  estInfo: {
    flex: 1,
  },
  estNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B2A4A',
  },
  estEndereco: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  estTipo: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
});
