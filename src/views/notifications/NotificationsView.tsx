import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { PageHeader } from '../../components/common/PageHeader';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { NotificationCard } from '../../components/notification/NotificationCard';
import { espaco } from '../../theme';
import {
  FiltroNotificacao,
  useNotificationsViewModel,
} from '../../viewmodels/useNotificationsViewModel';

const abas: TabOption<FiltroNotificacao>[] = [
  { id: 'TODAS', label: 'Todas' },
  { id: 'RENOVACAO', label: 'Renovação', icone: 'calendar' },
  { id: 'UTILIZACAO', label: 'Utilização', icone: 'circle-check' },
  { id: 'BENEFICIO', label: 'Benefícios', icone: 'gift' },
  { id: 'CAMPANHA', label: 'Campanhas', icone: 'megaphone' },
];

export default function NotificationsView() {
  const { lista, filtro, setFiltro, carregando, falhas, tentarFonte, textoVazio, indisponivel } =
    useNotificationsViewModel();

  return (
    <Screen>
      <PageHeader
        titulo="Notificações"
        subtitulo="Fique por dentro de tudo que acontece com seus benefícios e com a FCV."
      />
      <FilterTabs tabs={abas} selectedTab={filtro} onSelectTab={setFiltro} />

      {falhas.map((falha) => (
        <View key={falha.fonte} style={styles.erro}>
          <ErrorMessage mensagem={falha.mensagem} aoTentarDeNovo={() => tentarFonte(falha.fonte)} />
        </View>
      ))}

      {carregando ? (
        <Loading texto="Carregando notificações..." />
      ) : indisponivel ? (
        <EmptyState
          icone="circle-alert"
          titulo="Avisos indisponíveis"
          texto="Não conseguimos consultar estes avisos agora. Tente de novo em instantes."
        />
      ) : lista.length === 0 ? (
        <EmptyState icone="bell" titulo="Nenhuma notificação por aqui" texto={textoVazio} />
      ) : (
        lista.map((notificacao) => (
          <NotificationCard key={notificacao.id} notificacao={notificacao} />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  erro: {
    marginBottom: espaco.md,
  },
});
