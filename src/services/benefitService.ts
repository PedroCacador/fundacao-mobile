import { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import { ApiError, requisitar } from './api';

export const benefitService = {
  async listarBeneficios(token: string) {
    const beneficios = await requisitar<Beneficio[]>('/beneficios', { token });
    if (!Array.isArray(beneficios)) {
      throw new ApiError('A API retornou um formato inválido para GET /beneficios.', 0);
    }
    return beneficios;
  },

  async listarRelacoes(token: string) {
    const [ofertas, conveniados] = await Promise.all([
      requisitar<Oferta[]>('/ofertas', { token }),
      requisitar<Conveniado[]>('/conveniados', { token }),
    ]);

    if (!Array.isArray(ofertas)) {
      throw new ApiError('A API retornou um formato inválido para GET /ofertas.', 0);
    }
    if (!Array.isArray(conveniados)) {
      throw new ApiError('A API retornou um formato inválido para GET /conveniados.', 0);
    }
    return {
      ofertas,
      conveniados,
    };
  },
};
