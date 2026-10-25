import React from 'react';
import { BackHeader } from '../../components/common/BackHeader';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/StateMessage';

export default function LocationsView() {
  return (
    <Screen>
      <BackHeader titulo="Locais de Utilização" />
      <EmptyState icone="construction" titulo="Tela em desenvolvimento" />
    </Screen>
  );
}
