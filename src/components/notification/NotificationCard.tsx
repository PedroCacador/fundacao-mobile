import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Notificacao, TipoNotificacao } from '../../models/Notification';
import { cores, coresCategoria, espaco, familia, fonte } from '../../theme';
import { aparenciaStatusUtilizacao } from '../../utils/utilization';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Icone, IconBox, NomeIcone } from '../common/Icon';

const aparencia: Record<
  TipoNotificacao,
  { icone: NomeIcone; rotulo: string; cor: string; fundo: string }
> = {
  RENOVACAO: { icone: 'calendar', rotulo: 'Renovação', ...coresCategoria.azul },
  UTILIZACAO: { icone: 'circle-check', rotulo: 'Utilização', ...coresCategoria.verde },
  BENEFICIO: { icone: 'gift', rotulo: 'Benefício', ...coresCategoria.roxo },
  CAMPANHA: { icone: 'megaphone', rotulo: 'Campanha', ...coresCategoria.rosa },
};

export function NotificationCard({ notificacao }: { notificacao: Notificacao }) {
  const tipo = aparencia[notificacao.tipo];
  const status = notificacao.statusUtilizacao
    ? aparenciaStatusUtilizacao[notificacao.statusUtilizacao]
    : null;
  const icone = status?.icone ?? tipo.icone;
  const cor = status?.cor ?? tipo.cor;
  const fundo = status?.fundo ?? tipo.fundo;

  return (
    <Card estilo={styles.card}>
      <IconBox nome={icone} cor={cor} fundo={fundo} tamanho={52} redondo />
      <View style={styles.info}>
        <View style={styles.topo}>
          <Chip pequeno texto={tipo.rotulo} cor={tipo.cor} fundo={tipo.fundo} />
          {notificacao.quando ? <Text style={styles.quando}>{notificacao.quando}</Text> : null}
        </View>
        <Text style={styles.titulo}>{notificacao.titulo}</Text>
        <Text style={styles.mensagem}>{notificacao.mensagem}</Text>
        <View style={styles.fonte}>
          <Icone nome="info" tamanho={12} cor={cores.textoFraco} />
          <Text style={styles.fonteTexto}>Fonte: {notificacao.fonte}</Text>
        </View>
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
  fonte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    marginTop: espaco.xs,
  },
  fonteTexto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
  },
});
