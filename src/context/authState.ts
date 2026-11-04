import type { UsuarioMobile } from '../models/Auth';

export interface AvisoSessao {
  mensagem: string;
  acao: 'RESTAURAR' | 'LIMPAR_CREDENCIAL' | 'LIMPAR_PREFERENCIAS' | null;
}

export function precisaLimparSessao(aviso: AvisoSessao | null): boolean {
  return aviso?.acao === 'LIMPAR_CREDENCIAL' || aviso?.acao === 'LIMPAR_PREFERENCIAS';
}

type EtapaSessao = 'RESTAURANDO' | 'ANONIMA' | 'AUTENTICANDO' | 'AUTENTICADA' | 'SAINDO';

export interface EstadoAuth {
  etapa: EtapaSessao;
  usuario: UsuarioMobile | null;
  idSessao: number;
  aviso: AvisoSessao | null;
}

type AcaoAuth =
  | { tipo: 'INICIAR'; operacao: number; etapa: 'RESTAURANDO' | 'AUTENTICANDO' | 'SAINDO' }
  | { tipo: 'AUTENTICAR'; operacao: number; usuario: UsuarioMobile }
  | { tipo: 'ENCERRAR'; operacao: number; aviso?: AvisoSessao | null };

export const estadoAuthInicial: EstadoAuth = {
  etapa: 'RESTAURANDO',
  usuario: null,
  idSessao: 0,
  aviso: null,
};

// O reducer só descreve transições. HTTP e persistência ficam no provider/serviços.
export function authReducer(estado: EstadoAuth, acao: AcaoAuth): EstadoAuth {
  if (acao.operacao < estado.idSessao) return estado;
  switch (acao.tipo) {
    case 'INICIAR':
      return { etapa: acao.etapa, usuario: null, idSessao: acao.operacao, aviso: null };
    case 'AUTENTICAR':
      return { etapa: 'AUTENTICADA', usuario: acao.usuario, idSessao: acao.operacao, aviso: null };
    case 'ENCERRAR':
      return {
        etapa: 'ANONIMA',
        usuario: null,
        idSessao: acao.operacao,
        aviso: acao.aviso ?? null,
      };
  }
}
