import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';

export function useAuthViewModel() {
  const { login: entrar } = useAuth();
  const [email, setEmailState] = useState('');
  const [senha, setSenhaState] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const setEmail = useCallback((texto: string) => {
    setEmailState(texto);
    setErro(null);
  }, []);

  const setSenha = useCallback((texto: string) => {
    setSenhaState(texto);
    setErro(null);
  }, []);

  const login = useCallback(async () => {
    if (carregando) return;
    if (!email.trim() || !senha) {
      setErro('Informe seu e-mail e sua senha.');
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      await entrar(email, senha);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Não foi possível entrar. Tente novamente.');
      setCarregando(false);
    }
  }, [carregando, email, senha, entrar]);

  return { email, setEmail, senha, setSenha, login, carregando, erro };
}
