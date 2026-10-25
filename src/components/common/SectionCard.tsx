import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { cores, espaco, familia, fonte } from '../../theme';
import { Card } from './Card';
import { IconBox, NomeIcone } from './Icon';

const TAMANHO_ICONE = 48;
export const RECUO_SECAO = TAMANHO_ICONE + espaco.md;

interface SectionCardProps {
  icone: NomeIcone;
  titulo: string;
  subtitulo?: string;
  acao?: React.ReactNode;
  recuado?: boolean;
  onLayout?: ViewProps['onLayout'];
  children: React.ReactNode;
}

export function SectionCard({
  icone,
  titulo,
  subtitulo,
  acao,
  recuado = false,
  onLayout,
  children,
}: SectionCardProps) {
  return (
    <View onLayout={onLayout}>
      <Card estilo={styles.card}>
        <View style={styles.topo}>
          <IconBox nome={icone} tamanho={TAMANHO_ICONE} redondo />
          <View style={styles.textos}>
            <Text style={styles.titulo}>{titulo}</Text>
            {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
          </View>
          {acao ? <View style={styles.acao}>{acao}</View> : null}
        </View>
        <View style={[styles.corpo, recuado && styles.corpoRecuado]}>{children}</View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: espaco.md,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  textos: {
    flex: 1,
  },
  acao: {
    alignSelf: 'flex-start',
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.xl,
    color: cores.texto,
  },
  subtitulo: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    lineHeight: 16,
    color: cores.textoSecundario,
  },
  corpo: {
    marginTop: espaco.sm,
  },
  corpoRecuado: {
    marginTop: espaco.md,
    paddingLeft: RECUO_SECAO,
    gap: espaco.sm,
  },
});
