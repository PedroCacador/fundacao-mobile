import type { UsuarioMobile } from './Auth';

export const filtrosCarteira = ['TODOS', 'DISPONIVEIS', 'UTILIZADOS', 'EXPIRADOS'] as const;
export const periodosHistorico = ['MES', 'TRIMESTRE', 'SEMESTRE'] as const;
export type FiltroCarteira = (typeof filtrosCarteira)[number];
export type PeriodoHistorico = (typeof periodosHistorico)[number];
export type ContaPreferencias = Pick<UsuarioMobile, 'id' | 'escopo'>;

export interface PreferenciasConta {
  filtroCarteira: FiltroCarteira;
  periodoHistorico: PeriodoHistorico;
}

export const preferenciasPadrao: Readonly<PreferenciasConta> = {
  filtroCarteira: 'TODOS',
  periodoHistorico: 'TRIMESTRE',
};

export function normalizarPreferencias(valor: unknown): PreferenciasConta {
  const dados = valor && typeof valor === 'object' ? valor : {};
  return {
    filtroCarteira:
      'filtroCarteira' in dados && filtrosCarteira.some((filtro) => filtro === dados.filtroCarteira)
        ? (dados.filtroCarteira as FiltroCarteira)
        : preferenciasPadrao.filtroCarteira,
    periodoHistorico:
      'periodoHistorico' in dados &&
      periodosHistorico.some((periodo) => periodo === dados.periodoHistorico)
        ? (dados.periodoHistorico as PeriodoHistorico)
        : preferenciasPadrao.periodoHistorico,
  };
}
