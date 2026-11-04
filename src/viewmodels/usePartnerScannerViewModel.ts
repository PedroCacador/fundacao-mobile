import { useCallback, useState } from 'react';
import { DecisaoStatus, Utilizacao } from '../models/Utilization';
import { utilizationService } from '../services/utilizationService';

export function usePartnerScannerViewModel() {
  const [codigo, setCodigo] = useState('');
  const [cameraAberta, setCameraAberta] = useState(false);
  const [resgate, setResgate] = useState<Utilizacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const [modalConfirmacao, setModalConfirmacao] = useState<{
    aberto: boolean;
    acao: DecisaoStatus;
  }>({
    aberto: false,
    acao: 'APROVADA',
  });

  const abrirCamera = useCallback(() => {
    setErro(null);
    setCameraAberta(true);
  }, []);

  const fecharCamera = useCallback(() => {
    setCameraAberta(false);
  }, []);

  const buscarResgate = useCallback(
    async (codigoManual?: string) => {
      const valorBusca = (codigoManual ?? codigo).trim();
      if (!valorBusca) {
        setErro('Informe o código do resgate ou escaneie o QR Code.');
        return;
      }

      setCarregando(true);
      setErro(null);
      setSucesso(null);

      try {
        const item = await utilizationService.buscarPorTokenOuCodigo(valorBusca);
        setResgate(item);
        setCameraAberta(false);
      } catch (err: unknown) {
        const mensagem =
          err instanceof Error
            ? err.message
            : 'Não foi possível localizar o resgate. Verifique o código.';
        setErro(mensagem);
        setResgate(null);
      } finally {
        setCarregando(false);
      }
    },
    [codigo],
  );

  const abrirConfirmacao = useCallback((acao: DecisaoStatus) => {
    setModalConfirmacao({ aberto: true, acao });
  }, []);

  const fecharConfirmacao = useCallback(() => {
    setModalConfirmacao((prev) => ({ ...prev, aberto: false }));
  }, []);

  const executarDecisao = useCallback(async () => {
    if (!resgate) return;

    const { acao } = modalConfirmacao;
    fecharConfirmacao();
    setProcessando(true);
    setErro(null);

    try {
      await utilizationService.decidirUtilizacao(resgate.id, acao);
      setSucesso(
        acao === 'APROVADA'
          ? `Resgate #${resgate.id} aprovado com sucesso!`
          : `Resgate #${resgate.id} foi reprovado.`,
      );
      setResgate(null);
      setCodigo('');
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error
          ? err.message
          : 'Não foi possível registrar a decisão no servidor. Tente novamente.';
      setErro(mensagem);
    } finally {
      setProcessando(false);
    }
  }, [resgate, modalConfirmacao, fecharConfirmacao]);

  const limpar = useCallback(() => {
    setCodigo('');
    setCameraAberta(false);
    setResgate(null);
    setErro(null);
    setSucesso(null);
  }, []);

  return {
    codigo,
    setCodigo,
    cameraAberta,
    abrirCamera,
    fecharCamera,
    resgate,
    carregando,
    processando,
    erro,
    sucesso,
    modalConfirmacao,
    buscarResgate,
    abrirConfirmacao,
    fecharConfirmacao,
    executarDecisao,
    limpar,
  };
}
