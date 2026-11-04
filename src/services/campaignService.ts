import { Conveniado } from '../models/Benefit';
import { Campanha, ItemCampanha, OfertaCampanha } from '../models/Campaign';
import { requisitar } from './api';

export const campaignService = {
  async listarCatalogo() {
    const [campanhas, itens, ofertas, conveniados] = await Promise.all([
      requisitar<Campanha[]>('/campanhas'),
      requisitar<ItemCampanha[]>('/itens-campanha'),
      requisitar<OfertaCampanha[]>('/ofertas-campanha'),
      requisitar<Conveniado[]>('/conveniados'),
    ]);
    return { campanhas, itens, ofertas, conveniados };
  },
};
