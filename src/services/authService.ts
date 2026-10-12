import { RespostaLogin, UsuarioAutenticado } from '../models/Auth';
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
};
