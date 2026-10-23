import { useMemo } from 'react';
import { useUsuario } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { resumirCatalogo } from '../utils/benefit';

const LIMITE_DESTAQUES = 3;

export function useHomeViewModel() {
  const usuario = useUsuario();
  const { itens, carregando, atualizando, erro, recarregar } = useCatalog();

  const resumo = useMemo(() => resumirCatalogo(itens), [itens]);
  const destaques = useMemo(
    () => itens.filter((item) => item.disponivel).slice(0, LIMITE_DESTAQUES),
    [itens],
  );

  return {
    nome: usuario.nome,
    cargo: usuario.colaborador?.cargo ?? 'Colaborador(a) da FCV',
    resumo,
    destaques,
    carregando,
    atualizando,
    erro,
    recarregar,
  };
}
