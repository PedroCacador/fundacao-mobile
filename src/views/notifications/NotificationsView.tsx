import React from 'react';
import { BackHeader } from '../../components/common/BackHeader';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/StateMessage';

export default function NotificationsView() {
  return (
    <Screen>
      <BackHeader titulo="Notificações" />
      <EmptyState icone="construction" titulo="Tela em desenvolvimento" />
    </Screen>
  );
}
