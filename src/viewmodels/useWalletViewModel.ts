import { useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { usePreferences } from '../context/PreferencesContext';
import { resumirCatalogo } from '../utils/benefit';

export type { FiltroCarteira } from '../models/Preferences';

export function useWalletViewModel() {
  const { itens, carregando: carregandoCatalogo, atualizando, erro, recarregar } = useCatalog();
  const {
    preferencias,
    definirFiltroCarteira: setFiltro,
    carregando: carregandoPreferencias,
    erro: erroPreferencias,
    tentarDeNovo: tentarPreferencias,
  } = usePreferences();
  const filtro = preferencias.filtroCarteira;

  const resumo = useMemo(() => resumirCatalogo(itens), [itens]);

  const lista = useMemo(() => {
    if (filtro === 'DISPONIVEIS') return itens.filter((item) => item.disponivel);
    if (filtro === 'INDISPONIVEIS') return itens.filter((item) => !item.disponivel);
    return itens;
  }, [itens, filtro]);

  return {
    lista,
    filtro,
    setFiltro,
    resumo,
    carregando: carregandoCatalogo || carregandoPreferencias,
    carregandoPreferencias,
    erroPreferencias,
    tentarPreferencias,
    atualizando,
    erro,
    recarregar,
  };
}
