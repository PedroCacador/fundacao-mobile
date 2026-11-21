import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Screen } from '../../components/common/Screen';
import { SearchBar } from '../../components/common/SearchBar';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { UtilizationCard } from '../../components/history/UtilizationCard';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { useHistoryViewModel } from '../../viewmodels/useHistoryViewModel';

export default function HistoryView({ navigation }: RootScreenProps<'History'>) {
  const {
    busca,
    setBusca,
    buscaAtiva,
    lista,
    resumoTotal,
    carregando,
    erro,
    atualizando,
    tentarDeNovo,
    recarregar,
  } = useHistoryViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <PageHeader
        titulo="Histórico de Resgates"
        subtitulo="Todos os seus resgates dos últimos 6 meses, em qualquer status."
      />

      <SearchBar
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar por nome ou descrição do benefício..."
      />

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
            titulo="Nenhum resgate encontrado"
            texto={
              buscaAtiva
                ? 'Tente buscar por outro nome ou descrição de benefício.'
                : 'Quando você resgatar um benefício, ele aparece aqui.'
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
