import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, IconBox, NomeIcone } from './Icon';

export interface ItemResumo {
  icone: NomeIcone;
  valor: string | number;
  rotulo: string;
  cor?: string;
  fundo?: string;
  largo?: boolean;
}

interface SummaryCardProps {
  titulo?: string;
  itens: ItemResumo[];
  slogan?: 'texto' | 'caixa';
}

export function SummaryCard({ titulo, itens, slogan = 'texto' }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.arcoMaior} />
      <View style={styles.arcoMenor} />
      {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
      <View style={styles.linha}>
        {itens.map((item, indice) => (
          <View
            key={item.rotulo}
            style={[styles.item, item.largo && styles.itemLargo, indice > 0 && styles.divisor]}
          >
            <IconBox
              nome={item.icone}
              cor={item.cor ?? cores.primaria}
              fundo={item.fundo ?? cores.primariaClara}
              tamanho={44}
              redondo
            />
            <Text style={styles.valor} numberOfLines={1}>
              {item.valor}
            </Text>
            <Text style={styles.rotulo}>{item.rotulo}</Text>
          </View>
        ))}
        <View style={[styles.slogan, slogan === 'caixa' ? styles.sloganCaixa : styles.divisor]}>
          {slogan === 'caixa' ? (
            <View style={styles.sloganIcone}>
              <Icone nome="heart" tamanho={14} cor={cores.primaria} />
            </View>
          ) : null}
          <Text style={styles.sloganTexto}>Mais benefícios, mais para você.</Text>
          <View style={styles.sloganTraco} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.azulSuave,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.bordaAzul,
    paddingVertical: espaco.lg,
    paddingHorizontal: espaco.md,
    marginBottom: espaco.lg,
    overflow: 'hidden',
  },
  arcoMaior: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 16,
    borderColor: cores.decoracao,
  },
  arcoMenor: {
    position: 'absolute',
    top: 40,
    right: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: cores.decoracao,
  },
  titulo: {
    fontFamily: familia.semi,
    fontSize: fonte.lg,
    color: cores.texto,
    marginBottom: espaco.md,
    marginLeft: espaco.xs,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 2,
  },
  itemLargo: {
    flex: 1.35,
  },
  divisor: {
    borderLeftWidth: 1,
    borderLeftColor: cores.bordaAzul,
  },
  valor: {
    fontFamily: familia.negrito,
    fontSize: fonte.lg,
    color: cores.texto,
    marginTop: espaco.xs,
  },
  rotulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    lineHeight: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
  slogan: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: espaco.md,
    gap: espaco.sm,
  },
  sloganCaixa: {
    backgroundColor: cores.primariaClara,
    borderRadius: raio.md,
    marginLeft: espaco.sm,
    paddingVertical: espaco.sm,
    paddingRight: espaco.xs,
  },
  sloganIcone: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sloganTexto: {
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    lineHeight: 16,
    color: cores.primariaSuave,
  },
  sloganTraco: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: cores.primariaTraco,
  },
});
