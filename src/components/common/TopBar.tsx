import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cores, espaco } from '../../theme';
import { Icone } from './Icon';
import { Logo } from './Logo';

interface TopBarProps {
  voltar?: boolean;
  perfil?: boolean;
}

export function TopBar({ voltar = false, perfil = false }: TopBarProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.barra}>
      <View style={styles.esquerda}>
        {voltar ? (
          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Voltar ao início"
          >
            <Icone nome="chevron-left" tamanho={26} cor={cores.texto} />
          </Pressable>
        ) : null}
        <Logo largura={voltar ? 128 : 140} />
      </View>
      <View style={styles.direita}>
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
          style={({ pressed }) => [styles.sino, pressed && styles.pressionado]}
        >
          <Icone nome="bell" tamanho={24} cor={cores.texto} />
        </Pressable>
        {perfil ? (
          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Perfil"
            style={({ pressed }) => [styles.perfil, pressed && styles.pressionado]}
          >
            <Icone nome="user" tamanho={22} cor={cores.texto} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: espaco.lg,
    minHeight: 44,
  },
  esquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  direita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  sino: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfil: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.primariaClara,
  },
  pressionado: {
    opacity: 0.7,
  },
});
