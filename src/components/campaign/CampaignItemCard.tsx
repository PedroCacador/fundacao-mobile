import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ItemCampanhaCatalogo } from '../../models/Catalog';
import { cores, coresCategoria, espaco, familia, fonte } from '../../theme';
import { descreverValor } from '../../utils/benefit';
import { formatarData, lerData } from '../../utils/format';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Icone, IconBox } from '../common/Icon';
import { StatusBadge, StatusVisual } from '../common/StatusBadge';

interface CampaignItemCardProps {
  dados: ItemCampanhaCatalogo;
  status: StatusVisual;
  ultimaUtilizacao?: string | null;
  acao?: React.ReactNode;
}

export function CampaignItemCard({ dados, status, ultimaUtilizacao, acao }: CampaignItemCardProps) {
  const { item, campanha, conveniados, situacao } = dados;
  const fim = formatarData(lerData(campanha.data_fim));
  const expirado = situacao === 'EXPIRADA';

  return (
    <Card estilo={[styles.card, expirado && styles.cardExpirado]}>
      <View style={styles.linha}>
        <IconBox nome="megaphone" tamanho={46} {...coresCategoria.rosa} />
        <View style={styles.info}>
          <Chip pequeno texto={campanha.nome} {...coresCategoria.rosa} />
          <Text style={styles.titulo} numberOfLines={2}>
            {item.nome}
          </Text>
          {item.descricao ? (
            <Text style={styles.descricao} numberOfLines={2}>
              {item.descricao}
            </Text>
          ) : null}
          <Text style={styles.valor}>{descreverValor(item)}</Text>
        </View>
        <View style={styles.lateral}>
          <StatusBadge status={status} />
          <View style={styles.detalhe}>
            <Icone nome="calendar" tamanho={14} cor={cores.textoSecundario} />
            <Text style={styles.detalheTexto}>
              {expirado ? `Encerrada em\n${fim}` : `Válida até\n${fim}`}
            </Text>
          </View>
          {ultimaUtilizacao ? (
            <View style={styles.detalhe}>
              <Icone nome="circle-check" tamanho={14} cor={cores.primaria} />
              <Text style={styles.detalheTexto}>{`Último uso em\n${ultimaUtilizacao}`}</Text>
            </View>
          ) : null}
        </View>
      </View>
      {conveniados.length > 0 ? (
        <View style={styles.locais}>
          <Icone nome="map-pin" tamanho={14} cor={cores.textoSecundario} />
          <Text style={styles.locaisTexto} numberOfLines={2}>
            {conveniados.map((conveniado) => conveniado.nome_fantasia).join(', ')}
          </Text>
        </View>
      ) : null}
      {acao}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: espaco.md,
    marginBottom: espaco.md,
    paddingVertical: espaco.md + 2,
    paddingHorizontal: espaco.md,
  },
  cardExpirado: {
    backgroundColor: cores.fundo,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  titulo: {
    fontFamily: familia.semi,
    fontSize: fonte.lg,
    color: cores.texto,
  },
  descricao: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
    lineHeight: 16,
  },
  valor: {
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    color: cores.primaria,
  },
  lateral: {
    width: 100,
    gap: 5,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: cores.borda,
  },
  detalhe: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  detalheTexto: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    lineHeight: 13,
    color: cores.textoSecundario,
  },
  locais: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    paddingTop: espaco.sm,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  locaisTexto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
});
