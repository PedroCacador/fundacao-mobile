import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BenefitCard } from '../../components/benefit/BenefitCard';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Button } from '../../components/common/Button';
import { Screen } from '../../components/common/Screen';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { UserGreeting } from '../../components/common/UserGreeting';
import { TabScreenProps } from '../../navigation/types';
import { espaco } from '../../theme';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

export default function HomeView({ navigation }: TabScreenProps<'Home'>) {
  const {
    nome,
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
    podeResgatar,
  } = useHomeViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar perfil />

      <UserGreeting
        nome={nome}
        cargo=""
        tamanhoFoto={0}
        compacto
      />

      <SummaryCard
        titulo="Resumo dos seus benefícios"
        slogan="nenhum"
        itens={[
          {
            icone: 'gift',
            valor: carregando ? '-' : resumo.disponiveis,
            rotulo: 'Quantidade de benefícios disponíveis',
          },
          {
            icone: 'store',
            valor: carregando ? '-' : resumo.locais,
            rotulo: 'Quantidade de conveniados',
          },
        ]}
      />

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
            <CampaignCard
              key={campanha.id}
              campanha={campanha}
              itens={itens}
              acaoDoItem={(dados) =>
                podeResgatar(dados) ? (
                  <Button
                    titulo="Resgatar"
                    variante="secundaria"
                    icone="scan-qr-code"
                    aoPressionar={() =>
                      navigation.navigate('GerarQrCode', { itemCampanhaId: dados.item.id })
                    }
                  />
                ) : null
              }
            />
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  secao: {
    marginTop: espaco.lg,
  },
});
