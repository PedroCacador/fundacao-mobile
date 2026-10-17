import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { UsuarioAutenticado } from '../models/Auth';

const CHAVE_STORAGE_USUARIOS = 'fcv_mock_usuarios_cadastrados';
const CHAVE_STORAGE_SESSAO = 'fcv_mock_sessao_ativa';

export interface UsuarioCadastroInput {
  nome: string;
  email: string;
  senha: string;
  matricula?: string;
  cargo?: string;
  setor?: string;
  telefone?: string;
}

export interface UsuarioArmazenado extends UsuarioAutenticado {
  senha: string; // Para validação local
}

// Usuário padrão fiel ao protótipo do PDF (Ana Carolina Silva)
const USUARIO_PADRAO_PROTOTIPO: UsuarioArmazenado = {
  id: 1,
  nome: 'Kaio',
  email: 'kaio@gmail.com',
  senha: '123',
  perfil_id: 2,
  perfil: 'Colaborador',
  escopo: 'COLABORADOR',
  status: 'ATIVO',
  data_criacao: '2023-01-15T08:00:00.000Z',
  colaborador: {
    id: 101,
    usuario_id: 1,
    matricula: '4587',
    cargo: 'Analista Administrativo',
    setor: 'Administrativo',
    data_admissao: '2023-01-15',
    status: 'ATIVO',
    telefone: '(31) 98765-4321',
  },
};

async function getItem(chave: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(chave) : null;
  }
  return SecureStore.getItemAsync(chave);
}

async function setItem(chave: string, valor: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(chave, valor);
    return;
  }
  await SecureStore.setItemAsync(chave, valor);
}

async function removeItem(chave: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(chave);
    return;
  }
  await SecureStore.deleteItemAsync(chave);
}

/** CRUD Local e Mock Service para testes rápidos offline ou sem backend */
export const mockDataService = {
  /** Lista todos os usuários cadastrados */
  async listarUsuarios(): Promise<UsuarioArmazenado[]> {
    const raw = await getItem(CHAVE_STORAGE_USUARIOS);
    if (!raw) {
      // Inicializa com o usuário protótipo
      const inicial = [USUARIO_PADRAO_PROTOTIPO];
      await setItem(CHAVE_STORAGE_USUARIOS, JSON.stringify(inicial));
      return inicial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [USUARIO_PADRAO_PROTOTIPO];
    }
  },

  /** Cadastra um novo usuário no CRUD local */
  async registrarUsuario(input: UsuarioCadastroInput): Promise<UsuarioAutenticado> {
    const lista = await this.listarUsuarios();
    const jaExiste = lista.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (jaExiste) {
      throw new Error('Já existe um colaborador cadastrado com este e-mail.');
    }

    const novoId = lista.length > 0 ? Math.max(...lista.map((u) => u.id)) + 1 : 1;
    const novoUsuario: UsuarioArmazenado = {
      id: novoId,
      nome: input.nome.trim(),
      email: input.email.trim().toLowerCase(),
      senha: input.senha,
      perfil_id: 2,
      perfil: 'Colaborador',
      escopo: 'COLABORADOR',
      status: 'ATIVO',
      data_criacao: new Date().toISOString(),
      colaborador: {
        id: novoId * 100,
        usuario_id: novoId,
        matricula: input.matricula || String(1000 + novoId),
        cargo: input.cargo || 'Colaborador FCV',
        setor: input.setor || 'Operações',
        data_admissao: new Date().toISOString().split('T')[0],
        status: 'ATIVO',
        telefone: input.telefone || '(31) 99999-0000',
      },
    };

    lista.push(novoUsuario);
    await setItem(CHAVE_STORAGE_USUARIOS, JSON.stringify(lista));
    return novoUsuario;
  },

  /** Autentica pelo e-mail e senha cadastrados localmente */
  async loginLocal(email: string, senha: string): Promise<{ token: string; usuario: UsuarioAutenticado }> {
    const lista = await this.listarUsuarios();
    const encontrado = lista.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha,
    );

    if (!encontrado) {
      throw new Error('E-mail ou senha inválidos no cadastro local.');
    }

    const token = `fcv_mock_token_${encontrado.id}_${Date.now()}`;
    await setItem(CHAVE_STORAGE_SESSAO, JSON.stringify({ token, usuario: encontrado }));

    // Retorna sem a senha exposta
    const { senha: _, ...usuarioLimpo } = encontrado;
    return {
      token,
      usuario: usuarioLimpo as UsuarioAutenticado,
    };
  },

  /** Obtém a sessão mock atual */
  async obterSessaoMock(): Promise<{ token: string; usuario: UsuarioAutenticado } | null> {
    const raw = await getItem(CHAVE_STORAGE_SESSAO);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /** Remove a sessão mock */
  async limparSessaoMock(): Promise<void> {
    await removeItem(CHAVE_STORAGE_SESSAO);
  },

  /** Restaura a lista de usuários para o estado de fábrica do protótipo */
  async resetarDados(): Promise<void> {
    await setItem(CHAVE_STORAGE_USUARIOS, JSON.stringify([USUARIO_PADRAO_PROTOTIPO]));
    await this.limparSessaoMock();
  },
};
