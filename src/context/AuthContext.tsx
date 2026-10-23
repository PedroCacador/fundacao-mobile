import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UsuarioAutenticado } from '../models/Auth';
import { ApiError, definirAoExpirarSessao, definirToken } from '../services/api';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';

interface AuthContextData {
  usuario: UsuarioAutenticado | null;
  restaurando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [restaurando, setRestaurando] = useState(true);

  const logout = useCallback(async () => {
    definirToken(null);
    setUsuario(null);
    await tokenStorage.remover();
  }, []);

  useEffect(() => {
    definirAoExpirarSessao(() => {
      logout();
    });
    return () => definirAoExpirarSessao(null);
  }, [logout]);

  useEffect(() => {
    let ativo = true;

    async function restaurarSessao() {
      try {
        const tokenSalvo = await tokenStorage.obter();
        if (!tokenSalvo) return;

        const dados = await authService.buscarUsuarioLogado(tokenSalvo);
        if (!ativo) return;

        if (dados.escopo !== 'COLABORADOR' || dados.status !== 'ATIVO') {
          await tokenStorage.remover();
          return;
        }
        definirToken(tokenSalvo);
        setUsuario(dados);
      } catch (erro) {
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
    const resposta = await authService.login(email.trim(), senha);

    if (resposta.usuario.escopo !== 'COLABORADOR') {
      throw new ApiError(
        'Este aplicativo é exclusivo para colaboradores da FCV. Utilize o portal web.',
        403,
      );
    }

    await tokenStorage.salvar(resposta.token);
    definirToken(resposta.token);
    setUsuario(resposta.usuario);
  }, []);

  const valor = useMemo(
    () => ({ usuario, restaurando, login, logout }),
    [usuario, restaurando, login, logout],
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

export function useUsuario(): UsuarioAutenticado {
  const { usuario } = useAuth();
  if (!usuario) {
    throw new Error('useUsuario precisa de um usuário logado');
  }
  return usuario;
}
