import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, espaco, fonte, peso } from '../../theme';
import { NomeIcone } from './Icon';

interface ListItemProps {
  icone: NomeIcone;
  rotulo: string;
  valor?: string;
  aoPressionar?: () => void;
  ultimo?: boolean;
}

export function ListItem({ icone, rotulo, valor, aoPressionar, ultimo = false }: ListItemProps) {
  const conteudo = (
    <>
      <MaterialCommunityIcons name={icone} size={20} color={cores.primaria} />
      <Text style={styles.rotulo}>{rotulo}</Text>
      {valor ? (
        <Text style={styles.valor} numberOfLines={1}>
          {valor}
        </Text>
      ) : null}
      {aoPressionar ? (
        <MaterialCommunityIcons name="chevron-right" size={20} color={cores.textoFraco} />
      ) : null}
    </>
  );

  if (!aoPressionar) {
    return <View style={[styles.linha, !ultimo && styles.divisor]}>{conteudo}</View>;
  }
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.linha,
        !ultimo && styles.divisor,
        pressed && styles.pressionado,
      ]}
    >
      {conteudo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    paddingVertical: espaco.md,
  },
  divisor: {
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  pressionado: {
    opacity: 0.7,
  },
  rotulo: {
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  valor: {
    flex: 1,
    textAlign: 'right',
    fontSize: fonte.sm,
    fontWeight: peso.medio,
    color: cores.texto,
  },
});
