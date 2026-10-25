import React from 'react';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { Header } from '../../components/common/Header';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { TabScreenProps } from '../../navigation/types';
import { formatarData } from '../../utils/format';
import { FiltroCarteira, useWalletViewModel } from '../../viewmodels/useWalletViewModel';

export default function WalletView({ navigation }: TabScreenProps<'Wallet'>) {
  const { lista, filtro, setFiltro, resumo, carregando, atualizando, erro, recarregar } =
    useWalletViewModel();

  const abas: TabOption<FiltroCarteira>[] = [
    { id: 'TODOS', label: 'Todos' },
    { id: 'DISPONIVEIS', label: 'Disponíveis' },
    { id: 'INDISPONIVEIS', label: 'Indisponíveis' },
  ];

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar />
      <Header
        icone="wallet"
        titulo="Carteira de Benefícios"
        subtitulo="Confira todos os seus benefícios e onde usar cada um."
      />

      <SummaryCard
        itens={[
          {
            icone: 'gift',
            valor: carregando ? '-' : resumo.disponiveis,
            rotulo: 'Benefícios disponíveis',
          },
          {
            icone: 'store',
            valor: carregando ? '-' : resumo.locais,
            rotulo: 'Locais conveniados',
          },
          {
            icone: 'calendar',
            valor: resumo.proximaRenovacao ? formatarData(resumo.proximaRenovacao) : '-',
            rotulo: 'Próxima renovação',
          },
        ]}
      />

      <FilterTabs tabs={abas} selectedTab={filtro} onSelectTab={setFiltro} />

      {carregando ? (
        <Loading texto="Carregando benefícios..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : lista.length === 0 ? (
        <EmptyState
          icone="wallet"
          titulo="Nenhum benefício encontrado"
          texto="Não há benefícios neste filtro."
        />
      ) : (
        lista.map((item) => (
          <BenefitCard
            key={item.beneficio.id}
            item={item}
            aoPressionar={() =>
              navigation.navigate('BenefitDetails', { beneficioId: item.beneficio.id })
            }
          />
        ))
      )}
    </Screen>
  );
}
