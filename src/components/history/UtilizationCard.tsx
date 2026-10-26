import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusUtilizacao, Utilizacao } from '../../models/Utilization';
import { cores, espaco, familia, fonte } from '../../theme';
import { estiloCategoria } from '../../utils/category';
import { formatarData, formatarHora, lerData } from '../../utils/format';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { IconBox, Icone, NomeIcone } from '../common/Icon';

const aparencia: Record<
  StatusUtilizacao,
  { rotulo: string; icone: NomeIcone; cor: string; fundo: string }
> = {
  APROVADA: { rotulo: 'Utilizado', icone: 'check', cor: cores.sucesso, fundo: cores.sucessoFundo },
  PENDENTE: {
    rotulo: 'Pendente',
    icone: 'chevron-right',
    cor: cores.primaria,
    fundo: cores.primariaClara,
  },
  REPROVADA: { rotulo: 'Reprovado', icone: 'x', cor: cores.erro, fundo: cores.erroFundo },
  ESTORNADA: { rotulo: 'Estornado', icone: 'x', cor: cores.textoSecundario, fundo: cores.borda },
};

interface UtilizationCardProps {
  utilizacao: Utilizacao;
  aoPressionar?: () => void;
}

export function UtilizationCard({ utilizacao, aoPressionar }: UtilizationCardProps) {
  const estilo = estiloCategoria(utilizacao.conveniado_categoria);
  const status = aparencia[utilizacao.status];
  return (
    <Card
      estilo={styles.card}
      aoPressionar={aoPressionar}
      rotuloAcessivel={`${utilizacao.beneficio_nome} em ${utilizacao.conveniado_nome_fantasia}`}
    >
      <View style={styles.topo}>
        <IconBox nome={estilo.icone} cor={estilo.cor} fundo={estilo.fundo} tamanho={52} redondo />
        <View style={styles.info}>
          <Text style={styles.titulo}>{utilizacao.beneficio_nome}</Text>
          <Text style={styles.conveniado}>{utilizacao.conveniado_nome_fantasia}</Text>
          <Text style={styles.endereco}>{utilizacao.conveniado_endereco}</Text>
        </View>
        {aoPressionar ? <Icone nome="chevron-right" tamanho={20} cor={cores.textoFraco} /> : null}
      </View>
      <View style={styles.rodape}>
        <View style={styles.linha}>
          <Icone nome="calendar" tamanho={15} cor={cores.primaria} />
          <Text style={styles.detalhe}>
            {formatarData(lerData(utilizacao.data_solicitacao))}{' '}
            {formatarHora(utilizacao.data_solicitacao)}
          </Text>
        </View>
        <View style={styles.linha}>
          <Icone nome="coins" tamanho={15} cor={cores.primaria} />
          <Text style={styles.detalhe}>- 1 utilização</Text>
        </View>
        <Chip
          pequeno
          texto={status.rotulo}
          icone={status.icone}
          cor={status.cor}
          fundo={status.fundo}
        />
      </View>
      {utilizacao.status === 'REPROVADA' && utilizacao.observacoes ? (
        <Text style={styles.observacao}>{utilizacao.observacoes}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: espaco.md,
    gap: espaco.md,
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
    fontFamily: familia.negrito,
    fontSize: fonte.lg,
    color: cores.texto,
  },
  conveniado: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  endereco: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  rodape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.sm,
    paddingTop: espaco.md,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
  },
  detalhe: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  observacao: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.erro,
  },
});
