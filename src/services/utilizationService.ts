import { RespostaPaginada } from '../models/Pagination';
import {
  DecisaoStatus,
  DecisaoUtilizacaoPayload,
  StatusUtilizacao,
  Utilizacao,
} from '../models/Utilization';
import { ApiError, requisitar } from './api';

export interface FiltroUtilizacoes {
  pagina: number;
  limite: number;
  de: string;
  status?: StatusUtilizacao;
}

function montarConsulta(parametros: Record<string, string | number | undefined>) {
  return Object.entries(parametros)
    .filter((par): par is [string, string | number] => par[1] !== undefined)
    .map(([chave, valor]) => `${chave}=${encodeURIComponent(String(valor))}`)
    .join('&');
}

export const utilizationService = {
  async listarMinhas({ pagina, limite, de, status }: FiltroUtilizacoes) {
    const consulta = montarConsulta({ pagina, limite, de, status });
    const resposta = await requisitar<RespostaPaginada<Utilizacao> | Utilizacao[]>(
      `/eu/utilizacoes?${consulta}`,
    );
    if (Array.isArray(resposta)) {
      throw new ApiError(
        'Esta versão do servidor ainda não disponibiliza o histórico paginado.',
        502,
      );
    }
    if (!Array.isArray(resposta?.dados) || !resposta.paginacao) {
      throw new ApiError('O servidor retornou um histórico em formato inválido.', 502);
    }
    return resposta;
  },

  listarAprovadas() {
    return requisitar<Utilizacao[]>('/eu/utilizacoes?status=APROVADA');
  },

  listarPendentes() {
    return requisitar<Utilizacao[]>('/eu/utilizacoes?status=PENDENTE');
  },

  listarAguardando() {
    return requisitar<Utilizacao[]>('/eu/aguardando');
  },

  listarHistoricoConveniado(filtros?: { de?: string; ate?: string }) {
    const consulta = filtros ? montarConsulta(filtros) : '';
    const url = consulta ? `/eu/utilizacoes?${consulta}` : '/eu/utilizacoes';
    return requisitar<Utilizacao[]>(url);
  },

  async buscarPorTokenOuCodigo(codigo: string): Promise<Utilizacao> {
    const limpo = codigo.trim();
    if (!limpo) {
      throw new Error('Informe o código do QR Code para validar.');
    }

    return requisitar<Utilizacao>(`/validacao/${encodeURIComponent(limpo)}`);
  },

  decidirUtilizacao(codigo: string, acao: DecisaoStatus, motivo?: string) {
    const limpo = codigo.trim();
    if (!limpo) {
      throw new Error('Informe o código do resgate para registrar a decisão.');
    }

    const decisao = acao === 'APROVADA' ? 'aprovar' : 'reprovar';
    const corpo: DecisaoUtilizacaoPayload = {
      canal_validacao: 'APP_CONVENIADO',
      ...(motivo ? { motivo } : {}),
    };
    return requisitar<Utilizacao>(
      `/validacao/${encodeURIComponent(limpo)}/${decisao}`,
      {
        metodo: 'POST',
        corpo,
      },
    );
  },
};

const LIMITE_PAGINA_HISTORICO = 100;

export async function listarUtilizacoesDesde(de: string) {
  const todas: Utilizacao[] = [];
  let pagina = 1;
  let totalPaginas = 1;
  while (pagina <= totalPaginas) {
    const consulta = montarConsulta({ pagina, limite: LIMITE_PAGINA_HISTORICO, de });
    const resposta = await requisitar<RespostaPaginada<Utilizacao> | Utilizacao[]>(
      `/eu/utilizacoes?${consulta}`,
    );
    if (Array.isArray(resposta)) {
      return resposta;
    }
    if (
      !Array.isArray(resposta?.dados) ||
      !resposta.paginacao ||
      !Number.isInteger(resposta.paginacao.pagina) ||
      resposta.paginacao.pagina !== pagina ||
      !Number.isInteger(resposta.paginacao.totalPaginas) ||
      resposta.paginacao.totalPaginas < 0
    ) {
      throw new ApiError('O servidor retornou um histórico em formato inválido.', 502);
    }
    todas.push(...resposta.dados);
    totalPaginas = resposta.paginacao.totalPaginas;
    pagina += 1;
  }
  return todas;
}
