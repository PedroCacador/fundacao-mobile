import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icone } from '../common/Icon';
import { cores, espaco, raio } from '../../theme';

interface UsageDotsProps {
  disponiveis: number;
  pendentes: number;
  usados: number;
  tamanho?: number;
  rotuloAcessivel?: string;
}

export function UsageDots({
  disponiveis,
  pendentes,
  usados,
  tamanho = 16,
  rotuloAcessivel,
}: UsageDotsProps) {
  const total = disponiveis + pendentes + usados;
  const descricaoAcessivel =
    rotuloAcessivel ?? `${disponiveis} disponíveis, ${pendentes} em andamento, ${usados} usados`;
  if (total > 12) {
    return (
      <View style={styles.barra} accessibilityLabel={descricaoAcessivel}>
        {disponiveis > 0 ? (
          <View style={[styles.segmento, styles.segmentoDisponivel, { flex: disponiveis }]} />
        ) : null}
        {pendentes > 0 ? (
          <View style={[styles.segmento, styles.segmentoPendente, { flex: pendentes }]} />
        ) : null}
        {usados > 0 ? (
          <View style={[styles.segmento, styles.segmentoUsado, { flex: usados }]} />
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.linha} accessibilityLabel={descricaoAcessivel}>
      {Array.from({ length: disponiveis }, (_, indice) => (
        <View
          key={`disponivel-${indice}`}
          style={[
            styles.ficha,
            styles.fichaDisponivel,
            { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
          ]}
        />
      ))}
      {Array.from({ length: pendentes }, (_, indice) => (
        <View
          key={`pendente-${indice}`}
          style={[
            styles.ficha,
            styles.fichaPendente,
            { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
          ]}
        />
      ))}
      {Array.from({ length: usados }, (_, indice) => (
        <View
          key={`usado-${indice}`}
          style={[
            styles.ficha,
            styles.fichaUsada,
            { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
          ]}
        >
          <Icone
            nome="check"
            tamanho={Math.round(tamanho * 0.6)}
            cor={cores.branco}
            espessura={3}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.xs,
  },
  ficha: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fichaDisponivel: {
    backgroundColor: cores.primaria,
  },
  fichaPendente: {
    backgroundColor: cores.alertaFundo,
    borderWidth: 1.5,
    borderColor: '#D98A00',
  },
  fichaUsada: {
    backgroundColor: '#C3CBDA',
  },
  barra: {
    height: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: raio.pilula,
    gap: 2,
  },
  segmento: {
    borderRadius: raio.pilula,
  },
  segmentoDisponivel: {
    backgroundColor: cores.primaria,
  },
  segmentoPendente: {
    backgroundColor: '#D98A00',
  },
  segmentoUsado: {
    backgroundColor: '#C3CBDA',
  },
});
