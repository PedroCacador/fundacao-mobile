export type TipoNotificacao = 'RENOVACAO' | 'CAMPANHA';

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  quando: string;
}
