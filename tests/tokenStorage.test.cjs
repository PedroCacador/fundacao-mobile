const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { fonte, secureStore, credenciais, nativo, adiar } = require('./helpers/runtime.cjs');
const { tokenStorage } = fonte('services/tokenStorage.ts');
const originais = { ...secureStore };

beforeEach(() => {
  Object.assign(secureStore, originais);
  nativo.Platform.OS = 'android';
  credenciais.clear();
  delete globalThis.localStorage;
});

test('salva, recupera e remove usando SecureStore no nativo', async () => {
  await tokenStorage.salvar('credencial-de-teste');
  assert.equal(await tokenStorage.obter(), 'credencial-de-teste');
  await tokenStorage.remover();
  assert.equal(await tokenStorage.obter(), null);
});

test('logout aguardando uma gravação anterior deixa a credencial removida', async () => {
  const espera = adiar();
  secureStore.setItemAsync = async (chave, valor) => {
    await espera.promessa;
    credenciais.set(chave, valor);
  };
  const gravacao = tokenStorage.salvar('antiga');
  const remocao = tokenStorage.remover();
  espera.resolver();
  await Promise.all([gravacao, remocao]);
  assert.equal(await tokenStorage.obter(), null);
});

test('uma falha de gravação é propagada e não bloqueia as operações seguintes', async () => {
  secureStore.setItemAsync = async () => {
    throw new Error('armazenamento indisponível');
  };
  await assert.rejects(tokenStorage.salvar('teste'));
  Object.assign(secureStore, originais);
  await tokenStorage.salvar('nova');
  assert.equal(await tokenStorage.obter(), 'nova');
});

test('falha de leitura e de remoção são propagadas ao contexto', async () => {
  secureStore.getItemAsync = async () => {
    throw new Error('falha de leitura');
  };
  secureStore.deleteItemAsync = async () => {
    throw new Error('falha de remoção');
  };
  await assert.rejects(tokenStorage.obter(), /falha de leitura/);
  await assert.rejects(tokenStorage.remover(), /falha de remoção/);
});

test('preview web usa armazenamento do navegador sem chamar SecureStore', async () => {
  nativo.Platform.OS = 'web';
  const web = new Map();
  globalThis.localStorage = {
    getItem: (chave) => web.get(chave) ?? null,
    setItem: (chave, valor) => web.set(chave, valor),
    removeItem: (chave) => web.delete(chave),
  };
  await tokenStorage.salvar('web');
  assert.equal(await tokenStorage.obter(), 'web');
  assert.equal(credenciais.size, 0);
  await tokenStorage.remover();
  assert.equal(web.size, 0);
});

test('preview com armazenamento bloqueado não finge que salvou', async () => {
  nativo.Platform.OS = 'web';
  await assert.rejects(tokenStorage.salvar('teste'), /indisponível/);
});
