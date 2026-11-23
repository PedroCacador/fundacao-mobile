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
import { cores, coresCategoria, espaco, familia, fonte, raio, sombra } from '../../theme';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { Card } from '../../components/common/Card';
import { lerDataHoraApi } from '../../utils/qrcode';
import { IconBox, Icone } from '../../components/common/Icon';

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

  const [agora] = React.useState(() => Date.now());

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
            cor: cores.primaria,
            fundo: cores.primariaClara,
          },
          {
            icone: 'store',
            valor: carregando ? '-' : resumo.locais,
            rotulo: 'Quantidade de conveniados',
            cor: coresCategoria.verde.cor,
            fundo: coresCategoria.verde.fundo,
          },
        ]}
      />

      <View style={styles.secao}>
        <SectionHeader titulo="Benefícios aguardando validação" />
        <Text style={styles.subtituloPendentes}>
          Apresente seu QR Code no estabelecimento para concluir o resgate.
        </Text>
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
            const dataExpiracao = item.data_expiracao ?? item.expira_em;
            const expiraEm = dataExpiracao ? lerDataHoraApi(dataExpiracao) : null;
            const restantesMs = expiraEm === null ? null : expiraEm - agora;
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
                <View style={styles.pendenteConteudo}>
                  <View style={styles.pendenteTopo}>
                    <IconBox
                      nome="scan-qr-code"
                      tamanho={48}
                      cor={cores.primaria}
                      fundo={cores.primariaClara}
                      redondo
                    />
                    <View style={styles.pendenteInfo}>
                      <Text style={styles.pendenteRotulo}>RESGATE PENDENTE</Text>
                      <Text style={styles.pendenteTitulo}>{item.beneficio_nome}</Text>
                    </View>
                  </View>
                  <View style={styles.pendenteLocalLinha}>
                    <Icone nome="map-pin" tamanho={15} cor={cores.textoSecundario} />
                    <Text style={styles.pendenteLocal} numberOfLines={1}>
                      {item.conveniado_nome_fantasia}
                    </Text>
                  </View>
                  <View style={styles.pendenteRodape}>
                    <View
                      style={[
                        styles.pendenteEstado,
                        restantesMs !== null && restantesMs <= 0 && styles.pendenteEstadoExpirado,
                      ]}
                    >
                      <Icone
                        nome={restantesMs !== null && restantesMs <= 0 ? 'circle-alert' : 'clock'}
                        tamanho={14}
                        cor={restantesMs !== null && restantesMs <= 0 ? cores.erro : cores.alerta}
                      />
                      <Text
                        style={[
                          styles.pendentePrazo,
                          restantesMs !== null && restantesMs <= 0 && styles.pendentePrazoExpirado,
                        ]}
                      >
                        {textoExpiracao}
                      </Text>
                    </View>
                    <View style={styles.pendenteAbrir}>
                      <Text style={styles.pendenteAbrirTexto}>Abrir QR Code</Text>
                      <Icone nome="chevron-right" tamanho={17} cor={cores.primaria} />
                    </View>
                  </View>
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
    marginBottom: espaco.sm,
  },
  pendente: {
    marginBottom: espaco.md,
    padding: 0,
    borderColor: cores.bordaAzul,
    borderRadius: raio.lg,
    ...sombra.card,
  },
  subtituloPendentes: {
    marginTop: -espaco.sm,
    marginBottom: espaco.md,
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    lineHeight: 18,
    color: cores.textoSecundario,
  },
  pendenteConteudo: {
    gap: espaco.md,
    padding: espaco.lg,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
    borderRadius: raio.lg,
  },
  pendenteTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  pendenteInfo: {
    flex: 1,
    gap: 3,
  },
  pendenteRotulo: {
    fontFamily: familia.semi,
    fontSize: fonte.xxs,
    letterSpacing: 0.8,
    color: cores.primariaMedia,
  },
  pendenteTitulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.lg,
    lineHeight: 21,
    color: cores.texto,
  },
  pendenteLocalLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    paddingLeft: 2,
  },
  pendenteLocal: {
    fontFamily: familia.regular,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    flex: 1,
  },
  pendenteRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.sm,
    paddingTop: espaco.md,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  pendenteEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    paddingHorizontal: espaco.sm,
    paddingVertical: espaco.xs,
    borderRadius: raio.pilula,
    backgroundColor: cores.alertaFundo,
  },
  pendenteAbrir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pendenteAbrirTexto: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.primaria,
  },
  pendenteEstadoExpirado: {
    backgroundColor: cores.erroFundo,
  },
  pendentePrazo: {
    fontFamily: familia.medio,
    fontSize: fonte.xs,
    color: cores.alerta,
    flexShrink: 1,
  },
  pendentePrazoExpirado: {
    color: cores.erro,
  },
});
