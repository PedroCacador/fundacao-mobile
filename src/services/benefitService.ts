import { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import { requisitar } from './api';

export const benefitService = {
  async listarCatalogo() {
    const [beneficios, ofertas, conveniados] = await Promise.all([
      requisitar<Beneficio[]>('/beneficios'),
      requisitar<Oferta[]>('/ofertas'),
      requisitar<Conveniado[]>('/conveniados'),
    ]);
    return { beneficios, ofertas, conveniados };
  },
};
