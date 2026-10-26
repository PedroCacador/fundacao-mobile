import { Utilizacao } from '../models/Utilization';
import { requisitar } from './api';

export const utilizationService = {
  listarMinhas(de: string) {
    return requisitar<Utilizacao[]>(`/eu/utilizacoes?de=${de}`);
  },
};
