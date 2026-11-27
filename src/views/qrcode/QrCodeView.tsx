import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EstablishmentCard } from '../../components/benefit/EstablishmentCard';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { ChoiceChip } from '../../components/qrcode/ChoiceChip';
import { QrCodeCard } from '../../components/qrcode/QrCodeCard';
import { QrTips } from '../../components/qrcode/QrTips';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { useQrCodeViewModel } from '../../viewmodels/useQrCodeViewModel';

type QrCodeViewProps = RootScreenProps<'GerarQrCode'>;

export default function QrCodeView({ navigation, route }: QrCodeViewProps) {
  const {
    opcoes,
    carregandoOpcoes,
    erroOpcoes,
    recarregarOpcoes,
    opcao,
    escolherOpcao,
    emissao,
    situacao,
    restantes,
    emitindo,
    erroEmissao,
    emitir,
  } = useQrCodeViewModel(route.params);

  const opcoesExibidas =
    route.params?.solicitarAposConfirmacao && route.params.beneficioId !== undefined
      ? opcoes.filter((item) => item.chave === `BENEFICIO-${route.params?.beneficioId}`)
      : opcoes;
  const confirmarEmissao = () => {
    if (route.params?.solicitarAposConfirmacao) {
      void emitir();
      return;
    }
    if (!opcao) return;
    void emitir();
  };

  return (
    <Screen>
      <PageHeader titulo="QR Code" subtitulo="Apresente no estabelecimento" />
      {emissao && situacao ? (
        <>
          <QrCodeCard
            id={emissao.id}
            token={emissao.token_qrcode}
            codigoValidacao={emissao.codigo_validacao}
            titulo={opcao?.nome ?? 'Benefício solicitado'}
            situacao={situacao}
            restantes={restantes}
          />
          <QrTips />
          {erroEmissao ? <ErrorMessage mensagem={erroEmissao} /> : null}
        </>
      ) : carregandoOpcoes ? (
        <Loading texto="Carregando seus benefícios..." />
      ) : erroOpcoes ? (
        <ErrorMessage mensagem={erroOpcoes} aoTentarDeNovo={recarregarOpcoes} />
      ) : opcoesExibidas.length === 0 ? (
        <EmptyState
          icone="ticket"
          titulo={
            route.params?.solicitarAposConfirmacao
              ? 'Benefício indisponível'
              : 'Nenhum benefício para usar agora'
          }
          texto={
            route.params?.solicitarAposConfirmacao
              ? 'Este benefício não está mais disponível para solicitação.'
              : 'Quando houver benefícios ativos em estabelecimentos, eles aparecem aqui.'
          }
        />
      ) : (
        <>
          <Card estilo={styles.passo}>
            <Text style={styles.passoTitulo}>Escolha o benefício</Text>
            <View style={styles.opcoes}>
              {opcoesExibidas.map((item) => (
                <ChoiceChip
                  key={item.chave}
                  titulo={item.nome}
                  detalhe={item.detalhe}
                  escolhido={item.chave === opcao?.chave}
                  aoPressionar={() => escolherOpcao(item.chave)}
                />
              ))}
            </View>
          </Card>
          {opcao ? (
            <Card estilo={styles.passo}>
              <Text style={styles.passoTitulo}>Locais onde pode ser usado</Text>
              <View style={styles.locais}>
                {opcao.locais.map((item) => (
                  <EstablishmentCard
                    key={item.ofertaId}
                    conveniado={item.conveniado}
                    aoPressionar={() =>
                      navigation.navigate('LocationDetails', {
                        conveniadoId: item.conveniado.id,
                      })
                    }
                  />
                ))}
              </View>
            </Card>
          ) : null}
          {erroEmissao ? <ErrorMessage mensagem={erroEmissao} /> : null}
          <Button
            titulo="Solicitar uso e gerar QR Code"
            icone="scan-qr-code"
            aoPressionar={confirmarEmissao}
            carregando={emitindo}
            desabilitado={!opcao}
            estilo={styles.botaoGerar}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  passo: {
    marginBottom: espaco.md,
    gap: espaco.md,
  },
  passoTitulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.lg,
    color: cores.texto,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.sm,
  },
  locais: {
    gap: espaco.sm,
  },
  botaoGerar: {
    marginTop: espaco.md,
  },
});
