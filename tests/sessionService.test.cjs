const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { fonte, json, usuario } = require('./helpers/runtime.cjs');
const { sessionService } = fonte('services/sessionService.ts');
const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

for (const escopo of ['COLABORADOR', 'CONVENIADO']) {
  test(`login e restauração aceitam ${escopo} ativo com vínculo correspondente`, async () => {
    const dados = usuario(escopo);
    globalThis.fetch = async (url, opcoes) => {
      if (url.endsWith('/auth/login')) {
        assert.deepEqual(JSON.parse(opcoes.body), { email: 'teste@example.com', senha: 'senha' });
        return json({ token: 'teste', usuario: dados });
      }
      assert.equal(opcoes.headers.Authorization, 'Bearer teste');
      return json(dados);
    };
    assert.deepEqual(await sessionService.entrar(' teste@example.com ', 'senha'), {
      token: 'teste',
      usuario: dados,
    });
    assert.deepEqual(await sessionService.restaurar('teste'), dados);
  });
}

for (const [nome, modificar] of [
  [
    'FCV destinado ao portal',
    (u) => {
      u.escopo = 'FCV';
    },
  ],
  [
    'usuário inativo',
    (u) => {
      u.status = 'INATIVO';
    },
  ],
  [
    'colaborador afastado',
    (u) => {
      u.colaborador.status = 'AFASTADO';
    },
  ],
  [
    'vínculo ausente',
    (u) => {
      u.colaborador = null;
    },
  ],
  [
    'vínculo de outro usuário',
    (u) => {
      u.colaborador.usuario_id = 99;
    },
  ],
]) {
  test(`rejeita ${nome}`, async () => {
    const dados = usuario();
    modificar(dados);
    globalThis.fetch = async () => json(dados);
    await assert.rejects(sessionService.restaurar('teste'), { status: 403 });
  });
}

for (const status of ['INATIVO', 'EM_ANALISE']) {
  test(`rejeita conveniado ${status}`, async () => {
    const dados = usuario('CONVENIADO');
    dados.conveniado.status = status;
    globalThis.fetch = async () => json(dados);
    await assert.rejects(sessionService.restaurar('teste'), { status: 403 });
  });
}

test('não aceita login sem token ou resposta de usuário inválida', async () => {
  globalThis.fetch = async () => json({ usuario: usuario() });
  await assert.rejects(sessionService.entrar('teste@example.com', 'senha'), { status: 502 });
  globalThis.fetch = async () => json(null);
  await assert.rejects(sessionService.restaurar('teste'), { status: 502 });
});
