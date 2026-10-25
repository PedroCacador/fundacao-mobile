import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cores, espaco, familia, fonte } from '../../theme';
import { Icone } from './Icon';
import { Logo } from './Logo';

interface PageHeaderProps {
  titulo: string;
  subtitulo: string;
}

export function PageHeader({ titulo, subtitulo }: PageHeaderProps) {
  const navigation = useNavigation();

  const voltar = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Main', { screen: 'Home' });
  };

  return (
    <View style={styles.cabecalho}>
      <Pressable
        onPress={voltar}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        style={({ pressed }) => [styles.voltar, pressed && styles.pressionado]}
      >
        <Icone nome="chevron-left" tamanho={26} cor={cores.texto} />
      </Pressable>
      <View style={styles.textos}>
        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>
      <Logo largura={84} />
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espaco.md,
    marginBottom: espaco.lg,
  },
  voltar: {
    paddingTop: 2,
  },
  pressionado: {
    opacity: 0.7,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.titulo,
    lineHeight: 28,
    color: cores.texto,
  },
  subtitulo: {
    marginTop: 2,
    fontFamily: familia.regular,
    fontSize: fonte.md,
    lineHeight: 18,
    color: cores.textoSecundario,
  },
});
