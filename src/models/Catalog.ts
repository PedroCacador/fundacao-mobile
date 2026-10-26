import { Beneficio, Conveniado } from './Benefit';

export interface BeneficioCatalogo {
  beneficio: Beneficio;
  conveniados: Conveniado[];
  categoria: string;
  disponivel: boolean;
}

export interface ResumoCatalogo {
  disponiveis: number;
  locais: number;
  proximaRenovacao: Date | null;
}

export type AbaDetalhe = 'ONDE_USAR' | 'REGRAS' | 'QUANTIDADE' | 'ESTABELECIMENTOS';

export interface LocalConveniado {
  conveniado: Conveniado;
  beneficios: Beneficio[];
}
