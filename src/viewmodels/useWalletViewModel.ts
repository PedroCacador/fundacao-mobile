import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { BeneficioCatalogo } from '../models/Catalog';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { utilizationService } from '../services/utilizationService';
import { beneficiosAtivos } from '../utils/benefit';
import { formatarData, lerData } from '../utils/format';

export interface EntradaBeneficio {
  chave: string;
  catalogo: BeneficioCatalogo;
  ultimaUtilizacao: string | null;
}

interface ResultadoUtilizacoes {
  lista: Utilizacao[];
  erro: string | null;
}

async function buscarAprovadas(): Promise<ResultadoUtilizacoes> {
  try {
    return { lista: await utilizationService.listarAprovadas(), erro: null };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar suas utilizações.';
    return { lista: [], erro };
  }
}

function ultimasPorBeneficio(lista: Utilizacao[]) {
  const beneficios = new Map<number, string>();
  for (const utilizacao of lista) {
    if (utilizacao.status !== 'APROVADA' || utilizacao.beneficio_id === null) continue;
    const data = utilizacao.data_confirmacao ?? utilizacao.data_solicitacao;
    const anterior = beneficios.get(utilizacao.beneficio_id);
    if (!anterior || data > anterior) beneficios.set(utilizacao.beneficio_id, data);
  }
  return beneficios;
}

function formatar(data: string | undefined) {
  return data ? formatarData(lerData(data)) : null;
}

export function useWalletViewModel() {
  const { itens, carregando, atualizando, erro, recarregar: recarregarCatalogo } = useCatalog();
  const [utilizacoes, setUtilizacoes] = useState<ResultadoUtilizacoes | null>(null);
  const versao = useRef(0);

  useEffect(() => {
    const atual = ++versao.current;
    buscarAprovadas().then((novo) => {
      if (atual === versao.current) setUtilizacoes(novo);
    });
    return () => {
      versao.current += 1;
    };
  }, []);

  const recarregarUtilizacoes = useCallback(async () => {
    const atual = ++versao.current;
    const novo = await buscarAprovadas();
    if (atual === versao.current) setUtilizacoes(novo);
  }, []);

  const tentarUtilizacoes = useCallback(async () => {
    setUtilizacoes(null);
    await recarregarUtilizacoes();
  }, [recarregarUtilizacoes]);

  const recarregar = useCallback(async () => {
    await Promise.all([recarregarCatalogo(), recarregarUtilizacoes()]);
  }, [recarregarCatalogo, recarregarUtilizacoes]);

  const lista = useMemo<EntradaBeneficio[]>(() => {
    const ultimas = ultimasPorBeneficio(utilizacoes?.lista ?? []);
    return beneficiosAtivos(itens).map((catalogo) => ({
      chave: `beneficio-${catalogo.beneficio.id}`,
      catalogo,
      ultimaUtilizacao: formatar(ultimas.get(catalogo.beneficio.id)),
    }));
  }, [itens, utilizacoes]);

  return {
    lista,
    carregando,
    atualizando,
    erro,
    recarregar,
    erroUtilizacoes: utilizacoes?.erro ?? null,
    tentarUtilizacoes,
  };
}
