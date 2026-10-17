import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type StatusType = 'DISPONIVEL' | 'UTILIZADO' | 'EXPIRADO' | 'PENDENTE';

interface StatusBadgeProps {
  status: StatusType | string;
  rotuloPersonalizado?: string;
}

export const StatusBadge = React.memo(function StatusBadge({
  status,
  rotuloPersonalizado,
}: StatusBadgeProps) {
  const normalizado = status.toUpperCase();

  let fundo = '#EFF6FF';
  let cor = '#2563EB';
  let texto = rotuloPersonalizado ?? 'Disponível';

  switch (normalizado) {
    case 'DISPONIVEL':
    case 'DISPONÍVEL':
    case 'ATIVO':
      fundo = '#DCFCE7';
      cor = '#15803D';
      texto = rotuloPersonalizado ?? 'Disponível';
      break;
    case 'UTILIZADO':
    case 'CONFIRMADO':
      fundo = '#DBEAFE';
      cor = '#1D4ED8';
      texto = rotuloPersonalizado ?? 'Utilizado';
      break;
    case 'EXPIRADO':
    case 'INATIVO':
      fundo = '#FEE2E2';
      cor = '#B91C1C';
      texto = rotuloPersonalizado ?? 'Expirado';
      break;
    case 'PENDENTE':
    case 'EM_ANALISE':
      fundo = '#FEF3C7';
      cor = '#B45309';
      texto = rotuloPersonalizado ?? 'Pendente';
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: fundo }]}>
      <Text style={[styles.texto, { color: cor }]}>{texto}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
