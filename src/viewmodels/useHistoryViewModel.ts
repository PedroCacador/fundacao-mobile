import { useCallback, useEffect, useState } from 'react';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { utilizationService } from '../services/utilizationService';
import { dataParaApi } from '../utils/format';

export type PeriodoHistorico = 'MES' | 'TRIMESTRE' | 'SEMESTRE';

export const periodos: {
  id: PeriodoHistorico;
  label: string;
  frase: string;
  meses: number;
}[] = [
  {
    id: 'MES',
    label: 'Último mês',
    frase: 'no último mês',
    meses: 1,
  },
  {
    id: 'TRIMESTRE',
    label: 'Últimos 3 meses',
    frase: 'nos últimos 3 meses',
    meses: 3,
  },
  {
    id: 'SEMESTRE',
    label: 'Últimos 6 meses',
    frase: 'nos últimos 6 meses',
    meses: 6,
  },
];

interface ResultadoHistorico {
  lista: Utilizacao[];
  erro: string | null;
}

async function buscarHistorico(meses: number): Promise<ResultadoHistorico> {
  const inicio = new Date();
  inicio.setMonth(inicio.getMonth() - meses);
  try {
    return { lista: await utilizationService.listarMinhas(dataParaApi(inicio)), erro: null };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar o histórico.';
    return { lista: [], erro };
  }
}

export function useHistoryViewModel() {
  const [periodo, setPeriodo] = useState<PeriodoHistorico>('TRIMESTRE');
  const [resultado, setResultado] = useState<ResultadoHistorico | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  const selecionado = periodos.find((opcao) => opcao.id === periodo) ?? periodos[1];

  useEffect(() => {
    let ativo = true;
    buscarHistorico(selecionado.meses).then((novo) => {
      if (ativo) setResultado(novo);
    });
    return () => {
      ativo = false;
    };
  }, [selecionado.meses]);

  const escolherPeriodo = useCallback((novo: PeriodoHistorico) => {
    setResultado(null);
    setPeriodo(novo);
  }, []);

  const tentarDeNovo = useCallback(async () => {
    setResultado(null);
    setResultado(await buscarHistorico(selecionado.meses));
  }, [selecionado.meses]);

  const recarregar = useCallback(async () => {
    setAtualizando(true);
    setResultado(await buscarHistorico(selecionado.meses));
    setAtualizando(false);
  }, [selecionado.meses]);

  return {
    periodo,
    setPeriodo: escolherPeriodo,
    frasePeriodo: selecionado.frase,
    lista: resultado?.lista ?? [],
    carregando: resultado === null,
    erro: resultado?.erro ?? null,
    atualizando,
    tentarDeNovo,
    recarregar,
  };
}
