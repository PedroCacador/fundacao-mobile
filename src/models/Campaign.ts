export type TipoCampanha =
  'CAMPANHA' | 'EVENTO_INTERNO' | 'EVENTO_PATROCINADO' | 'VOUCHER' | 'CORTESIA';

export type StatusCampanha = 'PLANEJADA' | 'ATIVA' | 'ENCERRADA' | 'CANCELADA';

export interface Campanha {
  id: number;
  nome: string;
  tipo: TipoCampanha;
  descricao: string | null;
  data_inicio: string;
  data_fim: string;
  criterio_elegibilidade: string | null;
  patrocinador: string | null;
  status: StatusCampanha;
}
export interface ItemCampanha {
  id: number;
  campanha_id: number;
  nome: string;
  descricao: string | null;
  tipo_beneficio: 'PERCENTUAL' | 'VALOR_FIXO';
  valor: number;
  quantidade_maxima_utilizacoes: number | null;
  status: 'ATIVO' | 'INATIVO';
}
export interface OfertaCampanha {
  id: number;
  beneficio_campanha_id: number;
  conveniado_id: number;
  status: 'ATIVO' | 'INATIVO';
}

