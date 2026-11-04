import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Notificacao, TipoNotificacao } from '../models/Notification';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { utilizationService } from '../services/utilizationService';
import { calcularProximaRenovacao } from '../utils/benefit';
import { situacaoDaCampanha } from '../utils/campaign';
import { dataParaApi, diasAte, formatarData, formatarHora, lerData, plural } from '../utils/format';
import { useCampaignCatalog } from './useCampaignCatalog';

export type FiltroNotificacao = 'TODAS' | TipoNotificacao;

const DIAS_PARA_AVISAR_RENOVACAO = 30;
const DIAS_DE_UTILIZACOES = 30;
const LIMITE_UTILIZACOES = 20;

type Aviso = Notificacao & { distancia: number };

export type FonteAviso = 'CATALOGO' | 'UTILIZACOES' | 'CAMPANHAS';

interface Falha {
  fonte: FonteAviso;
  tipos: TipoNotificacao[];
  erro: string | null;
  mensagem: string;
}

interface ResultadoUtilizacoes {
  lista: Utilizacao[];
  erro: string | null;
}

async function buscarUtilizacoes(): Promise<ResultadoUtilizacoes> {
  const inicio = new Date();
  inicio.setDate(inicio.getDate() - DIAS_DE_UTILIZACOES);
  try {
    const resposta = await utilizationService.listarMinhas({
      pagina: 1,
      limite: LIMITE_UTILIZACOES,
      de: dataParaApi(inicio),
    });
    return { lista: resposta.dados, erro: null };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar suas utilizações.';
    return { lista: [], erro };
  }
}

function descreverPrazo(dias: number) {
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  return `Em ${dias} ${plural(dias, 'dia', 'dias')}`;
}

function descreverMomento(dataHora: string) {
  const dias = diasAte(lerData(dataHora));
  const hora = formatarHora(dataHora);
  if (dias === 0) return `Hoje ${hora}`;
  if (dias === -1) return `Ontem ${hora}`;
  return `${formatarData(lerData(dataHora))} ${hora}`;
}

const textoUtilizacao: Record<
  Utilizacao['status'],
  { titulo: string; mensagem: (utilizacao: Utilizacao) => string }
> = {
  APROVADA: {
    titulo: 'Utilização confirmada',
    mensagem: (u) =>
      `Sua utilização de ${u.beneficio_nome} no ${u.conveniado_nome_fantasia} foi aprovada.`,
  },
  PENDENTE: {
    titulo: 'Utilização aguardando confirmação',
    mensagem: (u) =>
      `Sua utilização de ${u.beneficio_nome} no ${u.conveniado_nome_fantasia} ainda está pendente.`,
  },
  REPROVADA: {
    titulo: 'Utilização reprovada',
    mensagem: (u) =>
      `Sua utilização de ${u.beneficio_nome} no ${u.conveniado_nome_fantasia} foi reprovada.${
        u.observacoes ? ` Motivo: ${u.observacoes}` : ''
      }`,
  },
  ESTORNADA: {
    titulo: 'Utilização estornada',
    mensagem: (u) =>
      `Sua utilização de ${u.beneficio_nome} no ${u.conveniado_nome_fantasia} foi estornada pela FCV.${
        u.observacoes ? ` Observação: ${u.observacoes}` : ''
      }`,
  },
};

export function useNotificationsViewModel() {
  const catalogo = useCatalog();
  const campanhas = useCampaignCatalog();
  const [utilizacoes, setUtilizacoes] = useState<ResultadoUtilizacoes | null>(null);
  const [filtro, setFiltro] = useState<FiltroNotificacao>('TODAS');
  const versao = useRef(0);

  useEffect(() => {
    const atual = ++versao.current;
    buscarUtilizacoes().then((novo) => {
      if (atual === versao.current) setUtilizacoes(novo);
    });
    return () => {
      versao.current += 1;
    };
  }, []);

  const tentarUtilizacoes = useCallback(async () => {
    const atual = ++versao.current;
    setUtilizacoes(null);
    const novo = await buscarUtilizacoes();
    if (atual === versao.current) setUtilizacoes(novo);
  }, []);

  const avisos = useMemo(() => {
    const lista: Aviso[] = [];

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
        fonte: 'regra de renovação do benefício',
        distancia: dias,
      });
    }

    for (const utilizacao of utilizacoes?.lista ?? []) {
      const momento = utilizacao.data_confirmacao ?? utilizacao.data_solicitacao;
      const texto = textoUtilizacao[utilizacao.status];
      lista.push({
        id: `utilizacao-${utilizacao.id}`,
        tipo: 'UTILIZACAO',
        titulo: texto.titulo,
        mensagem: texto.mensagem(utilizacao),
        quando: descreverMomento(momento),
        fonte: 'seu histórico de utilizações',
        statusUtilizacao: utilizacao.status,
        distancia: Math.abs(diasAte(lerData(momento))),
      });
    }

    for (const item of catalogo.itens) {
      const { beneficio } = item;
      if (beneficio.status === 'INATIVO') {
        lista.push({
          id: `beneficio-inativo-${beneficio.id}`,
          tipo: 'BENEFICIO',
          titulo: 'Benefício inativo',
          mensagem: `O benefício ${beneficio.nome} está inativo no momento e não pode ser utilizado.`,
          quando: null,
          fonte: 'status do benefício',
          distancia: Number.POSITIVE_INFINITY,
        });
      } else if (beneficio.status === 'ATIVO' && item.conveniados.length === 0) {
        lista.push({
          id: `beneficio-sem-local-${beneficio.id}`,
          tipo: 'BENEFICIO',
          titulo: 'Benefício sem estabelecimento ativo',
          mensagem: `O benefício ${beneficio.nome} ainda não tem estabelecimento conveniado ativo.`,
          quando: null,
          fonte: 'estabelecimentos conveniados do benefício',
          distancia: Number.POSITIVE_INFINITY,
        });
      }
    }

    for (const campanha of campanhas.campanhas) {
      if (situacaoDaCampanha(campanha) !== 'VIGENTE') continue;
      const fim = lerData(campanha.data_fim);
      lista.push({
        id: `campanha-${campanha.id}`,
        tipo: 'CAMPANHA',
        titulo: campanha.nome,
        mensagem: campanha.descricao ?? 'Confira os itens desta campanha na tela de Início.',
        quando: `Até ${formatarData(fim)}`,
        fonte: 'campanhas e eventos da FCV',
        distancia: diasAte(fim),
      });
    }

    return lista.sort((a, b) => a.distancia - b.distancia);
  }, [catalogo.itens, utilizacoes, campanhas.campanhas]);

  const lista = useMemo(
    () => avisos.filter((aviso) => filtro === 'TODAS' || aviso.tipo === filtro),
    [avisos, filtro],
  );

  const erroCatalogo = catalogo.erro;
  const erroUtilizacoes = utilizacoes?.erro ?? null;
  const erroCampanhas = campanhas.erro;

  const falhas = useMemo(() => {
    const todas: Falha[] = [
      {
        fonte: 'CATALOGO',
        tipos: ['RENOVACAO', 'BENEFICIO'],
        erro: erroCatalogo,
        mensagem: `Avisos de renovação e de benefícios indisponíveis. ${erroCatalogo}`,
      },
      {
        fonte: 'UTILIZACOES',
        tipos: ['UTILIZACAO'],
        erro: erroUtilizacoes,
        mensagem: `Avisos de utilização indisponíveis. ${erroUtilizacoes}`,
      },
      {
        fonte: 'CAMPANHAS',
        tipos: ['CAMPANHA'],
        erro: erroCampanhas,
        mensagem: `Avisos de campanhas indisponíveis. ${erroCampanhas}`,
      },
    ];
    return todas.filter(
      (falha) => falha.erro !== null && (filtro === 'TODAS' || falha.tipos.includes(filtro)),
    );
  }, [erroCatalogo, erroUtilizacoes, erroCampanhas, filtro]);

  const recarregarCatalogo = catalogo.recarregar;
  const tentarCampanhas = campanhas.tentarDeNovo;
  const tentarFonte = useCallback(
    (fonte: FonteAviso) => {
      if (fonte === 'CATALOGO') void recarregarCatalogo();
      else if (fonte === 'UTILIZACOES') void tentarUtilizacoes();
      else void tentarCampanhas();
    },
    [recarregarCatalogo, tentarUtilizacoes, tentarCampanhas],
  );

  const carregandoFiltro: Record<FiltroNotificacao, boolean> = {
    TODAS: catalogo.carregando || campanhas.carregando || utilizacoes === null,
    RENOVACAO: catalogo.carregando,
    BENEFICIO: catalogo.carregando,
    UTILIZACAO: utilizacoes === null,
    CAMPANHA: campanhas.carregando,
  };

  const textoVazio: Record<FiltroNotificacao, string> = {
    TODAS: 'Avisos de renovação, utilização, benefícios e campanhas da FCV aparecem nesta tela.',
    RENOVACAO: 'Nenhum benefício renova nos próximos 30 dias.',
    UTILIZACAO: 'Nenhuma utilização nos últimos 30 dias.',
    BENEFICIO: 'Nenhuma mudança nos seus benefícios agora.',
    CAMPANHA: 'Nenhuma campanha ou evento vigente no momento.',
  };

  return {
    lista,
    filtro,
    setFiltro,
    carregando: carregandoFiltro[filtro],
    falhas,
    tentarFonte,
    textoVazio: textoVazio[filtro],
    indisponivel: lista.length === 0 && falhas.length > 0,
  };
}
