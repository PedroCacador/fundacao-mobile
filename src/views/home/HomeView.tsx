import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icone } from '../../components/common/Icon';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { Avatar } from '../../components/common/Avatar';
import { Screen } from '../../components/common/Screen';
import { ShortcutCard } from '../../components/common/ShortcutCard';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { formatarData } from '../../utils/format';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

export default function HomeView({ navigation }: TabScreenProps<'Home'>) {
  const { nome, cargo, resumo, destaques, carregando, atualizando, erro, recarregar } =
    useHomeViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar />

      <Pressable
        style={styles.perfil}
        onPress={() => navigation.navigate('Profile')}
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil"
      >
        <Avatar nome={nome} />
        <View style={styles.perfilInfo}>
          <Text style={styles.ola}>Olá,</Text>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.cargo}>{cargo}</Text>
        </View>
        <Icone nome="chevron-right" tamanho={24} cor={cores.textoFraco} />
      </Pressable>

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
          titulo="Locais"
          subtitulo="Onde usar seus benefícios"
          aoPressionar={() => navigation.navigate('Locations')}
        />
      </View>

      <View style={styles.secaoTopo}>
        <Text style={styles.secaoTitulo}>Seus benefícios</Text>
        <Pressable
          onPress={() => navigation.navigate('Wallet')}
          hitSlop={8}
          accessibilityRole="link"
        >
          <Text style={styles.verTodos}>Ver todos</Text>
        </Pressable>
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
  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    marginBottom: espaco.lg,
  },
  perfilInfo: {
    flex: 1,
  },
  ola: {
    fontSize: fonte.md,
    color: cores.textoSecundario,
  },
  nome: {
    fontSize: fonte.tituloTela,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  cargo: {
    fontSize: fonte.md,
    color: cores.textoSecundario,
  },
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
    fontSize: fonte.xxl,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  verTodos: {
    fontSize: fonte.md,
    fontFamily: familia.semi,
    color: cores.primaria,
  },
});
