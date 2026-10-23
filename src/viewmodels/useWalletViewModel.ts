import { useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { resumirCatalogo } from '../utils/benefit';

export type FiltroCarteira = 'TODOS' | 'DISPONIVEIS' | 'INDISPONIVEIS';

export function useWalletViewModel() {
  const { itens, carregando, atualizando, erro, recarregar } = useCatalog();
  const [filtro, setFiltro] = useState<FiltroCarteira>('TODOS');

  const resumo = useMemo(() => resumirCatalogo(itens), [itens]);

  const contadores = useMemo(() => {
    const disponiveis = itens.filter((item) => item.disponivel).length;
    return {
      TODOS: itens.length,
      DISPONIVEIS: disponiveis,
      INDISPONIVEIS: itens.length - disponiveis,
    };
  }, [itens]);

  const lista = useMemo(() => {
    if (filtro === 'DISPONIVEIS') return itens.filter((item) => item.disponivel);
    if (filtro === 'INDISPONIVEIS') return itens.filter((item) => !item.disponivel);
    return itens;
  }, [itens, filtro]);

  return {
    lista,
    filtro,
    setFiltro,
    contadores,
    resumo,
    carregando,
    atualizando,
    erro,
    recarregar,
  };
}
