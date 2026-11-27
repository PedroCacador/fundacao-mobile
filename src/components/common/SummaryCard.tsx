import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte } from '../../theme';
import { IconBox, NomeIcone } from './Icon';

export interface ItemResumo {
  icone: NomeIcone;
  valor: string | number;
  rotulo: string;
  cor?: string;
  fundo?: string;
}

export function SummaryCard({ itens }: { itens: ItemResumo[] }) {
  return (
    <View style={styles.card}>
      {itens.map((item, indice) => (
        <View key={item.rotulo} style={[styles.item, indice > 0 && styles.divisor]}>
          <IconBox
            nome={item.icone}
            cor={item.cor ?? cores.primaria}
            fundo={item.fundo ?? cores.primariaClara}
            tamanho={42}
            redondo
          />
          <Text style={styles.valor} numberOfLines={1}>
            {item.valor}
          </Text>
          <Text style={styles.rotulo}>{item.rotulo}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#EFF4FB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.bordaAzul,
    paddingVertical: espaco.md,
    paddingHorizontal: espaco.xs,
    marginBottom: espaco.lg,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 2,
  },
  divisor: {
    borderLeftWidth: 1,
    borderLeftColor: '#D9E2F1',
  },
  valor: {
    fontFamily: familia.negrito,
    fontSize: fonte.sm,
    color: cores.texto,
    marginTop: espaco.xs,
  },
  rotulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    lineHeight: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
