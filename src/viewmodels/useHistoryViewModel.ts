import { useState } from 'react';

export type PeriodoHistorico =
  | 'MES'
  | 'TRIMESTRE'
  | 'SEMESTRE';

export const periodos: {
  id: PeriodoHistorico;
  label: string;
  frase: string;
}[] = [
  {
    id: 'MES',
    label: 'Último mês',
    frase: 'no último mês',
  },
  {
    id: 'TRIMESTRE',
    label: 'Últimos 3 meses',
    frase: 'nos últimos 3 meses',
  },
  {
    id: 'SEMESTRE',
    label: 'Últimos 6 meses',
    frase: 'nos últimos 6 meses',
  },
];

export function useHistoryViewModel() {
  const [periodo, setPeriodo] =
    useState<PeriodoHistorico>('TRIMESTRE');

  const selecionado =
    periodos.find(
      (opcao) => opcao.id === periodo
    ) ?? periodos[1];

  return {
    periodo,
    setPeriodo,
    frasePeriodo: selecionado.frase,
  };
}