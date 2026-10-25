import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores, familia, fonte } from '../../theme';
import { Icone } from './Icon';

export function SeeAllLink({ aoPressionar }: { aoPressionar: () => void }) {
  return (
    <Pressable
      onPress={aoPressionar}
      hitSlop={8}
      accessibilityRole="link"
      style={({ pressed }) => [styles.link, pressed && styles.pressionado]}
    >
      <Text style={styles.texto}>Ver todos</Text>
      <Icone nome="chevron-right" tamanho={16} cor={cores.primaria} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pressionado: {
    opacity: 0.7,
  },
  texto: {
    fontFamily: familia.medio,
    fontSize: fonte.md,
    color: cores.primaria,
  },
});
