import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header';
import { SummaryCard } from '../../components/common/SummaryCard';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { BenefitCard, ItemBeneficioCarteira } from '../../components/benefit/BenefitCard';
import { useWalletViewModel, FiltroCarteira } from '../../viewmodels/useWalletViewModel';

export default function WalletView({ navigation }: any) {
  const {
    carregando,
    atualizando,
    filtroAtivo,
    setFiltroAtivo,
    beneficios,
    estatisticas,
    contadoresAbas,
    recarregar,
  } = useWalletViewModel();

  const abasFiltro: TabOption<FiltroCarteira>[] = [
    { id: 'TODOS', label: 'Todos', count: contadoresAbas.TODOS },
    { id: 'DISPONIVEIS', label: 'Disponíveis', count: contadoresAbas.DISPONIVEIS },
    { id: 'UTILIZADOS', label: 'Utilizados', count: contadoresAbas.UTILIZADOS },
    { id: 'EXPIRADOS', label: 'Expirados', count: contadoresAbas.EXPIRADOS },
  ];

  const handleAbrirDetalhes = (beneficio: ItemBeneficioCarteira) => {
    navigation.navigate('BenefitDetails', { beneficio });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Cabeçalho Padronizado FCV */}
      <Header
        titulo="Carteira de Benefícios"
        subtitulo="Confira todos os seus benefícios e acompanhe o seu saldo e validade."
        iconeEsquerda="wallet-outline"
      />

      {/* Abas de Filtros Horizontais */}
      <FilterTabs
        tabs={abasFiltro}
        selectedTab={filtroAtivo}
        onSelectTab={(tabId) => setFiltroAtivo(tabId as FiltroCarteira)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={recarregar}
            colors={['#1B2A4A']}
            tintColor="#1B2A4A"
          />
        }
      >
        {/* Cards de Resumo Estatístico do Topo (Fiel ao Protótipo) */}
        <View style={styles.resumoRow}>
          <SummaryCard
            icone="gift-outline"
            valor={estatisticas.totalDisponiveis}
            rotulo="Benefícios disponíveis"
            corIcone="#2563EB"
            fundoIcone="#EFF6FF"
          />
          <SummaryCard
            icone="check-circle-outline"
            valor={estatisticas.utilizacoesRestantes}
            rotulo="Utilizações restantes"
            corIcone="#059669"
            fundoIcone="#ECFDF5"
          />
          <SummaryCard
            icone="calendar-month-outline"
            valor={estatisticas.proximaRenovacao}
            rotulo="Próxima renovação"
            corIcone="#7C3AED"
            fundoIcone="#F5F3FF"
          />
        </View>

        {/* Lista de Benefícios */}
        <View style={styles.listaContainer}>
          {carregando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1B2A4A" />
              <Text style={styles.loadingTexto}>Carregando benefícios...</Text>
            </View>
          ) : beneficios.length === 0 ? (
            <View style={styles.vazioContainer}>
              <Text style={styles.vazioTitulo}>Nenhum benefício encontrado</Text>
              <Text style={styles.vazioTexto}>
                Não encontramos nenhum benefício nesta categoria de filtro.
              </Text>
            </View>
          ) : (
            beneficios.map((beneficio) => (
              <BenefitCard
                key={beneficio.id}
                beneficio={beneficio}
                onPress={() => handleAbrirDetalhes(beneficio)}
                onPressRegras={() => handleAbrirDetalhes(beneficio)}
              />
            ))
          )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  resumoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  listaContainer: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTexto: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  vazioContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vazioTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2A4A',
    marginBottom: 6,
  },
  vazioTexto: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
