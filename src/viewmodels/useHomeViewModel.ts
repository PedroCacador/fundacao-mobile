import { useCallback, useMemo } from 'react';
import { useUsuario } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { Campanha } from '../models/Campaign';
import { ItemCampanhaCatalogo } from '../models/Catalog';
import { resumirCatalogo } from '../utils/benefit';
import { podeResgatar } from '../utils/campaign';
import { useCampaignCatalog } from './useCampaignCatalog';

const LIMITE_DESTAQUES = 3;

export interface CampanhaVigente {
  campanha: Campanha;
  itens: ItemCampanhaCatalogo[];
}

export function useHomeViewModel() {
  const usuario = useUsuario();
  const { itens, carregando, atualizando, erro, recarregar: recarregarCatalogo } = useCatalog();
  const campanhas = useCampaignCatalog();

  const resumo = useMemo(() => resumirCatalogo(itens), [itens]);
  const destaques = useMemo(
    () => itens.filter((item) => item.disponivel).slice(0, LIMITE_DESTAQUES),
    [itens],
  );

  const vigentes = useMemo<CampanhaVigente[]>(() => {
    const porCampanha = new Map<number, CampanhaVigente>();
    for (const dados of campanhas.itens) {
      if (dados.situacao !== 'VIGENTE') continue;
      const grupo = porCampanha.get(dados.campanha.id) ?? { campanha: dados.campanha, itens: [] };
      grupo.itens.push(dados);
      porCampanha.set(dados.campanha.id, grupo);
    }
    return Array.from(porCampanha.values()).sort((a, b) =>
      a.campanha.data_fim.localeCompare(b.campanha.data_fim),
    );
  }, [campanhas.itens]);

  const recarregarCampanhas = campanhas.recarregar;
  const recarregar = useCallback(async () => {
    await Promise.all([recarregarCatalogo(), recarregarCampanhas()]);
  }, [recarregarCatalogo, recarregarCampanhas]);

  return {
    nome: usuario.nome,
    cargo: usuario.colaborador?.cargo ?? 'Colaborador(a) da FCV',
    resumo,
    destaques,
    carregando,
    atualizando,
    erro,
    recarregar,
    campanhasVigentes: vigentes,
    carregandoCampanhas: campanhas.carregando,
    erroCampanhas: campanhas.erro,
    tentarCampanhas: campanhas.tentarDeNovo,
    podeResgatar,
  };
}
