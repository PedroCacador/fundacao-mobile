import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte } from '../../theme';
import { SeeAllLink } from './SeeAllLink';

interface SectionHeaderProps {
  titulo: string;
  aoVerTodos?: () => void;
}

export function SectionHeader({ titulo, aoVerTodos }: SectionHeaderProps) {
  return (
    <View style={styles.topo}>
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {aoVerTodos ? <SeeAllLink aoPressionar={aoVerTodos} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaco.md,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.xxl,
    color: cores.texto,
  },
});
