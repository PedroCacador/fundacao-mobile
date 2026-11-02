import type { PreferenciasConta } from '../models/Preferences';
import { preferenciasPadrao } from '../models/Preferences';

export interface EstadoPreferencias {
  valores: PreferenciasConta;
  alteracoes: Partial<PreferenciasConta>;
  carregando: boolean;
  hidratado: boolean;
  salvando: boolean;
  erro: string | null;
  revisao: number;
}

type AcaoPreferencias =
  | { tipo: 'CARREGAR' }
  | { tipo: 'CARREGADO'; valores: PreferenciasConta }
  | { tipo: 'ALTERAR'; valores: Partial<PreferenciasConta> }
  | { tipo: 'SALVANDO' | 'SALVO'; revisao: number }
  | { tipo: 'FALHA_GRAVACAO'; revisao: number; mensagem: string }
  | { tipo: 'FALHA_LEITURA'; mensagem: string }
  | { tipo: 'REPETIR_GRAVACAO' };

export function estadoPreferenciasInicial(habilitado: boolean): EstadoPreferencias {
  return {
    valores: { ...preferenciasPadrao },
    alteracoes: {},
    carregando: habilitado,
    hidratado: false,
    salvando: false,
    erro: null,
    revisao: 0,
  };
}

export function preferencesReducer(
  estado: EstadoPreferencias,
  acao: AcaoPreferencias,
): EstadoPreferencias {
  if ('revisao' in acao && acao.revisao !== estado.revisao) return estado;
  switch (acao.tipo) {
    case 'CARREGAR':
      return { ...estado, carregando: true, erro: null };
    case 'CARREGADO':
      return {
        ...estado,
        valores: { ...acao.valores, ...estado.alteracoes },
        carregando: false,
        hidratado: true,
        erro: null,
      };
    case 'FALHA_LEITURA':
      return { ...estado, carregando: false, erro: acao.mensagem };
    case 'ALTERAR':
      if (
        Object.entries(acao.valores).every(
          ([chave, valor]) => estado.valores[chave as keyof PreferenciasConta] === valor,
        )
      )
        return estado;
      return {
        ...estado,
        valores: { ...estado.valores, ...acao.valores },
        alteracoes: { ...estado.alteracoes, ...acao.valores },
        revisao: estado.revisao + 1,
      };
    case 'SALVANDO':
      return { ...estado, salvando: true, erro: null };
    case 'SALVO':
      return { ...estado, alteracoes: {}, salvando: false, erro: null };
    case 'FALHA_GRAVACAO':
      return { ...estado, salvando: false, erro: acao.mensagem };
    case 'REPETIR_GRAVACAO':
      return { ...estado, revisao: estado.revisao + 1 };
  }
}
