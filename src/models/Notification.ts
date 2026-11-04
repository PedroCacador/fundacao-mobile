import { StatusUtilizacao } from './Utilization';

export type TipoNotificacao = 'RENOVACAO' | 'UTILIZACAO' | 'BENEFICIO' | 'CAMPANHA';

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  quando: string | null;
  fonte: string;
  statusUtilizacao?: StatusUtilizacao;
}
