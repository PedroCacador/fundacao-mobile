import { RespostaPaginada } from '../models/Pagination';
import { StatusUtilizacao, Utilizacao } from '../models/Utilization';
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
};
