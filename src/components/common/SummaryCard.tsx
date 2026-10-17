import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SummaryCardProps {
  icone: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  valor: string | number;
  rotulo: string;
  corIcone?: string;
  fundoIcone?: string;
  larguraFixa?: boolean;
}

export const SummaryCard = React.memo(function SummaryCard({
  icone,
  valor,
  rotulo,
  corIcone = '#2563EB',
  fundoIcone = '#EFF6FF',
}: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconeContainer, { backgroundColor: fundoIcone }]}>
        <MaterialCommunityIcons name={icone} size={20} color={corIcone} />
      </View>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.rotulo} numberOfLines={2}>
        {rotulo}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  valor: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B2A4A',
    marginBottom: 2,
  },
  rotulo: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
});
