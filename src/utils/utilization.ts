import { NomeIcone } from '../models/Icon';
import { StatusUtilizacao, Utilizacao } from '../models/Utilization';
import { cores } from '../theme';
import { lerData } from './format';
import { contemTexto, normalizarTexto } from './search';

export interface AparenciaStatus {
  rotulo: string;
  icone: NomeIcone;
  cor: string;
  fundo: string;
}

export const statusUtilizacao: StatusUtilizacao[] = [
  'APROVADA',
  'PENDENTE',
  'REPROVADA',
  'ESTORNADA',
  'EXPIRADA',
  'CANCELADA',
];

export const aparenciaStatusUtilizacao: Record<StatusUtilizacao, AparenciaStatus> = {
  APROVADA: { rotulo: 'Utilizado', icone: 'check', cor: cores.sucesso, fundo: cores.sucessoFundo },
  PENDENTE: {
    rotulo: 'Pendente',
    icone: 'chevron-right',
    cor: cores.primaria,
    fundo: cores.primariaClara,
  },
  REPROVADA: { rotulo: 'Reprovado', icone: 'x', cor: cores.erro, fundo: cores.erroFundo },
  ESTORNADA: { rotulo: 'Estornado', icone: 'x', cor: cores.textoSecundario, fundo: cores.borda },
  EXPIRADA: { rotulo: 'Expirado', icone: 'clock', cor: cores.erro, fundo: cores.erroFundo },
  CANCELADA: { rotulo: 'Cancelado', icone: 'x', cor: cores.textoSecundario, fundo: cores.borda },
};

export const MESES_HISTORICO = 6;

export function inicioDoPeriodo(agora: Date, meses = MESES_HISTORICO) {
  const ultimoDiaDoMesAlvo = new Date(agora.getFullYear(), agora.getMonth() - meses + 1, 0).getDate();
  return new Date(
    agora.getFullYear(),
    agora.getMonth() - meses,
    Math.min(agora.getDate(), ultimoDiaDoMesAlvo),
  );
}

const DATA_ISO = /^\d{4}-\d{2}-\d{2}/;

function lerDataValida(texto: string | null | undefined): Date | null {
  if (typeof texto !== 'string' || !DATA_ISO.test(texto)) return null;
  const [ano, mes, dia] = texto.slice(0, 10).split('-').map(Number);
  const data = lerData(texto);
  if (
    Number.isNaN(data.getTime()) ||
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }
  return data;
}

export function filtrarUltimosMeses(
  utilizacoes: Utilizacao[],
  agora: Date,
  meses = MESES_HISTORICO,
) {
  const inicio = inicioDoPeriodo(agora, meses).getTime();
  const fim = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
  return utilizacoes.filter((utilizacao) => {
    const data = lerDataValida(utilizacao.data_solicitacao);
    if (!data) return false;
    const tempo = data.getTime();
    return tempo >= inicio && tempo <= fim;
  });
}

export function buscarUtilizacoes(
  utilizacoes: Utilizacao[],
  termo: string,
  descricoes: ReadonlyMap<number, string>,
) {
  const alvo = normalizarTexto(termo);
  if (!alvo) return utilizacoes;
  return utilizacoes.filter((utilizacao) => {
    const descricao =
      utilizacao.beneficio_id !== null ? descricoes.get(utilizacao.beneficio_id) : undefined;
    return contemTexto(utilizacao.beneficio_nome, alvo) || contemTexto(descricao, alvo);
  });
}

export function consultarHistorico({
  utilizacoes,
  agora,
  termo,
  descricoes,
}: {
  utilizacoes: Utilizacao[];
  agora: Date;
  termo: string;
  descricoes: ReadonlyMap<number, string>;
}) {
  const recentes = filtrarUltimosMeses(utilizacoes, agora);
  return [...buscarUtilizacoes(recentes, termo, descricoes)].sort((a, b) =>
    (b.data_solicitacao ?? '').localeCompare(a.data_solicitacao ?? ''),
  );
}
