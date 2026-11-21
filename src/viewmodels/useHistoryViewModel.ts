import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { listarUtilizacoesDesde } from '../services/utilizationService';
import { dataParaApi, plural } from '../utils/format';
import { consultarHistorico, inicioDoPeriodo, MESES_HISTORICO } from '../utils/utilization';

interface ResultadoHistorico {
  utilizacoes: Utilizacao[];
  consultadoEm: Date;
  erro: string | null;
}

async function buscarHistorico(): Promise<ResultadoHistorico> {
  const consultadoEm = new Date();
  try {
    const utilizacoes = await listarUtilizacoesDesde(dataParaApi(inicioDoPeriodo(consultadoEm)));
    return { utilizacoes, consultadoEm, erro: null };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar o histórico.';
    return { utilizacoes: [], consultadoEm, erro };
  }
}

export function useHistoryViewModel() {
  const { itens } = useCatalog();
  const [busca, setBusca] = useState('');
  const [resultado, setResultado] = useState<ResultadoHistorico | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const versao = useRef(0);

  useEffect(() => {
    const atual = ++versao.current;
    buscarHistorico().then((novo) => {
      if (atual === versao.current) setResultado(novo);
    });
    return () => {
      versao.current += 1;
    };
  }, []);

  const recarregar = useCallback(async () => {
    const atual = ++versao.current;
    setAtualizando(true);
    const novo = await buscarHistorico();
    if (atual === versao.current) {
      setResultado(novo);
      setAtualizando(false);
    }
  }, []);

  const tentarDeNovo = useCallback(async () => {
    const atual = ++versao.current;
    setResultado(null);
    const novo = await buscarHistorico();
    if (atual === versao.current) setResultado(novo);
  }, []);

  const descricoes = useMemo(
    () =>
      new Map(
        itens.flatMap(({ beneficio }) =>
          beneficio.descricao ? [[beneficio.id, beneficio.descricao] as const] : [],
        ),
      ),
    [itens],
  );

  const lista = useMemo(
    () =>
      resultado
        ? consultarHistorico({
            utilizacoes: resultado.utilizacoes,
            agora: resultado.consultadoEm,
            termo: busca,
            descricoes,
          })
        : [],
    [resultado, busca, descricoes],
  );

  const buscaAtiva = busca.trim().length > 0;
  const sufixo = `nos últimos ${MESES_HISTORICO} meses`;

  return {
    busca,
    setBusca,
    buscaAtiva,
    lista,
    resumoTotal: `${lista.length} ${plural(lista.length, 'resgate', 'resgates')} ${
      buscaAtiva ? `${plural(lista.length, 'encontrado', 'encontrados')} ` : ''
    }${sufixo}`,
    carregando: resultado === null,
    erro: resultado?.erro ?? null,
    atualizando,
    tentarDeNovo,
    recarregar,
  };
}
