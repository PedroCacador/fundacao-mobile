import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { Header } from '../../components/common/Header';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { TopBar } from '../../components/common/TopBar';
import { TabScreenProps } from '../../navigation/types';
import { espaco } from '../../theme';
import { useWalletViewModel } from '../../viewmodels/useWalletViewModel';

export default function WalletView({ navigation }: TabScreenProps<'Wallet'>) {
  const { lista, carregando, atualizando, erro, recarregar, erroUtilizacoes, tentarUtilizacoes } =
    useWalletViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar voltar perfil />
      <Header
        icone="wallet"
        titulo="Carteira de Benefícios"
        subtitulo="Confira todos os seus benefícios e acompanhe a validade de cada um."
      />

      {erroUtilizacoes ? (
        <View style={styles.aviso}>
          <ErrorMessage mensagem={erroUtilizacoes} aoTentarDeNovo={tentarUtilizacoes} />
        </View>
      ) : null}

      {carregando ? (
        <Loading texto="Carregando benefícios..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : lista.length === 0 ? (
        <EmptyState
          icone="wallet"
          titulo="Nada por aqui"
          texto="Não há benefícios ativos disponíveis no momento."
        />
      ) : (
        lista.map((entrada) => (
          <BenefitCard
            key={entrada.chave}
            item={entrada.catalogo}
            ultimaUtilizacao={entrada.ultimaUtilizacao}
            aoPressionar={() =>
              navigation.navigate('BenefitDetails', {
                beneficioId: entrada.catalogo.beneficio.id,
              })
            }
            aoVerRegras={() =>
              navigation.navigate('BenefitDetails', {
                beneficioId: entrada.catalogo.beneficio.id,
                aba: 'REGRAS',
              })
            }
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  aviso: {
    marginBottom: espaco.md,
  },
});
