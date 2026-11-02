import { API_URL, TEMPO_LIMITE_MS } from '../config/api';

export class ApiError extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface OpcoesRequisicao {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  corpo?: unknown;
  token?: string | null;
}

let tokenAtual: string | null = null;
let versaoSessao = 0;
let aoExpirarSessao: (() => void) | null = null;

export function definirToken(token: string | null) {
  versaoSessao += 1;
  tokenAtual = token;
}

export function definirAoExpirarSessao(callback: (() => void) | null) {
  aoExpirarSessao = callback;
}

export async function requisitar<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const { metodo = 'GET', corpo } = opcoes;
  const usaSessao = opcoes.token === undefined;
  const token = usaSessao ? tokenAtual : opcoes.token;
  const versaoRequisicao = versaoSessao;

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  const cabecalhos: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  try {
    const resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controlador.signal,
    });

    let dados: unknown = null;
    try {
      if (resposta.status !== 204) dados = await resposta.json();
    } catch {
      if (controlador.signal.aborted)
        throw new ApiError('A requisição demorou demais. Tente novamente.', 0);
      if (resposta.ok) throw new ApiError('O servidor retornou uma resposta inválida.', 502);
    }

    // Uma resposta da conta anterior não pode invalidar ou alimentar a sessão atual.
    if (usaSessao && token && versaoRequisicao !== versaoSessao) {
      throw new ApiError('Solicitação cancelada após a troca de sessão.', -1);
    }

    if (resposta.status === 401 && token && usaSessao) {
      definirToken(null);
      aoExpirarSessao?.();
      throw new ApiError('Sua sessão expirou. Entre novamente.', 401);
    }

    if (!resposta.ok) {
      const mensagem =
        dados && typeof dados === 'object' && 'erro' in dados && typeof dados.erro === 'string'
          ? dados.erro
          : 'Erro inesperado. Tente novamente.';
      throw new ApiError(mensagem, resposta.status);
    }

    return dados as T;
  } catch (erro) {
    if (erro instanceof ApiError) throw erro;
    throw new ApiError(
      controlador.signal.aborted
        ? 'A requisição demorou demais. Tente novamente.'
        : 'Não foi possível conectar ao servidor. Verifique sua conexão e se a API está no ar.',
      0,
    );
  } finally {
    clearTimeout(temporizador);
  }
}
