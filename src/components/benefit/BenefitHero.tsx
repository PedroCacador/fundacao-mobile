import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BeneficioCatalogo } from '../../models/Catalog';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import {
  calcularProximaRenovacao,
  descreverLimite,
  descreverRenovacao,
  descreverValor,
} from '../../utils/benefit';
import { formatarData, plural } from '../../utils/format';
import { formatarTempoExpiracao } from '../../utils/qrcode';
import { UsoBeneficio } from '../../utils/usage';
import { Card } from '../common/Card';
import { Icone, IconBox, NomeIcone } from '../common/Icon';
import { StatusBadge } from '../common/StatusBadge';
import { UsageDots } from './UsageDots';

interface BenefitHeroProps {
  item: BeneficioCatalogo;
  uso: UsoBeneficio;
}

export function BenefitHero({ item, uso }: BenefitHeroProps) {
  const { beneficio } = item;
  const status =
    uso.pendentes > 0 ? 'PENDENTE' : uso.disponiveis > 0 ? 'DISPONIVEL' : 'INDISPONIVEL';
  const proximaRenovacao = uso.proximaData ?? calcularProximaRenovacao(beneficio);
  const renovacao =
    proximaRenovacao !== null ? formatarData(proximaRenovacao) : descreverRenovacao(beneficio);

  const textoFaixa =
    uso.segundosRestantes === null
      ? 'Aguardando validação'
      : `Expira em ${formatarTempoExpiracao(uso.segundosRestantes)}`;

  return (
    <Card estilo={styles.card}>
      <View style={styles.topo}>
        <IconBox nome="tag" tamanho={62} cor={cores.textoSecundario} fundo="#EDF0F5" />
        <View style={styles.info}>
          <StatusBadge status={status} ponto />
          <Text style={styles.titulo}>{beneficio.nome}</Text>
          {beneficio.descricao ? <Text style={styles.descricao}>{beneficio.descricao}</Text> : null}
        </View>
      </View>

      <View style={styles.metricas}>
        <Metrica
          icone="calendar"
          rotulo={proximaRenovacao ? 'Próxima renovação' : 'Regra de renovação'}
          valor={renovacao}
          extra={proximaRenovacao ? `Em ${diasRestantes(proximaRenovacao)}` : undefined}
        />
        <Metrica
          icone="ticket"
          rotulo="Usos permitidos"
          valor={descreverLimite(beneficio)}
          divisor
        />
        <Metrica
          icone="badge-percent"
          rotulo="Benefício"
          valor={descreverValor(beneficio)}
          divisor
        />
      </View>

      <View style={styles.divisoria} />

      <Text style={styles.rotuloUso}>Seus usos neste ciclo</Text>
      <View style={styles.uso}>
        <View style={styles.fichas}>
          <UsageDots
            disponiveis={uso.disponiveis}
            pendentes={uso.pendentes}
            usados={uso.usados}
            tamanho={20}
          />
        </View>
        <View style={styles.numeroUso}>
          <Text style={styles.numero}>
            {uso.disponiveis} de {uso.total}
          </Text>
          <Text style={styles.rotuloNumero}>usos disponíveis</Text>
        </View>
      </View>

      <View style={styles.legenda}>
        <Legenda cor={cores.primaria} texto="disponível" />
        {uso.pendentes > 0 ? <Legenda cor="#D98A00" texto="em andamento" /> : null}
        <Legenda cor="#C3CBDA" texto="usado" />
      </View>

      {status === 'PENDENTE' ? (
        <View style={[styles.faixa, styles.faixaPendente]}>
          <Icone nome="clock" tamanho={16} cor={cores.alerta} />
          <Text style={[styles.textoFaixa, styles.textoFaixaPendente]}>{textoFaixa}</Text>
        </View>
      ) : null}
    </Card>
  );
}

function diasRestantes(data: Date) {
  const hoje = new Date();
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const inicioData = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const dias = Math.max(0, Math.ceil((inicioData.getTime() - inicioHoje.getTime()) / 86400000));
  return `${dias} ${plural(dias, 'dia', 'dias')}`;
}

function Legenda({ cor, texto }: { cor: string; texto: string }) {
  return (
    <View style={styles.itemLegenda}>
      <View style={[styles.pontoLegenda, { backgroundColor: cor }]} />
      <Text style={styles.textoLegenda}>{texto}</Text>
    </View>
  );
}

interface MetricaProps {
  icone: NomeIcone;
  rotulo: string;
  valor: string;
  extra?: string;
  divisor?: boolean;
}

function Metrica({ icone, rotulo, valor, extra, divisor = false }: MetricaProps) {
  return (
    <View style={[styles.metrica, divisor && styles.metricaDivisor]}>
      <IconBox nome={icone} tamanho={28} redondo />
      <Text style={styles.rotuloMetrica}>{rotulo}</Text>
      <Text style={styles.valorMetrica}>{valor}</Text>
      {extra ? <Text style={styles.extraMetrica}>{extra}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: espaco.md,
    marginBottom: espaco.lg,
    padding: espaco.lg,
    borderRadius: 16,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  info: {
    flex: 1,
    gap: espaco.xs,
  },
  metricas: {
    flexDirection: 'row',
    paddingVertical: espaco.md,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: '#E7ECF3',
    backgroundColor: '#F8FAFD',
  },
  metrica: {
    flex: 1,
    minWidth: 0,
    gap: espaco.xs,
    paddingHorizontal: espaco.sm,
  },
  metricaDivisor: {
    borderLeftWidth: 1,
    borderLeftColor: cores.borda,
  },
  rotuloMetrica: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    lineHeight: 14,
    color: cores.textoSecundario,
  },
  valorMetrica: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
    lineHeight: 16,
    color: cores.texto,
  },
  extraMetrica: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    lineHeight: 13,
    color: cores.textoSecundario,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.xxl,
    lineHeight: 25,
    color: cores.texto,
  },
  descricao: {
    fontFamily: familia.regular,
    fontSize: fonte.base,
    color: cores.textoSecundario,
  },
  divisoria: {
    height: 1,
    backgroundColor: '#E7ECF3',
    marginTop: espaco.xs,
  },
  rotuloUso: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  uso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  fichas: {
    flex: 1,
  },
  numeroUso: {
    alignItems: 'flex-end',
  },
  numero: {
    fontFamily: familia.titulo,
    fontSize: fonte.xxl,
    color: cores.texto,
  },
  rotuloNumero: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.md,
  },
  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
  },
  pontoLegenda: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  textoLegenda: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  faixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    paddingVertical: espaco.md,
    paddingHorizontal: espaco.md,
    borderRadius: raio.md,
    backgroundColor: '#EBF0F8',
  },
  faixaPendente: {
    backgroundColor: cores.alertaFundo,
  },
  textoFaixa: {
    flex: 1,
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.primaria,
  },
  textoFaixaPendente: {
    color: cores.alerta,
  },
});
