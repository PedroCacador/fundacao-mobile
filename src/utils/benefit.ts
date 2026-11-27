import { Beneficio, Conveniado } from '../models/Benefit';
import { BeneficioCatalogo, ResumoCatalogo } from '../models/Catalog';
import { formatarMoeda, lerData, plural } from './format';
import { contemTexto, normalizarTexto } from './search';

const NOME_CICLO = { ANO: 'ano', MES: 'mês', SEMANA: 'semana' } as const;

export function descreverValor(beneficio: Pick<Beneficio, 'tipo_beneficio' | 'valor'>) {
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
  const intervalo = beneficio.intervalo_valor ?? 0;
  const referencia =
    beneficio.referencia_contagem === 'DATA_ADMISSAO_COLABORADOR'
      ? 'a partir da sua data de admissão'
      : 'a partir do último uso';
  const unidade =
    beneficio.intervalo_unidade === 'MES'
      ? plural(intervalo, 'mês', 'meses')
      : plural(intervalo, 'dia', 'dias');
  return `Conta ${intervalo} ${unidade} ${referencia}`;
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

export function beneficiosAtivos(itens: BeneficioCatalogo[]) {
  return itens.filter((item) => item.beneficio.status === 'ATIVO' && item.disponivel);
}

export function categoriasDoConveniado(conveniado: Pick<Conveniado, 'categoria' | 'categorias'>) {
  const categorias = Array.isArray(conveniado.categorias)
    ? conveniado.categorias
        .map((categoria) => {
          if (typeof categoria === 'string') return categoria.trim();
          if (categoria && typeof categoria.nome === 'string') return categoria.nome.trim();
          return '';
        })
        .filter(Boolean)
    : [];
  if (categorias.length > 0) return categorias;
  return typeof conveniado.categoria === 'string' && conveniado.categoria.trim()
    ? [conveniado.categoria.trim()]
    : [];
}

export function listarCategorias(itens: BeneficioCatalogo[]) {
  const conjunto = new Set(
    itens.flatMap((item) => item.conveniados.flatMap(categoriasDoConveniado)),
  );
  return Array.from(conjunto).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function filtrarBeneficios(
  itens: BeneficioCatalogo[],
  termo: string,
  categoria: string | null,
) {
  const alvo = normalizarTexto(termo);
  return itens.filter((item) => {
    const naCategoria =
      categoria === null ||
      item.conveniados.some((conveniado) => categoriasDoConveniado(conveniado).includes(categoria));
    if (!naCategoria) return false;
    return (
      !alvo || contemTexto(item.beneficio.nome, alvo) || contemTexto(item.beneficio.descricao, alvo)
    );
  });
}
