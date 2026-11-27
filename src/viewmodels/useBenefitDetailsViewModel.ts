import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCatalog } from '../context/CatalogContext';
import { useUsuario } from '../context/AuthContext';
import { Utilizacao } from '../models/Utilization';
import { ApiError } from '../services/api';
import { listarUtilizacoesDesde, utilizationService } from '../services/utilizationService';
import { categoriasDoConveniado, calcularProximaRenovacao } from '../utils/benefit';
import { diasAte, formatarData, plural } from '../utils/format';
import { dataInicioUsos, resumirUsoBeneficio, UsoBeneficio } from '../utils/usage';

export function useBenefitDetailsViewModel(beneficioId: number) {
  const { itens, carregando } = useCatalog();
  const usuario = useUsuario();
  const dataAdmissao = usuario.colaborador?.data_admissao;
  const [utilizacoes, setUtilizacoes] = useState<Utilizacao[]>([]);
  const [pendentes, setPendentes] = useState<Utilizacao[]>([]);
  const [carregandoUsos, setCarregandoUsos] = useState(true);
  const [erroUsos, setErroUsos] = useState<string | null>(null);

  const item = useMemo(
    () => itens.find((atual) => atual.beneficio.id === beneficioId) ?? null,
    [itens, beneficioId],
  );

  const carregarUsos = useCallback(async () => {
    if (!item) return;
    setCarregandoUsos(true);
    setErroUsos(null);
    try {
      const inicio = dataInicioUsos([item.beneficio], new Date(), dataAdmissao);
      const [usosDoCiclo, emAndamento] = await Promise.all([
        listarUtilizacoesDesde(inicio),
        utilizationService.listarAguardando(),
      ]);
      setUtilizacoes(usosDoCiclo);
      setPendentes(emAndamento);
    } catch (falha) {
      setErroUsos(
        falha instanceof ApiError
          ? falha.message
          : 'Não foi possível carregar os usos deste benefício.',
      );
    } finally {
      setCarregandoUsos(false);
    }
  }, [item, dataAdmissao]);

  useFocusEffect(
    useCallback(() => {
      void carregarUsos();
    }, [carregarUsos]),
  );

  const uso: UsoBeneficio | null = useMemo(() => {
    if (!item) return null;
    const usoAtual = resumirUsoBeneficio(
      item.beneficio,
      utilizacoes,
      pendentes,
      new Date(),
      dataAdmissao,
    );
    return {
      ...usoAtual,
      disponiveis: item.disponivel ? usoAtual.disponiveis : 0,
    };
  }, [item, utilizacoes, pendentes, dataAdmissao]);

  const detalhes = useMemo(() => {
    if (!item || !uso) return null;
    const renovacao = uso.proximaData ?? calcularProximaRenovacao(item.beneficio);
    const dias = renovacao ? diasAte(renovacao) : null;
    const categorias = Array.from(
      new Set(
        item.conveniados
          .flatMap(categoriasDoConveniado)
          .map((categoria) => categoria.toLowerCase()),
      ),
    );

    return {
      renovacao: renovacao ? formatarData(renovacao) : null,
      emQuantosDias: dias !== null ? `(em ${dias} ${plural(dias, 'dia', 'dias')})` : null,
      uso,
      ondeUsar:
        categorias.length > 0
          ? `Em estabelecimentos de ${categorias.join(', ')} conveniados da FCV.`
          : 'Nenhum estabelecimento conveniado ativo para este benefício no momento.',
    };
  }, [item, uso]);

  return {
    item,
    detalhes,
    carregando: carregando || Boolean(item && carregandoUsos),
    erroUsos,
    recarregarUsos: carregarUsos,
  };
}
