import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TODAS_CATEGORIAS } from '../components/common/CategoryFilterModal';
import { useUsuario } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { BeneficioCatalogo } from '../models/Catalog';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { listarUtilizacoesDesde, utilizationService } from '../services/utilizationService';
import { filtrarBeneficios, listarCategorias } from '../utils/benefit';
import { formatarData, lerData } from '../utils/format';
import { dataInicioUsos, resumirUsoBeneficio, UsoBeneficio } from '../utils/usage';

export { TODAS_CATEGORIAS };

export interface EntradaBeneficio {
  chave: string;
  catalogo: BeneficioCatalogo;
  ultimaUtilizacao: string | null;
  uso: UsoBeneficio | null;
}

interface ResultadoUtilizacoes {
  lista: Utilizacao[];
  pendentes: Utilizacao[];
  erro: string | null;
}

async function buscarUtilizacoes(
  itens: BeneficioCatalogo[],
  dataAdmissao?: string | null,
): Promise<ResultadoUtilizacoes> {
  try {
    const dataInicio = dataInicioUsos(
      itens.map((item) => item.beneficio),
      new Date(),
      dataAdmissao,
    );
    const [lista, pendentes] = await Promise.all([
      listarUtilizacoesDesde(dataInicio),
      utilizationService.listarAguardando(),
    ]);
    return { lista, pendentes, erro: null };
  } catch (falha) {
    const erro =
      falha instanceof ApiError ? falha.message : 'Não foi possível carregar suas utilizações.';
    return { lista: [], pendentes: [], erro };
  }
}

function ultimasPorBeneficio(lista: Utilizacao[]) {
  const beneficios = new Map<number, string>();
  for (const utilizacao of lista) {
    if (utilizacao.status !== 'APROVADA' || utilizacao.beneficio_id === null) continue;
    const data =
      utilizacao.data_validacao ?? utilizacao.data_confirmacao ?? utilizacao.data_solicitacao;
    const anterior = beneficios.get(utilizacao.beneficio_id);
    if (!anterior || data > anterior) beneficios.set(utilizacao.beneficio_id, data);
  }
  return beneficios;
}

function formatar(data: string | undefined) {
  return data ? formatarData(lerData(data)) : null;
}

export function useWalletViewModel() {
  const { itens, carregando, atualizando, erro, recarregar: recarregarCatalogo } = useCatalog();
  const usuario = useUsuario();
  const dataAdmissao = usuario.colaborador?.data_admissao;
  const [utilizacoes, setUtilizacoes] = useState<ResultadoUtilizacoes | null>(null);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(TODAS_CATEGORIAS);
  const [modalFiltroAberto, setModalFiltroAberto] = useState(false);
  const versao = useRef(0);

  const carregarUtilizacoes = useCallback(async () => {
    const atual = ++versao.current;
    const catalogo = itens.filter((item) => item.beneficio.status === 'ATIVO');
    const novo = await buscarUtilizacoes(catalogo, dataAdmissao);
    if (atual === versao.current) setUtilizacoes(novo);
  }, [itens, dataAdmissao]);

  useFocusEffect(
    useCallback(() => {
      void carregarUtilizacoes();
      return () => {
        versao.current += 1;
      };
    }, [carregarUtilizacoes]),
  );

  const tentarUtilizacoes = useCallback(async () => {
    setUtilizacoes(null);
    await carregarUtilizacoes();
  }, [carregarUtilizacoes]);

  const recarregar = useCallback(async () => {
    await recarregarCatalogo();
    await carregarUtilizacoes();
  }, [recarregarCatalogo, carregarUtilizacoes]);

  const ativos = useMemo(() => itens.filter((item) => item.beneficio.status === 'ATIVO'), [itens]);
  const categorias = useMemo(() => listarCategorias(ativos), [ativos]);

  const lista = useMemo<EntradaBeneficio[]>(() => {
    const ultimas = ultimasPorBeneficio(utilizacoes?.lista ?? []);
    const filtrados = filtrarBeneficios(
      ativos,
      busca,
      categoria === TODAS_CATEGORIAS ? null : categoria,
    );
    return filtrados.map((catalogo) => {
      const usoAtual = resumirUsoBeneficio(
        catalogo.beneficio,
        utilizacoes?.lista ?? [],
        utilizacoes?.pendentes ?? [],
        new Date(),
        dataAdmissao,
      );
      return {
        chave: `beneficio-${catalogo.beneficio.id}`,
        catalogo,
        ultimaUtilizacao: formatar(ultimas.get(catalogo.beneficio.id)),
        uso: utilizacoes?.erro
          ? null
          : {
              ...usoAtual,
              disponiveis: catalogo.disponivel ? usoAtual.disponiveis : 0,
            },
      };
    });
  }, [ativos, utilizacoes, busca, categoria, dataAdmissao]);

  const totalEncontrados = lista.length;

  const abrirModalFiltro = () => setModalFiltroAberto(true);
  const fecharModalFiltro = () => setModalFiltroAberto(false);

  const aplicarFiltroCategoria = (selecionada: string) => {
    setCategoria(selecionada);
    setModalFiltroAberto(false);
  };

  const limparFiltros = () => {
    setCategoria(TODAS_CATEGORIAS);
    setModalFiltroAberto(false);
  };

  return {
    lista,
    totalEncontrados,
    carregandoUsos: utilizacoes === null,
    busca,
    setBusca,
    buscaAtiva: busca.trim().length > 0,
    categorias,
    categoria,
    filtroAtivo: categoria !== TODAS_CATEGORIAS,
    modalFiltroAberto,
    abrirModalFiltro,
    fecharModalFiltro,
    aplicarFiltroCategoria,
    limparFiltros,
    carregando,
    atualizando,
    erro,
    recarregar,
    erroUtilizacoes: utilizacoes?.erro ?? null,
    tentarUtilizacoes,
  };
}
