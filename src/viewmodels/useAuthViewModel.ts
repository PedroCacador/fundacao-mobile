import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';

export function useAuthViewModel() {
  const { login: entrar, logout } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, senha: string): Promise<boolean> => {
      if (!email.trim() || !senha) {
        setErro('Informe seu e-mail e sua senha.');
        return false;
      }

      setErro(null);
      setCarregando(true);
      try {
        await entrar(email, senha);
        return true;
      } catch (e) {
        setErro(e instanceof ApiError ? e.message : 'Não foi possível entrar. Tente novamente.');
        return false;
      } finally {
        setCarregando(false);
      }
    },
    [entrar],
  );

  const limparErro = useCallback(() => setErro(null), []);

  return { login, logout, carregando, erro, limparErro };
}
