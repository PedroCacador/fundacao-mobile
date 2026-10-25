import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cores } from '../../theme';

export type PosicaoCirculo = 'topoEsquerda' | 'topoDireita' | 'baseDireita';

export function DecorativeCircles({ posicoes }: { posicoes: PosicaoCirculo[] }) {
  return (
    <>
      {posicoes.map((posicao) => (
        <View key={posicao} style={[styles.circulo, styles[posicao]]} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  circulo: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: cores.decoracao,
  },
  topoEsquerda: {
    width: 260,
    height: 260,
    top: -170,
    left: -150,
  },
  topoDireita: {
    width: 240,
    height: 240,
    top: -120,
    right: -90,
  },
  baseDireita: {
    width: 320,
    height: 320,
    bottom: -230,
    right: -140,
  },
});
