import { User } from '../models/User';
import { BenefitSummary } from '../models/Benefit';

export function useHomeViewModel() {
  const user: User = {
    name: 'Ana Carolina Silva',
    role: 'Colaboradora da FCV',
    matricula: '4587',
    email: 'ana.carolina@email.com',
    phone: '(31) 98765-4321',
    cpf: '123.456.789-00',
    cargo: 'Analista Administrativo',
    setor: 'Administrativo',
    emailCorporativo: 'ana.silva@fcv.org.br',
  };

  const benefitSummary: BenefitSummary = {
    totalBeneficios: 5,
    utilizacoesRestantes: 18,
    proximaRenovacao: '12/11/2025',
  };

  return { user, benefitSummary };
}
