import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CategoryFilterModal, TODAS_CATEGORIAS } from '../../components/common/CategoryFilterModal';
import { Header } from '../../components/common/Header';
import { Screen } from '../../components/common/Screen';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { TopBar } from '../../components/common/TopBar';
import { LocationCard } from '../../components/location/LocationCard';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { plural } from '../../utils/format';
import { useLocationsViewModel } from '../../viewmodels/useLocationsViewModel';

export default function LocationsView({ navigation }: TabScreenProps<'Locations'>) {
  const {
    lista,
    categorias,
    categoria,
    busca,
    setBusca,
    modalFiltroAberto,
    abrirModalFiltro,
    fecharModalFiltro,
    aplicarFiltroCategoria,
    limparFiltros,
    carregando,
    atualizando,
    erro,
    recarregar,
  } = useLocationsViewModel();

  const filtroAtivo = categoria !== TODAS_CATEGORIAS;

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar voltar={false} perfil />

      <Header
        icone="map-pin"
        titulo="Locais de Atendimento"
        subtitulo="Encontre os estabelecimentos conveniados onde você pode utilizar seus benefícios."
      />

      {/* BARRA DE BUSCA E BOTÃO DE FILTRO POR CATEGORIA */}
      <SearchBar
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar local por nome..."
        filtroCategoria={{
          categoria: filtroAtivo ? categoria : null,
          aoAbrir: abrirModalFiltro,
          aoLimpar: limparFiltros,
        }}
      />

      {/* ESTADOS DE CARREGAMENTO / ERRO / VAZIO / LISTAGEM */}
      {carregando ? (
        <Loading texto="Carregando estabelecimentos conveniados..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : lista.length === 0 ? (
        <EmptyState
          icone="store"
          titulo="Nenhum estabelecimento encontrado"
          texto={
            filtroAtivo || busca.trim().length > 0
              ? 'Tente buscar por outro termo ou limpar os filtros de categoria.'
              : 'Não há estabelecimentos conveniados com benefícios ativos no momento.'
          }
        />
      ) : (
        <View style={styles.secaoLista}>
          <Text style={styles.contagem}>
            {lista.length}{' '}
            {plural(lista.length, 'estabelecimento encontrado', 'estabelecimentos encontrados')}
          </Text>

          {lista.map((local) => (
            <LocationCard
              key={local.conveniado.id}
              local={local}
              aoPressionar={() =>
                navigation.navigate('LocationDetails', {
                  conveniadoId: local.conveniado.id,
                })
              }
            />
          ))}
        </View>
      )}

      {/* MODAL DE FILTRO POR CATEGORIA COM LIMPAR / VOLTAR / FILTRAR */}
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
  secaoLista: {
    gap: espaco.xs,
  },
  contagem: {
    marginBottom: espaco.sm,
    fontSize: fonte.sm,
    fontFamily: familia.semi,
    color: cores.textoSecundario,
  },
});
