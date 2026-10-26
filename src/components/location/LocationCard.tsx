import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LocalConveniado } from '../../models/Catalog';

import { cores, espaco, fonte, familia, raio } from '../../theme';

import { estiloCategoria } from '../../utils/category';

import { Card } from '../common/Card';
import { IconBox, Icone } from '../common/Icon';

interface LocationCardProps {
  local: LocalConveniado;
}

export function LocationCard({ local }: LocationCardProps) {
  const { conveniado, beneficios } = local;

  const estilo = estiloCategoria(conveniado.categoria);

  return (
    <Card estilo={styles.card}>
      <View style={styles.topo}>
        <IconBox nome={estilo.icone} cor={estilo.cor} fundo={estilo.fundo} tamanho={64} />

        <View style={styles.info}>
          <Text style={styles.nome}>{conveniado.nome_fantasia}</Text>

          <View style={styles.linha}>
            <Icone nome="map-pin" tamanho={15} cor={cores.textoFraco} />

            <Text style={styles.endereco}>{conveniado.endereco}</Text>
          </View>

          <View style={styles.linha}>
            <Icone nome={estilo.icone} tamanho={15} cor={estilo.cor} />

            <Text style={styles.categoria}>{conveniado.categoria}</Text>
          </View>
        </View>
      </View>

      <View style={styles.aceita}>
        <Text style={styles.aceitaTitulo}>Aceita os seguintes benefícios:</Text>

        <View style={styles.chips}>
          {beneficios.map((beneficio) => (
            <View key={beneficio.id} style={styles.chip}>
              <Icone nome="gift" tamanho={14} cor={cores.primaria} />

              <Text style={styles.chipTexto}>{beneficio.nome}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: espaco.md,
    gap: espaco.md,
  },

  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },

  info: {
    flex: 1,
    gap: espaco.xs,
  },

  nome: {
    fontSize: fonte.lg,
    fontFamily: familia.negrito,
    color: cores.texto,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
  },

  endereco: {
    flex: 1,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },

  categoria: {
    fontSize: fonte.sm,
    fontFamily: familia.semi,
    color: cores.texto,
  },

  aceita: {
    gap: espaco.sm,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.primariaClara,
  },

  aceitaTitulo: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.xs,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    paddingHorizontal: espaco.sm,
    paddingVertical: 3,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaClara,
  },

  chipTexto: {
    fontSize: fonte.xs,
    fontFamily: familia.semi,
    color: cores.primaria,
  },
});
