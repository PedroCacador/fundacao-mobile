import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Screen } from '../../components/common/Screen';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ShortcutCard } from '../../components/common/ShortcutCard';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { UserGreeting } from '../../components/common/UserGreeting';
import { TabScreenProps } from '../../navigation/types';
import { espaco } from '../../theme';
import { formatarData } from '../../utils/format';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

export default function HomeView({ navigation }: TabScreenProps<'Home'>) {
  const {
    nome,
    cargo,
    resumo,
    destaques,
    carregando,
    atualizando,
    erro,
    recarregar,
    campanhasVigentes,
    carregandoCampanhas,
    erroCampanhas,
    tentarCampanhas,
  } = useHomeViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar perfil />

      <UserGreeting
        nome={nome}
        cargo={cargo}
        tamanhoFoto={68}
        aoPressionar={() => navigation.navigate('Profile')}
      />

      <SummaryCard
        titulo="Resumo dos seus benefícios"
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
            largo: true,
            icone: 'calendar',
            valor: resumo.proximaRenovacao ? formatarData(resumo.proximaRenovacao) : '-',
            rotulo: 'Próxima renovação',
          },
        ]}
      />

      <View style={styles.atalhos}>
        <ShortcutCard
          destaque
          icone="wallet"
          titulo="Minha Carteira"
          subtitulo="Veja seus benefícios"
          aoPressionar={() => navigation.navigate('Wallet')}
        />
        <ShortcutCard
          icone="history"
          titulo="Histórico"
          subtitulo="Suas utilizações"
          aoPressionar={() => navigation.navigate('History')}
        />
        <ShortcutCard
          icone="map-pin"
          titulo="Locais de utilização"
          subtitulo="Encontre estabelecimentos perto de você"
          aoPressionar={() => navigation.navigate('Locations')}
        />
      </View>

      <SectionHeader titulo="Seus benefícios" aoVerTodos={() => navigation.navigate('Wallet')} />

      {carregando ? (
        <Loading texto="Carregando benefícios..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : destaques.length === 0 ? (
        <EmptyState icone="gift" titulo="Nenhum benefício disponível no momento" />
      ) : (
        destaques.map((item) => (
          <BenefitCard
            key={item.beneficio.id}
            item={item}
            resumido
            aoPressionar={() =>
              navigation.navigate('BenefitDetails', { beneficioId: item.beneficio.id })
            }
          />
        ))
      )}

      <View style={styles.secao}>
        <SectionHeader titulo="Campanhas e eventos" />
        {carregandoCampanhas ? (
          <Loading texto="Carregando campanhas..." />
        ) : erroCampanhas ? (
          <ErrorMessage mensagem={erroCampanhas} aoTentarDeNovo={tentarCampanhas} />
        ) : campanhasVigentes.length === 0 ? (
          <EmptyState
            icone="megaphone"
            titulo="Nenhuma campanha ou evento vigente no momento"
            texto="Quando a FCV abrir uma campanha, ela aparece aqui com os itens disponíveis."
          />
        ) : (
          campanhasVigentes.map(({ campanha, itens }) => (
            <CampaignCard key={campanha.id} campanha={campanha} itens={itens} />
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  atalhos: {
    flexDirection: 'row',
    gap: espaco.sm,
    marginBottom: espaco.xl,
  },
  secao: {
    marginTop: espaco.lg,
  },
});
