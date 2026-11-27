import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Utilizacao } from '../models/Utilization';
import { utilizationService } from '../services/utilizationService';

export type FiltroStatusHistorico = 'TODOS' | 'APROVADA' | 'REPROVADA';

export function usePartnerHistoryViewModel() {
  const { usuario } = useAuth();
  const conveniadoId = usuario?.conveniado?.id;

  const [historico, setHistorico] = useState<Utilizacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroStatusHistorico>('TODOS');

  const carregarHistorico = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setAtualizando(true);
      } else {
        setCarregando(true);
      }
      setErro(null);

      try {
        if (!conveniadoId) {
          throw new Error('Não foi possível identificar o conveniado desta sessão.');
        }
        const lista = await utilizationService.listarHistoricoConveniado();
        const listaVinculada = lista.filter((item) => item.conveniado_id === conveniadoId);
        setHistorico(listaVinculada);
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
    },
    [conveniadoId],
  );

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, [carregarHistorico]),
  );

  const resumo = useMemo(() => {
    const aprovadas = historico.filter((item) => item.status === 'APROVADA');
    const reprovadas = historico.filter((item) => item.status === 'REPROVADA');
    const pendentes = historico.filter((item) => item.status === 'PENDENTE');
    const expiradas = historico.filter((item) => item.status === 'EXPIRADA');
    const valorTotal = aprovadas.reduce(
      (total, item) => total + (Number(item.valor_aplicado) || 0),
      0,
    );

    return {
      total: historico.length,
      aprovadas: aprovadas.length,
      reprovadas: reprovadas.length,
      pendentes: pendentes.length,
      expiradas: expiradas.length,
      valorTotal,
    };
  }, [historico]);

  const itensFiltrados = useMemo(() => {
    if (filtro === 'TODOS') return historico;
    return historico.filter((item) => item.status === filtro);
  }, [historico, filtro]);

  return {
    historico: itensFiltrados,
    historicoTotal: historico.length,
    carregando,
    atualizando,
    erro,
    filtro,
    setFiltro,
    resumo,
    recarregar: () => carregarHistorico(true),
  };
}
