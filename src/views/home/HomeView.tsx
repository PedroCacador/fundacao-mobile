import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { Screen } from '../../components/common/Screen';
import { SeeAllLink } from '../../components/common/SeeAllLink';
import { ShortcutCard } from '../../components/common/ShortcutCard';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { UserGreeting } from '../../components/common/UserGreeting';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { formatarData } from '../../utils/format';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

export default function HomeView({ navigation }: TabScreenProps<'Home'>) {
  const { nome, cargo, resumo, destaques, carregando, atualizando, erro, recarregar } =
    useHomeViewModel();

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

      <View style={styles.secaoTopo}>
        <Text style={styles.secaoTitulo}>Seus benefícios</Text>
        <SeeAllLink aoPressionar={() => navigation.navigate('Wallet')} />
      </View>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  atalhos: {
    flexDirection: 'row',
    gap: espaco.sm,
    marginBottom: espaco.xl,
  },
  secaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: espaco.md,
  },
  secaoTitulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.xxl,
    color: cores.texto,
  },
});
