import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { PageHeader } from '../../components/common/PageHeader';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { TextField } from '../../components/common/TextField';
import { LocationCard } from '../../components/location/LocationCard';
import { cores, espaco, familia, fonte } from '../../theme';
import { estiloCategoria } from '../../utils/category';
import { plural } from '../../utils/format';
import { TODAS_CATEGORIAS, useLocationsViewModel } from '../../viewmodels/useLocationsViewModel';

export default function LocationsView() {
  const {
    lista,
    categorias,
    categoria,
    setCategoria,
    busca,
    setBusca,
    carregando,
    atualizando,
    erro,
    recarregar,
  } = useLocationsViewModel();

  const abas: TabOption[] = [
    { id: TODAS_CATEGORIAS, label: 'Todos' },
    ...categorias.map((nome) => ({ id: nome, label: nome, icone: estiloCategoria(nome).icone })),
  ];

  return (
    <Screen bordas={['top', 'bottom']} atualizando={atualizando} aoAtualizar={recarregar}>
      <PageHeader
        titulo="Locais de utilização"
        subtitulo="Encontre os estabelecimentos conveniados onde você pode usar seus benefícios."
      />

      <View style={styles.busca}>
        <TextField
          icone="search"
          placeholder="Buscar por nome, endereço ou categoria"
          value={busca}
          onChangeText={setBusca}
          returnKeyType="search"
        />
      </View>

      <FilterTabs tabs={abas} selectedTab={categoria} onSelectTab={setCategoria} />

      {carregando ? (
        <Loading texto="Carregando estabelecimentos..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : lista.length === 0 ? (
        <EmptyState
          icone="store"
          titulo="Nenhum estabelecimento encontrado"
          texto="Tente buscar por outro nome ou escolher outra categoria."
        />
      ) : (
        <>
          <Text style={styles.contagem}>
            {lista.length}{' '}
            {plural(lista.length, 'estabelecimento encontrado', 'estabelecimentos encontrados')}
          </Text>
          {lista.map((local) => (
            <LocationCard key={local.conveniado.id} local={local} />
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  busca: {
    marginBottom: espaco.md,
  },
  contagem: {
    marginBottom: espaco.md,
    fontSize: fonte.sm,
    fontFamily: familia.semi,
    color: cores.texto,
  },
});
