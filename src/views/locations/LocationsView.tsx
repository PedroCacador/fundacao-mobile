import React, { useLayoutEffect } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LocationCard } from '../../components/location/LocationCard';
import { Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';

import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';

import { TextField } from '../../components/common/TextField';

import { RootScreenProps } from '../../navigation/types';

import { cores, espaco, fonte, familia, raio } from '../../theme';

import { estiloCategoria } from '../../utils/category';
import { plural } from '../../utils/format';

import { TODAS_CATEGORIAS, useLocationsViewModel } from '../../viewmodels/useLocationsViewModel';

export default function LocationsView({ navigation }: RootScreenProps<'Locations'>) {
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

  // Evita que apareçam dois cabeçalhos.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const abas = [
    {
      id: TODAS_CATEGORIAS,
      label: 'Todos',
    },
    ...categorias.map((nome) => ({
      id: nome,
      label: nome,
    })),
  ];

  return (
    <Screen bordas={['top', 'bottom']} atualizando={atualizando} aoAtualizar={recarregar}>
      {/* CABEÇALHO */}

      <View style={styles.cabecalho}>
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={10}
        >
          <Icone nome="chevron-left" tamanho={28} cor={cores.texto} />
        </Pressable>

        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>Locais de utilização</Text>

          <Text style={styles.subtitulo}>
            Encontre os estabelecimentos conveniados onde você pode usar seus benefícios.
          </Text>
        </View>

        <View style={styles.marca}>
          <Icone nome="user" tamanho={21} cor={cores.primaria} />

          <View>
            <Text style={styles.marcaSigla}>FCV</Text>

            <Text style={styles.marcaTexto}>
              Fundação
              {'\n'}
              Cristiano Varella
            </Text>
          </View>
        </View>
      </View>

      {/* CAMPO DE BUSCA */}

      <View style={styles.busca}>
        <TextField
          icone="search"
          placeholder="Buscar por nome ou endereço"
          value={busca}
          onChangeText={setBusca}
          returnKeyType="search"
        />
      </View>

      {/* FILTROS POR CATEGORIA */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rolagemAbas}
        contentContainerStyle={styles.abas}
      >
        {abas.map((aba) => {
          const ativa = categoria === aba.id;

          const icone = aba.id === TODAS_CATEGORIAS ? null : estiloCategoria(aba.id).icone;

          return (
            <Pressable
              key={aba.id}
              onPress={() => setCategoria(aba.id)}
              accessibilityRole="tab"
              accessibilityState={{
                selected: ativa,
              }}
              style={[styles.aba, ativa && styles.abaAtiva]}
            >
              {icone ? (
                <Icone nome={icone} tamanho={16} cor={ativa ? cores.branco : cores.primaria} />
              ) : null}

              <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>{aba.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ESTABELECIMENTOS */}

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
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.sm,
    marginBottom: espaco.lg,
  },

  botaoVoltar: {
    width: 28,
    alignItems: 'flex-start',
    marginTop: 2,
  },

  cabecalhoTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 20,
    fontFamily: familia.negrito,
    color: cores.texto,
  },

  subtitulo: {
    marginTop: espaco.xs,
    fontSize: fonte.sm,
    lineHeight: 18,
    color: cores.textoSecundario,
  },

  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 3,
  },

  marcaSigla: {
    fontSize: fonte.md,
    fontFamily: familia.negrito,
    color: cores.primaria,
  },

  marcaTexto: {
    fontSize: 5,
    fontFamily: familia.semi,
    lineHeight: 6,
    color: cores.primaria,
  },

  busca: {
    marginBottom: espaco.md,
  },

  rolagemAbas: {
    flexGrow: 0,
    marginBottom: espaco.lg,
  },

  abas: {
    flexDirection: 'row',
    gap: espaco.sm,
  },

  aba: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.sm,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaClara,
  },

  abaAtiva: {
    backgroundColor: cores.primaria,
  },

  abaTexto: {
    fontSize: fonte.sm,
    fontFamily: familia.semi,
    color: cores.primaria,
  },

  abaTextoAtivo: {
    color: cores.branco,
  },

  contagem: {
    marginBottom: espaco.md,
    fontSize: fonte.sm,
    fontFamily: familia.semi,
    color: cores.texto,
  },
});
