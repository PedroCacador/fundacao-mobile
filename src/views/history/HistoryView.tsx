import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/common/Card';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { PageHeader } from '../../components/common/PageHeader';
import { Pagination } from '../../components/common/Pagination';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { UtilizationCard } from '../../components/history/UtilizationCard';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { aparenciaStatusUtilizacao, statusUtilizacao } from '../../utils/utilization';
import {
  FiltroStatusHistorico,
  PeriodoHistorico,
  periodos,
  useHistoryViewModel,
} from '../../viewmodels/useHistoryViewModel';

const abasPeriodo: TabOption<PeriodoHistorico>[] = periodos.map((opcao) => ({
  id: opcao.id,
  label: opcao.label,
  icone: 'calendar',
}));

const abasStatus: TabOption<FiltroStatusHistorico>[] = [
  { id: 'TODOS', label: 'Todos' },
  ...statusUtilizacao.map((status) => ({
    id: status,
    label: aparenciaStatusUtilizacao[status].rotulo,
    icone: aparenciaStatusUtilizacao[status].icone,
  })),
];

export default function HistoryView({ navigation }: TabScreenProps<'History'>) {
  const {
    periodo,
    setPeriodo,
    frasePeriodo,
    status,
    setStatus,
    lista,
    pagina,
    totalPaginas,
    resumoTotal,
    paginaAnterior,
    proximaPagina,
    carregando,
    erro,
    atualizando,
    tentarDeNovo,
    recarregar,
    carregandoPreferencias,
    erroPreferencias,
    tentarPreferencias,
  } = useHistoryViewModel();
  const rolagem = useRef<React.ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    rolagem.current?.scrollTo({ y: 0, animated: true });
  }, [pagina]);

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar} refRolagem={rolagem}>
      <PageHeader
        titulo="Histórico de Utilizações"
        subtitulo="Acompanhe todas as utilizações dos seus benefícios em um só lugar."
      />

      {erroPreferencias ? (
        <View style={styles.erro}>
          <ErrorMessage mensagem={erroPreferencias} aoTentarDeNovo={tentarPreferencias} />
        </View>
      ) : null}

      <FilterTabs
        tabs={abasPeriodo}
        selectedTab={periodo}
        onSelectTab={setPeriodo}
        desabilitado={carregandoPreferencias}
      />
      <FilterTabs tabs={abasStatus} selectedTab={status} onSelectTab={setStatus} />

      {erro ? (
        <View style={styles.erro}>
          <ErrorMessage mensagem={erro} aoTentarDeNovo={tentarDeNovo} />
        </View>
      ) : carregando ? (
        <Loading texto="Carregando histórico..." />
      ) : lista.length === 0 ? (
        <Card estilo={styles.cardVazio}>
          <EmptyState
            icone="history"
            titulo={`Nenhuma utilização ${frasePeriodo}`}
            texto={
              status === 'TODOS'
                ? 'Quando você usar um benefício em um estabelecimento conveniado, ele aparece aqui.'
                : 'Não há utilizações com este status no período escolhido.'
            }
          />
        </Card>
      ) : (
        <>
          <Text style={styles.total}>{resumoTotal}</Text>
          {lista.map((utilizacao) => {
            const beneficioId = utilizacao.beneficio_id;
            return (
              <UtilizationCard
                key={utilizacao.id}
                utilizacao={utilizacao}
                aoPressionar={
                  beneficioId
                    ? () => navigation.navigate('BenefitDetails', { beneficioId })
                    : undefined
                }
              />
            );
          })}
          <Pagination
            pagina={pagina}
            totalPaginas={totalPaginas}
            aoAnterior={paginaAnterior}
            aoProxima={proximaPagina}
            desabilitado={atualizando}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  erro: {
    marginBottom: espaco.md,
  },
  total: {
    fontFamily: familia.medio,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    marginBottom: espaco.md,
  },
  cardVazio: {
    marginBottom: espaco.md,
    paddingVertical: espaco.sm,
  },
});
