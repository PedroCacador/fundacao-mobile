import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/common/Card';
import { Chip } from '../../components/common/Chip';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { Header } from '../../components/common/Header';
import { Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { formatarData, formatarHora, formatarMoeda, lerData } from '../../utils/format';
import { aparenciaStatusUtilizacao } from '../../utils/utilization';
import {
  FiltroStatusHistorico,
  usePartnerHistoryViewModel,
} from '../../viewmodels/usePartnerHistoryViewModel';

const abasFiltro: TabOption<FiltroStatusHistorico>[] = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'APROVADA', label: 'Aprovados', icone: 'check' },
  { id: 'REPROVADA', label: 'Reprovados', icone: 'x' },
];

export default function PartnerHistoryView() {
  const {
    historico,
    carregando,
    atualizando,
    erro,
    filtro,
    setFiltro,
    resumo,
    recarregar,
  } = usePartnerHistoryViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar notificacoes={false} />

      <Header
        icone="history"
        titulo="Histórico de Resgates"
        subtitulo="Consulte todos os resgates atendidos no seu estabelecimento."
      />

      <SummaryCard
        itens={[
          {
            icone: 'check',
            valor: resumo.aprovadas,
            rotulo: 'Aprovados',
            cor: cores.sucesso,
            fundo: cores.sucessoFundo,
          },
          {
            icone: 'coins',
            valor: formatarMoeda(resumo.valorTotal),
            rotulo: 'Total aprovado',
            largo: true,
          },
          {
            icone: 'x',
            valor: resumo.reprovadas,
            rotulo: 'Reprovados',
            cor: cores.erro,
            fundo: cores.erroFundo,
          },
        ]}
      />

      <View style={styles.secaoFiltros}>
        <FilterTabs
          tabs={abasFiltro}
          selectedTab={filtro}
          onSelectTab={setFiltro}
          desabilitado={carregando}
        />
      </View>

      {carregando ? (
        <Loading texto="Carregando histórico de atendimentos..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : historico.length === 0 ? (
        <EmptyState
          icone="history"
          titulo="Nenhum atendimento encontrado"
          texto={
            filtro === 'TODOS'
              ? 'Nenhuma utilização foi registrada neste estabelecimento até o momento.'
              : `Não há resgates com status "${filtro}" no histórico.`
          }
        />
      ) : (
        <View style={styles.lista}>
          <Text style={styles.contadorTexto}>
            {historico.length} {historico.length === 1 ? 'registro encontrado' : 'registros encontrados'}
          </Text>

          {historico.map((item) => {
            const visual = aparenciaStatusUtilizacao[item.status] ?? aparenciaStatusUtilizacao.APROVADA;
            return (
              <Card key={item.id} estilo={styles.cardItem}>
                <View style={styles.cardTopo}>
                  <Chip
                    pequeno
                    texto={visual.rotulo}
                    icone={visual.icone}
                    cor={visual.cor}
                    fundo={visual.fundo}
                  />
                  <Text style={styles.dataTexto}>
                    {formatarData(lerData(item.data_solicitacao))} às{' '}
                    {formatarHora(item.data_solicitacao)}
                  </Text>
                </View>

                <View style={styles.divisoria} />

                <View style={styles.infoLinha}>
                  <Icone nome="user" tamanho={18} cor={cores.primaria} />
                  <View style={styles.infoTextos}>
                    <Text style={styles.rotulo}>Colaborador</Text>
                    <Text style={styles.valor}>{item.colaborador_nome}</Text>
                  </View>
                </View>

                <View style={styles.infoLinha}>
                  <Icone nome="gift" tamanho={18} cor={cores.primaria} />
                  <View style={styles.infoTextos}>
                    <Text style={styles.rotulo}>Benefício</Text>
                    <Text style={styles.valor}>{item.beneficio_nome}</Text>
                  </View>
                </View>

                <View style={styles.infoLinha}>
                  <Icone nome="coins" tamanho={18} cor={cores.primaria} />
                  <View style={styles.infoTextos}>
                    <Text style={styles.rotulo}>Valor</Text>
                    <Text style={styles.valorDestaque}>
                      {formatarMoeda(item.valor_aplicado)}
                    </Text>
                  </View>
                </View>

                {item.observacoes ? (
                  <View style={styles.observacaoBox}>
                    <Text style={styles.rotulo}>Observações:</Text>
                    <Text style={styles.valorSecundario}>{item.observacoes}</Text>
                  </View>
                ) : null}

                <View style={styles.cardRodape}>
                  <View style={styles.canalBox}>
                    <Icone
                      nome={item.canal_validacao === 'TERMINAL_IOT' ? 'credit-card' : 'store'}
                      tamanho={14}
                      cor={cores.textoSecundario}
                    />
                    <Text style={styles.canalTexto}>
                      {item.canal_validacao === 'TERMINAL_IOT'
                        ? 'Validado via Totem IoT'
                        : 'Validado via App Conveniado'}
                    </Text>
                  </View>
                  <Text style={styles.idTexto}>#{item.id}</Text>
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  secaoFiltros: {
    marginVertical: espaco.md,
  },
  lista: {
    gap: espaco.md,
    marginTop: espaco.xs,
  },
  contadorTexto: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  cardItem: {
    gap: espaco.sm,
    padding: espaco.lg,
  },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataTexto: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  divisoria: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: 4,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  infoTextos: {
    flex: 1,
  },
  rotulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  valor: {
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
  valorDestaque: {
    fontFamily: familia.titulo,
    fontSize: fonte.titulo,
    color: cores.primaria,
  },
  valorSecundario: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  observacaoBox: {
    backgroundColor: cores.azulSuave,
    padding: espaco.sm,
    borderRadius: raio.sm,
    gap: 2,
    marginTop: 2,
  },
  cardRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: espaco.xs,
    paddingTop: espaco.xs,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  canalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  canalTexto: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  idTexto: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
    color: cores.textoFraco,
  },
});
