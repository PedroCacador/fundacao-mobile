import { RespostaPaginada } from '../models/Pagination';
import {
  DecisaoStatus,
  DecisaoUtilizacaoPayload,
  StatusUtilizacao,
  Utilizacao,
} from '../models/Utilization';
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

  listarPendentes() {
    return requisitar<Utilizacao[]>('/eu/utilizacoes?status=PENDENTE');
  },

  listarHistoricoConveniado(filtros?: { de?: string; ate?: string }) {
    const consulta = filtros ? montarConsulta(filtros) : '';
    const url = consulta ? `/eu/utilizacoes?${consulta}` : '/eu/utilizacoes';
    return requisitar<Utilizacao[]>(url);
  },

  buscarPorId(id: number) {
    return requisitar<Utilizacao>(`/eu/utilizacoes/${id}`).catch(() => {
      return requisitar<Utilizacao[]>('/eu/utilizacoes').then((lista) => {
        const encontrada = lista.find((item) => item.id === id);
        if (!encontrada) {
          throw new Error(`Utilização #${id} não encontrada.`);
        }
        return encontrada;
      });
    });
  },

  async buscarPorTokenOuCodigo(codigo: string): Promise<Utilizacao> {
    const limpo = codigo.trim();
    if (!limpo) {
      throw new Error('Informe o código do QR Code para validar.');
    }

    const idNumerico = Number(limpo);
    if (Number.isInteger(idNumerico) && idNumerico > 0) {
      return this.buscarPorId(idNumerico);
    }

    try {
      const parsed = JSON.parse(limpo);
      if (parsed?.id && Number.isInteger(Number(parsed.id))) {
        return this.buscarPorId(Number(parsed.id));
      }
    } catch {
      // Valor não é JSON, segue fluxo de comparação textual
    }

    const lista = await requisitar<Utilizacao[]>('/eu/utilizacoes');
    const encontrada = lista.find(
      (item) => item.token_qrcode === limpo || String(item.id) === limpo,
    );
    if (!encontrada) {
      throw new Error('Resgate não encontrado ou já processado.');
    }
    return encontrada;
  },

  decidirUtilizacao(id: number, acao: DecisaoStatus, observacoes?: string) {
    const corpo: DecisaoUtilizacaoPayload = {
      status: acao,
      canal_validacao: 'APP_CONVENIADO',
      observacoes: observacoes ?? `Decisão tomada via aplicativo do conveniado (${acao}).`,
    };

    return requisitar<Utilizacao>(`/eu/utilizacoes/${id}`, {
      metodo: 'PUT',
      corpo,
    }).catch(() => {
      return requisitar<Utilizacao>(`/utilizacoes/${id}`, {
        metodo: 'PUT',
        corpo,
      });
    });
  },
};
