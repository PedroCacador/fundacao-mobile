import React from 'react';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/StateMessage';

export default function NotificationsView() {
  return (
    <Screen bordas={['bottom']}>
      <EmptyState icone="progress-wrench" titulo="Tela em desenvolvimento" />
    </Screen>
  );
}
