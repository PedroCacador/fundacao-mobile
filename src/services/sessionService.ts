import type { SessaoMobile, UsuarioAutenticado, UsuarioMobile } from '../models/Auth';
import { ApiError } from './api';
import { authService } from './authService';

function rejeitarSenha(dados: unknown): void {
  if (!dados || typeof dados !== 'object') return;
  if (Array.isArray(dados)) {
    dados.forEach(rejeitarSenha);
    return;
  }
  for (const [chave, valor] of Object.entries(dados)) {
    const nomeCampo = chave.toLowerCase();
    if (nomeCampo.startsWith('senha') || nomeCampo.startsWith('password')) {
      throw new ApiError(
        'O servidor retornou dados de autenticação que não deveriam ser enviados.',
        502,
      );
    }
    rejeitarSenha(valor);
  }
}

function limparUsuario(usuario: UsuarioAutenticado): UsuarioAutenticado {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil_id: usuario.perfil_id,
    perfil: usuario.perfil,
    escopo: usuario.escopo,
    status: usuario.status,
    data_criacao: usuario.data_criacao,
    colaborador: usuario.colaborador
      ? {
          id: usuario.colaborador.id,
          usuario_id: usuario.colaborador.usuario_id,
          matricula: usuario.colaborador.matricula,
          setor: usuario.colaborador.setor,
          cargo: usuario.colaborador.cargo,
          data_admissao: usuario.colaborador.data_admissao,
          status: usuario.colaborador.status,
          telefone: usuario.colaborador.telefone,
        }
      : null,
    conveniado: usuario.conveniado
      ? {
          id: usuario.conveniado.id,
          usuario_id: usuario.conveniado.usuario_id,
          nome_fantasia: usuario.conveniado.nome_fantasia,
          razao_social: usuario.conveniado.razao_social,
          categoria: usuario.conveniado.categoria,
          cnpj: usuario.conveniado.cnpj,
          endereco: usuario.conveniado.endereco,
          status: usuario.conveniado.status,
          ...(usuario.conveniado.categorias !== undefined
            ? { categorias: usuario.conveniado.categorias }
            : {}),
          ...(usuario.conveniado.telefone !== undefined
            ? { telefone: usuario.conveniado.telefone }
            : {}),
          ...(usuario.conveniado.email !== undefined ? { email: usuario.conveniado.email } : {}),
        }
      : null,
  };
}

function validarUsuario(usuario: UsuarioAutenticado): UsuarioMobile {
  if (!usuario || !Number.isInteger(usuario.id) || usuario.id <= 0) {
    throw new ApiError('O servidor retornou uma sessão inválida.', 502);
  }
  rejeitarSenha(usuario);
  const usuarioLimpo = limparUsuario(usuario);
  if (usuario.escopo === 'FCV') {
    throw new ApiError('As contas da equipe FCV devem acessar o portal web.', 403);
  }
  if (usuario.status !== 'ATIVO') {
    throw new ApiError('Sua conta está inativa. Entre em contato com a FCV.', 403);
  }

  if (usuario.escopo === 'COLABORADOR') {
    const vinculo = usuarioLimpo.colaborador;
    if (vinculo?.status === 'ATIVO' && vinculo.usuario_id === usuario.id && !usuario.conveniado) {
      return {
        ...usuarioLimpo,
        escopo: 'COLABORADOR',
        colaborador: vinculo,
        conveniado: null,
      };
    }
  } else if (usuario.escopo === 'CONVENIADO') {
    const vinculo = usuarioLimpo.conveniado;
    if (vinculo?.status === 'ATIVO' && vinculo.usuario_id === usuario.id && !usuario.colaborador) {
      return {
        ...usuarioLimpo,
        escopo: 'CONVENIADO',
        colaborador: null,
        conveniado: vinculo,
      };
    }
  }
  throw new ApiError('Seu cadastro não possui um vínculo ativo para acessar o aplicativo.', 403);
}

export const sessionService = {
  async entrar(email: string, senha: string): Promise<SessaoMobile> {
    const resposta = await authService.login(email.trim(), senha);
    if (!resposta || typeof resposta.token !== 'string' || !resposta.token.trim()) {
      throw new ApiError('O servidor não retornou uma credencial válida.', 502);
    }
    return { token: resposta.token, usuario: validarUsuario(resposta.usuario) };
  },

  async restaurar(token: string): Promise<UsuarioMobile> {
    return validarUsuario(await authService.buscarUsuarioLogado(token));
  },
};
