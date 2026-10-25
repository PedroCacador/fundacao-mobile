import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BeneficioCatalogo } from '../../models/Catalog';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { estiloCategoria } from '../../utils/category';
import { Card } from '../common/Card';
import { IconBox, NomeIcone } from '../common/Icon';
import { StatusBadge } from '../common/StatusBadge';

interface BenefitHeroProps {
  item: BeneficioCatalogo;
  renovacao: string;
  emQuantosDias: string | null;
  limite: string;
  valor: string;
}

export function BenefitHero({ item, renovacao, emQuantosDias, limite, valor }: BenefitHeroProps) {
  const { beneficio, categoria, disponivel } = item;
  const estilo = estiloCategoria(categoria);

  return (
    <Card estilo={styles.card}>
      <View style={styles.topo}>
        <IconBox nome={estilo.icone} cor={estilo.cor} fundo={estilo.fundo} tamanho={64} />
        <View style={styles.info}>
          <StatusBadge status={disponivel ? 'DISPONIVEL' : 'INDISPONIVEL'} ponto />
          <Text style={styles.titulo}>{beneficio.nome}</Text>
          {beneficio.descricao ? <Text style={styles.descricao}>{beneficio.descricao}</Text> : null}
        </View>
      </View>
      <View style={styles.metricas}>
        <Metrica
          largo
          icone="calendar"
          rotulo="Próxima renovação"
          valor={renovacao}
          extra={emQuantosDias}
        />
        <Metrica divisor icone="ticket" rotulo="Usos permitidos" valor={limite} />
        <Metrica divisor icone="badge-percent" rotulo="Benefício" valor={valor} />
      </View>
    </Card>
  );
}

interface MetricaProps {
  icone: NomeIcone;
  rotulo: string;
  valor: string;
  extra?: string | null;
  divisor?: boolean;
  largo?: boolean;
}

function Metrica({ icone, rotulo, valor, extra, divisor = false, largo = false }: MetricaProps) {
  return (
    <View style={[styles.metrica, largo && styles.metricaLarga, divisor && styles.divisor]}>
      <IconBox nome={icone} tamanho={28} redondo />
      <View style={styles.metricaTextos}>
        <Text style={styles.rotulo}>{rotulo}</Text>
        <Text style={styles.valor}>{valor}</Text>
        {extra ? <Text style={styles.extra}>{extra}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: espaco.lg,
    padding: 0,
    overflow: 'hidden',
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.lg,
    padding: espaco.lg,
  },
  info: {
    flex: 1,
    gap: espaco.xs,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.titulo,
    lineHeight: 28,
    color: cores.texto,
  },
  descricao: {
    fontFamily: familia.regular,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    lineHeight: 18,
  },
  metricas: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: espaco.md,
    paddingHorizontal: 2,
    backgroundColor: cores.superficie,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  metrica: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    paddingHorizontal: 5,
  },
  metricaLarga: {
    flex: 1.25,
  },
  divisor: {
    borderLeftWidth: 1,
    borderLeftColor: cores.borda,
  },
  metricaTextos: {
    flex: 1,
  },
  rotulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
  },
  valor: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.texto,
    marginTop: 1,
  },
  extra: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
  },
});
