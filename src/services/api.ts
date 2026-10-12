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

/** Faz a requisição, converte o JSON e transforma falhas em ApiError com mensagem em português. */
export async function requisitar<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const { metodo = 'GET', corpo, token } = opcoes;

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

  let dados: any = null;
  try {
    dados = await resposta.json();
  } catch {
    // resposta sem corpo JSON (ex.: 204)
  }

  if (!resposta.ok) {
    throw new ApiError(dados?.erro ?? 'Erro inesperado. Tente novamente.', resposta.status);
  }

  return dados as T;
}
