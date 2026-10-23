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
  const {
    lista,
    filtro,
    setFiltro,
    contadores,
    resumo,
    carregando,
    atualizando,
    erro,
    recarregar,
  } = useWalletViewModel();

  const abas: TabOption<FiltroCarteira>[] = [
    { id: 'TODOS', label: 'Todos', count: contadores.TODOS },
    { id: 'DISPONIVEIS', label: 'Disponíveis', count: contadores.DISPONIVEIS },
    { id: 'INDISPONIVEIS', label: 'Indisponíveis', count: contadores.INDISPONIVEIS },
  ];

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar />
      <Header
        icone="wallet-outline"
        titulo="Carteira de Benefícios"
        subtitulo="Confira todos os seus benefícios e onde usar cada um."
      />

      <SummaryCard
        itens={[
          {
            icone: 'gift-outline',
            valor: carregando ? '-' : resumo.disponiveis,
            rotulo: 'Benefícios disponíveis',
          },
          {
            icone: 'storefront-outline',
            valor: carregando ? '-' : resumo.locais,
            rotulo: 'Locais conveniados',
          },
          {
            icone: 'calendar-month-outline',
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
          icone="wallet-outline"
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
