import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/common/Card';
import { FilterTabs, TabOption } from '../../components/common/FilterTabs';
import { Icone, IconBox, NomeIcone } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { EmptyState, Loading } from '../../components/common/StateMessage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { estiloCategoria } from '../../utils/category';
import {
  AbaDetalhe,
  useBenefitDetailsViewModel,
} from '../../viewmodels/useBenefitDetailsViewModel';

const abas: TabOption<AbaDetalhe>[] = [
  { id: 'ONDE_USAR', label: 'Onde usar' },
  { id: 'REGRAS', label: 'Regras' },
  { id: 'QUANTIDADE', label: 'Quantidade' },
  { id: 'ESTABELECIMENTOS', label: 'Estabelecimentos' },
];

export default function BenefitDetailsView({ route }: RootScreenProps<'BenefitDetails'>) {
  const { item, detalhes, aba, setAba, carregando } = useBenefitDetailsViewModel(
    route.params.beneficioId,
  );

  if (carregando) {
    return (
      <Screen bordas={['bottom']}>
        <Loading />
      </Screen>
    );
  }

  if (!item || !detalhes) {
    return (
      <Screen bordas={['bottom']}>
        <EmptyState icone="gift" titulo="Benefício não encontrado" />
      </Screen>
    );
  }

  const { beneficio, conveniados, categoria, disponivel } = item;
  const estilo = estiloCategoria(categoria);

  return (
    <Screen bordas={['bottom']}>
      <Card estilo={styles.banner}>
        <IconBox nome={estilo.icone} cor={estilo.cor} fundo={estilo.fundo} tamanho={64} />
        <View style={styles.bannerInfo}>
          <StatusBadge status={disponivel ? 'DISPONIVEL' : 'INDISPONIVEL'} />
          <Text style={styles.bannerTitulo}>{beneficio.nome}</Text>
          {beneficio.descricao ? (
            <Text style={styles.bannerDescricao}>{beneficio.descricao}</Text>
          ) : null}
        </View>
      </Card>

      <View style={styles.metricas}>
        <Metrica icone="calendar" rotulo="Próxima renovação" valor={detalhes.renovacao} />
        <Metrica icone="tag" rotulo="Usos permitidos" valor={detalhes.limite} />
        <Metrica icone="badge-percent" rotulo="Benefício" valor={detalhes.valor} />
      </View>

      <FilterTabs tabs={abas} selectedTab={aba} onSelectTab={setAba} />

      {aba === 'ONDE_USAR' ? (
        <Secao icone="map-pin" titulo="Onde pode utilizar">
          <Text style={styles.texto}>
            {detalhes.categorias.length > 0
              ? `Válido em estabelecimentos de: ${detalhes.categorias.join(', ')}.`
              : 'Nenhum estabelecimento conveniado ativo para este benefício no momento.'}
          </Text>
        </Secao>
      ) : null}

      {aba === 'REGRAS' ? (
        <Secao icone="file-text" titulo="Regras de utilização">
          {detalhes.regras.map((regra) => (
            <View key={regra} style={styles.regra}>
              <Icone nome="check" tamanho={18} cor={cores.sucesso} />
              <Text style={styles.texto}>{regra}</Text>
            </View>
          ))}
        </Secao>
      ) : null}

      {aba === 'QUANTIDADE' ? (
        <Secao icone="coins" titulo="Quantidade e validade">
          <Text style={styles.texto}>Usos permitidos: {detalhes.limite}</Text>
          <Text style={styles.texto}>
            Próxima renovação: {detalhes.renovacao}
            {detalhes.emQuantosDias ? ` (${detalhes.emQuantosDias})` : ''}
          </Text>
        </Secao>
      ) : null}

      {aba === 'ESTABELECIMENTOS' ? (
        <Secao icone="store" titulo="Estabelecimentos conveniados">
          {conveniados.length === 0 ? (
            <Text style={styles.texto}>Nenhum estabelecimento ativo no momento.</Text>
          ) : (
            conveniados.map((conveniado) => {
              const estiloLocal = estiloCategoria(conveniado.categoria);
              return (
                <View key={conveniado.id} style={styles.local}>
                  <IconBox
                    nome={estiloLocal.icone}
                    cor={estiloLocal.cor}
                    fundo={estiloLocal.fundo}
                    tamanho={40}
                  />
                  <View style={styles.localInfo}>
                    <Text style={styles.localNome}>{conveniado.nome_fantasia}</Text>
                    <Text style={styles.localEndereco}>{conveniado.endereco}</Text>
                    <Text style={styles.localCategoria}>{conveniado.categoria}</Text>
                  </View>
                </View>
              );
            })
          )}
        </Secao>
      ) : null}
    </Screen>
  );
}

function Metrica({ icone, rotulo, valor }: { icone: NomeIcone; rotulo: string; valor: string }) {
  return (
    <Card estilo={styles.metrica}>
      <Icone nome={icone} tamanho={20} cor={cores.primaria} />
      <Text style={styles.metricaRotulo}>{rotulo}</Text>
      <Text style={styles.metricaValor}>{valor}</Text>
    </Card>
  );
}

function Secao({
  icone,
  titulo,
  children,
}: {
  icone: NomeIcone;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card estilo={styles.secao}>
      <View style={styles.secaoTopo}>
        <IconBox nome={icone} tamanho={36} redondo />
        <Text style={styles.secaoTitulo}>{titulo}</Text>
      </View>
      <View style={styles.secaoCorpo}>{children}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.lg,
    marginBottom: espaco.md,
  },
  bannerInfo: {
    flex: 1,
    gap: espaco.xs,
  },
  bannerTitulo: {
    fontSize: fonte.tituloTela,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  bannerDescricao: {
    fontSize: fonte.md,
    color: cores.textoSecundario,
    lineHeight: 18,
  },
  metricas: {
    flexDirection: 'row',
    gap: espaco.sm,
    marginBottom: espaco.lg,
  },
  metrica: {
    flex: 1,
    alignItems: 'center',
    padding: espaco.md,
    gap: espaco.xs,
  },
  metricaRotulo: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  metricaValor: {
    fontSize: fonte.md,
    fontFamily: familia.negrito,
    color: cores.texto,
    textAlign: 'center',
  },
  secao: {
    marginBottom: espaco.md,
  },
  secaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  secaoTitulo: {
    fontSize: fonte.lg,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  secaoCorpo: {
    marginTop: espaco.md,
    gap: espaco.sm,
  },
  texto: {
    flex: 1,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    lineHeight: 20,
  },
  regra: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.sm,
  },
  local: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    paddingVertical: espaco.xs,
  },
  localInfo: {
    flex: 1,
  },
  localNome: {
    fontSize: fonte.md,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  localEndereco: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  localCategoria: {
    fontSize: fonte.xs,
    fontFamily: familia.semi,
    color: cores.primaria,
  },
});
