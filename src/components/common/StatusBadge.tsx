import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';

export type StatusVisual = 'DISPONIVEL' | 'INDISPONIVEL' | 'PENDENTE';

const aparencia: Record<StatusVisual, { rotulo: string; cor: string; fundo: string }> = {
  DISPONIVEL: { rotulo: 'Disponível', cor: cores.sucesso, fundo: cores.sucessoFundo },
  INDISPONIVEL: { rotulo: 'Indisponível', cor: cores.textoSecundario, fundo: cores.borda },
  PENDENTE: { rotulo: 'Pendente', cor: cores.alerta, fundo: cores.alertaFundo },
};

export function StatusBadge({ status, ponto = false }: { status: StatusVisual; ponto?: boolean }) {
  const { rotulo, cor, fundo } = aparencia[status];
  return (
    <View style={[styles.badge, { backgroundColor: fundo }]}>
      {ponto ? <View style={[styles.ponto, { backgroundColor: cor }]} /> : null}
      <Text style={[styles.texto, { color: cor }]}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: espaco.md,
    paddingVertical: 3,
    borderRadius: raio.sm,
  },
  ponto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  texto: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
  },
});
