import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { CampaignItemCard } from '../../components/campaign/CampaignItemCard';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { Header } from '../../components/common/Header';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { TabScreenProps } from '../../navigation/types';
import { coresCategoria, espaco } from '../../theme';
import { formatarData } from '../../utils/format';
import { FiltroCarteira, useWalletViewModel } from '../../viewmodels/useWalletViewModel';

const abas: TabOption<FiltroCarteira>[] = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'DISPONIVEIS', label: 'Disponíveis' },
  { id: 'UTILIZADOS', label: 'Utilizados' },
  { id: 'EXPIRADOS', label: 'Expirados' },
];

export default function WalletView({ navigation }: TabScreenProps<'Wallet'>) {
  const {
    lista,
    filtro,
    setFiltro,
    resumo,
    textoVazio,
    carregando,
    atualizando,
    erro,
    recarregar,
    erroCampanhas,
    tentarCampanhas,
    erroUtilizacoes,
    tentarUtilizacoes,
  } = useWalletViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar voltar perfil />
      <Header
        icone="wallet"
        titulo="Carteira de Benefícios"
        subtitulo="Confira todos os seus benefícios e acompanhe a validade de cada um."
      />

      <SummaryCard
        slogan="caixa"
        itens={[
          {
            icone: 'gift',
            valor: carregando ? '-' : resumo.disponiveis,
            rotulo: 'Benefícios disponíveis',
          },
          {
            icone: 'store',
            valor: carregando ? '-' : resumo.locais,
            rotulo: 'Locais conveniados',
            ...coresCategoria.verde,
          },
          {
            largo: true,
            icone: 'calendar',
            valor: resumo.proximaRenovacao ? formatarData(resumo.proximaRenovacao) : '-',
            rotulo: 'Próxima renovação',
            ...coresCategoria.roxo,
          },
        ]}
      />

      <FilterTabs tabs={abas} selectedTab={filtro} onSelectTab={setFiltro} />

      {erroCampanhas ? (
        <View style={styles.aviso}>
          <ErrorMessage mensagem={erroCampanhas} aoTentarDeNovo={tentarCampanhas} />
        </View>
      ) : null}
      {erroUtilizacoes && filtro === 'UTILIZADOS' ? (
        <View style={styles.aviso}>
          <ErrorMessage mensagem={erroUtilizacoes} aoTentarDeNovo={tentarUtilizacoes} />
        </View>
      ) : null}

      {carregando ? (
        <Loading texto="Carregando benefícios..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : lista.length === 0 ? (
        <EmptyState icone="wallet" titulo="Nada por aqui" texto={textoVazio} />
      ) : (
        lista.map((entrada) =>
          entrada.tipo === 'BENEFICIO' ? (
            <BenefitCard
              key={entrada.chave}
              item={entrada.catalogo}
              ultimaUtilizacao={entrada.ultimaUtilizacao}
              aoPressionar={() =>
                navigation.navigate('BenefitDetails', {
                  beneficioId: entrada.catalogo.beneficio.id,
                })
              }
              aoVerRegras={() =>
                navigation.navigate('BenefitDetails', {
                  beneficioId: entrada.catalogo.beneficio.id,
                  aba: 'REGRAS',
                })
              }
            />
          ) : (
            <CampaignItemCard
              key={entrada.chave}
              dados={entrada.dados}
              status={entrada.status}
              ultimaUtilizacao={entrada.ultimaUtilizacao}
            />
          ),
        )
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  aviso: {
    marginBottom: espaco.md,
  },
});
