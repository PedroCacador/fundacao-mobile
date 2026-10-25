import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, NomeIcone } from './Icon';

interface ChipProps {
  texto: string;
  icone?: NomeIcone;
  pequeno?: boolean;
}

export function Chip({ texto, icone, pequeno = false }: ChipProps) {
  return (
    <View style={[styles.chip, pequeno && styles.chipPequeno]}>
      {icone ? <Icone nome={icone} tamanho={13} cor={cores.primaria} /> : null}
      <Text style={[styles.texto, pequeno && styles.textoPequeno]}>{texto}</Text>
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
    backgroundColor: cores.primariaClara,
  },
  chipPequeno: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  texto: {
    fontFamily: familia.medio,
    fontSize: fonte.xs,
    color: cores.primaria,
  },
  textoPequeno: {
    fontSize: fonte.xxs,
  },
});
