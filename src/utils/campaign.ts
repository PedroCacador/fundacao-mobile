import type { Conveniado } from '../models/Benefit';
import type { Campanha, ItemCampanha, OfertaCampanha, TipoCampanha } from '../models/Campaign';
import type { ItemCampanhaCatalogo, SituacaoCampanha } from '../models/Catalog';
import { diasAte, lerData } from './format';

export const NOME_TIPO_CAMPANHA: Record<TipoCampanha, string> = {
  CAMPANHA: 'Campanha',
  EVENTO_INTERNO: 'Evento interno',
  EVENTO_PATROCINADO: 'Evento patrocinado',
  VOUCHER: 'Voucher',
  CORTESIA: 'Cortesia',
};

export function situacaoDaCampanha(campanha: Campanha, hoje = new Date()): SituacaoCampanha {
  const fimPassou = diasAte(lerData(campanha.data_fim), hoje) < 0;
  if (campanha.status === 'ENCERRADA' || (campanha.status === 'ATIVA' && fimPassou)) {
    return 'EXPIRADA';
  }
  const comecou = diasAte(lerData(campanha.data_inicio), hoje) <= 0;
  return campanha.status === 'ATIVA' && comecou ? 'VIGENTE' : 'FORA_DO_AR';
}

export function montarItensCampanha(
  campanhas: Campanha[],
  itens: ItemCampanha[],
  ofertas: OfertaCampanha[],
  conveniados: Conveniado[],
  hoje = new Date(),
): ItemCampanhaCatalogo[] {
  const porCampanha = new Map(campanhas.map((campanha) => [campanha.id, campanha]));
  const ativos = new Map(
    conveniados
      .filter((conveniado) => conveniado.status === 'ATIVO')
      .map((conveniado) => [conveniado.id, conveniado]),
  );

  return itens.flatMap((item) => {
    const campanha = porCampanha.get(item.campanha_id);
    if (!campanha) return [];
    const situacao = situacaoDaCampanha(campanha, hoje);
    if (situacao === 'FORA_DO_AR') return [];
    if (situacao === 'VIGENTE' && item.status !== 'ATIVO') return [];
    const locais = ofertas
      .filter((oferta) => oferta.beneficio_campanha_id === item.id && oferta.status === 'ATIVO')
      .flatMap((oferta) => {
        const conveniado = ativos.get(oferta.conveniado_id);
        return conveniado ? [conveniado] : [];
      })
      .sort((a, b) => a.nome_fantasia.localeCompare(b.nome_fantasia));
    return [{ item, campanha, conveniados: locais, situacao }];
  });
}

export function podeResgatar(dados: ItemCampanhaCatalogo) {
  return dados.situacao === 'VIGENTE' && dados.conveniados.length > 0;
}
