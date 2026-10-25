import React from 'react';
import { Image } from 'react-native';

const PROPORCAO = 574 / 114;

export function Logo({ largura = 140 }: { largura?: number }) {
  return (
    <Image
      source={require('../../../assets/logo-fcv.png')}
      style={{ width: largura, height: largura / PROPORCAO }}
      resizeMode="contain"
      accessibilityLabel="Fundação Cristiano Varella, pela vida"
    />
  );
}
