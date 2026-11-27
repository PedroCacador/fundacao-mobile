import type { Beneficio } from '../models/Benefit';
import type { Utilizacao } from '../models/Utilization';
import { calcularProximaRenovacao } from './benefit';
import { lerData } from './format';

export interface UsoBeneficio {
  total: number;
  disponiveis: number;
  pendentes: number;
  usados: number;
  proximaData: Date | null;
  segundosRestantes: number | null;
  utilizacaoPendenteId: number | null;
}

function somarMeses(data: Date, meses: number) {
  const dia = data.getDate();
  const resultado = new Date(data.getFullYear(), data.getMonth() + meses, 1);
  const ultimoDia = new Date(resultado.getFullYear(), resultado.getMonth() + 1, 0).getDate();
  resultado.setDate(Math.min(dia, ultimoDia));
  return resultado;
}

function dataDoCiclo(beneficio: Beneficio, hoje: Date, dataAdmissao?: string | null) {
  if (beneficio.tipo_janela === 'JANELA_MOVEL') {
    if (beneficio.referencia_contagem === 'DATA_ADMISSAO_COLABORADOR' && dataAdmissao) {
      const admissao = lerData(dataAdmissao);
      if (admissao > hoje) return admissao;
      const intervalo = beneficio.intervalo_valor ?? 0;
      if (intervalo <= 0) return admissao;
      if (beneficio.intervalo_unidade === 'MES') {
        const mesesDecorridos =
          (hoje.getFullYear() - admissao.getFullYear()) * 12 +
          hoje.getMonth() -
          admissao.getMonth();
        let inicio = somarMeses(admissao, Math.floor(mesesDecorridos / intervalo) * intervalo);
        while (inicio > hoje) inicio = somarMeses(inicio, -intervalo);
        return inicio;
      }
      const diasDecorridos = Math.floor((hoje.getTime() - admissao.getTime()) / 86400000);
      const inicio = new Date(admissao);
      inicio.setDate(inicio.getDate() + Math.floor(diasDecorridos / intervalo) * intervalo);
      return inicio;
    }
    const inicio = new Date(hoje);
    const intervalo = beneficio.intervalo_valor ?? 0;
    if (beneficio.intervalo_unidade === 'MES') {
      inicio.setMonth(inicio.getMonth() - intervalo);
    } else {
      inicio.setDate(inicio.getDate() - intervalo);
    }
    return inicio;
  }

  const reset = beneficio.dia_reset ? lerData(beneficio.dia_reset) : new Date(2000, 0, 1);
  if (beneficio.unidade_ciclo === 'ANO') {
    const inicio = new Date(hoje.getFullYear(), reset.getMonth(), reset.getDate());
    if (inicio > hoje) inicio.setFullYear(inicio.getFullYear() - 1);
    return inicio;
  }
  if (beneficio.unidade_ciclo === 'SEMANA') {
    const inicio = new Date(hoje);
    const deslocamento = (hoje.getDay() - reset.getDay() + 7) % 7;
    inicio.setDate(inicio.getDate() - deslocamento);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  }

  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), reset.getDate());
  if (inicio > hoje) inicio.setMonth(inicio.getMonth() - 1);
  return inicio;
}

function dataIso(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function dataInicioUsos(
  beneficios: Beneficio[],
  hoje = new Date(),
  dataAdmissao?: string | null,
) {
  const datas = beneficios.map((beneficio) => dataDoCiclo(beneficio, hoje, dataAdmissao));
  if (datas.length === 0) return dataIso(hoje);
  return dataIso(new Date(Math.min(...datas.map((data) => data.getTime()))));
}

export function resumirUsoBeneficio(
  beneficio: Beneficio,
  utilizacoes: Utilizacao[],
  pendentes: Utilizacao[],
  hoje = new Date(),
  dataAdmissao?: string | null,
): UsoBeneficio {
  const inicio = dataDoCiclo(beneficio, hoje, dataAdmissao);
  const relevantes = utilizacoes.filter((item) => {
    if (item.beneficio_id !== beneficio.id || item.status !== 'APROVADA') return false;
    const data = item.data_validacao ?? item.data_confirmacao ?? item.data_solicitacao;
    return new Date(data.includes('T') ? data : data.replace(' ', 'T')) >= inicio;
  });
  const emAndamento = pendentes.filter(
    (item) => item.beneficio_id === beneficio.id && item.status === 'PENDENTE',
  );
  const total = Math.max(0, beneficio.quantidade_maxima_utilizacoes);
  const usados = Math.min(total, relevantes.length);
  const quantidadePendentes = Math.min(total - usados, emAndamento.length);
  const disponiveis = Math.max(0, total - usados - quantidadePendentes);
  const expiracao = emAndamento[0]?.data_expiracao ?? emAndamento[0]?.expira_em;
  const segundosExpiracao = expiracao
    ? Math.max(
        0,
        Math.ceil(
          (new Date(expiracao.includes('T') ? expiracao : expiracao.replace(' ', 'T')).getTime() -
            hoje.getTime()) /
            1000,
        ),
      )
    : null;
  const segundosRestantes = emAndamento[0]?.segundos_restantes ?? segundosExpiracao;
  let proximaData = calcularProximaRenovacao(beneficio, hoje);

  if (beneficio.tipo_janela === 'JANELA_MOVEL' && relevantes.length > 0) {
    const hojeTimestamp = hoje.getTime();
    const liberacoes = relevantes
      .map((item) => item.data_validacao ?? item.data_confirmacao ?? item.data_solicitacao)
      .map((texto) => new Date(texto.includes('T') ? texto : texto.replace(' ', 'T')))
      .map((data) => {
        const liberacao = new Date(data);
        if (beneficio.intervalo_unidade === 'MES') {
          liberacao.setMonth(liberacao.getMonth() + (beneficio.intervalo_valor ?? 0));
        } else {
          liberacao.setDate(liberacao.getDate() + (beneficio.intervalo_valor ?? 0));
        }
        return liberacao;
      })
      .filter((data) => data.getTime() > hojeTimestamp)
      .sort((a, b) => a.getTime() - b.getTime());
    if (liberacoes[0]) {
      proximaData = liberacoes[0];
    } else {
      proximaData = null;
    }
  }

  return {
    total,
    disponiveis,
    pendentes: quantidadePendentes,
    usados,
    proximaData,
    segundosRestantes,
    utilizacaoPendenteId: emAndamento[0]?.id ?? null,
  };
}
