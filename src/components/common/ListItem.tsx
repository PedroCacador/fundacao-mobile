import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte } from '../../theme';
import { Icone, NomeIcone } from './Icon';

interface ListItemProps {
  icone: NomeIcone;
  rotulo: string;
  valor?: string;
  valorADireita?: boolean;
  ultimo?: boolean;
}

export function ListItem({
  icone,
  rotulo,
  valor,
  valorADireita = false,
  ultimo = false,
}: ListItemProps) {
  return (
    <View style={[styles.linha, !ultimo && styles.divisor]}>
      <Icone nome={icone} tamanho={18} cor={cores.texto} />
      <Text style={styles.rotulo}>{rotulo}</Text>
      {valor ? (
        <Text style={[styles.valor, valorADireita && styles.valorDireita]} numberOfLines={1}>
          {valor}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    paddingVertical: 11,
  },
  divisor: {
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  rotulo: {
    width: '38%',
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  valor: {
    flex: 1,
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  valorDireita: {
    textAlign: 'right',
    fontFamily: familia.regular,
    color: cores.textoSecundario,
  },
});
