import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Campanha } from '../../models/Campaign';
import { ItemCampanhaCatalogo } from '../../models/Catalog';
import { cores, coresCategoria, espaco, familia, fonte } from '../../theme';
import { descreverValor } from '../../utils/benefit';
import { NOME_TIPO_CAMPANHA } from '../../utils/campaign';
import { formatarData, lerData } from '../../utils/format';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Icone, IconBox } from '../common/Icon';

interface CampaignCardProps {
  campanha: Campanha;
  itens: ItemCampanhaCatalogo[];
  acaoDoItem?: (item: ItemCampanhaCatalogo) => React.ReactNode;
}

export function CampaignCard({ campanha, itens, acaoDoItem }: CampaignCardProps) {
  const inicio = formatarData(lerData(campanha.data_inicio));
  const fim = formatarData(lerData(campanha.data_fim));

  return (
    <Card estilo={styles.card}>
      <View style={styles.topo}>
        <IconBox nome="megaphone" tamanho={48} redondo {...coresCategoria.rosa} />
        <View style={styles.info}>
          <Chip pequeno texto={NOME_TIPO_CAMPANHA[campanha.tipo]} {...coresCategoria.rosa} />
          <Text style={styles.titulo}>{campanha.nome}</Text>
          {campanha.descricao ? <Text style={styles.texto}>{campanha.descricao}</Text> : null}
        </View>
      </View>

      <View style={styles.linha}>
        <Icone nome="calendar" tamanho={14} cor={cores.textoSecundario} />
        <Text style={styles.texto}>{inicio === fim ? inicio : `De ${inicio} até ${fim}`}</Text>
      </View>
      {campanha.patrocinador ? (
        <View style={styles.linha}>
          <Icone nome="building" tamanho={14} cor={cores.textoSecundario} />
          <Text style={styles.texto}>Patrocínio: {campanha.patrocinador}</Text>
        </View>
      ) : null}
      {campanha.criterio_elegibilidade ? (
        <View style={styles.linha}>
          <Icone nome="info" tamanho={14} cor={cores.textoSecundario} />
          <Text style={styles.texto}>{campanha.criterio_elegibilidade}</Text>
        </View>
      ) : null}

      {itens.map((dados) => (
        <View key={dados.item.id} style={styles.item}>
          <View style={styles.itemTopo}>
            <Text style={styles.itemNome}>{dados.item.nome}</Text>
            <Text style={styles.itemValor}>{descreverValor(dados.item)}</Text>
          </View>
          {dados.item.descricao ? <Text style={styles.texto}>{dados.item.descricao}</Text> : null}
          <View style={styles.linha}>
            <Icone nome="map-pin" tamanho={14} cor={cores.textoSecundario} />
            <Text style={styles.texto}>
              {dados.conveniados.length > 0
                ? dados.conveniados.map((conveniado) => conveniado.nome_fantasia).join(', ')
                : 'Nenhum estabelecimento ativo para este item.'}
            </Text>
          </View>
          {acaoDoItem ? acaoDoItem(dados) : null}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: espaco.sm,
    marginBottom: espaco.md,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.md,
    marginBottom: espaco.xs,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.xl,
    color: cores.texto,
  },
  texto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    lineHeight: 17,
    color: cores.textoSecundario,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
  },
  item: {
    gap: espaco.xs,
    paddingTop: espaco.md,
    marginTop: espaco.xs,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  itemTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.sm,
  },
  itemNome: {
    flex: 1,
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
  itemValor: {
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    color: cores.primaria,
  },
});
