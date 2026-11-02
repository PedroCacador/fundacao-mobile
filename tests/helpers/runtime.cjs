const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const nativo = {
  Platform: { OS: 'android' },
};
const credenciais = new Map();
const secureStore = {
  async getItemAsync(chave) {
    return credenciais.get(chave) ?? null;
  },
  async setItemAsync(chave, valor) {
    credenciais.set(chave, valor);
  },
  async deleteItemAsync(chave) {
    credenciais.delete(chave);
  },
};

// Somente o processo de teste substitui os módulos nativos. Os providers,
// hooks, cliente HTTP e serviços testados são os arquivos reais de src/.
const carregar = Module._load;
Module._load = function (nome, ...argumentos) {
  if (nome === 'react-native') return nativo;
  if (nome === 'expo-secure-store') return secureStore;
  if (nome === 'expo-constants') return { expoConfig: {} };
  return carregar.call(this, nome, ...argumentos);
};
for (const extensao of ['.ts', '.tsx']) {
  Module._extensions[extensao] = (modulo, arquivo) => {
    const resultado = ts.transpileModule(fs.readFileSync(arquivo, 'utf8'), {
      fileName: arquivo,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    });
    modulo._compile(resultado.outputText, arquivo);
  };
}
process.env.EXPO_PUBLIC_API_URL = 'http://api.test/api/v1';

function fonte(arquivo) {
  return require(path.join(__dirname, '../../src', arquivo));
}

function adiar() {
  let resolver;
  let rejeitar;
  const promessa = new Promise((resolve, reject) => {
    resolver = resolve;
    rejeitar = reject;
  });
  return { promessa, resolver, rejeitar };
}

function json(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function usuario(escopo = 'COLABORADOR', id = 3) {
  return {
    id,
    nome: 'Conta de teste',
    email: 'teste@example.com',
    perfil_id: 1,
    perfil: escopo,
    escopo,
    status: 'ATIVO',
    data_criacao: '2026-01-01T00:00:00.000Z',
    colaborador:
      escopo === 'COLABORADOR'
        ? {
            id: 1,
            usuario_id: id,
            matricula: 'TESTE',
            setor: 'Setor',
            cargo: 'Cargo',
            data_admissao: '2020-01-01',
            telefone: null,
            status: 'ATIVO',
          }
        : null,
    conveniado:
      escopo === 'CONVENIADO'
        ? {
            id: 2,
            usuario_id: id,
            nome_fantasia: 'Local de teste',
            razao_social: 'Local',
            cnpj: '00000000000000',
            categoria: 'Outros',
            endereco: 'Rua de teste',
            status: 'ATIVO',
          }
        : null,
  };
}

module.exports = { fonte, nativo, secureStore, credenciais, adiar, json, usuario };
