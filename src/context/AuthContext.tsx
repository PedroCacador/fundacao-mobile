import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { UsuarioMobile } from '../models/Auth';
import { ApiError, definirAoExpirarSessao, definirToken } from '../services/api';
import { sessionService } from '../services/sessionService';
import { tokenStorage } from '../services/tokenStorage';
import { authReducer, estadoAuthInicial, type AvisoSessao } from './authState';

export interface AuthContextData {
  usuario: UsuarioMobile | null;
  escopo: UsuarioMobile['escopo'] | null;
  perfil: string | null;
  idSessao: number;
  restaurando: boolean;
  autenticando: boolean;
  saindo: boolean;
  avisoSessao: AvisoSessao | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  tratarAviso: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [estado, dispatch] = useReducer(authReducer, estadoAuthInicial);
  const operacao = useRef(0);
  const loginEmAndamento = useRef<number | null>(null);
  const montado = useRef(false);

  const estaAtual = useCallback((id: number) => montado.current && operacao.current === id, []);
  const iniciar = useCallback((etapa: 'RESTAURANDO' | 'AUTENTICANDO' | 'SAINDO') => {
    const id = ++operacao.current;
    definirToken(null);
    dispatch({ tipo: 'INICIAR', operacao: id, etapa });
    return id;
  }, []);

  const limparCredencial = useCallback(
    async (id: number, mensagem?: string) => {
      let aviso: AvisoSessao | null = mensagem ? { mensagem, acao: null } : null;
      try {
        await tokenStorage.remover();
      } catch {
        aviso = {
          mensagem:
            'O acesso foi encerrado, mas não foi possível remover a credencial salva. Tente novamente para concluir a saída.',
          acao: 'LIMPAR_CREDENCIAL',
        };
      }
      if (estaAtual(id)) dispatch({ tipo: 'ENCERRAR', operacao: id, aviso });
    },
    [estaAtual],
  );

  const encerrar = useCallback(
    async (mensagem?: string) => {
      if (!montado.current) return;
      const id = iniciar('SAINDO');
      await limparCredencial(id, mensagem);
    },
    [iniciar, limparCredencial],
  );

  const logout = useCallback(() => encerrar(), [encerrar]);

  const restaurar = useCallback(async () => {
    if (!montado.current) return;
    const id = iniciar('RESTAURANDO');
    try {
      const token = await tokenStorage.obter();
      if (!estaAtual(id)) return;
      if (!token) {
        dispatch({ tipo: 'ENCERRAR', operacao: id });
        return;
      }
      const usuario = await sessionService.restaurar(token);
      if (!estaAtual(id)) return;
      definirToken(token);
      dispatch({ tipo: 'AUTENTICAR', operacao: id, usuario });
    } catch (erro) {
      if (!estaAtual(id)) return;
      if (erro instanceof ApiError && [401, 403, 404].includes(erro.status)) {
        await limparCredencial(
          id,
          erro.status === 401 ? 'Sua sessão expirou. Entre novamente.' : erro.message,
        );
      } else {
        dispatch({
          tipo: 'ENCERRAR',
          operacao: id,
          aviso: {
            mensagem:
              erro instanceof ApiError
                ? `Não foi possível validar sua sessão. ${erro.message}`
                : 'Não foi possível ler a credencial salva. Tente novamente ou entre com sua conta.',
            acao: 'RESTAURAR',
          },
        });
      }
    }
  }, [estaAtual, iniciar, limparCredencial]);

  useEffect(() => {
    montado.current = true;
    definirAoExpirarSessao(() => {
      void encerrar('Sua sessão expirou. Entre novamente.');
    });
    void restaurar();
    return () => {
      montado.current = false;
      operacao.current += 1;
      definirAoExpirarSessao(null);
      definirToken(null);
    };
  }, [encerrar, restaurar]);

  const login = useCallback(
    async (email: string, senha: string) => {
      if (!montado.current || loginEmAndamento.current === operacao.current) return;
      if (estado.aviso?.acao === 'LIMPAR_CREDENCIAL') {
        throw new ApiError('Conclua a remoção da credencial salva antes de entrar novamente.', 0);
      }
      const id = iniciar('AUTENTICANDO');
      loginEmAndamento.current = id;
      let preparando = true;
      let gravando = false;
      try {
        // Uma tentativa de troca de conta não deve deixar a credencial anterior salva.
        await tokenStorage.remover();
        preparando = false;
        if (!estaAtual(id)) return;
        const sessao = await sessionService.entrar(email, senha);
        if (!estaAtual(id)) return;
        gravando = true;
        await tokenStorage.salvar(sessao.token);
        if (!estaAtual(id)) return;
        definirToken(sessao.token);
        dispatch({ tipo: 'AUTENTICAR', operacao: id, usuario: sessao.usuario });
      } catch (erro) {
        if (!estaAtual(id)) return;
        if (preparando || gravando) {
          await limparCredencial(id);
          throw new ApiError(
            'Não foi possível preparar ou salvar sua sessão. Verifique o armazenamento e tente novamente.',
            0,
          );
        }
        dispatch({ tipo: 'ENCERRAR', operacao: id });
        throw erro;
      } finally {
        if (loginEmAndamento.current === id) loginEmAndamento.current = null;
      }
    },
    [estado.aviso?.acao, iniciar, estaAtual, limparCredencial],
  );

  const tratarAviso = useCallback(async () => {
    if (estado.aviso?.acao === 'LIMPAR_CREDENCIAL') await logout();
    else if (estado.aviso?.acao === 'RESTAURAR') await restaurar();
  }, [estado.aviso?.acao, logout, restaurar]);

  const valor = useMemo<AuthContextData>(
    () => ({
      usuario: estado.usuario,
      escopo: estado.usuario?.escopo ?? null,
      perfil: estado.usuario?.perfil ?? null,
      idSessao: estado.idSessao,
      restaurando: estado.etapa === 'RESTAURANDO',
      autenticando: estado.etapa === 'AUTENTICANDO',
      saindo: estado.etapa === 'SAINDO',
      avisoSessao: estado.aviso,
      login,
      logout,
      tratarAviso,
    }),
    [estado, login, logout, tratarAviso],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextData {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  return contexto;
}

export function useUsuario(): UsuarioMobile {
  const { usuario } = useAuth();
  if (!usuario) throw new Error('useUsuario precisa de um usuário logado');
  return usuario;
}
