import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

type IconeCategoria = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function obterApresentacaoCategoria(categoria: string): {
  icone: IconeCategoria;
  fundo: string;
  cor: string;
} {
  const normalizada = categoria
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');

  if (/academ|academia|musculacao|fitness/.test(normalizada)) {
    return { icone: 'dumbbell', fundo: '#F3E8FF', cor: '#8046CC' };
  }
  if (/farmac|medicamento|drogaria/.test(normalizada)) {
    return { icone: 'pill', fundo: '#E8F1FC', cor: '#3569A8' };
  }
  if (/aliment|restaurante|comida|refeicao/.test(normalizada)) {
    return { icone: 'silverware-fork-knife', fundo: '#FDECEB', cor: '#D94F45' };
  }
  if (/saude|bem.?estar/.test(normalizada)) {
    return { icone: 'heart-pulse', fundo: '#F3E8FF', cor: '#8046CC' };
  }
  if (/cultura|lazer|cinema|teatro/.test(normalizada)) {
    return { icone: 'ticket-confirmation-outline', fundo: '#E8F5E9', cor: '#388E3C' };
  }
  if (/educa|curso|ensino/.test(normalizada)) {
    return { icone: 'school-outline', fundo: '#E8F1FC', cor: '#3569A8' };
  }
  if (/transporte|mobilidade|viagem/.test(normalizada)) {
    return { icone: 'bus', fundo: '#FFF3E0', cor: '#C77716' };
  }
  if (/tecnologia|eletron/.test(normalizada)) {
    return { icone: 'laptop', fundo: '#E5F4F7', cor: '#287A8A' };
  }
  return { icone: 'tag-outline', fundo: '#E8EDF2', cor: '#52677F' };
}

export default function HomeView({ navigation }: any) {
  const {
    user,
    beneficios,
    conveniados,
    beneficiosAtivos,
    categorias,
    carregando,
    erro,
    recarregar,
  } = useHomeViewModel();
  const conveniadosAtivos = conveniados.filter((item) => item.status === 'ATIVO').length;
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} />}
      >

        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
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
          <Text style={styles.summaryTitle}>Resumo dos benefícios</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconCircle}>
                <MaterialCommunityIcons name="gift-outline" size={22} color="#3A5A8C" />
              </View>
              <Text style={styles.summaryValue}>
                {carregando && beneficios.length === 0 ? '—' : beneficios.length}
              </Text>
              <Text style={styles.summaryLabel}>Benefícios{'\n'}cadastrados</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconCircle}>
                <MaterialCommunityIcons name="check-circle-outline" size={22} color="#3A5A8C" />
              </View>
              <Text style={styles.summaryValue}>
                {carregando && beneficios.length === 0 ? '—' : beneficiosAtivos}
              </Text>
              <Text style={styles.summaryLabel}>Benefícios{'\n'}ativos</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconCircle}>
                <MaterialCommunityIcons name="store-outline" size={22} color="#3A5A8C" />
              </View>
              <Text style={styles.summaryValue}>
                {carregando && conveniados.length === 0 ? '—' : conveniadosAtivos}
              </Text>
              <Text style={styles.summaryLabel}>Conveniados{'\n'}ativos</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsRow}
        >
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardActive]}
            onPress={() => navigation.navigate('Wallet')}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardTop}>
              <MaterialCommunityIcons name="wallet-outline" size={28} color="#FFFFFF" />
              <MaterialCommunityIcons name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
            </View>
            <Text style={styles.actionTitleActive}>Minha Carteira</Text>
            <Text style={styles.actionSubtitleActive}>Veja seus benefícios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardTop}>
              <MaterialCommunityIcons name="history" size={28} color="#1B2A4A" />
              <MaterialCommunityIcons name="chevron-right" size={18} color="#C0C8D1" />
            </View>
            <Text style={styles.actionTitle}>Histórico</Text>
            <Text style={styles.actionSubtitle}>Suas utilizações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.getParent()?.navigate('Locations')}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardTop}>
              <MaterialCommunityIcons name="map-marker" size={28} color="#1B2A4A" />
              <MaterialCommunityIcons name="chevron-right" size={18} color="#C0C8D1" />
            </View>
            <Text style={styles.actionTitle}>Locais de utilização</Text>
            <Text style={styles.actionSubtitle}>Encontre estabelecimentos perto de você</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.benefitsHeader}>
          <Text style={styles.benefitsTitle}>Benefícios por categoria</Text>
        </View>

        <View style={styles.benefitsList}>
          {carregando && beneficios.length === 0 ? (
            <ActivityIndicator color="#3A5A8C" size="large" />
          ) : erro && beneficios.length === 0 ? (
            <Text style={styles.catalogMessage}>{erro}</Text>
          ) : categorias.length === 0 ? (
            <Text style={styles.catalogMessage}>
              Nenhum benefício cadastrado na API.
            </Text>
          ) : (
            <>
              {erro ? <Text style={styles.catalogWarning}>{erro}</Text> : null}
              {categorias.map((categoria) => {
              const apresentacao = obterApresentacaoCategoria(categoria.nome);
              const selecionada = categoriaSelecionada === categoria.nome;
              const quantidadeItens =
                categoria.conveniados.length + categoria.beneficiosSemConveniado.length;

              return (
                <View key={categoria.nome}>
                  <TouchableOpacity
                    style={[
                      styles.categoryCard,
                      selecionada && styles.categoryCardSelected,
                    ]}
                    activeOpacity={0.82}
                    onPress={() =>
                      setCategoriaSelecionada(selecionada ? null : categoria.nome)
                    }
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: apresentacao.fundo },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={apresentacao.icone}
                        size={25}
                        color={apresentacao.cor}
                      />
                    </View>
                    <View style={styles.benefitListContent}>
                      <Text style={styles.categoryTitle}>{categoria.nome}</Text>
                      <Text style={styles.categorySubtitle}>
                        {categoria.nome === 'Sem conveniado vinculado'
                          ? `${categoria.beneficiosSemConveniado.length} benefícios`
                          : `${categoria.conveniados.length} ${
                              categoria.conveniados.length === 1 ? 'conveniado' : 'conveniados'
                            }`}
                      </Text>
                    </View>
                    <View style={styles.categoryTrailing}>
                      <View style={styles.categoryCount}>
                        <Text style={styles.categoryCountText}>
                          {quantidadeItens}
                        </Text>
                      </View>
                      <MaterialCommunityIcons
                        name={selecionada ? 'chevron-up' : 'chevron-down'}
                        size={21}
                        color="#728197"
                      />
                    </View>
                  </TouchableOpacity>
                  {selecionada
                    ? categoria.conveniados.map(({ conveniado, beneficios: beneficiosDoConveniado }) => (
                        <View key={conveniado.id} style={styles.categoryBenefit}>
                          <View style={styles.vendorHeading}>
                            <MaterialCommunityIcons
                              name="store-outline"
                              size={19}
                              color={apresentacao.cor}
                            />
                            <Text style={styles.vendorTitle}>{conveniado.nome_fantasia}</Text>
                            <View style={styles.statusPill}>
                              <Text style={styles.statusPillText}>{conveniado.status}</Text>
                            </View>
                          </View>
                          {beneficiosDoConveniado.map(({ beneficio, statusOferta }) => (
                            <View key={beneficio.id} style={styles.vendorBenefit}>
                              <View style={styles.benefitHeading}>
                                <Text style={styles.benefitListTitle}>{beneficio.nome}</Text>
                                <View style={styles.statusPill}>
                                  <Text style={styles.statusPillText}>{beneficio.status}</Text>
                                </View>
                              </View>
                              <Text style={styles.offerStatus}>Oferta: {statusOferta}</Text>
                              {beneficio.descricao ? (
                                <Text style={styles.benefitListDesc}>{beneficio.descricao}</Text>
                              ) : null}
                              <View style={styles.benefitMeta}>
                                <View style={styles.benefitMetaItem}>
                                  <MaterialCommunityIcons
                                    name="tag-outline"
                                    size={16}
                                    color="#52677F"
                                  />
                                  <Text style={styles.benefitMetaText}>
                                    {beneficio.tipo_beneficio} {beneficio.valor}
                                  </Text>
                                </View>
                                <View style={styles.benefitMetaItem}>
                                  <MaterialCommunityIcons
                                    name="counter"
                                    size={16}
                                    color="#52677F"
                                  />
                                  <Text style={styles.benefitMetaText}>
                                    Até {beneficio.quantidade_maxima_utilizacoes} utilizações
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      ))
                    : null}
                  {selecionada
                    ? categoria.beneficiosSemConveniado.map((beneficio) => (
                        <View key={beneficio.id} style={styles.categoryBenefit}>
                          <View style={styles.benefitHeading}>
                            <Text style={styles.benefitListTitle}>{beneficio.nome}</Text>
                            <View style={styles.statusPill}>
                              <Text style={styles.statusPillText}>{beneficio.status}</Text>
                            </View>
                          </View>
                          {beneficio.descricao ? (
                            <Text style={styles.benefitListDesc}>{beneficio.descricao}</Text>
                          ) : null}
                          <View style={styles.benefitMeta}>
                            <View style={styles.benefitMetaItem}>
                              <MaterialCommunityIcons name="tag-outline" size={16} color="#52677F" />
                              <Text style={styles.benefitMetaText}>
                                {beneficio.tipo_beneficio} {beneficio.valor}
                              </Text>
                            </View>
                            <View style={styles.benefitMetaItem}>
                              <MaterialCommunityIcons name="counter" size={16} color="#52677F" />
                              <Text style={styles.benefitMetaText}>
                                Até {beneficio.quantidade_maxima_utilizacoes} utilizações
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))
                    : null}
                </View>
              );
              })}
            </>
          )}
        </View>

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
  benefitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B2A4A',
  },
  benefitsList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 1,
  },
  categoryCardSelected: {
    borderColor: '#C8D5E5',
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  categoryTitle: {
    color: '#1B2A4A',
    fontSize: 15,
    fontWeight: '700',
  },
  categorySubtitle: {
    color: '#748196',
    fontSize: 12,
    marginTop: 4,
  },
  categoryTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryCount: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 7,
    borderRadius: 14,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCountText: {
    color: '#3A5A8C',
    fontSize: 12,
    fontWeight: '700',
  },
  benefitListContent: {
    flex: 1,
  },
  benefitListTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 2,
  },
  benefitListDesc: {
    fontSize: 12,
    color: '#8E99A4',
    marginBottom: 8,
    lineHeight: 16,
  },
  offerStatus: {
    color: '#748196',
    fontSize: 11,
    marginTop: 2,
  },
  categoryBenefit: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginLeft: 26,
    marginRight: 4,
    marginTop: -2,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#D8E2EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 1,
  },
  vendorHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomColor: '#EDF0F4',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  vendorTitle: {
    color: '#1B2A4A',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  vendorBenefit: {
    paddingTop: 12,
  },
  benefitHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusPill: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusPillText: {
    color: '#388E3C',
    fontSize: 10,
    fontWeight: '700',
  },
  benefitMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  benefitMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  benefitMetaText: {
    color: '#52677F',
    fontSize: 11,
    fontWeight: '600',
  },
  catalogMessage: {
    color: '#5D6875',
    fontSize: 14,
    paddingVertical: 20,
    textAlign: 'center',
  },
  catalogWarning: {
    color: '#8A5A00',
    backgroundColor: '#FFF3D6',
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 12,
    padding: 12,
  },
});
