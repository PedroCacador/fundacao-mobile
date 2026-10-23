import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { cores, espaco, raio, sombra } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  aoPressionar?: () => void;
  estilo?: StyleProp<ViewStyle>;
  rotuloAcessivel?: string;
}

export function Card({ children, aoPressionar, estilo, rotuloAcessivel }: CardProps) {
  if (!aoPressionar) {
    return <View style={[styles.card, estilo]}>{children}</View>;
  }
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      style={({ pressed }) => [styles.card, estilo, pressed && styles.pressionado]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    padding: espaco.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    ...sombra.card,
  },
  pressionado: {
    opacity: 0.8,
  },
});
