import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, espaco, fonte, peso, raio } from '../../theme';
import { Button } from './Button';
import { NomeIcone } from './Icon';

export function Loading({ texto = 'Carregando...' }: { texto?: string }) {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

interface EmptyStateProps {
  icone: NomeIcone;
  titulo: string;
  texto?: string;
}

export function EmptyState({ icone, titulo, texto }: EmptyStateProps) {
  return (
    <View style={styles.centro}>
      <MaterialCommunityIcons name={icone} size={48} color={cores.textoFraco} />
      <Text style={styles.titulo}>{titulo}</Text>
      {texto ? <Text style={styles.texto}>{texto}</Text> : null}
    </View>
  );
}

interface ErrorMessageProps {
  mensagem: string;
  aoTentarDeNovo?: () => void;
}

export function ErrorMessage({ mensagem, aoTentarDeNovo }: ErrorMessageProps) {
  return (
    <View style={styles.erro} accessibilityRole="alert">
      <View style={styles.erroLinha}>
        <MaterialCommunityIcons name="alert-circle-outline" size={18} color={cores.erro} />
        <Text style={styles.erroTexto}>{mensagem}</Text>
      </View>
      {aoTentarDeNovo ? (
        <Button titulo="Tentar de novo" variante="secundaria" aoPressionar={aoTentarDeNovo} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espaco.xxl,
    paddingHorizontal: espaco.xl,
    gap: espaco.sm,
  },
  titulo: {
    fontSize: fonte.md,
    fontWeight: peso.semi,
    color: cores.texto,
    textAlign: 'center',
  },
  texto: {
    fontSize: fonte.sm,
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 18,
  },
  erro: {
    backgroundColor: cores.erroFundo,
    borderRadius: raio.md,
    padding: espaco.md,
    gap: espaco.md,
  },
  erroLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.sm,
  },
  erroTexto: {
    flex: 1,
    fontSize: fonte.sm,
    color: cores.erro,
    lineHeight: 18,
  },
});
