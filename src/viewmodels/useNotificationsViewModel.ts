import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Campanha } from '../models/Campaign';
import { Notificacao, TipoNotificacao } from '../models/Notification';
import { ApiError } from '../services/api';
import { campaignService } from '../services/campaignService';
import { calcularProximaRenovacao } from '../utils/benefit';
import { diasAte, formatarData, lerData, plural } from '../utils/format';

export type FiltroNotificacao = 'TODAS' | TipoNotificacao;

const DIAS_PARA_AVISAR_RENOVACAO = 30;

interface ResultadoCampanhas {
  campanhas: Campanha[];
  erro: string | null;
}

async function buscarCampanhas(): Promise<ResultadoCampanhas> {
  try {
    return { campanhas: await campaignService.listar(), erro: null };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar as campanhas.';
    return { campanhas: [], erro };
  }
}

function descreverPrazo(dias: number) {
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  return `Em ${dias} ${plural(dias, 'dia', 'dias')}`;
}

export function useNotificationsViewModel() {
  const catalogo = useCatalog();
  const [resultado, setResultado] = useState<ResultadoCampanhas | null>(null);
  const [filtro, setFiltro] = useState<FiltroNotificacao>('TODAS');

  useEffect(() => {
    let ativo = true;
    buscarCampanhas().then((novo) => {
      if (ativo) setResultado(novo);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const tentarDeNovo = useCallback(async () => {
    setResultado(null);
    setResultado(await buscarCampanhas());
  }, []);

  const notificacoes = useMemo(() => {
    const lista: (Notificacao & { dias: number })[] = [];

    for (const item of catalogo.itens) {
      const renovacao = item.disponivel ? calcularProximaRenovacao(item.beneficio) : null;
      if (!renovacao) continue;
      const dias = diasAte(renovacao);
      if (dias > DIAS_PARA_AVISAR_RENOVACAO) continue;
      lista.push({
        id: `renovacao-${item.beneficio.id}`,
        tipo: 'RENOVACAO',
        titulo: 'Renovação do benefício',
        mensagem: `Seu benefício ${item.beneficio.nome} renova em ${formatarData(renovacao)}. Aproveite!`,
        quando: descreverPrazo(dias),
        dias,
      });
    }

    for (const campanha of resultado?.campanhas ?? []) {
      const dias = diasAte(lerData(campanha.data_fim));
      if (campanha.status !== 'ATIVA' || dias < 0) continue;
      lista.push({
        id: `campanha-${campanha.id}`,
        tipo: 'CAMPANHA',
        titulo: campanha.nome,
        mensagem: campanha.descricao ?? 'Confira a nova campanha da FCV.',
        quando: `Até ${formatarData(lerData(campanha.data_fim))}`,
        dias,
      });
    }

    return lista.sort((a, b) => a.dias - b.dias);
  }, [catalogo.itens, resultado]);

  const lista = useMemo(
    () => notificacoes.filter((item) => filtro === 'TODAS' || item.tipo === filtro),
    [notificacoes, filtro],
  );

  return {
    lista,
    filtro,
    setFiltro,
    carregando: catalogo.carregando || resultado === null,
    erro: resultado?.erro ?? null,
    tentarDeNovo,
  };
}
