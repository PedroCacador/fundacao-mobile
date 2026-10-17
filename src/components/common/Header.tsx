import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
  iconeEsquerda?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export const Header = React.memo(function Header({
  titulo,
  subtitulo,
  iconeEsquerda = 'wallet-outline',
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topo}>
        <View style={styles.iconeWrapper}>
          <MaterialCommunityIcons name={iconeEsquerda} size={26} color="#1B2A4A" />
        </View>
        <Text style={styles.logoTexto}>
          <Text style={styles.logoNegrito}>FCV</Text>
          <Text style={styles.logoSub}> Fundação Cristiano Varella</Text>
        </Text>
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  iconeWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTexto: {
    fontSize: 13,
    color: '#1B2A4A',
  },
  logoNegrito: {
    fontWeight: '800',
    fontSize: 15,
    color: '#1B2A4A',
  },
  logoSub: {
    color: '#64748B',
    fontWeight: '500',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B2A4A',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
});
