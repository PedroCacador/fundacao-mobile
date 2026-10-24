import React from 'react';
import { Header } from '../../components/common/Header';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/StateMessage';
import { TopBar } from '../../components/common/TopBar';

export default function HistoryView() {
  return (
    <Screen>
      <TopBar />
      <Header icone="history" titulo="Histórico" subtitulo="Suas utilizações de benefícios." />
      <EmptyState icone="progress-wrench" titulo="Tela em desenvolvimento" />
    </Screen>
  );
}
