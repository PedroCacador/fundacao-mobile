import { useMemo } from 'react';
import { User } from '../models/User';
import { BenefitSummary } from '../models/Benefit';
import { mapearUsuario } from '../models/mapearUsuario';
import { useAuth } from '../context/AuthContext';

export function useHomeViewModel() {
  const { usuario } = useAuth();
  const user: User = useMemo(() => mapearUsuario(usuario!), [usuario]);

  const benefitSummary: BenefitSummary = {
    totalBeneficios: 5,
    utilizacoesRestantes: 18,
    proximaRenovacao: '12/11/2025',
  };

  return { user, benefitSummary };
}
