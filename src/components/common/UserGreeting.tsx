import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte } from '../../theme';
import { Avatar } from './Avatar';
import { Chip } from './Chip';
import { Icone } from './Icon';

interface UserGreetingProps {
  nome: string;
  cargo: string;
  tamanhoFoto: number;
  matricula?: string | null;
  aoPressionar?: () => void;
  compacto?: boolean;
}

export function UserGreeting({
  nome,
  cargo,
  tamanhoFoto,
  matricula,
  aoPressionar,
  compacto = false,
}: UserGreetingProps) {
  if (compacto) {
    return (
      <View style={styles.compacto}>
        <Text style={styles.olaCompacto} accessibilityRole="header">
          Olá, {nome}
        </Text>
      </View>
    );
  }

  const conteudo = (
    <>
      <Avatar nome={nome} tamanho={tamanhoFoto} />
      <View style={styles.info}>
        <Text style={styles.ola}>Olá,</Text>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.cargo}>{cargo}</Text>
        {matricula ? (
          <View style={styles.matricula}>
            <Chip icone="user" texto={`Matrícula: ${matricula}`} />
          </View>
        ) : null}
      </View>
      {aoPressionar ? <Icone nome="chevron-right" tamanho={22} cor={cores.texto} /> : null}
    </>
  );

  if (!aoPressionar) {
    return <View style={styles.linha}>{conteudo}</View>;
  }
  return (
    <Pressable
      style={styles.linha}
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel="Abrir perfil"
    >
      {conteudo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  compacto: {
    marginBottom: espaco.lg,
  },
  olaCompacto: {
    fontFamily: familia.tituloMedio,
    fontSize: fonte.lg,
    lineHeight: 20,
    color: cores.texto,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.lg,
    marginBottom: espaco.xl,
  },
  info: {
    flex: 1,
  },
  ola: {
    fontFamily: familia.regular,
    fontSize: fonte.base,
    color: cores.texto,
  },
  nome: {
    fontFamily: familia.titulo,
    fontSize: fonte.titulo,
    lineHeight: 28,
    color: cores.texto,
  },
  cargo: {
    fontFamily: familia.regular,
    fontSize: fonte.md,
    color: cores.textoSecundario,
  },
  matricula: {
    marginTop: espaco.sm,
  },
});
