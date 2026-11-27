import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { CategoryFilterModal } from '../../components/common/CategoryFilterModal';
import { Header } from '../../components/common/Header';
import { Screen } from '../../components/common/Screen';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { TopBar } from '../../components/common/TopBar';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { plural } from '../../utils/format';
import { useWalletViewModel } from '../../viewmodels/useWalletViewModel';

export default function WalletView({ navigation }: TabScreenProps<'Wallet'>) {
  const {
    lista,
    totalEncontrados,
    carregandoUsos,
    busca,
    setBusca,
    buscaAtiva,
    categorias,
    categoria,
    filtroAtivo,
    modalFiltroAberto,
    abrirModalFiltro,
    fecharModalFiltro,
    aplicarFiltroCategoria,
    limparFiltros,
    carregando,
    atualizando,
    erro,
    recarregar,
    erroUtilizacoes,
    tentarUtilizacoes,
  } = useWalletViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar voltar />
      <Header
        icone="gift"
        titulo="Benefícios"
        subtitulo="Confira os benefícios disponíveis e acompanhe suas utilizações."
      />

      <SearchBar
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar benefício por nome ou descrição..."
        filtroCategoria={{
          categoria: filtroAtivo ? categoria : null,
          aoAbrir: abrirModalFiltro,
          aoLimpar: limparFiltros,
        }}
      />

      <Text style={styles.contagem}>
        {totalEncontrados}{' '}
        {plural(totalEncontrados, 'benefício encontrado', 'benefícios encontrados')}
      </Text>

      {erroUtilizacoes ? (
        <View style={styles.aviso}>
          <ErrorMessage mensagem={erroUtilizacoes} aoTentarDeNovo={tentarUtilizacoes} />
        </View>
      ) : null}

      {carregando || (carregandoUsos && !erroUtilizacoes) ? (
        <Loading texto="Carregando benefícios..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : lista.length === 0 ? (
        <EmptyState
          icone="gift"
          titulo="Nenhum benefício encontrado"
          texto={
            filtroAtivo || buscaAtiva
              ? 'Tente buscar por outro termo ou limpar o filtro de categoria.'
              : 'Não há benefícios ativos disponíveis no momento.'
          }
        />
      ) : (
        lista.map((entrada) => (
          <BenefitCard
            key={entrada.chave}
            item={entrada.catalogo}
            uso={entrada.uso}
            aoPressionar={() =>
              navigation.navigate('BenefitDetails', {
                beneficioId: entrada.catalogo.beneficio.id,
              })
            }
          />
        ))
      )}

      <CategoryFilterModal
        aberto={modalFiltroAberto}
        categorias={categorias}
        categoriaSelecionada={categoria}
        aoFiltrar={aplicarFiltroCategoria}
        aoLimpar={limparFiltros}
        aoVoltar={fecharModalFiltro}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  contagem: {
    marginTop: espaco.md,
    marginBottom: espaco.md,
    fontSize: fonte.sm,
    fontFamily: familia.semi,
    color: cores.textoSecundario,
  },
  aviso: {
    marginBottom: espaco.md,
  },
});
