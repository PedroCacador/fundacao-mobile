import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte } from '../../theme';
import { IconBox, NomeIcone } from './Icon';

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
  icone: NomeIcone;
}

export function Header({ titulo, subtitulo, icone }: HeaderProps) {
  return (
    <View style={styles.header}>
      <IconBox nome={icone} tamanho={64} redondo />
      <View style={styles.textos}>
        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.lg,
    marginBottom: espaco.lg,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.tituloTela,
    color: cores.texto,
  },
  subtitulo: {
    fontFamily: familia.regular,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    marginTop: 2,
    lineHeight: 19,
  },
});
