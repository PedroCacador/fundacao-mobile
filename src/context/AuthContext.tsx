import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UsuarioAutenticado } from '../models/Auth';
import { ApiError } from '../services/api';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';
import { mockDataService } from '../data/mockDataService';

interface AuthContextData {
  usuario: UsuarioAutenticado | null;
  token: string | null;
  /** true enquanto o app verifica se existe uma sessão salva */
  restaurando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [restaurando, setRestaurando] = useState(true);

  // Ao abrir o app: se há token salvo, confirma com a API (GET /auth/eu).
  useEffect(() => {
    let ativo = true;

    async function restaurarSessao() {
      try {
        // 1. Verifica se há sessão mock ativa de desenvolvimento
        const sessaoMock = await mockDataService.obterSessaoMock();
        if (sessaoMock && ativo) {
          setToken(sessaoMock.token);
          setUsuario(sessaoMock.usuario);
          return;
        }

        // 2. Caso contrário, verifica o token seguro da API
        const tokenSalvo = await tokenStorage.obter();
        if (!tokenSalvo) return;

        const dados = await authService.buscarUsuarioLogado(tokenSalvo);
        if (!ativo) return;

        if (dados.escopo !== 'COLABORADOR' || dados.status !== 'ATIVO') {
          await tokenStorage.remover();
          return;
        }
        setToken(tokenSalvo);
        setUsuario(dados);
      } catch (erro) {
        // 401/403/404: sessão vencida ou inválida. Falha de rede: só volta ao login.
        if (erro instanceof ApiError && erro.status !== 0) {
          await tokenStorage.remover();
        }
      } finally {
        if (ativo) setRestaurando(false);
      }
    }

    restaurarSessao();
    return () => {
      ativo = false;
    };
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    try {
      // Tenta login na API real primeiro
      const resposta = await authService.login(email.trim(), senha);

      if (resposta.usuario.escopo !== 'COLABORADOR') {
        throw new ApiError(
          'Este aplicativo é exclusivo para colaboradores da FCV. Utilize o portal web.',
          403,
        );
      }

      await tokenStorage.salvar(resposta.token);
      setToken(resposta.token);
      setUsuario(resposta.usuario);
    } catch (e) {
      // Se a API estiver offline ou der erro de rede, tenta validar no mockDataService local
      try {
        const resultadoMock = await mockDataService.loginLocal(email, senha);
        setToken(resultadoMock.token);
        setUsuario(resultadoMock.usuario);
      } catch {
        // Se também falhar no mock local, propaga o erro original
        throw e;
      }
    }
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.remover();
    await mockDataService.limparSessaoMock();
    setToken(null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, token, restaurando, login, logout }),
    [usuario, token, restaurando, login, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextData {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return contexto;
}
