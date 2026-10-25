import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cores, espaco, familia, fonte } from '../../theme';
import { Icone } from './Icon';

export function BackHeader({ titulo }: { titulo: string }) {
  const navigation = useNavigation();

  return (
    <View style={styles.barra}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        style={({ pressed }) => [styles.voltar, pressed && styles.pressionado]}
      >
        <Icone nome="chevron-left" tamanho={22} cor={cores.primaria} espessura={2} />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </Pressable>
      <Text style={styles.titulo} accessibilityRole="header" numberOfLines={1}>
        {titulo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xxl,
    minHeight: 44,
    marginBottom: espaco.md,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pressionado: {
    opacity: 0.7,
  },
  voltarTexto: {
    fontFamily: familia.medio,
    fontSize: fonte.lg,
    color: cores.primaria,
  },
  titulo: {
    flex: 1,
    fontFamily: familia.titulo,
    fontSize: fonte.xxl,
    color: cores.texto,
  },
});
