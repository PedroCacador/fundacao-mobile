import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BeneficioCatalogo } from '../../models/Catalog';
import { cores, espaco, familia, fonte, sombra } from '../../theme';
import { UsoBeneficio } from '../../utils/usage';
import { diasAte, formatarData, plural } from '../../utils/format';
import { formatarTempoExpiracao } from '../../utils/qrcode';
import { Card } from '../common/Card';
import { Icone, IconBox } from '../common/Icon';
import { StatusBadge } from '../common/StatusBadge';
import { UsageDots } from './UsageDots';

interface BenefitCardProps {
  item: BeneficioCatalogo;
  uso: UsoBeneficio | null;
  aoPressionar: () => void;
}

export function BenefitCard({ item, uso, aoPressionar }: BenefitCardProps) {
  const { beneficio } = item;
  const status = !uso
    ? item.disponivel
      ? 'DISPONIVEL'
      : 'INDISPONIVEL'
    : uso.pendentes > 0
      ? 'PENDENTE'
      : uso.disponiveis > 0
        ? 'DISPONIVEL'
        : 'INDISPONIVEL';

  let textoData = '';
  let iconeData: 'calendar' | 'clock' = 'calendar';
  if (!uso) {
    textoData = 'Usos indisponíveis';
  } else if (status === 'PENDENTE') {
    iconeData = 'clock';
    textoData =
      uso.segundosRestantes === null
        ? 'Aguardando validação'
        : `Expira em ${formatarTempoExpiracao(uso.segundosRestantes)}`;
  } else if (uso.proximaData) {
    const dias = diasAte(uso.proximaData);
    textoData =
      beneficio.tipo_janela === 'JANELA_MOVEL'
        ? `Próximo uso liberado em ${formatarData(uso.proximaData)} (em ${dias} ${plural(dias, 'dia', 'dias')})`
        : `Renova em ${formatarData(uso.proximaData)}`;
  }

  return (
    <Card aoPressionar={aoPressionar} estilo={styles.card} rotuloAcessivel={beneficio.nome}>
      <View style={styles.topo}>
        <IconBox nome="tag" tamanho={44} cor={cores.textoSecundario} fundo="#EDF0F5" />
        <View style={styles.info}>
          <Text style={styles.titulo} numberOfLines={2}>
            {beneficio.nome}
          </Text>
          {beneficio.descricao ? (
            <Text style={styles.descricao} numberOfLines={2}>
              {beneficio.descricao}
            </Text>
          ) : null}
        </View>
        <Icone nome="chevron-right" tamanho={20} cor={cores.textoSecundario} />
      </View>

      <View style={styles.divisoria} />

      <View style={styles.uso}>
        <View style={styles.indicador}>
          {uso ? (
            <UsageDots
              disponiveis={uso.disponiveis}
              pendentes={uso.pendentes}
              usados={uso.usados}
              tamanho={16}
              rotuloAcessivel={`${uso.disponiveis} disponíveis, ${uso.pendentes} em andamento`}
            />
          ) : null}
          {uso ? (
            <Text style={styles.contagem}>
              <Text style={uso.disponiveis > 0 ? styles.disponiveis : styles.indisponiveis}>
                {uso.disponiveis} {plural(uso.disponiveis, 'disponível', 'disponíveis')}
              </Text>
              {uso.pendentes > 0 ? (
                <>
                  {' · '}
                  <Text style={styles.pendentes}>
                    {uso.pendentes} {plural(uso.pendentes, 'em andamento', 'em andamento')}
                  </Text>
                </>
              ) : null}
            </Text>
          ) : null}
        </View>
        <StatusBadge status={status} ponto />
      </View>

      {textoData ? (
        <View style={[styles.data, status === 'PENDENTE' && styles.dataPendente]}>
          <Icone
            nome={iconeData}
            tamanho={14}
            cor={status === 'PENDENTE' ? cores.alerta : cores.textoSecundario}
          />
          <Text style={[styles.textoData, status === 'PENDENTE' && styles.textoPendente]}>
            {textoData}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: espaco.md,
    marginBottom: espaco.md,
    padding: espaco.lg,
    borderRadius: 14,
    ...sombra.card,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.lg,
    lineHeight: 20,
    color: cores.texto,
  },
  descricao: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    lineHeight: 17,
    color: cores.textoSecundario,
  },
  divisoria: {
    height: 1,
    backgroundColor: '#E7ECF3',
  },
  uso: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.sm,
  },
  indicador: {
    flex: 1,
    gap: espaco.sm,
  },
  contagem: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: '#475569',
  },
  disponiveis: {
    fontFamily: familia.semi,
    color: cores.primaria,
  },
  indisponiveis: {
    fontFamily: familia.semi,
    color: '#5B6B8A',
  },
  pendentes: {
    fontFamily: familia.semi,
    color: cores.alerta,
  },
  data: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
  },
  dataPendente: {
    marginTop: -espaco.xs,
  },
  textoData: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  textoPendente: {
    fontFamily: familia.semi,
    color: cores.alerta,
  },
});
