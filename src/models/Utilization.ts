export type StatusUtilizacao = 'PENDENTE' | 'APROVADA' | 'REPROVADA' | 'ESTORNADA';

export interface Utilizacao {
  id: number;
  status: StatusUtilizacao;
  valor_aplicado: number;
  canal_validacao: 'APP_CONVENIADO' | 'TERMINAL_IOT' | null;
  data_solicitacao: string;
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
}
