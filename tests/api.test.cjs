const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { fonte, adiar, json } = require('./helpers/runtime.cjs');
const { requisitar, definirToken, definirAoExpirarSessao, ApiError } = fonte('services/api.ts');
const { authService } = fonte('services/authService.ts');
const { qrCodeService } = fonte('services/qrCodeService.ts');
const { utilizationService } = fonte('services/utilizationService.ts');
const fetchOriginal = globalThis.fetch;

beforeEach(() => {
  definirToken(null);
  definirAoExpirarSessao(null);
});
afterEach(() => {
  globalThis.fetch = fetchOriginal;
  definirAoExpirarSessao(null);
});

test('envia o Bearer centralizado nas consultas autenticadas', async () => {
  definirToken('sessao-A');
  globalThis.fetch = async (url, opcoes) => {
    assert.equal(url, 'http://api.test/api/v1/beneficios');
    assert.equal(opcoes.headers.Authorization, 'Bearer sessao-A');
    return json([1]);
  };
  assert.deepEqual(await requisitar('/beneficios'), [1]);
});

test('solicitar uso cria o resgate pela API e recebe o QR Code', async () => {
  definirToken('sessao-A');
  const emissao = {
    id: 25,
    token_qrcode: 'qr-token',
    codigo_validacao: 'FCV25A',
    status: 'PENDENTE',
    data_solicitacao: '2026-11-23 13:00:00',
    data_expiracao: '2026-11-23 13:05:00',
  };
  globalThis.fetch = async (url, opcoes) => {
    assert.equal(url, 'http://api.test/api/v1/resgates');
    assert.equal(opcoes.method, 'POST');
    assert.equal(opcoes.headers.Authorization, 'Bearer sessao-A');
    assert.deepEqual(JSON.parse(opcoes.body), { beneficio_id: 12 });
    return json(emissao);
  };

  assert.deepEqual(await qrCodeService.emitir(12), emissao);
});

test('recupera o QR Code pelo endpoint do resgate e lista pendências pela rota do colaborador', async () => {
  const chamadas = [];
  globalThis.fetch = async (url, opcoes) => {
    chamadas.push([url, opcoes.method]);
    return json([]);
  };

  await qrCodeService.consultar(25);
  await utilizationService.listarAguardando();

  assert.deepEqual(chamadas, [
    ['http://api.test/api/v1/resgates/25', 'GET'],
    ['http://api.test/api/v1/eu/aguardando', 'GET'],
  ]);
});

test('login e recuperação não enviam um token de outra conta', async () => {
  definirToken('sessao-antiga');
  let chamadas = 0;
  globalThis.fetch = async (_url, opcoes) => {
    assert.equal(opcoes.headers.Authorization, undefined);
    chamadas += 1;
    return json({ mensagem: 'ok' });
  };
  await authService.login('teste@example.com', 'senha');
  await authService.solicitarCodigo('teste@example.com');
  await authService.redefinirSenha('teste@example.com', 'codigo', 'nova');
  assert.equal(chamadas, 3);
});

test('401 de credenciais incorretas não expira outra sessão', async () => {
  definirToken('sessao-A');
  let expiracoes = 0;
  definirAoExpirarSessao(() => {
    expiracoes += 1;
  });
  globalThis.fetch = async () => json({ erro: 'Credenciais incorretas' }, 401);
  await assert.rejects(authService.login('teste@example.com', 'incorreta'), { status: 401 });
  assert.equal(expiracoes, 0);
});

test('401 simultâneos encerram a sessão uma única vez', async () => {
  definirToken('sessao-A');
  const espera = adiar();
  let expiracoes = 0;
  definirAoExpirarSessao(() => {
    expiracoes += 1;
  });
  globalThis.fetch = async () => {
    await espera.promessa;
    return json({ erro: 'Expirado' }, 401);
  };
  const consultas = [requisitar('/a'), requisitar('/b')];
  espera.resolver();
  const resultados = await Promise.allSettled(consultas);
  assert.deepEqual(resultados.map((r) => r.reason.status).sort(), [-1, 401]);
  assert.equal(expiracoes, 1);
});

test('403 preserva a sessão e a mensagem do servidor', async () => {
  definirToken('sessao-A');
  let expiracoes = 0;
  definirAoExpirarSessao(() => {
    expiracoes += 1;
  });
  globalThis.fetch = async () => json({ erro: 'Acesso negado' }, 403);
  await assert.rejects(requisitar('/restrito'), { status: 403, message: 'Acesso negado' });
  assert.equal(expiracoes, 0);
});

for (const status of [200, 401]) {
  test(`resposta ${status} da conta anterior não afeta a conta nova`, async () => {
    definirToken('sessao-A');
    const espera = adiar();
    let expiracoes = 0;
    definirAoExpirarSessao(() => {
      expiracoes += 1;
    });
    globalThis.fetch = async () => {
      await espera.promessa;
      return json({ origem: 'A' }, status);
    };
    const consulta = requisitar('/privado');
    definirToken('sessao-B');
    espera.resolver();
    await assert.rejects(consulta, { status: -1 });
    assert.equal(expiracoes, 0);
  });
}

test('401 na validação explícita é devolvido ao fluxo de restauração', async () => {
  let expiracoes = 0;
  definirAoExpirarSessao(() => {
    expiracoes += 1;
  });
  globalThis.fetch = async () => json({ erro: 'Expirado' }, 401);
  await assert.rejects(authService.buscarUsuarioLogado('salvo'), { status: 401 });
  assert.equal(expiracoes, 0);
});

test('falha de rede é distinguida de autorização', async () => {
  globalThis.fetch = async () => {
    throw new TypeError('offline');
  };
  await assert.rejects(
    requisitar('/beneficios'),
    (erro) => erro instanceof ApiError && erro.status === 0,
  );
});

test('sucesso com JSON inválido não é apresentado como dado válido', async () => {
  globalThis.fetch = async () => new Response('<html>erro</html>');
  await assert.rejects(requisitar('/beneficios'), { status: 502 });
});

test('erro HTTP sem JSON usa mensagem segura e preserva o status', async () => {
  globalThis.fetch = async () => new Response('indisponível', { status: 503 });
  await assert.rejects(requisitar('/beneficios'), { status: 503 });
});

test('timeout abrange a leitura do corpo da resposta', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  globalThis.fetch = async (_url, opcoes) => ({
    ok: true,
    status: 200,
    json: () =>
      new Promise((_resolve, reject) =>
        opcoes.signal.addEventListener('abort', () => reject(new Error('timeout'))),
      ),
  });
  const consulta = requisitar('/lento');
  await Promise.resolve();
  t.mock.timers.tick(10000);
  await assert.rejects(consulta, { status: 0 });
});
