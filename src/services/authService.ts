import { RespostaCodigo, RespostaLogin, UsuarioAutenticado } from '../models/Auth';
import { requisitar } from './api';

export const authService = {
  login(email: string, senha: string) {
    return requisitar<RespostaLogin>('/auth/login', {
      metodo: 'POST',
      corpo: { email, senha },
    });
  },

  buscarUsuarioLogado(token: string) {
    return requisitar<UsuarioAutenticado>('/auth/eu', { token });
  },

  solicitarCodigo(email: string) {
    return requisitar<RespostaCodigo>('/auth/esqueci-senha', {
      metodo: 'POST',
      corpo: { email },
    });
  },

  redefinirSenha(email: string, codigo: string, novaSenha: string) {
    return requisitar<{ mensagem: string }>('/auth/redefinir-senha', {
      metodo: 'POST',
      corpo: { email, codigo, nova_senha: novaSenha },
    });
  },
};
