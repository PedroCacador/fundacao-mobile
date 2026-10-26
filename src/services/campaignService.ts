import { Campanha } from '../models/Campaign';
import { requisitar } from './api';

export const campaignService = {
  listar() {
    return requisitar<Campanha[]>('/campanhas');
  },
};
