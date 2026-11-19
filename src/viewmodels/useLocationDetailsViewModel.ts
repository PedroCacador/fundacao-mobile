import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Beneficio, Conveniado } from '../models/Benefit';
import { benefitService } from '../services/benefitService';

export function useLocationDetailsViewModel(conveniadoId: number) {
  const { itens, carregando: carregandoCatalogo, erro: erroCatalogo, recarregar: recarregarCatalogo } =
    useCatalog();

  // Busca do conveniado presente no catálogo ativo
  const conveniadoCatalogo = useMemo(() => {
    for (const item of itens) {
      const achado = item.conveniados.find((c) => c.id === conveniadoId);
      if (achado) return achado;
    }
    return null;
  }, [itens, conveniadoId]);

  const [conveniadoManual, setConveniadoManual] = useState<Conveniado | null>(null);
  const [carregandoConveniado, setCarregandoConveniado] = useState(() => !conveniadoCatalogo);
  const [erroConveniado, setErroConveniado] = useState<string | null>(null);

  const conveniado = conveniadoCatalogo ?? conveniadoManual;

  // Benefícios ativos disponíveis neste local
  const beneficiosAtivos = useMemo(() => {
    const lista: Beneficio[] = [];
    for (const item of itens) {
      if (!item.disponivel) continue;
      const vinculado = item.conveniados.some((c) => c.id === conveniadoId);
      if (vinculado) {
        lista.push(item.beneficio);
      }
    }
    return lista;
  }, [itens, conveniadoId]);

  // Lista de categorias do conveniado (suporte a N:N e categoria única)
  const categorias = useMemo(() => {
    if (!conveniado) return [];
    if (conveniado.categorias && conveniado.categorias.length > 0) {
      return conveniado.categorias;
    }
    return conveniado.categoria ? [conveniado.categoria] : [];
  }, [conveniado]);

  useEffect(() => {
    let ativo = true;
    if (!conveniadoCatalogo) {
      benefitService
        .buscarConveniadoPorId(conveniadoId)
        .then((dados) => {
          if (ativo) {
            setConveniadoManual(dados);
            setCarregandoConveniado(false);
          }
        })
        .catch((err: unknown) => {
          if (ativo) {
            const mensagem =
              err instanceof Error
                ? err.message
                : 'Não foi possível carregar os detalhes do conveniado.';
            setErroConveniado(mensagem);
            setCarregandoConveniado(false);
          }
        });
    }
    return () => {
      ativo = false;
    };
  }, [conveniadoCatalogo, conveniadoId]);

  const recarregar = useCallback(async () => {
    setCarregandoConveniado(true);
    setErroConveniado(null);
    try {
      const [, dadosConveniado] = await Promise.all([
        recarregarCatalogo(),
        benefitService.buscarConveniadoPorId(conveniadoId),
      ]);
      setConveniadoManual(dadosConveniado);
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error ? err.message : 'Não foi possível carregar os detalhes do conveniado.';
      setErroConveniado(mensagem);
    } finally {
      setCarregandoConveniado(false);
    }
  }, [conveniadoId, recarregarCatalogo]);

  const carregando = (carregandoCatalogo && !conveniado) || (carregandoConveniado && !conveniado);
  const erro = erroConveniado || (itens.length === 0 ? erroCatalogo : null);

  return {
    conveniado,
    beneficiosAtivos,
    categorias,
    carregando,
    erro,
    recarregar,
  };
}
