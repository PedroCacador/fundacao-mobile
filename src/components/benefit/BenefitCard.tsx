import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BeneficioCatalogo } from '../../models/Catalog';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { calcularProximaRenovacao, descreverLimite, descreverValor } from '../../utils/benefit';
import { estiloCategoria } from '../../utils/category';
import { formatarData } from '../../utils/format';
import { Card } from '../common/Card';
import { Icone, IconBox } from '../common/Icon';
import { StatusBadge } from '../common/StatusBadge';

interface BenefitCardProps {
  item: BeneficioCatalogo;
  aoPressionar: () => void;
  resumido?: boolean;
}

export function BenefitCard({ item, aoPressionar, resumido = false }: BenefitCardProps) {
  const { beneficio, categoria, disponivel } = item;
  const estilo = estiloCategoria(categoria);
  const renovacao = calcularProximaRenovacao(beneficio);

  return (
    <Card aoPressionar={aoPressionar} estilo={styles.card} rotuloAcessivel={beneficio.nome}>
      <View style={styles.linha}>
        <IconBox nome={estilo.icone} cor={estilo.cor} fundo={estilo.fundo} />
        <View style={styles.info}>
          <View style={styles.topo}>
            <Text style={styles.titulo} numberOfLines={1}>
              {beneficio.nome}
            </Text>
            {resumido ? null : <StatusBadge status={disponivel ? 'DISPONIVEL' : 'INDISPONIVEL'} />}
          </View>
          {beneficio.descricao ? (
            <Text style={styles.descricao} numberOfLines={2}>
              {beneficio.descricao}
            </Text>
          ) : null}
          <View style={styles.chips}>
            <Text style={styles.chip}>{descreverValor(beneficio)}</Text>
            <Text style={styles.chip}>{descreverLimite(beneficio)}</Text>
          </View>
          {!resumido && renovacao ? (
            <View style={styles.rodape}>
              <Icone nome="calendar" tamanho={14} cor={cores.textoSecundario} />
              <Text style={styles.rodapeTexto}>Renovação em {formatarData(renovacao)}</Text>
            </View>
          ) : null}
        </View>
        <Icone nome="chevron-right" tamanho={22} cor={cores.textoFraco} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: espaco.md,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  info: {
    flex: 1,
    gap: espaco.xs,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.sm,
  },
  titulo: {
    flex: 1,
    fontSize: fonte.lg,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  descricao: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
    lineHeight: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.xs,
  },
  chip: {
    fontSize: fonte.xs,
    fontFamily: familia.semi,
    color: cores.primaria,
    backgroundColor: cores.primariaClara,
    paddingHorizontal: espaco.sm,
    paddingVertical: 2,
    borderRadius: raio.sm,
    overflow: 'hidden',
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
  },
  rodapeTexto: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
});
