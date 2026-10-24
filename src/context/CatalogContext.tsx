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

interface Resultado {
  usuarioId: number;
  itens: BeneficioCatalogo[];
  erro: string | null;
}

async function buscarCatalogo(usuarioId: number): Promise<Resultado> {
  try {
    const { beneficios, ofertas, conveniados } = await benefitService.listarCatalogo();
    return { usuarioId, itens: montarCatalogo(beneficios, ofertas, conveniados), erro: null };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar os benefícios.';
    return { usuarioId, itens: [], erro };
  }
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id ?? null;
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    if (usuarioId === null) return;
    let ativo = true;
    buscarCatalogo(usuarioId).then((novo) => {
      if (ativo) setResultado(novo);
    });
    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  const recarregar = useCallback(async () => {
    if (usuarioId === null) return;
    setAtualizando(true);
    setResultado(await buscarCatalogo(usuarioId));
    setAtualizando(false);
  }, [usuarioId]);

  const atual = resultado && resultado.usuarioId === usuarioId ? resultado : null;
  const itens = useMemo(() => atual?.itens ?? [], [atual]);
  const carregando = usuarioId !== null && atual === null;
  const erro = atual?.erro ?? null;

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
