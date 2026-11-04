import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { BeneficioCatalogo, ItemCampanhaCatalogo } from '../models/Catalog';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { utilizationService } from '../services/utilizationService';
import { resumirCatalogo } from '../utils/benefit';
import { formatarData, lerData } from '../utils/format';
import { useCampaignCatalog } from './useCampaignCatalog';

export type FiltroCarteira = 'TODOS' | 'DISPONIVEIS' | 'UTILIZADOS' | 'EXPIRADOS';

export type EntradaCarteira =
  | {
      tipo: 'BENEFICIO';
      chave: string;
      catalogo: BeneficioCatalogo;
      ultimaUtilizacao: string | null;
    }
  | {
      tipo: 'CAMPANHA';
      chave: string;
      dados: ItemCampanhaCatalogo;
      status: 'DISPONIVEL' | 'UTILIZADO' | 'EXPIRADO';
      ultimaUtilizacao: string | null;
    };

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

function ultimasPorOrigem(lista: Utilizacao[]) {
  const beneficios = new Map<number, string>();
  const itens = new Map<number, string>();
  for (const utilizacao of lista) {
    if (utilizacao.status !== 'APROVADA') continue;
    const data = utilizacao.data_confirmacao ?? utilizacao.data_solicitacao;
    const destino =
      utilizacao.beneficio_id !== null
        ? { mapa: beneficios, id: utilizacao.beneficio_id }
        : utilizacao.item_campanha_id !== null
          ? { mapa: itens, id: utilizacao.item_campanha_id }
          : null;
    if (!destino) continue;
    const anterior = destino.mapa.get(destino.id);
    if (!anterior || data > anterior) destino.mapa.set(destino.id, data);
  }
  return { beneficios, itens };
}

function formatar(data: string | undefined) {
  return data ? formatarData(lerData(data)) : null;
}

export function useWalletViewModel() {
  const { itens, carregando, atualizando, erro, recarregar: recarregarCatalogo } = useCatalog();
  const campanhas = useCampaignCatalog();
  const [filtro, setFiltro] = useState<FiltroCarteira>('TODOS');
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

  const recarregarCampanhas = campanhas.recarregar;
  const recarregar = useCallback(async () => {
    await Promise.all([recarregarCatalogo(), recarregarCampanhas(), recarregarUtilizacoes()]);
  }, [recarregarCatalogo, recarregarCampanhas, recarregarUtilizacoes]);

  const resumo = useMemo(() => resumirCatalogo(itens), [itens]);

  const entradas = useMemo<EntradaCarteira[]>(() => {
    const ultimas = ultimasPorOrigem(utilizacoes?.lista ?? []);
    const deBeneficios: EntradaCarteira[] = itens.map((catalogo) => ({
      tipo: 'BENEFICIO',
      chave: `beneficio-${catalogo.beneficio.id}`,
      catalogo,
      ultimaUtilizacao: formatar(ultimas.beneficios.get(catalogo.beneficio.id)),
    }));
    const deCampanhas: EntradaCarteira[] = campanhas.itens.map((dados) => {
      const ultima = formatar(ultimas.itens.get(dados.item.id));
      return {
        tipo: 'CAMPANHA',
        chave: `campanha-${dados.item.id}`,
        dados,
        status: dados.situacao === 'EXPIRADA' ? 'EXPIRADO' : ultima ? 'UTILIZADO' : 'DISPONIVEL',
        ultimaUtilizacao: ultima,
      };
    });
    return [...deBeneficios, ...deCampanhas];
  }, [itens, campanhas.itens, utilizacoes]);

  const lista = useMemo(() => {
    return entradas.filter((entrada) => {
      if (filtro === 'TODOS') return true;
      if (filtro === 'UTILIZADOS') return entrada.ultimaUtilizacao !== null;
      if (entrada.tipo === 'BENEFICIO') {
        return filtro === 'DISPONIVEIS' && entrada.catalogo.disponivel;
      }
      const expirado = entrada.dados.situacao === 'EXPIRADA';
      return filtro === 'EXPIRADOS' ? expirado : !expirado && entrada.dados.conveniados.length > 0;
    });
  }, [entradas, filtro]);

  const mensagemVazia: Record<FiltroCarteira, string> = {
    TODOS: 'Você ainda não tem benefícios na carteira.',
    DISPONIVEIS: 'Nenhum benefício ou item de campanha disponível agora.',
    UTILIZADOS: 'Nenhuma utilização aprovada até agora.',
    EXPIRADOS: 'Nenhum item de campanha encerrada.',
  };

  return {
    lista,
    filtro,
    setFiltro,
    resumo,
    textoVazio: mensagemVazia[filtro],
    carregando: carregando || campanhas.carregando || (filtro === 'UTILIZADOS' && !utilizacoes),
    atualizando,
    erro,
    recarregar,
    erroCampanhas: campanhas.erro,
    tentarCampanhas: campanhas.tentarDeNovo,
    erroUtilizacoes: utilizacoes?.erro ?? null,
    tentarUtilizacoes,
  };
}
