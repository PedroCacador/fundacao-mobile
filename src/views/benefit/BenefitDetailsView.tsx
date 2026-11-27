import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BenefitHero } from '../../components/benefit/BenefitHero';
import { BackHeader } from '../../components/common/BackHeader';
import { Button } from '../../components/common/Button';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { IconBox, Icone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { formatarData } from '../../utils/format';
import { useBenefitDetailsViewModel } from '../../viewmodels/useBenefitDetailsViewModel';

export default function BenefitDetailsView({
  navigation,
  route,
}: RootScreenProps<'BenefitDetails'>) {
  const { item, detalhes, carregando, erroUsos, recarregarUsos } = useBenefitDetailsViewModel(
    route.params.beneficioId,
  );
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);

  const solicitarUso = () => {
    if (!item) return;
    setConfirmacaoAberta(true);
  };

  const confirmarUso = () => {
    if (!item) return;
    setConfirmacaoAberta(false);
    navigation.push('GerarQrCode', {
      beneficioId: item.beneficio.id,
      solicitarAposConfirmacao: true,
    });
  };

  if (carregando || !item || !detalhes) {
    return (
      <Screen>
        <BackHeader titulo="Detalhes do Benefício" />
        {carregando ? <Loading /> : <EmptyState icone="gift" titulo="Benefício não encontrado" />}
      </Screen>
    );
  }

  if (erroUsos) {
    return (
      <Screen>
        <BackHeader titulo="Detalhes do Benefício" />
        <ErrorMessage mensagem={erroUsos} aoTentarDeNovo={recarregarUsos} />
      </Screen>
    );
  }

  const { uso } = detalhes;
  const pendente = uso.pendentes > 0;
  const disponivel = uso.disponiveis > 0 && !pendente && item.conveniados.length > 0;
  const textoBotao = pendente
    ? 'Exibir QR Code'
    : disponivel
      ? 'Solicitar uso do benefício'
      : `Indisponível até ${uso.proximaData ? formatarData(uso.proximaData) : 'a próxima renovação'}`;

  const abrirQr = () => {
    if (!uso.utilizacaoPendenteId) return;
    navigation.navigate('GerarQrCode', {
      beneficioId: item.beneficio.id,
      utilizacaoId: uso.utilizacaoPendenteId,
    });
  };

  return (
    <Screen>
      <BackHeader titulo="Detalhes do Benefício" />

      <BenefitHero item={item} uso={uso} />

      <Button
        titulo={textoBotao}
        icone={disponivel || pendente ? 'scan-qr-code' : undefined}
        aoPressionar={pendente ? abrirQr : solicitarUso}
        desabilitado={!disponivel && !pendente}
        estilo={styles.botaoPrincipal}
      />
      <ConfirmationModal
        aberto={confirmacaoAberta}
        titulo="Confirmar resgate"
        mensagem={`Você vai solicitar o uso de "${item.beneficio.nome}". Em seguida, será gerado um QR Code para apresentar no estabelecimento.`}
        textoConfirmar="Confirmar resgate"
        varianteConfirmar="primaria"
        aoCancelar={() => setConfirmacaoAberta(false)}
        aoConfirmar={confirmarUso}
      />

      <Text style={styles.tituloLocais}>Locais conveniados</Text>
      {item.conveniados.length === 0 ? (
        <Text style={styles.textoVazio}>Nenhum estabelecimento ativo no momento.</Text>
      ) : (
        <View style={styles.listaLocais}>
          {item.conveniados.map((local) => (
            <Pressable
              key={local.id}
              onPress={() => navigation.navigate('LocationDetails', { conveniadoId: local.id })}
              style={({ pressed }) => [styles.local, pressed && styles.localPressionado]}
              accessibilityRole="button"
              accessibilityLabel={`Detalhes de ${local.nome_fantasia}`}
            >
              <IconBox nome="map-pin" tamanho={36} cor={cores.primaria} fundo="#E7EEF9" />
              <View style={styles.localTextos}>
                <Text style={styles.localNome}>{local.nome_fantasia}</Text>
                <Text style={styles.localEndereco} numberOfLines={2}>
                  {local.endereco}
                </Text>
              </View>
              <Icone nome="chevron-right" tamanho={20} cor={cores.textoSecundario} />
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  botaoPrincipal: {
    minHeight: 52,
    marginBottom: espaco.xxl,
  },
  tituloLocais: {
    marginTop: espaco.sm,
    marginBottom: espaco.md,
    fontFamily: familia.titulo,
    fontSize: fonte.xl,
    color: cores.texto,
  },
  listaLocais: {
    gap: espaco.sm,
  },
  local: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    padding: espaco.md,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  localPressionado: {
    opacity: 0.8,
  },
  localTextos: {
    flex: 1,
    gap: 2,
  },
  localNome: {
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
  localEndereco: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  textoVazio: {
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
});
