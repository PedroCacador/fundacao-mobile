import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBadge, StatusType } from '../common/StatusBadge';

export interface ItemBeneficioCarteira {
  id: number;
  nome: string;
  descricao?: string | null;
  categoria: string;
  status: StatusType;
  utilizacoesFeitas: number;
  utilizacoesMaximas: number;
  dataRenovacao: string;
  icone: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  corIcone: string;
  fundoIcone: string;
}

interface BenefitCardProps {
  beneficio: ItemBeneficioCarteira;
  onPress: () => void;
  onPressRegras?: () => void;
}

export const BenefitCard = React.memo(function BenefitCard({
  beneficio,
  onPress,
  onPressRegras,
}: BenefitCardProps) {
  const porcentagem =
    beneficio.utilizacoesMaximas > 0
      ? Math.min(
          100,
          Math.round((beneficio.utilizacoesFeitas / beneficio.utilizacoesMaximas) * 100),
        )
      : 0;

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.card}>
      <View style={styles.corpo}>
        {/* Ícone da Categoria */}
        <View style={[styles.iconeBox, { backgroundColor: beneficio.fundoIcone }]}>
          <MaterialCommunityIcons name={beneficio.icone} size={24} color={beneficio.corIcone} />
        </View>

        {/* Informações Centrais */}
        <View style={styles.info}>
          <View style={styles.topoLinha}>
            <Text style={styles.titulo} numberOfLines={1}>
              {beneficio.nome}
            </Text>
            <StatusBadge status={beneficio.status} />
          </View>

          {beneficio.descricao ? (
            <Text style={styles.descricao} numberOfLines={2}>
              {beneficio.descricao}
            </Text>
          ) : null}

          {/* Contador de Utilizações */}
          <View style={styles.utilizacoesContainer}>
            <Text style={styles.utilizacoesTexto}>
              <Text style={styles.utilizacoesDestaque}>{beneficio.utilizacoesFeitas}</Text> de{' '}
              {beneficio.utilizacoesMaximas}{' '}
              {beneficio.status === 'DISPONIVEL' ? 'utilizações restantes' : 'utilizações'}
            </Text>

            {/* Barra de Progresso */}
            <View style={styles.barraFundo}>
              <View
                style={[
                  styles.barraPreenchimento,
                  {
                    width: `${porcentagem}%`,
                    backgroundColor:
                      beneficio.status === 'EXPIRADO'
                        ? '#EF4444'
                        : beneficio.status === 'UTILIZADO'
                          ? '#64748B'
                          : '#10B981',
                  },
                ]}
              />
            </View>
          </View>

          {/* Rodapé do Card: Data de renovação / validade e regras */}
          <View style={styles.rodape}>
            <View style={styles.renovacaoBox}>
              <MaterialCommunityIcons
                name={
                  beneficio.status === 'EXPIRADO'
                    ? 'calendar-remove-outline'
                    : 'calendar-clock-outline'
                }
                size={15}
                color={beneficio.status === 'EXPIRADO' ? '#EF4444' : '#64748B'}
              />
              <Text
                style={[
                  styles.renovacaoTexto,
                  beneficio.status === 'EXPIRADO' && styles.renovacaoTextoExpirado,
                ]}
              >
                {beneficio.status === 'EXPIRADO'
                  ? `Validade encerrada em ${beneficio.dataRenovacao}`
                  : `Renovação em ${beneficio.dataRenovacao}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onPressRegras ?? onPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.regrasBotao}
            >
              <MaterialCommunityIcons name="information-outline" size={14} color="#2563EB" />
              <Text style={styles.regrasTexto}>Regras de utilização</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  corpo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconeBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  topoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  titulo: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2A4A',
  },
  descricao: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  utilizacoesContainer: {
    marginTop: 6,
    marginBottom: 12,
  },
  utilizacoesTexto: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  utilizacoesDestaque: {
    fontWeight: '700',
    color: '#1B2A4A',
  },
  barraFundo: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraPreenchimento: {
    height: '100%',
    borderRadius: 3,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    flexWrap: 'wrap',
    gap: 8,
  },
  renovacaoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  renovacaoTexto: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  renovacaoTextoExpirado: {
    color: '#DC2626',
    fontWeight: '600',
  },
  regrasBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  regrasTexto: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
});
