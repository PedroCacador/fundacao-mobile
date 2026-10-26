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
  { id: 'CAMPANHA', label: 'Campanhas', icone: 'megaphone' },
];

export default function NotificationsView() {
  
  const { lista, filtro, setFiltro, carregando, erro, tentarDeNovo } = useNotificationsViewModel();
  return (
    <Screen>
      <PageHeader
        titulo="Notificações"
        subtitulo="Fique por dentro de tudo que acontece com seus benefícios e com a FCV."
      />
      <FilterTabs tabs={abas} selectedTab={filtro} onSelectTab={setFiltro} />
      {erro ? (
        <View style={styles.erro}>
          <ErrorMessage mensagem={erro} aoTentarDeNovo={tentarDeNovo} />
        </View>
      ) : null}
      {carregando ? (
        <Loading texto="Carregando notificações..." />
      ) : lista.length === 0 ? (
        <EmptyState
          icone="bell"
          titulo="Nenhuma notificação por aqui"
          texto="Avisos de renovação e campanhas da FCV aparecem nesta tela."
        />
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
