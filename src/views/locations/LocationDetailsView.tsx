import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../components/common/BackHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Chip } from '../../components/common/Chip';
import { IconBox, Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { SectionCard } from '../../components/common/SectionCard';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { estiloCategoria } from '../../utils/category';
import { formatarCnpj, formatarMoeda } from '../../utils/format';
import { abrirNavegador, TipoNavegador } from '../../utils/map';
import { useLocationDetailsViewModel } from '../../viewmodels/useLocationDetailsViewModel';

export default function LocationDetailsView({
  navigation,
  route,
}: RootScreenProps<'LocationDetails'>) {
  const { conveniadoId } = route.params;
  const { conveniado, beneficiosAtivos, categorias, carregando, erro, recarregar } =
    useLocationDetailsViewModel(conveniadoId);

  const handleNavegacao = async (tipo: TipoNavegador) => {
    if (!conveniado?.endereco) {
      Alert.alert('Endereço indisponível', 'Este estabelecimento não possui endereço cadastrado.');
      return;
    }
    const sucesso = await abrirNavegador(tipo, conveniado.endereco);
    if (!sucesso) {
      Alert.alert(
        'Não foi possível abrir o mapa',
        'Verifique se você possui o aplicativo de mapas instalado no aparelho.',
      );
    }
  };

  if (carregando) {
    return (
      <Screen>
        <BackHeader titulo="Detalhes do Local" />
        <Loading texto="Carregando detalhes do estabelecimento..." />
      </Screen>
    );
  }

  if (erro || !conveniado) {
    return (
      <Screen>
        <BackHeader titulo="Detalhes do Local" />
        {erro ? (
          <ErrorMessage mensagem={erro} aoTentarDeNovo={recarregar} />
        ) : (
          <EmptyState
            icone="store"
            titulo="Estabelecimento não encontrado"
            texto="O estabelecimento solicitado não foi localizado ou não está mais ativo."
          />
        )}
      </Screen>
    );
  }

  const estiloPrincipal = estiloCategoria(conveniado.categoria);

  return (
    <Screen>
      <BackHeader titulo="Detalhes do Local" />

      {/* CARTÃO PRINCIPAL DE IDENTIFICAÇÃO DO CONVENIADO */}
      <Card estilo={styles.cardPrincipal}>
        <View style={styles.topoPrincipal}>
          <IconBox
            nome={estiloPrincipal.icone}
            cor={estiloPrincipal.cor}
            fundo={estiloPrincipal.fundo}
            tamanho={64}
          />

          <View style={styles.identificacaoTextos}>
            <Text style={styles.nomeFantasia}>{conveniado.nome_fantasia}</Text>
            {conveniado.razao_social && conveniado.razao_social !== conveniado.nome_fantasia ? (
              <Text style={styles.razaoSocial}>{conveniado.razao_social}</Text>
            ) : null}
            <View style={styles.badgeAtivo}>
              <View style={styles.pontoVerde} />
              <Text style={styles.textoBadgeAtivo}>Estabelecimento Conveniado Ativo</Text>
            </View>
          </View>
        </View>

        <View style={styles.divisoria} />

        {/* DETALHES DE CADASTRO E ENDEREÇO */}
        <View style={styles.linhasInfo}>
          <View style={styles.linhaInfo}>
            <Icone nome="map-pin" tamanho={18} cor={cores.primaria} />
            <View style={styles.textosLinha}>
              <Text style={styles.rotuloInfo}>Endereço</Text>
              <Text style={styles.valorInfo}>{conveniado.endereco}</Text>
            </View>
          </View>

          {conveniado.cnpj ? (
            <View style={styles.linhaInfo}>
              <Icone nome="id-card" tamanho={18} cor={cores.primaria} />
              <View style={styles.textosLinha}>
                <Text style={styles.rotuloInfo}>CNPJ</Text>
                <Text style={styles.valorInfo}>{formatarCnpj(conveniado.cnpj)}</Text>
              </View>
            </View>
          ) : null}

          {conveniado.telefone ? (
            <View style={styles.linhaInfo}>
              <Icone nome="phone" tamanho={18} cor={cores.primaria} />
              <View style={styles.textosLinha}>
                <Text style={styles.rotuloInfo}>Telefone</Text>
                <Text style={styles.valorInfo}>{conveniado.telefone}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </Card>

      {/* CATEGORIAS VINCULADAS */}
      <SectionCard
        recuado
        icone="tag"
        titulo="Categorias vinculadas"
        subtitulo="Áreas de atuação e categorias deste parceiro conveniado:"
      >
        <View style={styles.chipsContainer}>
          {categorias.map((cat) => {
            const estilo = estiloCategoria(cat);
            return (
              <Chip
                key={cat}
                texto={cat}
                icone={estilo.icone}
                cor={estilo.cor}
                fundo={estilo.fundo}
              />
            );
          })}
        </View>
      </SectionCard>

      {/* NAVEGAÇÃO EXTERNA (MAPAS) */}
      <SectionCard
        recuado
        icone="map"
        titulo="Como chegar"
        subtitulo="Abra sua rota diretamente no seu aplicativo de navegação favorito:"
      >
        <View style={styles.botoesNavegacao}>
          <Button
            titulo="Google Maps"
            variante="secundaria"
            icone="map-pin"
            aoPressionar={() => handleNavegacao('google')}
            estilo={styles.botaoMapa}
          />
          <Button
            titulo="Maps (Nativo)"
            variante="secundaria"
            icone="map"
            aoPressionar={() => handleNavegacao('apple')}
            estilo={styles.botaoMapa}
          />
          <Button
            titulo="Waze"
            variante="secundaria"
            icone="navigation"
            aoPressionar={() => handleNavegacao('waze')}
            estilo={styles.botaoMapa}
          />
        </View>
      </SectionCard>

      {/* BENEFÍCIOS ATIVOS DISPONÍVEIS NESTE LOCAL */}
      <SectionCard
        recuado
        icone="gift"
        titulo="Benefícios disponíveis"
        subtitulo="Benefícios ativos que você pode usufruir neste estabelecimento:"
      >
        {beneficiosAtivos.length === 0 ? (
          <EmptyState
            icone="gift"
            titulo="Nenhum benefício ativo"
            texto="No momento não há benefícios ativos associados a este local."
          />
        ) : (
          <View style={styles.listaBeneficios}>
            {beneficiosAtivos.map((beneficio) => (
              <Pressable
                key={beneficio.id}
                onPress={() =>
                  navigation.navigate('BenefitDetails', {
                    beneficioId: beneficio.id,
                  })
                }
                style={({ pressed }) => [styles.cardBeneficio, pressed && styles.cardPressionado]}
              >
                <View style={styles.beneficioEsquerda}>
                  <IconBox nome="gift" tamanho={44} cor={cores.primaria} fundo={cores.primariaClara} />
                  <View style={styles.beneficioTextos}>
                    <Text style={styles.beneficioNome}>{beneficio.nome}</Text>
                    {beneficio.descricao ? (
                      <Text style={styles.beneficioDescricao} numberOfLines={2}>
                        {beneficio.descricao}
                      </Text>
                    ) : null}
                    <Text style={styles.beneficioValor}>
                      {beneficio.tipo_beneficio === 'PERCENTUAL'
                        ? `${beneficio.valor}% de desconto`
                        : formatarMoeda(beneficio.valor)}
                    </Text>
                  </View>
                </View>

                <Icone nome="chevron-right" tamanho={20} cor={cores.textoFraco} />
              </Pressable>
            ))}
          </View>
        )}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardPrincipal: {
    padding: espaco.xl,
    gap: espaco.md,
    marginBottom: espaco.md,
  },
  topoPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  identificacaoTextos: {
    flex: 1,
    gap: 3,
  },
  nomeFantasia: {
    fontFamily: familia.titulo,
    fontSize: fonte.lg,
    color: cores.texto,
  },
  razaoSocial: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  badgeAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  pontoVerde: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.sucesso,
  },
  textoBadgeAtivo: {
    fontFamily: familia.medio,
    fontSize: fonte.xs,
    color: cores.sucesso,
  },
  divisoria: {
    height: 1,
    backgroundColor: cores.borda,
  },
  linhasInfo: {
    gap: espaco.sm,
  },
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.md,
  },
  textosLinha: {
    flex: 1,
  },
  rotuloInfo: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
  },
  valorInfo: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.sm,
  },
  botoesNavegacao: {
    gap: espaco.sm,
  },
  botaoMapa: {
    width: '100%',
  },
  listaBeneficios: {
    gap: espaco.sm,
  },
  cardBeneficio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: espaco.md,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  cardPressionado: {
    opacity: 0.8,
  },
  beneficioEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    flex: 1,
  },
  beneficioTextos: {
    flex: 1,
    gap: 2,
  },
  beneficioNome: {
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
  beneficioDescricao: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
    lineHeight: 16,
  },
  beneficioValor: {
    fontFamily: familia.semi,
    fontSize: fonte.xs,
    color: cores.primaria,
    marginTop: 2,
  },
});
