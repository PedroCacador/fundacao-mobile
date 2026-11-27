import React from 'react';
import { Alert, AlertButton, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../components/common/BackHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Chip } from '../../components/common/Chip';
import { IconBox, Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { categoriasDoConveniado } from '../../utils/benefit';
import { estiloCategoria } from '../../utils/category';
import {
  abrirMapaPadrao,
  abrirNavegador,
  obterNavegadoresDisponiveis,
  TipoNavegador,
} from '../../utils/map';
import { useLocationDetailsViewModel } from '../../viewmodels/useLocationDetailsViewModel';

export default function LocationDetailsView({
  navigation,
  route,
}: RootScreenProps<'LocationDetails'>) {
  const { conveniadoId } = route.params;
  const { conveniado, beneficiosAtivos, categorias, carregando, erro, recarregar } =
    useLocationDetailsViewModel(conveniadoId);

  const abrirMapa = async (tipo?: TipoNavegador) => {
    if (!conveniado?.endereco) {
      Alert.alert('Endereço indisponível', 'Este estabelecimento não possui endereço cadastrado.');
      return;
    }
    const sucesso =
      Platform.OS === 'android'
        ? await abrirMapaPadrao(conveniado.endereco)
        : tipo
          ? await abrirNavegador(tipo, conveniado.endereco)
          : false;
    if (!sucesso) {
      Alert.alert(
        'Não foi possível abrir o mapa',
        'Verifique se você possui um aplicativo de mapas instalado no aparelho.',
      );
    }
  };

  const solicitarRota = async () => {
    if (Platform.OS === 'ios') {
      const disponiveis = await obterNavegadoresDisponiveis();
      if (disponiveis.length === 0) {
        Alert.alert('Mapas indisponíveis', 'Não há um aplicativo de mapas disponível no aparelho.');
        return;
      }
      const nomes: Record<TipoNavegador, string> = {
        apple: 'Apple Maps',
        google: 'Google Maps',
        waze: 'Waze',
      };
      const botoes: AlertButton[] = disponiveis.map((tipo) => ({
        text: nomes[tipo],
        onPress: () => void abrirMapa(tipo),
      }));
      botoes.push({ text: 'Cancelar', style: 'cancel' });
      Alert.alert('Como chegar', 'Escolha o aplicativo de mapas', [...botoes]);
      return;
    }
    void abrirMapa();
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

  const categoriaPrincipal = categoriasDoConveniado(conveniado)[0] ?? 'Outros';
  const estiloPrincipal = estiloCategoria(categoriaPrincipal);

  return (
    <Screen>
      <BackHeader titulo="Detalhes do Local" />

      <Card estilo={styles.cardPrincipal}>
        <View style={styles.topoPrincipal}>
          <IconBox
            nome={estiloPrincipal.icone}
            cor={estiloPrincipal.cor}
            fundo={estiloPrincipal.fundo}
            tamanho={62}
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

        <View style={styles.linhasInfo}>
          <View style={styles.linhaInfo}>
            <Icone nome="map-pin" tamanho={18} cor={cores.primaria} />
            <View style={styles.textosLinha}>
              <Text style={styles.rotuloInfo}>Endereço</Text>
              <Text style={styles.valorInfo}>{conveniado.endereco}</Text>
            </View>
          </View>

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

        {categorias.length > 0 ? (
          <View style={styles.chipsContainer}>
            {categorias.map((categoria) => {
              const estilo = estiloCategoria(categoria);
              return (
                <Chip
                  key={categoria}
                  texto={categoria}
                  icone={estilo.icone}
                  cor={estilo.cor}
                  fundo={estilo.fundo}
                />
              );
            })}
          </View>
        ) : null}
      </Card>

      <Button
        titulo="Como chegar"
        icone="navigation"
        aoPressionar={solicitarRota}
        estilo={styles.botaoMapa}
      />

      <Card estilo={styles.cardBeneficios}>
        <View style={styles.cabecalhoBeneficios}>
          <IconBox nome="gift" tamanho={48} cor={cores.primaria} fundo="#E7EEF9" redondo />
          <View style={styles.textosBeneficios}>
            <Text style={styles.tituloBeneficios}>Benefícios disponíveis</Text>
            <Text style={styles.subtituloBeneficios}>
              Benefícios ativos que você pode usufruir neste estabelecimento:
            </Text>
          </View>
        </View>
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
                onPress={() => navigation.navigate('BenefitDetails', { beneficioId: beneficio.id })}
                style={({ pressed }) => [styles.cardBeneficio, pressed && styles.cardPressionado]}
                accessibilityRole="button"
                accessibilityLabel={`Detalhes de ${beneficio.nome}`}
              >
                <View style={styles.beneficioTextos}>
                  <Text style={styles.beneficioNome}>{beneficio.nome}</Text>
                  {beneficio.descricao ? (
                    <Text style={styles.beneficioDescricao} numberOfLines={2}>
                      {beneficio.descricao}
                    </Text>
                  ) : null}
                </View>
                <Icone nome="chevron-right" tamanho={20} cor={cores.textoSecundario} />
              </Pressable>
            ))}
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardPrincipal: {
    padding: espaco.lg,
    gap: espaco.md,
    marginBottom: espaco.lg,
    borderRadius: 14,
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
    fontSize: fonte.xl,
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
    width: 7,
    height: 7,
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
    backgroundColor: '#E7ECF3',
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
    marginTop: espaco.xs,
  },
  botaoMapa: {
    minHeight: 54,
    marginBottom: espaco.xxl,
    ...{
      shadowColor: cores.primaria,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 7,
      elevation: 3,
    },
  },
  cardBeneficios: {
    padding: espaco.lg,
    gap: espaco.lg,
    borderRadius: 14,
  },
  cabecalhoBeneficios: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  textosBeneficios: {
    flex: 1,
    gap: 3,
  },
  tituloBeneficios: {
    fontFamily: familia.titulo,
    fontSize: fonte.xl,
    color: cores.texto,
  },
  subtituloBeneficios: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    lineHeight: 18,
    color: cores.textoSecundario,
  },
  listaBeneficios: {
    gap: espaco.sm,
  },
  cardBeneficio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.md,
    padding: espaco.md,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  cardPressionado: {
    opacity: 0.8,
  },
  beneficioTextos: {
    flex: 1,
    gap: 2,
  },
  beneficioNome: {
    fontFamily: familia.titulo,
    fontSize: fonte.base,
    color: cores.texto,
  },
  beneficioDescricao: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
    lineHeight: 17,
  },
});
