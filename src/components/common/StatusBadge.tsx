import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, fonte, peso, raio } from '../../theme';

export type StatusVisual = 'DISPONIVEL' | 'INDISPONIVEL' | 'PENDENTE';

const aparencia: Record<StatusVisual, { rotulo: string; cor: string; fundo: string }> = {
  DISPONIVEL: { rotulo: 'Disponível', cor: cores.sucesso, fundo: cores.sucessoFundo },
  INDISPONIVEL: { rotulo: 'Indisponível', cor: cores.textoSecundario, fundo: cores.borda },
  PENDENTE: { rotulo: 'Pendente', cor: cores.alerta, fundo: cores.alertaFundo },
};

export function StatusBadge({ status }: { status: StatusVisual }) {
  const { rotulo, cor, fundo } = aparencia[status];
  return (
    <View style={[styles.badge, { backgroundColor: fundo }]}>
      <Text style={[styles.texto, { color: cor }]}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: espaco.sm,
    paddingVertical: 2,
    borderRadius: raio.sm,
  },
  texto: {
    fontSize: fonte.xs,
    fontWeight: peso.semi,
  },
});
