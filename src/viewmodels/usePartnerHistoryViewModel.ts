import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Utilizacao } from '../models/Utilization';
import { utilizationService } from '../services/utilizationService';

export type FiltroStatusHistorico = 'TODOS' | 'APROVADA' | 'REPROVADA';

export function usePartnerHistoryViewModel() {
  const [historico, setHistorico] = useState<Utilizacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroStatusHistorico>('TODOS');

  const carregarHistorico = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setErro(null);

    try {
      const lista = await utilizationService.listarHistoricoConveniado();
      setHistorico(lista);
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar o histórico de atendimentos.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, [carregarHistorico]),
  );

  const resumo = useMemo(() => {
    const aprovadas = historico.filter((item) => item.status === 'APROVADA');
    const reprovadas = historico.filter((item) => item.status === 'REPROVADA');
    const valorTotal = aprovadas.reduce((total, item) => total + (Number(item.valor_aplicado) || 0), 0);

    return {
      total: historico.length,
      aprovadas: aprovadas.length,
      reprovadas: reprovadas.length,
      valorTotal,
    };
  }, [historico]);

  const itensFiltrados = useMemo(() => {
    if (filtro === 'TODOS') return historico;
    return historico.filter((item) => item.status === filtro);
  }, [historico, filtro]);

  return {
    historico: itensFiltrados,
    carregando,
    atualizando,
    erro,
    filtro,
    setFiltro,
    resumo,
    recarregar: () => carregarHistorico(true),
  };
}
