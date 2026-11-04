import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { Paginacao } from '../models/Pagination';
import type { PeriodoHistorico } from '../models/Preferences';
import { StatusUtilizacao, Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { utilizationService } from '../services/utilizationService';
import { dataParaApi, plural } from '../utils/format';

export type { PeriodoHistorico } from '../models/Preferences';

export type FiltroStatusHistorico = 'TODOS' | StatusUtilizacao;

export const ITENS_POR_PAGINA = 10;

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

interface Consulta {
  periodo: PeriodoHistorico;
  meses: number;
  status: FiltroStatusHistorico;
  pagina: number;
}

interface ResultadoHistorico {
  chave: string;
  lista: Utilizacao[];
  paginacao: Paginacao | null;
  erro: string | null;
}

function chaveDe({ periodo, status, pagina }: Consulta) {
  return `${periodo}|${status}|${pagina}`;
}

async function buscarHistorico(consulta: Consulta): Promise<ResultadoHistorico> {
  const inicio = new Date();
  inicio.setMonth(inicio.getMonth() - consulta.meses);
  try {
    const resposta = await utilizationService.listarMinhas({
      pagina: consulta.pagina,
      limite: ITENS_POR_PAGINA,
      de: dataParaApi(inicio),
      status: consulta.status === 'TODOS' ? undefined : consulta.status,
    });
    return {
      chave: chaveDe(consulta),
      lista: resposta.dados,
      paginacao: resposta.paginacao,
      erro: null,
    };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar o histórico.';
    return { chave: chaveDe(consulta), lista: [], paginacao: null, erro };
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
  const [status, setStatusLocal] = useState<FiltroStatusHistorico>('TODOS');
  const [pagina, setPagina] = useState(1);
  const [resultado, setResultado] = useState<ResultadoHistorico | null>(null);
  const [chaveAtualizando, setChaveAtualizando] = useState<string | null>(null);
  const versaoRequisicao = useRef(0);
  const montado = useRef(false);

  const selecionado = periodos.find((opcao) => opcao.id === periodo) ?? periodos[1];
  const meses = selecionado.meses;
  const chave = chaveDe({ periodo, meses, status, pagina });

  const aplicar = useCallback((novo: ResultadoHistorico, paginaPedida: number) => {
    const ultima = novo.paginacao?.totalPaginas ?? 0;
    if (ultima > 0 && paginaPedida > ultima) {
      setPagina(ultima);
      return;
    }
    setResultado(novo);
    setChaveAtualizando(null);
  }, []);

  useEffect(() => {
    montado.current = true;
    const versao = ++versaoRequisicao.current;
    if (carregandoPreferencias)
      return () => {
        montado.current = false;
        versaoRequisicao.current += 1;
      };
    let ativo = true;
    buscarHistorico({ periodo, meses, status, pagina }).then((novo) => {
      if (ativo && versao === versaoRequisicao.current) aplicar(novo, pagina);
    });
    return () => {
      ativo = false;
      montado.current = false;
      versaoRequisicao.current += 1;
    };
  }, [periodo, meses, status, pagina, carregandoPreferencias, aplicar]);

  const escolherPeriodo = useCallback(
    (novo: PeriodoHistorico) => {
      setResultado(null);
      setChaveAtualizando(null);
      setPagina(1);
      definirPeriodoHistorico(novo);
    },
    [definirPeriodoHistorico],
  );

  const escolherStatus = useCallback((novo: FiltroStatusHistorico) => {
    setResultado(null);
    setChaveAtualizando(null);
    setPagina(1);
    setStatusLocal(novo);
  }, []);

  const irParaPagina = useCallback((nova: number) => {
    setResultado(null);
    setChaveAtualizando(null);
    setPagina(Math.max(1, nova));
  }, []);

  const repetir = useCallback(
    async (mostrarAtualizando: boolean) => {
      if (!montado.current || carregandoPreferencias) return;
      const atual = { periodo, meses, status, pagina };
      const versao = ++versaoRequisicao.current;
      if (mostrarAtualizando) setChaveAtualizando(chaveDe(atual));
      else setResultado(null);
      const novo = await buscarHistorico(atual);
      if (montado.current && versao === versaoRequisicao.current) aplicar(novo, pagina);
    },
    [periodo, meses, status, pagina, carregandoPreferencias, aplicar],
  );

  const tentarDeNovo = useCallback(() => repetir(false), [repetir]);
  const recarregar = useCallback(() => repetir(true), [repetir]);

  const atual = !carregandoPreferencias && resultado?.chave === chave ? resultado : null;
  const total = atual?.paginacao?.total ?? 0;

  return {
    periodo,
    setPeriodo: escolherPeriodo,
    frasePeriodo: selecionado.frase,
    status,
    setStatus: escolherStatus,
    lista: atual?.lista ?? [],
    pagina: atual?.paginacao?.pagina ?? pagina,
    totalPaginas: atual?.paginacao?.totalPaginas ?? 0,
    total,
    resumoTotal: `${total} ${plural(total, 'utilização', 'utilizações')} ${selecionado.frase}`,
    paginaAnterior: () => irParaPagina(pagina - 1),
    proximaPagina: () => irParaPagina(pagina + 1),
    carregando: atual === null,
    erro: atual?.erro ?? null,
    atualizando: chaveAtualizando === chave && !carregandoPreferencias,
    carregandoPreferencias,
    erroPreferencias,
    tentarPreferencias,
    tentarDeNovo,
    recarregar,
  };
}
