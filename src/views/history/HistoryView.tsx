import React from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Card } from '../../components/common/Card';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/StateMessage';

import { TabScreenProps } from '../../navigation/types';

import {
  cores,
  espaco,
  fonte,
  peso,
  raio,
} from '../../theme';

import {
  periodos,
  useHistoryViewModel,
} from '../../viewmodels/useHistoryViewModel';

export default function HistoryView({
  navigation,
}: TabScreenProps<'History'>) {
  const {
    periodo,
    setPeriodo,
    frasePeriodo,
  } = useHistoryViewModel();

  return (
    <Screen>
      {/* CABEÇALHO */}

      <View style={styles.cabecalho}>
        <Pressable
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate('Home')}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao Início"
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={cores.texto}
          />
        </Pressable>

        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>
            Histórico de Utilizações
          </Text>

          <Text style={styles.subtitulo}>
            Acompanhe todas as utilizações
            dos seus benefícios em um só lugar.
          </Text>
        </View>

        <View style={styles.marca}>
          <MaterialCommunityIcons
            name="human-handsup"
            size={21}
            color={cores.primaria}
          />

          <View>
            <Text style={styles.marcaSigla}>
              FCV
            </Text>

            <Text style={styles.marcaTexto}>
              Fundação
              {'\n'}
              Cristiano Varella
            </Text>
          </View>
        </View>
      </View>

      {/* FILTROS DE PERÍODO */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rolagemAbas}
        contentContainerStyle={styles.abas}
      >
        {periodos.map((opcao) => {
          const ativa = periodo === opcao.id;

          return (
            <Pressable
              key={opcao.id}
              onPress={() => setPeriodo(opcao.id)}
              accessibilityRole="tab"
              accessibilityState={{
                selected: ativa,
              }}
              style={[
                styles.aba,
                ativa && styles.abaAtiva,
              ]}
            >
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={16}
                color={
                  ativa
                    ? cores.branco
                    : cores.primaria
                }
              />

              <Text
                style={[
                  styles.abaTexto,
                  ativa && styles.abaTextoAtivo,
                ]}
              >
                {opcao.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* MENSAGEM DE HISTÓRICO VAZIO */}

      <Card estilo={styles.cardVazio}>
        <EmptyState
          icone="history"
          titulo={`Nenhuma utilização ${frasePeriodo}`}
          texto="Quando você usar um benefício em um estabelecimento conveniado, ele aparece aqui."
        />
      </Card>
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
    fontWeight: peso.negrito,
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
    fontWeight: peso.negrito,
    color: cores.primaria,
  },

  marcaTexto: {
    fontSize: 5,
    fontWeight: peso.semi,
    lineHeight: 6,
    color: cores.primaria,
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
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaClara,
  },

  abaAtiva: {
    backgroundColor: cores.primaria,
  },

  abaTexto: {
    fontSize: fonte.sm,
    fontWeight: peso.semi,
    color: cores.primaria,
  },

  abaTextoAtivo: {
    color: cores.branco,
  },

  cardVazio: {
    marginBottom: espaco.md,
    paddingVertical: espaco.sm,
  },
});