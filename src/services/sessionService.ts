import type { SessaoMobile, UsuarioAutenticado, UsuarioMobile } from '../models/Auth';
import { ApiError } from './api';
import { authService } from './authService';

function validarUsuario(usuario: UsuarioAutenticado): UsuarioMobile {
  if (!usuario || !Number.isInteger(usuario.id) || usuario.id <= 0) {
    throw new ApiError('O servidor retornou uma sessão inválida.', 502);
  }
  if (usuario.escopo === 'FCV') {
    throw new ApiError('As contas da equipe FCV devem acessar o portal web.', 403);
  }
  if (usuario.status !== 'ATIVO') {
    throw new ApiError('Sua conta está inativa. Entre em contato com a FCV.', 403);
  }

  if (usuario.escopo === 'COLABORADOR') {
    const vinculo = usuario.colaborador;
    if (vinculo?.status === 'ATIVO' && vinculo.usuario_id === usuario.id && !usuario.conveniado) {
      return { ...usuario, escopo: 'COLABORADOR', colaborador: vinculo, conveniado: null };
    }
  } else if (usuario.escopo === 'CONVENIADO') {
    const vinculo = usuario.conveniado;
    if (vinculo?.status === 'ATIVO' && vinculo.usuario_id === usuario.id && !usuario.colaborador) {
      return { ...usuario, escopo: 'CONVENIADO', colaborador: null, conveniado: vinculo };
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
