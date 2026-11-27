import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconBox } from '../common/Icon';
import { cores, espaco, familia, fonte, raio } from '../../theme';

export function QrTips() {
  return (
    <View style={styles.dica}>
      <IconBox nome="info" tamanho={36} cor={cores.primaria} fundo={cores.branco} redondo />
      <Text style={styles.texto}>
        <Text style={styles.rotulo}>Dica: </Text>
        deixe a tela visível e com o brilho no máximo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    marginTop: espaco.md,
    paddingVertical: espaco.md,
    paddingHorizontal: espaco.lg,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaAzul,
    backgroundColor: '#EEF3FB',
  },
  texto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    lineHeight: 20,
    color: '#334155',
  },
  rotulo: {
    fontFamily: familia.semi,
    color: cores.texto,
  },
});
