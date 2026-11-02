import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import type { PeriodoHistorico } from '../models/Preferences';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { utilizationService } from '../services/utilizationService';
import { dataParaApi } from '../utils/format';

export type { PeriodoHistorico } from '../models/Preferences';

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
  periodo: PeriodoHistorico;
  lista: Utilizacao[];
  erro: string | null;
}

async function buscarHistorico(
  meses: number,
  periodo: PeriodoHistorico,
): Promise<ResultadoHistorico> {
  const inicio = new Date();
  inicio.setMonth(inicio.getMonth() - meses);
  try {
    return {
      periodo,
      lista: await utilizationService.listarMinhas(dataParaApi(inicio)),
      erro: null,
    };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar o histórico.';
    return { periodo, lista: [], erro };
  }
}

export function useHistoryViewModel() {
  const {
    preferencias,
    definirPeriodoHistorico,
    carregando: carregandoPreferencias,
    erro: erroPreferencias,
    tentarDeNovo: tentarPreferencias,
  } = usePreferences();
  const periodo = preferencias.periodoHistorico;
  const [resultado, setResultado] = useState<ResultadoHistorico | null>(null);
  const [periodoAtualizando, setPeriodoAtualizando] = useState<PeriodoHistorico | null>(null);
  const versaoRequisicao = useRef(0);
  const montado = useRef(false);

  const selecionado = periodos.find((opcao) => opcao.id === periodo) ?? periodos[1];

  useEffect(() => {
    montado.current = true;
    const versao = ++versaoRequisicao.current;
    if (carregandoPreferencias)
      return () => {
        montado.current = false;
        versaoRequisicao.current += 1;
      };
    let ativo = true;
    buscarHistorico(selecionado.meses, periodo).then((novo) => {
      if (ativo && versao === versaoRequisicao.current) {
        setResultado(novo);
        setPeriodoAtualizando(null);
      }
    });
    return () => {
      ativo = false;
      montado.current = false;
      versaoRequisicao.current += 1;
    };
  }, [selecionado.meses, periodo, carregandoPreferencias]);

  const escolherPeriodo = useCallback(
    (novo: PeriodoHistorico) => {
      setResultado(null);
      setPeriodoAtualizando(null);
      definirPeriodoHistorico(novo);
    },
    [definirPeriodoHistorico],
  );

  const tentarDeNovo = useCallback(async () => {
    if (!montado.current || carregandoPreferencias) return;
    const versao = ++versaoRequisicao.current;
    setResultado(null);
    const novo = await buscarHistorico(selecionado.meses, periodo);
    if (montado.current && versao === versaoRequisicao.current) {
      setResultado(novo);
      setPeriodoAtualizando(null);
    }
  }, [selecionado.meses, periodo, carregandoPreferencias]);

  const recarregar = useCallback(async () => {
    if (!montado.current || carregandoPreferencias) return;
    const versao = ++versaoRequisicao.current;
    setPeriodoAtualizando(periodo);
    const novo = await buscarHistorico(selecionado.meses, periodo);
    if (montado.current && versao === versaoRequisicao.current) {
      setResultado(novo);
      setPeriodoAtualizando(null);
    }
  }, [selecionado.meses, periodo, carregandoPreferencias]);

  const atual = !carregandoPreferencias && resultado?.periodo === periodo ? resultado : null;

  return {
    periodo,
    setPeriodo: escolherPeriodo,
    frasePeriodo: selecionado.frase,
    lista: atual?.lista ?? [],
    carregando: atual === null,
    erro: atual?.erro ?? null,
    atualizando: periodoAtualizando === periodo && !carregandoPreferencias,
    carregandoPreferencias,
    erroPreferencias,
    tentarPreferencias,
    tentarDeNovo,
    recarregar,
  };
}
