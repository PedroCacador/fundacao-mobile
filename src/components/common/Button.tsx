import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, NomeIcone } from './Icon';

type Variante = 'primaria' | 'secundaria' | 'perigo';

interface ButtonProps {
  titulo: string;
  aoPressionar: () => void;
  variante?: Variante;
  icone?: NomeIcone;
  carregando?: boolean;
  desabilitado?: boolean;
  estilo?: StyleProp<ViewStyle>;
}

export function Button({
  titulo,
  aoPressionar,
  variante = 'primaria',
  icone,
  carregando = false,
  desabilitado = false,
  estilo,
}: ButtonProps) {
  const corTexto =
    variante === 'primaria' ? cores.branco : variante === 'perigo' ? cores.erro : cores.primaria;
  const bloqueado = desabilitado || carregando;

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      style={({ pressed }) => [
        styles.base,
        styles[variante],
        pressed && styles.pressionado,
        bloqueado && styles.bloqueado,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <>
          <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
          {icone ? <Icone nome={icone} tamanho={20} cor={corTexto} espessura={2} /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: raio.pilula,
    paddingHorizontal: espaco.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
  },
  primaria: {
    backgroundColor: cores.primaria,
  },
  secundaria: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  perigo: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.erroFundo,
  },
  pressionado: {
    opacity: 0.85,
  },
  bloqueado: {
    opacity: 0.6,
  },
  texto: {
    fontFamily: familia.semi,
    fontSize: fonte.xl,
  },
});
