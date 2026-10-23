import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, raio } from '../../theme';

export type NomeIcone = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface IconBoxProps {
  nome: NomeIcone;
  cor?: string;
  fundo?: string;
  tamanho?: number;
  redondo?: boolean;
}

export function IconBox({
  nome,
  cor = cores.primaria,
  fundo = cores.primariaClara,
  tamanho = 44,
  redondo = false,
}: IconBoxProps) {
  return (
    <View
      style={[
        styles.caixa,
        {
          width: tamanho,
          height: tamanho,
          backgroundColor: fundo,
          borderRadius: redondo ? tamanho / 2 : raio.md,
        },
      ]}
    >
      <MaterialCommunityIcons name={nome} size={Math.round(tamanho * 0.5)} color={cor} />
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
