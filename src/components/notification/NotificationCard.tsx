import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Notificacao, TipoNotificacao } from '../../models/Notification';
import { cores, coresCategoria, espaco, familia, fonte } from '../../theme';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { IconBox, NomeIcone } from '../common/Icon';

const aparencia: Record<
  TipoNotificacao,
  { icone: NomeIcone; rotulo: string; cor: string; fundo: string }
> = {
  RENOVACAO: { icone: 'calendar', rotulo: 'Renovação', ...coresCategoria.azul },
  CAMPANHA: { icone: 'megaphone', rotulo: 'Campanha', ...coresCategoria.rosa },
};

export function NotificationCard({ notificacao }: { notificacao: Notificacao }) {
  const { icone, rotulo, cor, fundo } = aparencia[notificacao.tipo];
  return (
    <Card estilo={styles.card}>
      <IconBox nome={icone} cor={cor} fundo={fundo} tamanho={52} redondo />
      <View style={styles.info}>
        <View style={styles.topo}>
          <Chip pequeno texto={rotulo} cor={cor} fundo={fundo} />
          <Text style={styles.quando}>{notificacao.quando}</Text>
        </View>
        <Text style={styles.titulo}>{notificacao.titulo}</Text>
        <Text style={styles.mensagem}>{notificacao.mensagem}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.md,
    marginBottom: espaco.md,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.sm,
  },
  quando: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  titulo: {
    fontFamily: familia.semi,
    fontSize: fonte.lg,
    color: cores.texto,
  },
  mensagem: {
    fontFamily: familia.regular,
    fontSize: fonte.md,
    lineHeight: 18,
    color: cores.textoSecundario,
  },
});
