import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, fonte, peso } from '../../theme';
import { IconBox, NomeIcone } from './Icon';

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
  icone: NomeIcone;
}

export function Header({ titulo, subtitulo, icone }: HeaderProps) {
  return (
    <View style={styles.header}>
      <IconBox nome={icone} tamanho={52} redondo />
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
    gap: espaco.md,
    marginBottom: espaco.lg,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: fonte.xl,
    fontWeight: peso.negrito,
    color: cores.texto,
  },
  subtitulo: {
    fontSize: fonte.sm,
    color: cores.textoSecundario,
    marginTop: 2,
    lineHeight: 18,
  },
});
