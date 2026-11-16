import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Header } from '../../components/common/Header';
import { Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TopBar } from '../../components/common/TopBar';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { formatarData, formatarMoeda, lerData } from '../../utils/format';
import { usePartnerPendingViewModel } from '../../viewmodels/usePartnerPendingViewModel';

export default function PartnerPendingView() {
  const {
    pendentes,
    carregando,
    atualizando,
    erro,
    sucesso,
    processandoId,
    modalConfirmacao,
    recarregar,
    abrirConfirmacao,
    fecharConfirmacao,
    executarDecisao,
    limparSucesso,
  } = usePartnerPendingViewModel();

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar notificacoes={false} />

      <Header
        icone="clock"
        titulo="Solicitações Pendentes"
        subtitulo="Aprove ou recuse os resgates pendentes do seu estabelecimento."
      />

      {sucesso ? (
        <View style={styles.sucessoBox}>
          <Icone nome="circle-check" tamanho={20} cor={cores.sucesso} />
          <Text style={styles.sucessoTexto}>{sucesso}</Text>
          <Pressable onPress={limparSucesso} hitSlop={8}>
            <Icone nome="x" tamanho={18} cor={cores.sucesso} />
          </Pressable>
        </View>
      ) : null}

      {carregando ? (
        <Loading texto="Buscando solicitações pendentes..." />
      ) : erro ? (
        <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
      ) : pendentes.length === 0 ? (
        <EmptyState
          icone="clock"
          titulo="Nenhuma solicitação pendente"
          texto="Quando um colaborador solicitar um resgate pelo Totem ou app, ele aparecerá aqui para sua validação."
        />
      ) : (
        <View style={styles.lista}>
          <Text style={styles.contadorTexto}>
            {pendentes.length} {pendentes.length === 1 ? 'solicitação aguardando' : 'solicitações aguardando'}
          </Text>

          {pendentes.map((item) => (
            <Card key={item.id} estilo={styles.cardItem}>
              <View style={styles.cardTopo}>
                <StatusBadge status="PENDENTE" ponto />
                <Text style={styles.codigoText}>Solicitação #{item.id}</Text>
              </View>

              <View style={styles.divisoria} />

              <View style={styles.infoLinha}>
                <Icone nome="user" tamanho={18} cor={cores.primaria} />
                <View style={styles.infoTextos}>
                  <Text style={styles.rotulo}>Colaborador</Text>
                  <Text style={styles.valor}>{item.colaborador_nome}</Text>
                </View>
              </View>

              <View style={styles.infoLinha}>
                <Icone nome="gift" tamanho={18} cor={cores.primaria} />
                <View style={styles.infoTextos}>
                  <Text style={styles.rotulo}>Benefício</Text>
                  <Text style={styles.valor}>{item.beneficio_nome}</Text>
                </View>
              </View>

              <View style={styles.infoLinha}>
                <Icone nome="coins" tamanho={18} cor={cores.primaria} />
                <View style={styles.infoTextos}>
                  <Text style={styles.rotulo}>Valor Aplicado</Text>
                  <Text style={styles.valorDestaque}>
                    {formatarMoeda(item.valor_aplicado)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoLinha}>
                <Icone nome="calendar" tamanho={18} cor={cores.textoSecundario} />
                <View style={styles.infoTextos}>
                  <Text style={styles.rotulo}>Solicitado em</Text>
                  <Text style={styles.valorSecundario}>
                    {formatarData(lerData(item.data_solicitacao))}
                  </Text>
                </View>
              </View>

              {item.observacoes ? (
                <View style={styles.observacaoBox}>
                  <Text style={styles.rotulo}>Observações:</Text>
                  <Text style={styles.valorSecundario}>{item.observacoes}</Text>
                </View>
              ) : null}

              <View style={styles.divisoria} />

              <View style={styles.acoesContainer}>
                <Button
                  titulo="Aprovar"
                  variante="primaria"
                  icone="check"
                  carregando={processandoId === item.id}
                  aoPressionar={() => abrirConfirmacao(item, 'APROVADA')}
                  estilo={styles.botaoAcao}
                />
                <Button
                  titulo="Reprovar"
                  variante="perigo"
                  icone="circle-x"
                  desabilitado={processandoId === item.id}
                  aoPressionar={() => abrirConfirmacao(item, 'REPROVADA')}
                  estilo={styles.botaoAcao}
                />
              </View>
            </Card>
          ))}
        </View>
      )}

      <ConfirmationModal
        aberto={modalConfirmacao.aberto}
        titulo={modalConfirmacao.acao === 'APROVADA' ? 'Aprovar Resgate' : 'Reprovar Resgate'}
        mensagem={
          modalConfirmacao.acao === 'APROVADA'
            ? `Deseja aprovar o resgate de ${modalConfirmacao.item ? formatarMoeda(modalConfirmacao.item.valor_aplicado) : ''} para o colaborador ${modalConfirmacao.item?.colaborador_nome}?`
            : `Deseja reprovar a solicitação de ${modalConfirmacao.item?.colaborador_nome}?`
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
  sucessoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    backgroundColor: cores.sucessoFundo,
    padding: espaco.md,
    borderRadius: raio.sm,
    marginBottom: espaco.md,
  },
  sucessoTexto: {
    flex: 1,
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    color: cores.sucesso,
  },
  lista: {
    gap: espaco.md,
  },
  contadorTexto: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  cardItem: {
    gap: espaco.sm,
    padding: espaco.lg,
  },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codigoText: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  divisoria: {
    height: 1,
    backgroundColor: cores.borda,
    marginVertical: 4,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  infoTextos: {
    flex: 1,
  },
  rotulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  valor: {
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
    padding: espaco.sm,
    borderRadius: raio.sm,
    gap: 2,
  },
  acoesContainer: {
    flexDirection: 'row',
    gap: espaco.md,
    marginTop: 4,
  },
  botaoAcao: {
    flex: 1,
  },
});
