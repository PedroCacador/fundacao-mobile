import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import { BeneficioCatalogo } from '../models/Catalog';
import { ApiError } from '../services/api';
import { useAuth } from './AuthContext';
import { benefitService } from '../services/benefitService';

interface CatalogContextData {
  itens: BeneficioCatalogo[];
  carregando: boolean;
  atualizando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextData | undefined>(undefined);

function montarCatalogo(
  beneficios: Beneficio[],
  ofertas: Oferta[],
  conveniados: Conveniado[],
): BeneficioCatalogo[] {
  const conveniadosAtivos = new Map(
    conveniados.filter((c) => c.status === 'ATIVO').map((c) => [c.id, c]),
  );

  return beneficios
    .filter((beneficio) => beneficio.status !== 'DESCONTINUADO')
    .map((beneficio) => {
      const locais = ofertas
        .filter((oferta) => oferta.beneficio_id === beneficio.id && oferta.status === 'ATIVO')
        .map((oferta) => conveniadosAtivos.get(oferta.conveniado_id))
        .filter((conveniado): conveniado is Conveniado => conveniado !== undefined);

      return {
        beneficio,
        conveniados: locais,
        categoria: locais[0]?.categoria ?? 'Outros',
        disponivel: beneficio.status === 'ATIVO' && locais.length > 0,
      };
    });
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const [itens, setItens] = useState<BeneficioCatalogo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    try {
      setErro(null);
      const { beneficios, ofertas, conveniados } = await benefitService.listarCatalogo();
      setItens(montarCatalogo(beneficios, ofertas, conveniados));
    } catch (falha) {
      setErro(
        falha instanceof ApiError ? falha.message : 'Não foi possível carregar os benefícios.',
      );
    }
  }, []);

  useEffect(() => {
    if (!usuario) {
      setItens([]);
      setCarregando(true);
      return;
    }
    buscar().finally(() => setCarregando(false));
  }, [usuario, buscar]);

  const recarregar = useCallback(async () => {
    setAtualizando(true);
    await buscar();
    setAtualizando(false);
  }, [buscar]);

  const valor = useMemo(
    () => ({ itens, carregando, atualizando, erro, recarregar }),
    [itens, carregando, atualizando, erro, recarregar],
  );

  return <CatalogContext.Provider value={valor}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextData {
  const contexto = useContext(CatalogContext);
  if (!contexto) {
    throw new Error('useCatalog precisa ser usado dentro de um CatalogProvider');
  }
  return contexto;
}
