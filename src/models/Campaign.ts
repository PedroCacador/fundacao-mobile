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
