export interface BenefitSummary {
  totalBeneficios: number;
  utilizacoesRestantes: number;
  proximaRenovacao: string;
}

export interface BenefitCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  utilizacoesRestantes: number;
}
