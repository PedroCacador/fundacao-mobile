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
let aoExpirarSessao: (() => void) | null = null;

export function definirToken(token: string | null) {
  tokenAtual = token;
}

export function definirAoExpirarSessao(callback: (() => void) | null) {
  aoExpirarSessao = callback;
}

export async function requisitar<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const { metodo = 'GET', corpo } = opcoes;
  const token = opcoes.token ?? tokenAtual;

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  const cabecalhos: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal: controlador.signal,
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão e se a API está no ar.',
      0,
    );
  } finally {
    clearTimeout(temporizador);
  }

  let dados: { erro?: string } | null = null;
  try {
    dados = await resposta.json();
  } catch {
    dados = null;
  }

  if (resposta.status === 401 && token && !opcoes.token) {
    aoExpirarSessao?.();
    throw new ApiError('Sua sessão expirou. Entre novamente.', 401);
  }

  if (!resposta.ok) {
    throw new ApiError(dados?.erro ?? 'Erro inesperado. Tente novamente.', resposta.status);
  }

  return dados as T;
}
