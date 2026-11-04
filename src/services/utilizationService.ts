import { RespostaPaginada } from '../models/Pagination';
import { StatusUtilizacao, Utilizacao } from '../models/Utilization';
import { requisitar } from './api';

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
  listarMinhas({ pagina, limite, de, status }: FiltroUtilizacoes) {
    const consulta = montarConsulta({ pagina, limite, de, status });
    return requisitar<RespostaPaginada<Utilizacao>>(`/eu/utilizacoes?${consulta}`);
  },
  listarAprovadas() {
    return requisitar<Utilizacao[]>('/eu/utilizacoes?status=APROVADA');
  },
};
