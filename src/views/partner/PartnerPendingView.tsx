import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/common/Screen';
import { TopBar } from '../../components/common/TopBar';
import { IconBox } from '../../components/common/Icon';
import { cores, espaco, familia, fonte } from '../../theme';

export default function PartnerPendingView() {
  return (
    <Screen>
      <TopBar notificacoes={false} />
      <View style={styles.conteudo}>
        <IconBox nome="clock" tamanho={64} />
        <Text style={styles.titulo}>Solicitações Pendentes</Text>
        <Text style={styles.descricao}>
          Aqui você poderá visualizar e aprovar os resgates enviados pelo Totem ou pendentes de decisão.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espaco.xl,
    paddingVertical: espaco.xxl,
    gap: espaco.md,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.xl,
    color: cores.texto,
    textAlign: 'center',
  },
  descricao: {
    fontFamily: familia.regular,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 22,
  },
});
