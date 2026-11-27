import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Card } from '../../components/common/Card';
import { IconBox, Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ErrorMessage, Loading } from '../../components/common/StateMessage';
import { TopBar } from '../../components/common/TopBar';
import { TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte, raio, sombra } from '../../theme';
import { formatarTempoExpiracao } from '../../utils/qrcode';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';

export default function HomeView({ navigation }: TabScreenProps<'Home'>) {
  const {
    nome,
    catalogo,
    resumo,
    carregando,
    erro,
    atualizando,
    recarregar,
    campanhasVigentes,
    carregandoCampanhas,
    erroCampanhas,
    tentarCampanhas,
    pendentes,
    carregandoPendentes,
    erroPendentes,
    tentarPendentes,
  } = useHomeViewModel();

  const primeiroNome = nome.trim().split(/\s+/)[0] || nome;

  return (
    <Screen atualizando={atualizando} aoAtualizar={recarregar}>
      <TopBar />

      <Text style={styles.saudacao} accessibilityRole="header">
        Olá, {primeiroNome}
      </Text>

      <Pressable
        onPress={() => navigation.navigate('Wallet')}
        accessibilityRole="button"
        accessibilityLabel="Ver benefícios"
        style={({ pressed }) => [styles.banner, pressed && styles.pressionado]}
      >
        <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="fcvBanner" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#17306A" />
              <Stop offset="1" stopColor="#1F4A9E" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#fcvBanner)" />
        </Svg>
        <View style={styles.circuloTopo} />
        <View style={styles.circuloBase} />
        <View style={styles.bannerPresente}>
          <Icone nome="gift" tamanho={80} cor="rgba(255,255,255,0.22)" />
        </View>
        <View style={styles.bannerConteudo}>
          <Text style={styles.bannerRotulo}>PARA VOCÊ</Text>
          <Text style={styles.bannerTitulo}>Seus benefícios estão esperando por você</Text>
          <Text style={styles.bannerTexto}>
            {carregando
              ? 'Carregando benefícios disponíveis...'
              : `${resumo.disponiveis} ${resumo.disponiveis === 1 ? 'benefício disponível' : 'benefícios disponíveis'} em ${resumo.locais} ${resumo.locais === 1 ? 'estabelecimento conveniado' : 'estabelecimentos conveniados'}.`}
          </Text>
          <View style={styles.bannerBotao}>
            <Text style={styles.bannerBotaoTexto}>Ver benefícios</Text>
            <Icone nome="chevron-right" tamanho={18} cor={cores.primaria} />
          </View>
        </View>
      </Pressable>

      {erro ? (
        <View style={styles.erroCatalogo}>
          <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
        </View>
      ) : null}

      {!carregandoPendentes && erroPendentes && pendentes.length === 0 ? (
        <View style={styles.secao}>
          <ErrorMessage mensagem={erroPendentes} aoTentarDeNovo={tentarPendentes} />
        </View>
      ) : null}
      {!carregandoPendentes && pendentes.length > 0 ? (
        <>
          {erroPendentes ? (
            <View style={styles.secao}>
              <ErrorMessage mensagem={erroPendentes} aoTentarDeNovo={tentarPendentes} />
            </View>
          ) : null}
          {pendentes.map((item, indice) => {
            const restantes = item.segundos_restantes ?? null;
            const locais =
              catalogo.find((entrada) => entrada.beneficio.id === item.beneficio_id)?.conveniados ??
              [];
            const parametros =
              item.origem === 'CAMPANHA'
                ? { itemCampanhaId: item.item_campanha_id ?? undefined, utilizacaoId: item.id }
                : { beneficioId: item.beneficio_id ?? undefined, utilizacaoId: item.id };
            return (
              <Card
                key={item.id}
                estilo={[styles.pendente, indice > 0 && styles.pendenteComAnterior]}
                aoPressionar={() => navigation.navigate('GerarQrCode', parametros)}
                rotuloAcessivel={`Exibir QR Code de ${item.beneficio_nome}`}
              >
                <View style={styles.pendenteConteudo}>
                  <View style={styles.pendenteTopo}>
                    <IconBox
                      nome="scan-qr-code"
                      tamanho={48}
                      cor={cores.primaria}
                      fundo="#E7EEF9"
                      redondo
                    />
                    <View style={styles.pendenteInfo}>
                      <Text style={styles.pendenteRotulo}>RESGATE PENDENTE</Text>
                      <Text style={styles.pendenteTitulo}>{item.beneficio_nome}</Text>
                    </View>
                  </View>
                  <View style={styles.pendenteLocais}>
                    <View style={styles.pendenteLocalCabecalho}>
                      <Icone nome="map-pin" tamanho={14} cor={cores.textoSecundario} />
                      <Text style={styles.pendenteLocalRotulo}>Locais disponíveis</Text>
                    </View>
                    {locais.length > 0 ? (
                      locais.map((local) => (
                        <View key={local.id} style={styles.pendenteLocal}>
                          <Text style={styles.pendenteLocalNome}>{local.nome_fantasia}</Text>
                          <Text style={styles.pendenteEndereco}>{local.endereco}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.pendenteEndereco}>Endereço indisponível</Text>
                    )}
                  </View>
                  <View style={styles.pendenteRodape}>
                    <View style={styles.pendenteEstado}>
                      <Icone nome="clock" tamanho={15} cor={cores.alerta} />
                      <Text style={styles.pendentePrazo}>
                        {restantes === null
                          ? 'Aguardando validação'
                          : `Expira em ${formatarTempoExpiracao(restantes)}`}
                      </Text>
                    </View>
                    <View style={styles.pendenteAbrir}>
                      <Text style={styles.pendenteAbrirTexto}>Exibir QR Code</Text>
                      <Icone nome="chevron-right" tamanho={17} cor={cores.primaria} />
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
        </>
      ) : null}

      <View style={styles.secao}>
        <SectionHeader titulo="Você sabia?" />
        <Card estilo={styles.dica}>
          <IconBox nome="lightbulb" tamanho={40} cor={cores.alerta} fundo={cores.alertaFundo} />
          <View style={styles.dicaTexto}>
            <Text style={styles.dicaTitulo}>Use no estabelecimento</Text>
            <Text style={styles.dicaDescricao}>
              Solicite o benefício no app e apresente o QR Code ao atendente. Você tem até 3 horas.
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.secao}>
        <SectionHeader titulo="Campanhas e eventos" />
        {carregandoCampanhas ? (
          <Loading texto="Carregando campanhas..." />
        ) : erroCampanhas ? (
          <ErrorMessage mensagem={erroCampanhas} aoTentarDeNovo={tentarCampanhas} />
        ) : campanhasVigentes.length === 0 ? (
          <View style={styles.campanhaVazia}>
            <IconBox nome="bell" tamanho={40} cor={cores.primaria} fundo={cores.branco} redondo />
            <View style={styles.dicaTexto}>
              <Text style={styles.campanhaTitulo}>Em breve por aqui</Text>
              <Text style={styles.dicaDescricao}>
                Ative as notificações para saber das novidades da FCV.
              </Text>
            </View>
          </View>
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
  saudacao: {
    marginTop: espaco.xs,
    marginBottom: espaco.lg,
    fontFamily: familia.titulo,
    fontSize: fonte.xxl,
    lineHeight: 28,
    color: cores.texto,
  },
  banner: {
    minHeight: 220,
    overflow: 'hidden',
    borderRadius: 19,
    padding: espaco.xl,
    marginBottom: 0,
    ...sombra.destaque,
  },
  bannerConteudo: {
    alignItems: 'flex-start',
    gap: espaco.sm,
  },
  bannerRotulo: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.8)',
  },
  bannerTitulo: {
    maxWidth: 280,
    fontFamily: familia.titulo,
    fontSize: fonte.xxl,
    lineHeight: 26,
    color: cores.branco,
  },
  bannerTexto: {
    maxWidth: 300,
    fontFamily: familia.regular,
    fontSize: fonte.base,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.88)',
  },
  bannerBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    marginTop: espaco.xs,
    paddingVertical: 9,
    paddingHorizontal: espaco.lg,
    borderRadius: raio.pilula,
    backgroundColor: cores.branco,
  },
  bannerBotaoTexto: {
    fontFamily: familia.tituloNegrito,
    fontSize: fonte.base,
    color: cores.primaria,
  },
  circuloTopo: {
    position: 'absolute',
    width: 162,
    height: 162,
    top: -32,
    right: -25,
    borderRadius: 81,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circuloBase: {
    position: 'absolute',
    width: 112,
    height: 112,
    bottom: -34,
    right: 25,
    borderRadius: 56,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  bannerPresente: {
    position: 'absolute',
    top: 20,
    right: 12,
  },
  pressionado: {
    opacity: 0.9,
  },
  secao: {
    marginTop: espaco.xxl,
    marginBottom: espaco.sm,
  },
  erroCatalogo: {
    marginTop: espaco.md,
  },
  pendente: {
    marginTop: espaco.xxl,
    padding: 0,
    borderColor: cores.borda,
    borderRadius: 14,
    overflow: 'hidden',
    ...sombra.card,
  },
  pendenteComAnterior: {
    marginTop: espaco.md,
  },
  pendenteConteudo: {
    gap: espaco.md,
    padding: espaco.lg,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
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
    fontSize: fonte.xs,
    letterSpacing: 1,
    color: cores.primariaMedia,
  },
  pendenteTitulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.base,
    color: cores.texto,
  },
  pendenteLocais: {
    gap: espaco.xs,
  },
  pendenteLocalCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
  },
  pendenteLocalRotulo: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  pendenteLocal: {
    marginLeft: espaco.lg,
    marginTop: espaco.xs,
    gap: 2,
  },
  pendenteLocalNome: {
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  pendenteEndereco: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  pendenteRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.sm,
    paddingTop: espaco.md,
    borderTopWidth: 1,
    borderTopColor: '#E7ECF3',
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
  pendentePrazo: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
    color: cores.alerta,
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
  dica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    padding: espaco.lg,
    borderRadius: 15,
    ...sombra.card,
  },
  dicaTexto: {
    flex: 1,
    gap: espaco.xs,
  },
  dicaTitulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.base,
    color: cores.texto,
  },
  dicaDescricao: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    lineHeight: 18,
    color: cores.textoSecundario,
  },
  campanhaVazia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    padding: espaco.lg,
    borderRadius: 15,
    backgroundColor: '#EEF3FB',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#AEBBD8',
  },
  campanhaTitulo: {
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
});
