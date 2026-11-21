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

export function filtrarUltimosMeses(
  utilizacoes: Utilizacao[],
  agora: Date,
  meses = MESES_HISTORICO,
) {
  const inicio = inicioDoPeriodo(agora, meses).getTime();
  return utilizacoes.filter(
    (utilizacao) => lerData(utilizacao.data_solicitacao).getTime() >= inicio,
  );
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
    b.data_solicitacao.localeCompare(a.data_solicitacao),
  );
}
