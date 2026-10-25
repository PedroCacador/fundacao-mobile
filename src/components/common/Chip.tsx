import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, NomeIcone } from './Icon';

interface ChipProps {
  texto: string;
  icone?: NomeIcone;
  pequeno?: boolean;
  cor?: string;
  fundo?: string;
}

export function Chip({
  texto,
  icone,
  pequeno = false,
  cor = cores.primaria,
  fundo = cores.primariaClara,
}: ChipProps) {
  return (
    <View style={[styles.chip, pequeno && styles.chipPequeno, { backgroundColor: fundo }]}>
      {icone ? <Icone nome={icone} tamanho={13} cor={cor} /> : null}
      <Text style={[styles.texto, pequeno && styles.textoPequeno, { color: cor }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espaco.xs,
    paddingHorizontal: espaco.sm,
    paddingVertical: 3,
    borderRadius: raio.sm,
  },
  chipPequeno: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  texto: {
    fontFamily: familia.medio,
    fontSize: fonte.xs,
  },
  textoPequeno: {
    fontSize: fonte.xxs,
  },
});
