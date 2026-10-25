import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BeneficioCatalogo } from '../../models/Catalog';
import { cores, espaco, familia, fonte } from '../../theme';
import { calcularProximaRenovacao, descreverLimite } from '../../utils/benefit';
import { estiloCategoria } from '../../utils/category';
import { formatarData } from '../../utils/format';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { Icone, IconBox } from '../common/Icon';
import { StatusBadge } from '../common/StatusBadge';

interface BenefitCardProps {
  item: BeneficioCatalogo;
  aoPressionar: () => void;
  aoVerRegras?: () => void;
  resumido?: boolean;
}

export function BenefitCard({
  item,
  aoPressionar,
  aoVerRegras,
  resumido = false,
}: BenefitCardProps) {
  const { beneficio, categoria, disponivel } = item;
  const estilo = estiloCategoria(categoria);
  const renovacao = calcularProximaRenovacao(beneficio);

  return (
    <Card aoPressionar={aoPressionar} estilo={styles.card} rotuloAcessivel={beneficio.nome}>
      <IconBox
        nome={estilo.icone}
        cor={estilo.cor}
        fundo={estilo.fundo}
        tamanho={resumido ? 54 : 46}
      />
      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={resumido ? 1 : 2}>
          {beneficio.nome}
        </Text>
        {beneficio.descricao ? (
          <Text style={styles.descricao} numberOfLines={2}>
            {beneficio.descricao}
          </Text>
        ) : null}
        {resumido ? (
          <View style={styles.chip}>
            <Chip texto={descreverLimite(beneficio)} />
          </View>
        ) : aoVerRegras ? (
          <Pressable
            onPress={aoVerRegras}
            hitSlop={6}
            accessibilityRole="link"
            style={styles.regras}
          >
            <Icone nome="info" tamanho={14} cor={cores.primaria} />
            <Text style={styles.regrasTexto}>Regras de utilização</Text>
          </Pressable>
        ) : null}
      </View>
      {resumido ? null : (
        <View style={styles.lateral}>
          <StatusBadge status={disponivel ? 'DISPONIVEL' : 'INDISPONIVEL'} />
          <Text style={styles.limite}>{descreverLimite(beneficio)}</Text>
          <View style={styles.renovacao}>
            <Icone nome="calendar" tamanho={14} cor={cores.textoSecundario} />
            <Text style={styles.renovacaoTexto}>
              {renovacao ? `Renovação em\n${formatarData(renovacao)}` : 'Renova após\no uso'}
            </Text>
          </View>
        </View>
      )}
      <Icone nome="chevron-right" tamanho={20} cor={cores.textoSecundario} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: espaco.md,
    paddingVertical: espaco.md + 2,
    paddingHorizontal: espaco.md,
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
  chip: {
    marginTop: espaco.xs,
  },
  regras: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: espaco.sm,
  },
  regrasTexto: {
    fontFamily: familia.medio,
    fontSize: fonte.xs,
    color: cores.primaria,
  },
  lateral: {
    width: 100,
    gap: 5,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: cores.borda,
  },
  limite: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  renovacao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  renovacaoTexto: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    lineHeight: 13,
    color: cores.textoSecundario,
  },
});
