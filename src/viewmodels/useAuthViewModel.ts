import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { precisaLimparSessao } from '../context/authState';
import { ApiError } from '../services/api';

export function useAuthViewModel() {
  const { login: entrar, autenticando, saindo, avisoSessao, tratarAviso } = useAuth();
  const [email, setEmailState] = useState('');
  const [senha, setSenhaState] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const carregando = autenticando || saindo;
  const limpezaPendente = precisaLimparSessao(avisoSessao);

  const setEmail = useCallback((texto: string) => {
    setEmailState(texto);
    setErro(null);
  }, []);

  const setSenha = useCallback((texto: string) => {
    setSenhaState(texto);
    setErro(null);
  }, []);

  const login = useCallback(async () => {
    if (carregando || limpezaPendente) return;
    if (!email.trim() || !senha) {
      setErro('Informe seu e-mail e sua senha.');
      return;
    }

    setErro(null);
    try {
      await entrar(email, senha);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Não foi possível entrar. Tente novamente.');
    }
  }, [carregando, limpezaPendente, email, senha, entrar]);

  return {
    email,
    setEmail,
    senha,
    setSenha,
    login,
    carregando,
    limpezaPendente,
    erro: limpezaPendente
      ? (avisoSessao?.mensagem ?? null)
      : (erro ?? avisoSessao?.mensagem ?? null),
    tentarDeNovo: avisoSessao?.acao ? tratarAviso : undefined,
  };
}
