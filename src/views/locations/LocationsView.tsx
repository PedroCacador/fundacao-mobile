import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CategoryFilterModal, TODAS_CATEGORIAS } from '../../components/common/CategoryFilterModal';
import { Chip } from '../../components/common/Chip';
import { Header } from '../../components/common/Header';
import { Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { TextField } from '../../components/common/TextField';
import { TopBar } from '../../components/common/TopBar';
import { LocationCard } from '../../components/location/LocationCard';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte, raio } from '../../theme';
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
      <View style={styles.barraBuscaFiltro}>
        <View style={styles.campoBusca}>
          <TextField
            icone="search"
            placeholder="Buscar local por nome..."
            value={busca}
            onChangeText={setBusca}
            returnKeyType="search"
          />
        </View>

        <Pressable
          style={[styles.botaoFiltro, filtroAtivo && styles.botaoFiltroAtivo]}
          onPress={abrirModalFiltro}
          accessibilityRole="button"
          accessibilityLabel="Abrir filtro por categoria"
        >
          <Icone
            nome="filter"
            tamanho={22}
            cor={filtroAtivo ? cores.branco : cores.primaria}
          />
          {filtroAtivo ? <View style={styles.pontoFiltroAtivo} /> : null}
        </Pressable>
      </View>

      {/* INDICAÇÃO DE FILTRO ATIVO SELECIONADO */}
      {filtroAtivo ? (
        <View style={styles.tagFiltroLinha}>
          <Text style={styles.tagFiltroTexto}>Filtrado por:</Text>
          <Chip
            texto={categoria}
            icone="tag"
            cor={cores.primaria}
            fundo={cores.primariaClara}
          />
          <Pressable onPress={limparFiltros} hitSlop={8} style={styles.botaoLimparTag}>
            <Icone nome="x" tamanho={16} cor={cores.textoSecundario} />
          </Pressable>
        </View>
      ) : null}

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
  barraBuscaFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    marginBottom: espaco.md,
  },
  campoBusca: {
    flex: 1,
  },
  botaoFiltro: {
    width: 56,
    height: 56,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  botaoFiltroAtivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  pontoFiltroAtivo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.branco,
  },
  tagFiltroLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    marginBottom: espaco.md,
  },
  tagFiltroTexto: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  botaoLimparTag: {
    padding: 2,
  },
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
