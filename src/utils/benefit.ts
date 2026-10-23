import { Beneficio } from '../models/Benefit';
import { BeneficioCatalogo, ResumoCatalogo } from '../models/Catalog';
import { formatarMoeda, lerData, plural } from './format';

const NOME_CICLO = { ANO: 'ano', MES: 'mês', SEMANA: 'semana' } as const;

export function descreverValor(beneficio: Beneficio) {
  if (beneficio.tipo_beneficio === 'PERCENTUAL') {
    return `${beneficio.valor}% de desconto`;
  }
  return `${formatarMoeda(beneficio.valor)} de desconto`;
}

export function descreverLimite(beneficio: Beneficio) {
  const quantidade = beneficio.quantidade_maxima_utilizacoes;
  if (beneficio.tipo_janela === 'CALENDARIO_FIXO' && beneficio.unidade_ciclo) {
    return `${quantidade} por ${NOME_CICLO[beneficio.unidade_ciclo]}`;
  }
  const intervalo = beneficio.intervalo_valor ?? 0;
  const unidade =
    beneficio.intervalo_unidade === 'MES'
      ? plural(intervalo, 'mês', 'meses')
      : plural(intervalo, 'dia', 'dias');
  return `${quantidade} a cada ${intervalo} ${unidade}`;
}

export function descreverRenovacao(beneficio: Beneficio) {
  if (beneficio.tipo_janela === 'CALENDARIO_FIXO' && beneficio.unidade_ciclo) {
    return `Renova a cada ${NOME_CICLO[beneficio.unidade_ciclo]}`;
  }
  const referencia =
    beneficio.referencia_contagem === 'DATA_ADMISSAO_COLABORADOR'
      ? 'a partir da sua data de admissão'
      : 'a partir do último uso';
  return `Conta ${beneficio.intervalo_valor} ${beneficio.intervalo_unidade === 'MES' ? 'meses' : 'dias'} ${referencia}`;
}

export function calcularProximaRenovacao(beneficio: Beneficio, hoje = new Date()): Date | null {
  if (beneficio.tipo_janela !== 'CALENDARIO_FIXO' || !beneficio.unidade_ciclo) {
    return null;
  }
  const referencia = beneficio.dia_reset ? lerData(beneficio.dia_reset) : null;
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  if (beneficio.unidade_ciclo === 'MES') {
    const dia = referencia?.getDate() ?? 1;
    const nesteMes = new Date(ano, mes, dia);
    return nesteMes > hoje ? nesteMes : new Date(ano, mes + 1, dia);
  }
  if (beneficio.unidade_ciclo === 'ANO') {
    const mesReset = referencia?.getMonth() ?? 0;
    const diaReset = referencia?.getDate() ?? 1;
    const nesteAno = new Date(ano, mesReset, diaReset);
    return nesteAno > hoje ? nesteAno : new Date(ano + 1, mesReset, diaReset);
  }
  const diaSemana = referencia?.getDay() ?? 1;
  const faltam = (diaSemana - hoje.getDay() + 7) % 7 || 7;
  return new Date(ano, mes, hoje.getDate() + faltam);
}

export function resumirCatalogo(itens: BeneficioCatalogo[]): ResumoCatalogo {
  const disponiveis = itens.filter((item) => item.disponivel);
  const locais = new Set(disponiveis.flatMap((item) => item.conveniados.map((c) => c.id)));
  const datas = disponiveis
    .map((item) => calcularProximaRenovacao(item.beneficio))
    .filter((data): data is Date => data !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    disponiveis: disponiveis.length,
    locais: locais.size,
    proximaRenovacao: datas[0] ?? null,
  };
}
