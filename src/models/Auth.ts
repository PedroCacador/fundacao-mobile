import type { Conveniado } from './Benefit';

export interface Colaborador {
  id: number;
  usuario_id: number;
  matricula: string;
  setor: string;
  cargo: string;
  data_admissao: string;
  status: 'ATIVO' | 'INATIVO' | 'AFASTADO';
  telefone: string | null;
}

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  perfil_id: number;
  perfil: string;
  escopo: 'FCV' | 'COLABORADOR' | 'CONVENIADO';
  status: 'ATIVO' | 'INATIVO';
  data_criacao: string;
  colaborador: Colaborador | null;
  conveniado: Conveniado | null;
}

export interface RespostaLogin {
  token: string;
  usuario: UsuarioAutenticado;
}

export type UsuarioMobile = UsuarioAutenticado &
  (
    | { escopo: 'COLABORADOR'; colaborador: Colaborador; conveniado: null }
    | { escopo: 'CONVENIADO'; colaborador: null; conveniado: Conveniado }
  );

export interface SessaoMobile {
  token: string;
  usuario: UsuarioMobile;
}

export interface RespostaCodigo {
  mensagem: string;
}
