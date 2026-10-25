import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BenefitHero } from '../../components/benefit/BenefitHero';
import { EstablishmentCard } from '../../components/benefit/EstablishmentCard';
import { BackHeader } from '../../components/common/BackHeader';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { Icone, IconBox } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { RECUO_SECAO, SectionCard } from '../../components/common/SectionCard';
import { SeeAllLink } from '../../components/common/SeeAllLink';
import { EmptyState, Loading } from '../../components/common/StateMessage';
import { useScrollToSection } from '../../hooks/useScrollToSection';
import { AbaDetalhe } from '../../models/Catalog';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { useBenefitDetailsViewModel } from '../../viewmodels/useBenefitDetailsViewModel';

const abas: TabOption<AbaDetalhe>[] = [
  { id: 'ONDE_USAR', label: 'Onde usar', icone: 'map-pin' },
  { id: 'REGRAS', label: 'Regras', icone: 'file-text' },
  { id: 'QUANTIDADE', label: 'Quantidade', icone: 'coins' },
  { id: 'ESTABELECIMENTOS', label: 'Estabelecimentos', icone: 'store' },
];

export default function BenefitDetailsView({
  navigation,
  route,
}: RootScreenProps<'BenefitDetails'>) {
  const { item, detalhes, aba, setAba, carregando } = useBenefitDetailsViewModel(
    route.params.beneficioId,
    route.params.aba,
  );
  const { refRolagem, posicionar, rolarPara } = useScrollToSection<AbaDetalhe>(route.params.aba);

  const selecionar = (id: AbaDetalhe) => {
    setAba(id);
    rolarPara(id);
  };

  if (carregando || !item || !detalhes) {
    return (
      <Screen>
        <BackHeader titulo="Detalhes do Benefício" />
        {carregando ? <Loading /> : <EmptyState icone="gift" titulo="Benefício não encontrado" />}
      </Screen>
    );
  }

  return (
    <Screen refRolagem={refRolagem}>
      <BackHeader titulo="Detalhes do Benefício" />

      <BenefitHero
        item={item}
        renovacao={detalhes.renovacao}
        emQuantosDias={detalhes.emQuantosDias}
        limite={detalhes.limite}
        valor={detalhes.valor}
      />

      <FilterTabs tabs={abas} selectedTab={aba} onSelectTab={selecionar} />

      <SectionCard
        recuado
        icone="map-pin"
        titulo="Onde pode utilizar"
        onLayout={(evento) => posicionar('ONDE_USAR', evento.nativeEvent.layout.y)}
      >
        <Text style={styles.texto}>{detalhes.ondeUsar}</Text>
        <View style={styles.aviso}>
          <Icone nome="info" tamanho={18} cor={cores.primaria} />
          <Text style={styles.avisoTexto}>
            Realize a validação no terminal do estabelecimento para efetuar a utilização.
          </Text>
        </View>
      </SectionCard>

      <SectionCard
        recuado
        icone="file-text"
        titulo="Regras de utilização"
        onLayout={(evento) => posicionar('REGRAS', evento.nativeEvent.layout.y)}
      >
        {detalhes.regras.map((regra) => (
          <View key={regra} style={styles.regra}>
            <Icone nome="check" tamanho={16} cor={cores.primaria} espessura={2.2} />
            <Text style={styles.texto}>{regra}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard
        recuado
        icone="coins"
        titulo="Quantidade e validade"
        onLayout={(evento) => posicionar('QUANTIDADE', evento.nativeEvent.layout.y)}
      >
        <View style={styles.quantidade}>
          <View style={styles.quantidadeColuna}>
            <Text style={styles.rotulo}>Usos permitidos</Text>
            <Text style={styles.valor}>{detalhes.limite}</Text>
            <Text style={styles.extra}>({detalhes.valor})</Text>
          </View>
          <View style={styles.quantidadeDireita}>
            <IconBox nome="calendar" tamanho={28} redondo />
            <View style={styles.quantidadeColuna}>
              <Text style={styles.rotulo}>Próxima renovação</Text>
              <Text style={styles.valor}>{detalhes.renovacao}</Text>
              {detalhes.emQuantosDias ? (
                <Text style={styles.extra}>{detalhes.emQuantosDias}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </SectionCard>

      <SectionCard
        recuado
        icone="store"
        titulo="Estabelecimentos conveniados"
        subtitulo="Confira os estabelecimentos onde você pode utilizar seu benefício."
        acao={<SeeAllLink aoPressionar={() => navigation.navigate('Locations')} />}
        onLayout={(evento) => posicionar('ESTABELECIMENTOS', evento.nativeEvent.layout.y)}
      >
        {item.conveniados.length === 0 ? (
          <Text style={styles.texto}>Nenhum estabelecimento ativo no momento.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.locaisRolagem}
            contentContainerStyle={styles.locais}
          >
            {item.conveniados.map((conveniado) => (
              <EstablishmentCard key={conveniado.id} conveniado={conveniado} />
            ))}
          </ScrollView>
        )}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  texto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    lineHeight: 19,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    marginLeft: -RECUO_SECAO,
    marginTop: espaco.xs,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.azulSuave,
  },
  avisoTexto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.texto,
    lineHeight: 17,
  },
  regra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
  },
  quantidade: {
    flexDirection: 'row',
  },
  quantidadeColuna: {
    flex: 1,
    gap: 2,
  },
  quantidadeDireita: {
    flex: 1.15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    paddingLeft: espaco.md,
    borderLeftWidth: 1,
    borderLeftColor: cores.borda,
  },
  rotulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
  },
  valor: {
    fontFamily: familia.semi,
    fontSize: fonte.base,
    color: cores.texto,
  },
  extra: {
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
  },
  locaisRolagem: {
    marginLeft: -RECUO_SECAO,
  },
  locais: {
    gap: espaco.sm,
  },
});
