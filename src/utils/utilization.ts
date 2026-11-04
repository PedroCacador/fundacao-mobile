import { NomeIcone } from '../models/Icon';
import { StatusUtilizacao } from '../models/Utilization';
import { cores } from '../theme';

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
};
