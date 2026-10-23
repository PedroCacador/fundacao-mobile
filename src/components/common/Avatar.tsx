import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, peso } from '../../theme';

interface AvatarProps {
  nome: string;
  tamanho?: number;
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export function Avatar({ nome, tamanho = 64 }: AvatarProps) {
  return (
    <View
      style={[styles.avatar, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}
      accessibilityLabel={`Foto de ${nome}`}
    >
      <Text style={[styles.texto, { fontSize: tamanho * 0.36 }]}>{iniciais(nome)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: cores.primaria,
    fontWeight: peso.negrito,
  },
});
