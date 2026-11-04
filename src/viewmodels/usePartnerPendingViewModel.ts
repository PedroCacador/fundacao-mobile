import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { DecisaoStatus, Utilizacao } from '../models/Utilization';
import { utilizationService } from '../services/utilizationService';

export function usePartnerPendingViewModel() {
  const [pendentes, setPendentes] = useState<Utilizacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const [modalConfirmacao, setModalConfirmacao] = useState<{
    aberto: boolean;
    item: Utilizacao | null;
    acao: DecisaoStatus;
  }>({
    aberto: false,
    item: null,
    acao: 'APROVADA',
  });

  const carregarPendentes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setErro(null);

    try {
      const lista = await utilizationService.listarPendentes();
      setPendentes(lista);
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar as solicitações pendentes.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPendentes();
    }, [carregarPendentes]),
  );

  const abrirConfirmacao = useCallback((item: Utilizacao, acao: DecisaoStatus) => {
    setModalConfirmacao({ aberto: true, item, acao });
  }, []);

  const fecharConfirmacao = useCallback(() => {
    setModalConfirmacao((prev) => ({ ...prev, aberto: false }));
  }, []);

  const executarDecisao = useCallback(async () => {
    const { item, acao } = modalConfirmacao;
    if (!item) return;

    fecharConfirmacao();
    setProcessandoId(item.id);
    setErro(null);

    try {
      await utilizationService.decidirUtilizacao(item.id, acao);
      setSucesso(
        acao === 'APROVADA'
          ? `Solicitação #${item.id} (${item.colaborador_nome}) aprovada com sucesso!`
          : `Solicitação #${item.id} (${item.colaborador_nome}) foi reprovada.`,
      );
      // Remove imediatamente o item da lista local para feedback instantâneo
      setPendentes((anteriores) => anteriores.filter((p) => p.id !== item.id));
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error
          ? err.message
          : 'Erro ao registrar a decisão da solicitação. Tente novamente.';
      setErro(mensagem);
    } finally {
      setProcessandoId(null);
    }
  }, [modalConfirmacao, fecharConfirmacao]);

  const limparSucesso = useCallback(() => {
    setSucesso(null);
  }, []);

  return {
    pendentes,
    carregando,
    atualizando,
    erro,
    sucesso,
    processandoId,
    modalConfirmacao,
    recarregar: () => carregarPendentes(true),
    abrirConfirmacao,
    fecharConfirmacao,
    executarDecisao,
    limparSucesso,
  };
}
