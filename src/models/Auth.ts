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

/** Usuário como devolvido pela API em /auth/login e /auth/eu. */
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
}

export interface RespostaLogin {
  token: string;
  usuario: UsuarioAutenticado;
}
