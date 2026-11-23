import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Conveniado } from '../../models/Benefit';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { categoriasDoConveniado } from '../../utils/benefit';
import { estiloCategoria } from '../../utils/category';
import { Chip } from '../common/Chip';
import { Icone, IconBox } from '../common/Icon';

interface EstablishmentCardProps {
  conveniado: Conveniado;
  aoPressionar?: () => void;
}

export function EstablishmentCard({ conveniado, aoPressionar }: EstablishmentCardProps) {
  const categoria = categoriasDoConveniado(conveniado)[0] ?? 'Outros';
  const estilo = estiloCategoria(categoria);

  const conteudo = (
    <View style={styles.card}>
      <IconBox nome={estilo.icone} cor={estilo.cor} fundo={estilo.fundo} tamanho={56} />
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={2}>
          {conveniado.nome_fantasia}
        </Text>
        <View style={styles.endereco}>
          <Icone nome="map-pin" tamanho={11} cor={cores.textoSecundario} />
          <Text style={styles.enderecoTexto} numberOfLines={2}>
            {conveniado.endereco}
          </Text>
        </View>
        <Chip pequeno texto={categoria} />
      </View>
    </View>
  );

  if (aoPressionar) {
    return (
      <Pressable onPress={aoPressionar} style={({ pressed }) => pressed && styles.pressionado}>
        {conteudo}
      </Pressable>
    );
  }

  return conteudo;
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    padding: espaco.sm,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nome: {
    fontFamily: familia.semi,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  endereco: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 3,
  },
  enderecoTexto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.xxs,
    color: cores.textoSecundario,
  },
  pressionado: {
    opacity: 0.8,
  },
});
