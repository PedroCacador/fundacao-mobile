import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { cores, espaco, fonte, peso } from '../../theme';

export function TopBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.barra}>
      <View style={styles.logo}>
        <Text style={styles.sigla}>FCV</Text>
        <View>
          <Text style={styles.nome}>Fundação</Text>
          <Text style={styles.nome}>Cristiano Varella</Text>
        </View>
      </View>
      <Pressable
        onPress={() => navigation.navigate('Notifications')}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
      >
        <MaterialCommunityIcons name="bell-outline" size={24} color={cores.texto} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: espaco.lg,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
  },
  sigla: {
    fontSize: fonte.xxl,
    fontWeight: peso.negrito,
    color: cores.primaria,
    letterSpacing: 1,
  },
  nome: {
    fontSize: fonte.xs,
    fontWeight: peso.semi,
    color: cores.primaria,
    lineHeight: 13,
  },
  botao: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
  },
  pressionado: {
    opacity: 0.7,
  },
});
