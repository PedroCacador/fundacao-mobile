const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const {
  fonte,
  asyncStorage,
  preferenciasGuardadas,
  credenciais,
  adiar,
} = require('./helpers/runtime.cjs');
const { storageService } = fonte('services/storageService.ts');
const originais = { ...asyncStorage };
const colaborador = { id: 3, escopo: 'COLABORADOR' };
const conveniado = { id: 3, escopo: 'CONVENIADO' };
const CHAVE_MARCADOR = '@fcv:v1:preferencias:conta-atual';
const chave = (conta) => `@fcv:v1:conta:${conta.escopo}:${conta.id}:preferencias`;
const padrao = { filtroCarteira: 'TODOS', periodoHistorico: 'TRIMESTRE' };
const escolhidas = { filtroCarteira: 'DISPONIVEIS', periodoHistorico: 'SEMESTRE' };

beforeEach(() => {
  preferenciasGuardadas.clear();
  credenciais.clear();
  Object.assign(asyncStorage, originais);
});

test('persiste somente os filtros permitidos e recupera na reabertura da mesma conta', async () => {
  assert.deepEqual(await storageService.carregarPreferencias(colaborador), padrao);
  await storageService.salvarPreferencias(colaborador, escolhidas);
  assert.deepEqual(await storageService.carregarPreferencias(colaborador), escolhidas);
  assert.equal(credenciais.size, 0);
  assert.deepEqual(JSON.parse(preferenciasGuardadas.get(CHAVE_MARCADOR)), colaborador);
});

test('mesmo id em escopos diferentes não compartilha preferências', async () => {
  await storageService.carregarPreferencias(colaborador);
  await storageService.salvarPreferencias(colaborador, escolhidas);
  assert.deepEqual(await storageService.carregarPreferencias(conveniado), padrao);
  assert.equal(preferenciasGuardadas.has(chave(colaborador)), false);
  await assert.rejects(storageService.salvarPreferencias(colaborador, escolhidas), /outra conta/);
});

test('trocar de usuário limpa a conta anterior e mantém chaves de outros recursos', async () => {
  preferenciasGuardadas.set('@outro-recurso', 'preservar');
  await storageService.carregarPreferencias(colaborador);
  await storageService.salvarPreferencias(colaborador, escolhidas);
  assert.deepEqual(
    await storageService.carregarPreferencias({ id: 8, escopo: 'COLABORADOR' }),
    padrao,
  );
  assert.equal(preferenciasGuardadas.has(chave(colaborador)), false);
  assert.equal(preferenciasGuardadas.get('@outro-recurso'), 'preservar');
});

test('logout limpa dados da conta e marcador sem AsyncStorage.clear', async () => {
  preferenciasGuardadas.set('tema-de-outro-modulo', 'claro');
  await storageService.carregarPreferencias(colaborador);
  await storageService.salvarPreferencias(colaborador, escolhidas);
  await storageService.limparConta();
  assert.deepEqual([...preferenciasGuardadas.entries()], [['tema-de-outro-modulo', 'claro']]);
  await assert.rejects(
    storageService.salvarPreferencias(colaborador, escolhidas),
    /sessão encerrada/,
  );
});

test('token, senha, cadastro e campos extras nunca são serializados', async () => {
  await storageService.carregarPreferencias(colaborador);
  await storageService.salvarPreferencias(colaborador, {
    ...escolhidas,
    token: 'segredo',
    senha: 'segredo',
    usuario: { nome: 'Pessoa' },
    historico: [1],
  });
  assert.deepEqual(JSON.parse(preferenciasGuardadas.get(chave(colaborador))), escolhidas);
  assert.ok(!JSON.stringify([...preferenciasGuardadas]).includes('segredo'));
});

test('valores desconhecidos e JSON corrompido retornam padrões e são normalizados', async () => {
  await storageService.carregarPreferencias(colaborador);
  for (const texto of [
    '{invalido',
    JSON.stringify({ filtroCarteira: 'OUTRO', periodoHistorico: 20, token: 'remover' }),
  ]) {
    preferenciasGuardadas.set(chave(colaborador), texto);
    assert.deepEqual(await storageService.carregarPreferencias(colaborador), padrao);
    assert.deepEqual(JSON.parse(preferenciasGuardadas.get(chave(colaborador))), padrao);
  }
});

test('marcador corrompido permite limpar só os namespaces conhecidos de preferências', async () => {
  preferenciasGuardadas.set(CHAVE_MARCADOR, '{invalido');
  preferenciasGuardadas.set(chave(colaborador), JSON.stringify(escolhidas));
  preferenciasGuardadas.set(chave(conveniado), JSON.stringify(escolhidas));
  preferenciasGuardadas.set('@fcv:v1:conta:COLABORADOR:3:outro', 'preservar');
  await storageService.limparConta();
  assert.deepEqual([...preferenciasGuardadas.keys()], ['@fcv:v1:conta:COLABORADOR:3:outro']);
});

test('gravação lenta seguida de logout não recria preferências depois da limpeza', async () => {
  await storageService.carregarPreferencias(colaborador);
  const espera = adiar();
  asyncStorage.setItem = async (item, valor) => {
    await espera.promessa;
    preferenciasGuardadas.set(item, valor);
  };
  const escrita = storageService.salvarPreferencias(colaborador, escolhidas);
  const limpeza = storageService.limparConta();
  espera.resolver();
  await Promise.all([escrita, limpeza]);
  assert.equal(preferenciasGuardadas.size, 0);
});

test('falhas de leitura e escrita são propagadas sem inutilizar a fila', async () => {
  asyncStorage.getItem = async () => {
    throw new Error('leitura indisponível');
  };
  await assert.rejects(storageService.carregarPreferencias(colaborador), /leitura indisponível/);
  Object.assign(asyncStorage, originais);
  await storageService.carregarPreferencias(colaborador);
  asyncStorage.setItem = async () => {
    throw new Error('disco cheio');
  };
  await assert.rejects(storageService.salvarPreferencias(colaborador, escolhidas), /disco cheio/);
  Object.assign(asyncStorage, originais);
  await storageService.salvarPreferencias(colaborador, escolhidas);
  assert.deepEqual(await storageService.carregarPreferencias(colaborador), escolhidas);
});

test('remoção com falha preserva o marcador para repetir a limpeza', async () => {
  await storageService.carregarPreferencias(colaborador);
  await storageService.salvarPreferencias(colaborador, escolhidas);
  asyncStorage.removeItem = async () => {
    throw new Error('remoção indisponível');
  };
  await assert.rejects(storageService.limparConta(), /remoção indisponível/);
  assert.ok(preferenciasGuardadas.has(CHAVE_MARCADOR));
  Object.assign(asyncStorage, originais);
  await storageService.limparConta();
  assert.equal(preferenciasGuardadas.size, 0);
});

test('rejeita conta inválida antes de criar chaves no armazenamento', () => {
  for (const conta of [
    { id: 0, escopo: 'COLABORADOR' },
    { id: 3, escopo: 'FCV' },
  ]) {
    assert.throws(() => storageService.carregarPreferencias(conta), /Conta inválida/);
  }
  assert.equal(preferenciasGuardadas.size, 0);
});
