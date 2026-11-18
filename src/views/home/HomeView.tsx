import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Button } from '../../components/common/Button';
import { Screen } from '../../components/common/Screen';
import { SectionHeader } from '../../components/common/SectionHeader';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { SummaryCard } from '../../components/common/SummaryCard';
import { TopBar } from '../../components/common/TopBar';
import { UserGreeting } from '../../components/common/UserGreeting';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { Card } from '../../components/common/Card';
import { lerDataHoraApi } from '../../utils/qrcode';

export default function HomeView({ navigation }: TabScreenProps<'Home'>) {
  const {
    nome,
    resumo,
    carregando,
    atualizando,
    recarregar,
    campanhasVigentes,
    carregandoCampanhas,
    erroCampanhas,
    tentarCampanhas,
    podeResgatar,
    pendentes,
    carregandoPendentes,
    erroPendentes,
    tentarPendentes,
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

      <View style={styles.secao}>
        <SectionHeader titulo="Benefícios aguardando validação" />
        {carregandoPendentes ? (
          <Loading texto="Carregando solicitações..." />
        ) : erroPendentes ? (
          <ErrorMessage mensagem={erroPendentes} aoTentarDeNovo={tentarPendentes} />
        ) : pendentes.length === 0 ? (
          <EmptyState
            icone="scan-qr-code"
            titulo="Nenhum benefício aguardando validação"
          />
        ) : (
          pendentes.map((item) => {
            const expiraEm = item.expira_em ? lerDataHoraApi(item.expira_em) : null;
            const restantesMs = expiraEm === null ? null : expiraEm - Date.now();
            const textoExpiracao =
              restantesMs === null
                ? 'Aguardando validação'
                : restantesMs <= 0
                  ? 'QR Code expirado'
                  : `Expira em ${Math.ceil(restantesMs / 60000)} min`;
            const parametros =
              item.origem === 'CAMPANHA'
                ? {
                    itemCampanhaId: item.item_campanha_id ?? undefined,
                    conveniadoId: item.conveniado_id,
                    utilizacaoId: item.id,
                  }
                : {
                    beneficioId: item.beneficio_id ?? undefined,
                    conveniadoId: item.conveniado_id,
                    utilizacaoId: item.id,
                  };

            return (
              <Card
                key={item.id}
                estilo={styles.pendente}
                aoPressionar={() => navigation.navigate('GerarQrCode', parametros)}
                rotuloAcessivel={`Abrir QR Code de ${item.beneficio_nome}`}
              >
                <View style={styles.pendenteTopo}>
                  <View style={styles.pendenteInfo}>
                    <Text style={styles.pendenteTitulo}>{item.beneficio_nome}</Text>
                    <Text style={styles.pendenteLocal}>{item.conveniado_nome_fantasia}</Text>
                  </View>
                  <Text style={styles.pendentePrazo}>{textoExpiracao}</Text>
                </View>
              </Card>
            );
          })
        )}
      </View>

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
  pendente: {
    marginBottom: espaco.md,
  },
  pendenteTopo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendenteInfo: {
    flex: 1,
  },
  pendenteTitulo: {
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
  pendenteLocal: {
    marginTop: 2,
    fontFamily: familia.regular,
    fontSize: fonte.md,
    color: cores.textoSecundario,
  },
  pendentePrazo: {
    marginLeft: espaco.md,
    fontFamily: familia.medio,
    fontSize: fonte.xs,
    color: cores.alerta,
  },
});
