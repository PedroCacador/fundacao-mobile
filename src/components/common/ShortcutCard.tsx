import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, NomeIcone } from './Icon';

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
        <View style={[styles.icone, destaque && styles.iconeSemFundo]}>
          <Icone nome={icone} tamanho={22} cor={corPrincipal} />
        </View>
        <Icone
          nome="chevron-right"
          tamanho={16}
          cor={destaque ? cores.branco : cores.textoSecundario}
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
    minHeight: 118,
    backgroundColor: cores.azulSuave,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaAzul,
    padding: 10,
    gap: 2,
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
    marginBottom: espaco.md,
  },
  icone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeSemFundo: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
  },
  subtitulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
    lineHeight: 14,
  },
  subtituloDestaque: {
    color: cores.primariaClara,
  },
});
