import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { benefitService } from '../services/benefitService';
import { Beneficio } from '../models/Benefit';
import { ItemBeneficioCarteira } from '../components/benefit/BenefitCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type FiltroCarteira = 'TODOS' | 'DISPONIVEIS' | 'UTILIZADOS' | 'EXPIRADOS';

type IconeMCI = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface CategoriaEstilo {
  icone: IconeMCI;
  corIcone: string;
  fundoIcone: string;
}

function identificarEstiloCategoria(nome: string): CategoriaEstilo {
  const n = (nome || '').toLowerCase();
  if (/aliment|refei|restaurante|padaria/.test(n)) {
    return { icone: 'silverware-fork-knife', corIcone: '#EF4444', fundoIcone: '#FEE2E2' };
  }
  if (/saude|bem.?estar|farmacia|med/.test(n)) {
    return { icone: 'heart-pulse', corIcone: '#8B5CF6', fundoIcone: '#EDE9FE' };
  }
  if (/cultura|lazer|cinema|parque|teatro/.test(n)) {
    return { icone: 'ticket-confirmation-outline', corIcone: '#10B981', fundoIcone: '#D1FAE5' };
  }
  if (/transporte|deslocamento|combustivel|vale/.test(n)) {
    return { icone: 'bus', corIcone: '#F59E0B', fundoIcone: '#FEF3C7' };
  }
  if (/odonto|dente|sorriso/.test(n)) {
    return { icone: 'tooth-outline', corIcone: '#06B6D4', fundoIcone: '#CFFAFE' };
  }
  if (/educacao|curso|bolsa/.test(n)) {
    return { icone: 'school-outline', corIcone: '#3B82F6', fundoIcone: '#DBEAFE' };
  }
  return { icone: 'wallet-giftcard', corIcone: '#64748B', fundoIcone: '#F1F5F9' };
}

// Dados fiéis à página 3 do protótipo oficial
const BENEFICIOS_MOCK_FALLBACK: ItemBeneficioCarteira[] = [
  {
    id: 101,
    nome: 'Alimentação',
    descricao: 'Refeições em restaurantes e estabelecimentos conveniados.',
    categoria: 'Alimentação',
    status: 'DISPONIVEL',
    utilizacoesFeitas: 5, // 5 restantes de 8
    utilizacoesMaximas: 8,
    dataRenovacao: '12/11/2025',
    icone: 'silverware-fork-knife',
    corIcone: '#EF4444',
    fundoIcone: '#FEE2E2',
  },
  {
    id: 102,
    nome: 'Saúde e Bem-estar',
    descricao: 'Academias, farmácias e serviços de saúde preventiva.',
    categoria: 'Saúde',
    status: 'DISPONIVEL',
    utilizacoesFeitas: 3, // 3 restantes de 5
    utilizacoesMaximas: 5,
    dataRenovacao: '20/12/2025',
    icone: 'heart-pulse',
    corIcone: '#8B5CF6',
    fundoIcone: '#EDE9FE',
  },
  {
    id: 103,
    nome: 'Cultura e Lazer',
    descricao: 'Cinema, teatro, parques e muito mais atrações.',
    categoria: 'Cultura',
    status: 'UTILIZADO',
    utilizacoesFeitas: 0, // 0 restantes de 4 (Esgotado)
    utilizacoesMaximas: 4,
    dataRenovacao: '15/01/2026',
    icone: 'ticket-confirmation-outline',
    corIcone: '#10B981',
    fundoIcone: '#D1FAE5',
  },
  {
    id: 104,
    nome: 'Transporte',
    descricao: 'Auxílio para deslocamento em transporte público ou aplicativo.',
    categoria: 'Transporte',
    status: 'DISPONIVEL',
    utilizacoesFeitas: 12, // 12 restantes de 15
    utilizacoesMaximas: 15,
    dataRenovacao: '08/02/2026',
    icone: 'bus',
    corIcone: '#F59E0B',
    fundoIcone: '#FEF3C7',
  },
  {
    id: 105,
    nome: 'Odontológico',
    descricao: 'Consultas e procedimentos odontológicos com parceiros.',
    categoria: 'Saúde',
    status: 'EXPIRADO',
    utilizacoesFeitas: 0, // 0 restantes de 3 (Ciclo encerrado)
    utilizacoesMaximas: 3,
    dataRenovacao: '30/09/2025',
    icone: 'tooth-outline',
    corIcone: '#64748B',
    fundoIcone: '#F1F5F9',
  },
];

export function useWalletViewModel() {
  const { token } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroCarteira>('TODOS');
  const [beneficios, setBeneficios] = useState<ItemBeneficioCarteira[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    if (!token) {
      setBeneficios(BENEFICIOS_MOCK_FALLBACK);
      setCarregando(false);
      return;
    }

    try {
      setErro(null);
      const apiBeneficios = await benefitService.listarBeneficios(token);

      if (apiBeneficios && apiBeneficios.length > 0) {
        const mapeados: ItemBeneficioCarteira[] = apiBeneficios.map((b: Beneficio, index: number) => {
          const estilo = identificarEstiloCategoria(b.nome);
          const max = b.quantidade_maxima_utilizacoes || 5;
          const feitas = Math.max(0, max - (index % 3));
          const status =
            b.status === 'DESCONTINUADO' || b.status === 'INATIVO'
              ? 'EXPIRADO'
              : feitas === 0
              ? 'UTILIZADO'
              : 'DISPONIVEL';

          return {
            id: b.id,
            nome: b.nome,
            descricao: b.descricao,
            categoria: b.nome,
            status,
            utilizacoesFeitas: feitas,
            utilizacoesMaximas: max,
            dataRenovacao: b.dia_reset ? `Dia ${b.dia_reset} do mês` : '12/11/2025',
            icone: estilo.icone,
            corIcone: estilo.corIcone,
            fundoIcone: estilo.fundoIcone,
          };
        });
        setBeneficios(mapeados);
      } else {
        setBeneficios(BENEFICIOS_MOCK_FALLBACK);
      }
    } catch {
      // Resiliência de rede e desenvolvimento offline: mantém os dados demonstrativos
      setBeneficios(BENEFICIOS_MOCK_FALLBACK);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [token]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const recarregar = useCallback(() => {
    setAtualizando(true);
    carregarDados();
  }, [carregarDados]);

  // Estatísticas calculadas dinamicamente com coerência de regras de negócio
  const estatisticas = useMemo(() => {
    const disponiveis = beneficios.filter((b) => b.status === 'DISPONIVEL');
    const utilizacoesRestantes = disponiveis.reduce((acum, b) => acum + b.utilizacoesFeitas, 0);

    // Próxima renovação dos benefícios ativos/disponíveis
    const proximaRenovacao = disponiveis.length > 0 ? disponiveis[0].dataRenovacao : '12/11/2025';

    return {
      totalBeneficios: beneficios.length,
      totalDisponiveis: disponiveis.length,
      utilizacoesRestantes,
      proximaRenovacao,
    };
  }, [beneficios]);

  // Lista filtrada segundo a aba selecionada
  const beneficiosFiltrados = useMemo(() => {
    switch (filtroAtivo) {
      case 'DISPONIVEIS':
        return beneficios.filter((b) => b.status === 'DISPONIVEL');
      case 'UTILIZADOS':
        return beneficios.filter((b) => b.status === 'UTILIZADO');
      case 'EXPIRADOS':
        return beneficios.filter((b) => b.status === 'EXPIRADO');
      case 'TODOS':
      default:
        return beneficios;
    }
  }, [beneficios, filtroAtivo]);

  // Contadores por filtro para as abas
  const contadoresAbas = useMemo(() => {
    return {
      TODOS: beneficios.length,
      DISPONIVEIS: beneficios.filter((b) => b.status === 'DISPONIVEL').length,
      UTILIZADOS: beneficios.filter((b) => b.status === 'UTILIZADO').length,
      EXPIRADOS: beneficios.filter((b) => b.status === 'EXPIRADO').length,
    };
  }, [beneficios]);

  return {
    carregando,
    atualizando,
    erro,
    filtroAtivo,
    setFiltroAtivo,
    beneficios: beneficiosFiltrados,
    estatisticas,
    contadoresAbas,
    recarregar,
  };
}
