import React from 'react';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/StateMessage';

export default function LocationsView() {
  return (
    <Screen bordas={['bottom']}>
      <EmptyState icone="construction" titulo="Tela em desenvolvimento" />
    </Screen>
  );
}
