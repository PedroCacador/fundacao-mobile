import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUsuario } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { Campanha } from '../models/Campaign';
import { ItemCampanhaCatalogo } from '../models/Catalog';
import { resumirCatalogo } from '../utils/benefit';
import { podeResgatar } from '../utils/campaign';
import { Utilizacao } from '../models/Utilization';
import { utilizationService } from '../services/utilizationService';
import { useCampaignCatalog } from './useCampaignCatalog';

export interface CampanhaVigente {
  campanha: Campanha;
  itens: ItemCampanhaCatalogo[];
}

export function useHomeViewModel() {
  const usuario = useUsuario();
  const { itens, carregando, atualizando, erro, recarregar: recarregarCatalogo } = useCatalog();
  const campanhas = useCampaignCatalog();
  const [pendentes, setPendentes] = useState<Utilizacao[]>([]);
  const [carregandoPendentes, setCarregandoPendentes] = useState(true);
  const [erroPendentes, setErroPendentes] = useState<string | null>(null);

  const carregarPendentes = useCallback(async () => {
    setCarregandoPendentes(true);
    setErroPendentes(null);
    try {
      setPendentes(await utilizationService.listarAguardando());
    } catch (falha) {
      setErroPendentes(
        falha instanceof Error ? falha.message : 'Não foi possível carregar os benefícios pendentes.',
      );
    } finally {
      setCarregandoPendentes(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    utilizationService
      .listarAguardando()
      .then((resultado) => {
        if (ativo) {
          setPendentes(resultado);
          setCarregandoPendentes(false);
        }
      })
      .catch((falha) => {
        if (ativo) {
          setErroPendentes(
            falha instanceof Error ? falha.message : 'Não foi possível carregar os benefícios pendentes.',
          );
          setCarregandoPendentes(false);
        }
      });
    return () => {
      ativo = false;
    };
  }, []);

  const resumo = useMemo(() => resumirCatalogo(itens), [itens]);

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
    await Promise.all([recarregarCatalogo(), recarregarCampanhas(), carregarPendentes()]);
  }, [recarregarCatalogo, recarregarCampanhas, carregarPendentes]);

  return {
    nome: usuario.nome,
    catalogo: itens,
    cargo: usuario.colaborador?.cargo ?? 'Colaborador(a) da FCV',
    resumo,
    carregando,
    atualizando,
    erro,
    recarregar,
    campanhasVigentes: vigentes,
    carregandoCampanhas: campanhas.carregando,
    erroCampanhas: campanhas.erro,
    tentarCampanhas: campanhas.tentarDeNovo,
    podeResgatar,
    pendentes,
    carregandoPendentes,
    erroPendentes,
    tentarPendentes: carregarPendentes,
  };
}
