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

  async buscarConveniadoPorId(id: number): Promise<Conveniado> {
    try {
      return await requisitar<Conveniado>(`/conveniados/${id}`);
    } catch {
      const todos = await requisitar<Conveniado[]>('/conveniados');
      const encontrado = todos.find((c) => c.id === id);
      if (!encontrado) {
        throw new Error(`Conveniado #${id} não encontrado.`);
      }
      return encontrado;
    }
  },
};
