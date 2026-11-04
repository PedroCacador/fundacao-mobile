import { useCallback, useEffect, useRef, useState } from 'react';
import { Campanha } from '../models/Campaign';
import { ItemCampanhaCatalogo } from '../models/Catalog';
import { ApiError } from '../services/api';
import { campaignService } from '../services/campaignService';
import { montarItensCampanha } from '../utils/campaign';

interface ResultadoCampanhas {
  campanhas: Campanha[];
  itens: ItemCampanhaCatalogo[];
  erro: string | null;
}

async function buscarCampanhas(): Promise<ResultadoCampanhas> {
  try {
    const dados = await campaignService.listarCatalogo();
    return {
      campanhas: dados.campanhas,
      itens: montarItensCampanha(dados.campanhas, dados.itens, dados.ofertas, dados.conveniados),
      erro: null,
    };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar as campanhas.';
    return { campanhas: [], itens: [], erro };
  }
}

export function useCampaignCatalog() {
  const [resultado, setResultado] = useState<ResultadoCampanhas | null>(null);
  const versao = useRef(0);

  useEffect(() => {
    const atual = ++versao.current;
    buscarCampanhas().then((novo) => {
      if (atual === versao.current) setResultado(novo);
    });
    return () => {
      versao.current += 1;
    };
  }, []);

  const recarregar = useCallback(async () => {
    const atual = ++versao.current;
    const novo = await buscarCampanhas();
    if (atual === versao.current) setResultado(novo);
  }, []);

  const tentarDeNovo = useCallback(async () => {
    setResultado(null);
    await recarregar();
  }, [recarregar]);

  return {
    campanhas: resultado?.campanhas ?? [],
    itens: resultado?.itens ?? [],
    carregando: resultado === null,
    erro: resultado?.erro ?? null,
    recarregar,
    tentarDeNovo,
  };
}
