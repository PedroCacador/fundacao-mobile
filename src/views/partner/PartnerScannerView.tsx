import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Header } from '../../components/common/Header';
import { IconBox, Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TextField } from '../../components/common/TextField';
import { TopBar } from '../../components/common/TopBar';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { formatarData, formatarMoeda, lerData } from '../../utils/format';
import { usePartnerScannerViewModel } from '../../viewmodels/usePartnerScannerViewModel';

export default function PartnerScannerView() {
  const {
    codigo,
    setCodigo,
    cameraAberta,
    abrirCamera,
    fecharCamera,
    aoEscanearCodigo,
    escaneado,
    resgate,
    carregando,
    processando,
    erro,
    sucesso,
    modalConfirmacao,
    buscarResgate,
    abrirConfirmacao,
    fecharConfirmacao,
    executarDecisao,
    limpar,
  } = usePartnerScannerViewModel();

  return (
    <Screen>
      <TopBar notificacoes={false} />

      <Header
        icone="qr-code"
        titulo="Validar Resgate"
        subtitulo="Escaneie o QR Code pela câmera ou informe o código abaixo."
      />

      {sucesso ? (
        <Card estilo={styles.cardSucesso}>
          <IconBox nome="circle-check" cor={cores.sucesso} fundo={cores.sucessoFundo} tamanho={56} />
          <Text style={styles.textoSucesso}>{sucesso}</Text>
          <Button
            titulo="Validar Próximo Resgate"
            variante="primaria"
            icone="qr-code"
            aoPressionar={limpar}
            estilo={styles.botaoAcao}
          />
        </Card>
      ) : resgate ? (
        <Card estilo={styles.cardResgate}>
          <View style={styles.resgateCabecalho}>
            <StatusBadge status="PENDENTE" ponto />
            <Text style={styles.resgateId}>Solicitação #{resgate.id}</Text>
          </View>

          <View style={styles.divisoria} />

          <View style={styles.linhaInfo}>
            <Icone nome="user" tamanho={20} cor={cores.primaria} />
            <View style={styles.textoInfo}>
              <Text style={styles.rotuloInfo}>Colaborador</Text>
              <Text style={styles.valorInfo}>{resgate.colaborador_nome}</Text>
            </View>
          </View>

          <View style={styles.linhaInfo}>
            <Icone nome="gift" tamanho={20} cor={cores.primaria} />
            <View style={styles.textoInfo}>
              <Text style={styles.rotuloInfo}>Benefício</Text>
              <Text style={styles.valorInfo}>{resgate.beneficio_nome}</Text>
            </View>
          </View>

          <View style={styles.linhaInfo}>
            <Icone nome="coins" tamanho={20} cor={cores.primaria} />
            <View style={styles.textoInfo}>
              <Text style={styles.rotuloInfo}>Valor do Resgate</Text>
              <Text style={styles.valorDestaque}>
                {formatarMoeda(resgate.valor_aplicado)}
              </Text>
            </View>
          </View>

          <View style={styles.linhaInfo}>
            <Icone nome="calendar" tamanho={20} cor={cores.textoSecundario} />
            <View style={styles.textoInfo}>
              <Text style={styles.rotuloInfo}>Data da Solicitação</Text>
              <Text style={styles.valorSecundario}>
                {formatarData(lerData(resgate.data_solicitacao))}
              </Text>
            </View>
          </View>

          {resgate.observacoes ? (
            <View style={styles.observacaoBox}>
              <Text style={styles.rotuloInfo}>Observações:</Text>
              <Text style={styles.valorSecundario}>{resgate.observacoes}</Text>
            </View>
          ) : null}

          {erro ? (
            <View style={styles.erroBox}>
              <Icone nome="circle-alert" tamanho={18} cor={cores.erro} />
              <Text style={styles.erroTexto}>{erro}</Text>
            </View>
          ) : null}

          <View style={styles.acoesContainer}>
            <Button
              titulo="Aprovar Resgate"
              variante="primaria"
              icone="check"
              carregando={processando}
              aoPressionar={() => abrirConfirmacao('APROVADA')}
              estilo={styles.botaoAcao}
            />
            <Button
              titulo="Reprovar Resgate"
              variante="perigo"
              icone="circle-x"
              desabilitado={processando}
              aoPressionar={() => abrirConfirmacao('REPROVADA')}
              estilo={styles.botaoAcao}
            />
            <Button
              titulo="Cancelar / Voltar"
              variante="secundaria"
              desabilitado={processando}
              aoPressionar={limpar}
              estilo={styles.botaoAcao}
            />
          </View>
        </Card>
      ) : (
        <View style={styles.opcoesContainer}>
          {/* OPÇÃO 1: ESCANEAR QR CODE PELA CÂMERA */}
          <Card estilo={styles.cardCamera}>
            <View style={styles.cabecalhoBloco}>
              <IconBox nome="scan-qr-code" tamanho={48} redondo />
              <View style={styles.textosBloco}>
                <Text style={styles.tituloBloco}>Escanear QR Code</Text>
                <Text style={styles.subtituloBloco}>
                  Aponte a câmera para o QR Code na tela do colaborador.
                </Text>
              </View>
            </View>

            {cameraAberta ? (
              <View style={styles.visorContainer}>
                <View style={styles.cameraWrapper}>
                  <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    barcodeScannerSettings={{
                      barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={escaneado ? undefined : aoEscanearCodigo}
                  />
                  <View style={styles.molduraOverlay} pointerEvents="none">
                    <View style={[styles.canto, styles.cantoTopoEsquerda]} />
                    <View style={[styles.canto, styles.cantoTopoDireita]} />
                    <View style={[styles.canto, styles.cantoBaseEsquerda]} />
                    <View style={[styles.canto, styles.cantoBaseDireita]} />
                  </View>
                </View>

                <Text style={styles.visorInstrucao}>
                  {carregando
                    ? 'Consultando resgate...'
                    : 'Aponte para o QR Code na tela do colaborador'}
                </Text>

                <Button
                  titulo="Fechar Câmera"
                  variante="secundaria"
                  icone="circle-x"
                  aoPressionar={fecharCamera}
                  desabilitado={carregando}
                  estilo={styles.botaoAcao}
                />
              </View>
            ) : (
              <Button
                titulo="Abrir Câmera"
                variante="primaria"
                icone="scan-qr-code"
                aoPressionar={abrirCamera}
              />
            )}
          </Card>

          {/* SEPARADOR CLARO: OU */}
          <View style={styles.separadorOu}>
            <View style={styles.linhaSeparador} />
            <Text style={styles.textoSeparador}>OU DIGITE O CÓDIGO</Text>
            <View style={styles.linhaSeparador} />
          </View>

          {/* OPÇÃO 2: DIGITAR CÓDIGO MANUALMENTE */}
          <Card estilo={styles.cardManual}>
            <View style={styles.cabecalhoBloco}>
              <IconBox nome="ticket" tamanho={48} redondo />
              <View style={styles.textosBloco}>
                <Text style={styles.tituloBloco}>Código Manual</Text>
                <Text style={styles.subtituloBloco}>
                  Alternativa caso não utilize a câmera no momento.
                </Text>
              </View>
            </View>

            <TextField
              icone="ticket"
              placeholder="Ex: 1, 10"
              value={codigo}
              onChangeText={setCodigo}
              onSubmitEditing={() => buscarResgate()}
              returnKeyType="search"
            />

            {erro ? (
              <View style={styles.erroBox}>
                <Icone nome="circle-alert" tamanho={18} cor={cores.erro} />
                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            ) : null}

            <Button
              titulo="Localizar pelo Código"
              variante="secundaria"
              icone="search"
              carregando={carregando}
              aoPressionar={() => buscarResgate()}
            />
          </Card>
        </View>
      )}

      <ConfirmationModal
        aberto={modalConfirmacao.aberto}
        titulo={modalConfirmacao.acao === 'APROVADA' ? 'Aprovar Resgate' : 'Reprovar Resgate'}
        mensagem={
          modalConfirmacao.acao === 'APROVADA'
            ? `Tem certeza que deseja aprovar o resgate de ${resgate ? formatarMoeda(resgate.valor_aplicado) : ''} para o colaborador ${resgate?.colaborador_nome}?`
            : `Tem certeza que deseja reprovar a solicitação de resgate de ${resgate?.colaborador_nome}?`
        }
        textoConfirmar={
          modalConfirmacao.acao === 'APROVADA' ? 'Sim, Aprovar' : 'Sim, Reprovar'
        }
        varianteConfirmar={modalConfirmacao.acao === 'APROVADA' ? 'primaria' : 'perigo'}
        aoConfirmar={executarDecisao}
        aoCancelar={fecharConfirmacao}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  opcoesContainer: {
    gap: espaco.md,
  },
  cardCamera: {
    gap: espaco.lg,
    padding: espaco.xl,
  },
  cardManual: {
    gap: espaco.lg,
    padding: espaco.xl,
  },
  cabecalhoBloco: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  textosBloco: {
    flex: 1,
    gap: 2,
  },
  tituloBloco: {
    fontFamily: familia.titulo,
    fontSize: fonte.lg,
    color: cores.texto,
  },
  subtituloBloco: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
    lineHeight: 18,
  },
  visorContainer: {
    gap: espaco.md,
    alignItems: 'center',
  },
  cameraWrapper: {
    width: 240,
    height: 240,
    borderRadius: raio.lg,
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  molduraOverlay: {
    ...StyleSheet.absoluteFill,
  },
  visorInstrucao: {
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  canto: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: cores.primaria,
  },
  cantoTopoEsquerda: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: raio.sm,
  },
  cantoTopoDireita: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: raio.sm,
  },
  cantoBaseEsquerda: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: raio.sm,
  },
  cantoBaseDireita: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: raio.sm,
  },
  separadorOu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    paddingVertical: espaco.xs,
  },
  linhaSeparador: {
    flex: 1,
    height: 1,
    backgroundColor: cores.borda,
  },
  textoSeparador: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
    color: cores.textoFraco,
    letterSpacing: 0.8,
  },
  cardResgate: {
    gap: espaco.md,
    padding: espaco.xl,
  },
  resgateCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resgateId: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  divisoria: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: espaco.xs,
  },
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  textoInfo: {
    flex: 1,
  },
  rotuloInfo: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  valorInfo: {
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
  valorDestaque: {
    fontFamily: familia.titulo,
    fontSize: fonte.titulo,
    color: cores.primaria,
  },
  valorSecundario: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  observacaoBox: {
    backgroundColor: cores.azulSuave,
    padding: espaco.md,
    borderRadius: raio.sm,
    gap: espaco.xs,
  },
  acoesContainer: {
    gap: espaco.sm,
    marginTop: espaco.md,
  },
  botaoAcao: {
    width: '100%',
  },
  cardSucesso: {
    alignItems: 'center',
    padding: espaco.xxl,
    gap: espaco.md,
  },
  textoSucesso: {
    fontFamily: familia.titulo,
    fontSize: fonte.lg,
    color: cores.sucesso,
    textAlign: 'center',
  },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    backgroundColor: cores.erroFundo,
    padding: espaco.md,
    borderRadius: raio.sm,
  },
  erroTexto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.erro,
  },
});
