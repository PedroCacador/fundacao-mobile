import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, NomeIcone } from './Icon';

interface PaginationProps {
  pagina: number;
  totalPaginas: number;
  aoAnterior: () => void;
  aoProxima: () => void;
  desabilitado?: boolean;
}

interface BotaoPaginaProps {
  icone: NomeIcone;
  rotulo: string;
  aoPressionar: () => void;
  bloqueado: boolean;
}

function BotaoPagina({ icone, rotulo, aoPressionar, bloqueado }: BotaoPaginaProps) {
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={bloqueado}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: bloqueado }}
      style={({ pressed }) => [
        styles.botao,
        bloqueado && styles.bloqueado,
        pressed && styles.pressionado,
      ]}
    >
      <Icone nome={icone} tamanho={20} cor={bloqueado ? cores.textoFraco : cores.primaria} />
    </Pressable>
  );
}

export function Pagination({
  pagina,
  totalPaginas,
  aoAnterior,
  aoProxima,
  desabilitado = false,
}: PaginationProps) {
  if (totalPaginas <= 1) return null;

  return (
    <View style={styles.linha}>
      <BotaoPagina
        icone="chevron-left"
        rotulo="Página anterior"
        aoPressionar={aoAnterior}
        bloqueado={desabilitado || pagina <= 1}
      />
      <Text style={styles.texto} accessibilityLiveRegion="polite">
        Página {pagina} de {totalPaginas}
      </Text>
      <BotaoPagina
        icone="chevron-right"
        rotulo="Próxima página"
        aoPressionar={aoProxima}
        bloqueado={desabilitado || pagina >= totalPaginas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.lg,
    marginTop: espaco.sm,
  },
  botao: {
    width: 40,
    height: 40,
    borderRadius: raio.pilula,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primariaClara,
  },
  bloqueado: {
    backgroundColor: cores.borda,
  },
  pressionado: {
    opacity: 0.7,
  },
  texto: {
    fontFamily: familia.medio,
    fontSize: fonte.base,
    color: cores.texto,
  },
});
