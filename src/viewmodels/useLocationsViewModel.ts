import { useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { LocalConveniado } from '../models/Catalog';

export const TODAS_CATEGORIAS = 'TODAS';

const PRIMEIRO_ACENTO = 768;
const ULTIMO_ACENTO = 879;

function normalizar(texto: string) {
  const semAcento = Array.from(texto.normalize('NFD')).filter((letra) => {
    const codigo = letra.charCodeAt(0);
    return codigo < PRIMEIRO_ACENTO || codigo > ULTIMO_ACENTO;
  });

  return semAcento.join('').toLowerCase();
}

export function useLocationsViewModel() {
  const { itens, carregando, atualizando, erro, recarregar } = useCatalog();

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(TODAS_CATEGORIAS);

  const locais = useMemo(() => {
    const porConveniado = new Map<number, LocalConveniado>();

    for (const item of itens) {
      if (!item.disponivel) continue;

      for (const conveniado of item.conveniados) {
        const local = porConveniado.get(conveniado.id) ?? {
          conveniado,
          beneficios: [],
        };

        local.beneficios.push(item.beneficio);
        porConveniado.set(conveniado.id, local);
      }
    }

    return Array.from(porConveniado.values()).sort((a, b) =>
      a.conveniado.nome_fantasia.localeCompare(b.conveniado.nome_fantasia),
    );
  }, [itens]);

  const categorias = useMemo(
    () => Array.from(new Set(locais.map((local) => local.conveniado.categoria))).sort(),
    [locais],
  );

  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());

    return locais.filter(({ conveniado }) => {
      const naCategoria =
        categoria === TODAS_CATEGORIAS || conveniado.categoria === categoria;

      const texto = normalizar(
        `${conveniado.nome_fantasia} ${conveniado.endereco} ${conveniado.categoria}`,
      );

      return naCategoria && texto.includes(termo);
    });
  }, [locais, busca, categoria]);

  return {
    lista,
    categorias,
    categoria,
    setCategoria,
    busca,
    setBusca,
    carregando,
    atualizando,
    erro,
    recarregar,
  };
}