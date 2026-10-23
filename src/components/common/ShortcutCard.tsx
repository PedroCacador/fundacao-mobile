import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, espaco, fonte, peso, raio, sombra } from '../../theme';
import { NomeIcone } from './Icon';

interface ShortcutCardProps {
  icone: NomeIcone;
  titulo: string;
  subtitulo: string;
  aoPressionar: () => void;
  destaque?: boolean;
}

export function ShortcutCard({
  icone,
  titulo,
  subtitulo,
  aoPressionar,
  destaque = false,
}: ShortcutCardProps) {
  const corPrincipal = destaque ? cores.branco : cores.primaria;

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      style={({ pressed }) => [
        styles.card,
        destaque && styles.destaque,
        pressed && styles.pressionado,
      ]}
    >
      <View style={styles.topo}>
        <MaterialCommunityIcons name={icone} size={26} color={corPrincipal} />
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={destaque ? cores.primariaClara : cores.textoFraco}
        />
      </View>
      <Text style={[styles.titulo, { color: destaque ? cores.branco : cores.texto }]}>
        {titulo}
      </Text>
      <Text style={[styles.subtitulo, destaque && styles.subtituloDestaque]}>{subtitulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 112,
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.md,
    gap: espaco.xs,
    ...sombra.card,
  },
  destaque: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  pressionado: {
    opacity: 0.85,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaco.sm,
  },
  titulo: {
    fontSize: fonte.sm,
    fontWeight: peso.negrito,
  },
  subtitulo: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
    lineHeight: 15,
  },
  subtituloDestaque: {
    color: cores.primariaClara,
  },
});
