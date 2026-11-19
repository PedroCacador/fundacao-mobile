import { useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { LocalConveniado } from '../models/Catalog';
import { TODAS_CATEGORIAS } from '../components/common/CategoryFilterModal';

export { TODAS_CATEGORIAS };

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
  const [modalFiltroAberto, setModalFiltroAberto] = useState(false);

  const locais = useMemo(() => {
    const porConveniado = new Map<number, LocalConveniado>();

    for (const item of itens) {
      if (!item.disponivel) continue;

      for (const conveniado of item.conveniados) {
        const local = porConveniado.get(conveniado.id) ?? {
          conveniado,
          beneficios: [],
        };

        // Evita duplicidade de benefício no mesmo local
        if (!local.beneficios.some((b) => b.id === item.beneficio.id)) {
          local.beneficios.push(item.beneficio);
        }
        porConveniado.set(conveniado.id, local);
      }
    }

    return Array.from(porConveniado.values()).sort((a, b) =>
      a.conveniado.nome_fantasia.localeCompare(b.conveniado.nome_fantasia),
    );
  }, [itens]);

  const categorias = useMemo(() => {
    const conjunto = new Set<string>();
    for (const local of locais) {
      if (local.conveniado.categorias && local.conveniado.categorias.length > 0) {
        local.conveniado.categorias.forEach((cat) => {
          if (cat) conjunto.add(cat);
        });
      } else if (local.conveniado.categoria) {
        conjunto.add(local.conveniado.categoria);
      }
    }
    return Array.from(conjunto).sort();
  }, [locais]);

  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());

    return locais.filter(({ conveniado }) => {
      const cats =
        conveniado.categorias && conveniado.categorias.length > 0
          ? conveniado.categorias
          : [conveniado.categoria];

      const naCategoria =
        categoria === TODAS_CATEGORIAS || cats.some((c) => c === categoria);

      if (!naCategoria) return false;
      if (!termo) return true;

      const texto = normalizar(
        `${conveniado.nome_fantasia} ${conveniado.razao_social ?? ''} ${conveniado.endereco ?? ''} ${cats.join(' ')}`,
      );

      return texto.includes(termo);
    });
  }, [locais, busca, categoria]);

  const abrirModalFiltro = () => setModalFiltroAberto(true);
  const fecharModalFiltro = () => setModalFiltroAberto(false);

  const aplicarFiltroCategoria = (cat: string) => {
    setCategoria(cat);
    setModalFiltroAberto(false);
  };

  const limparFiltros = () => {
    setCategoria(TODAS_CATEGORIAS);
    setModalFiltroAberto(false);
  };

  return {
    lista,
    locaisTotal: locais.length,
    categorias,
    categoria,
    setCategoria,
    busca,
    setBusca,
    modalFiltroAberto,
    abrirModalFiltro,
    fecharModalFiltro,
    aplicarFiltroCategoria,
    limparFiltros,
    carregando,
    atualizando,
    erro,
    recarregar,
  };
}
