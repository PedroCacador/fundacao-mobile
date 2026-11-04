import { Beneficio, Conveniado } from './Benefit';
import { Campanha, ItemCampanha } from './Campaign';

export type SituacaoCampanha = 'VIGENTE' | 'EXPIRADA' | 'FORA_DO_AR';

export interface ItemCampanhaCatalogo {
  item: ItemCampanha;
  campanha: Campanha;
  conveniados: Conveniado[];
  situacao: SituacaoCampanha;
}

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
