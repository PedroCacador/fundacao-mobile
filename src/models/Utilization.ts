export type StatusUtilizacao =
  | 'PENDENTE'
  | 'APROVADA'
  | 'REPROVADA'
  | 'ESTORNADA'
  | 'EXPIRADA'
  | 'CANCELADA';

export interface Utilizacao {
  id: number;
  status: StatusUtilizacao;
  valor_aplicado: number;
  canal_validacao: 'APP_CONVENIADO' | 'TERMINAL_IOT' | null;
  data_solicitacao: string;
  data_expiracao?: string | null;
  expira_em?: string | null;
  codigo_validacao?: string | null;
  data_confirmacao: string | null;
  observacoes: string | null;
  origem: 'BENEFICIO' | 'CAMPANHA';
  beneficio_id: number | null;
  item_campanha_id: number | null;
  beneficio_nome: string;
  conveniado_id: number;
  conveniado_nome_fantasia: string;
  conveniado_categoria: string;
  conveniado_endereco: string;
  colaborador_nome: string;
  token_qrcode?: string | null;
}

export type DecisaoStatus = 'APROVADA' | 'REPROVADA';

export interface DecisaoUtilizacaoPayload {
  status: DecisaoStatus;
  canal_validacao: 'APP_CONVENIADO';
  observacoes?: string | null;
}
