import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, fonte, peso } from '../../theme';
import { Card } from './Card';
import { IconBox, NomeIcone } from './Icon';

export interface ItemResumo {
  icone: NomeIcone;
  valor: string | number;
  rotulo: string;
}

interface SummaryCardProps {
  titulo?: string;
  itens: ItemResumo[];
}

export function SummaryCard({ titulo, itens }: SummaryCardProps) {
  return (
    <Card estilo={styles.card}>
      {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
      <View style={styles.linha}>
        {itens.map((item, indice) => (
          <View key={item.rotulo} style={[styles.item, indice > 0 && styles.divisor]}>
            <IconBox nome={item.icone} tamanho={40} redondo />
            <Text style={styles.valor}>{item.valor}</Text>
            <Text style={styles.rotulo}>{item.rotulo}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: espaco.lg,
  },
  titulo: {
    fontSize: fonte.md,
    fontWeight: peso.negrito,
    color: cores.texto,
    marginBottom: espaco.md,
  },
  linha: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: espaco.xs,
    paddingHorizontal: espaco.xs,
  },
  divisor: {
    borderLeftWidth: 1,
    borderLeftColor: cores.borda,
  },
  valor: {
    fontSize: fonte.lg,
    fontWeight: peso.negrito,
    color: cores.texto,
    marginTop: espaco.xs,
  },
  rotulo: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
