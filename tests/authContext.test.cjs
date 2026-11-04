const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const {
  montar,
  act,
  fonte,
  secureStore,
  credenciais,
  adiar,
  json,
  usuario,
} = require('./helpers/react.cjs');
const { requisitar } = fonte('services/api.ts');
const originais = { ...secureStore };
const fetchOriginal = globalThis.fetch;
let app;

beforeEach(() => {
  credenciais.clear();
  Object.assign(secureStore, originais);
  globalThis.fetch = async () => {
    throw new Error('Transporte não configurado no teste');
  };
});
afterEach(async () => {
  if (app) await app.desmontar();
  app = null;
  globalThis.fetch = fetchOriginal;
});

function loginSimulado(escopo = 'COLABORADOR', token = 'teste', id = 3) {
  globalThis.fetch = async () => json({ token, usuario: usuario(escopo, id) });
}

test('inicia anônimo quando não há credencial', async () => {
  app = await montar();
  assert.equal(app.auth.restaurando, false);
  assert.equal(app.auth.usuario, null);
  assert.equal(app.elemento.textContent, 'ANONIMA');
});

for (const escopo of ['COLABORADOR', 'CONVENIADO']) {
  test(`${escopo}: entra, restaura ao remontar e sai removendo a credencial`, async () => {
    app = await montar();
    loginSimulado(escopo);
    await act(async () => app.auth.login('teste@example.com', 'senha'));
    assert.equal(app.auth.escopo, escopo);
    assert.equal(app.elemento.textContent, escopo);
    assert.equal(credenciais.get('fcv_token'), 'teste');
    await app.desmontar();
    app = null;
    globalThis.fetch = async () => json(usuario(escopo));
    app = await montar();
    assert.equal(app.auth.usuario.escopo, escopo);
    await act(async () => app.auth.logout());
    assert.equal(app.auth.usuario, null);
    assert.equal(credenciais.size, 0);
    assert.equal(app.elemento.textContent, 'ANONIMA');
  });
}

test('restauração não libera o usuário antes da validação na API', async () => {
  credenciais.set('fcv_token', 'salvo');
  const espera = adiar();
  globalThis.fetch = async () => espera.promessa;
  app = await montar();
  assert.equal(app.auth.restaurando, true);
  assert.equal(app.auth.usuario, null);
  await act(async () => espera.resolver(json(usuario())));
  assert.equal(app.auth.restaurando, false);
  assert.equal(app.auth.escopo, 'COLABORADOR');
});

for (const status of [401, 403, 404]) {
  test(`restauração ${status} remove a credencial inválida sem liberar dados`, async () => {
    credenciais.set('fcv_token', 'salvo');
    globalThis.fetch = async () => json({ erro: 'Acesso indisponível' }, status);
    app = await montar();
    assert.equal(app.auth.usuario, null);
    assert.equal(credenciais.size, 0);
    assert.ok(app.auth.avisoSessao.mensagem);
  });
}

for (const falha of ['rede', 'servidor']) {
  test(`falha de ${falha} na restauração preserva token e permite tentar de novo`, async () => {
    credenciais.set('fcv_token', 'salvo');
    globalThis.fetch = async () => {
      if (falha === 'rede') throw new TypeError('offline');
      return json({ erro: 'Servidor indisponível' }, 500);
    };
    app = await montar();
    assert.equal(app.auth.usuario, null);
    assert.equal(credenciais.get('fcv_token'), 'salvo');
    assert.equal(app.auth.avisoSessao.acao, 'RESTAURAR');
    globalThis.fetch = async () => json(usuario());
    await act(async () => app.auth.tratarAviso());
    assert.equal(app.auth.escopo, 'COLABORADOR');
  });
}

test('falha de leitura é exibida e pode ser recuperada', async () => {
  secureStore.getItemAsync = async () => {
    throw new Error('leitura bloqueada');
  };
  app = await montar();
  assert.equal(app.auth.avisoSessao.acao, 'RESTAURAR');
  assert.equal(app.auth.restaurando, false);
  Object.assign(secureStore, originais);
  await act(async () => app.auth.tratarAviso());
  assert.equal(app.auth.avisoSessao, null);
});

test('falha de gravação não libera sessão nem deixa token salvo', async () => {
  app = await montar();
  loginSimulado();
  secureStore.setItemAsync = async () => {
    throw new Error('gravação bloqueada');
  };
  await act(async () => {
    await assert.rejects(app.auth.login('teste@example.com', 'senha'), { status: 0 });
  });
  assert.equal(app.auth.usuario, null);
  assert.equal(app.auth.autenticando, false);
  assert.equal(credenciais.size, 0);
});

test('falha ao remover encerra acesso em memória, impede novo login e permite repetir limpeza', async () => {
  app = await montar();
  loginSimulado();
  await act(async () => app.auth.login('teste@example.com', 'senha'));
  secureStore.deleteItemAsync = async () => {
    throw new Error('remoção bloqueada');
  };
  await act(async () => app.auth.logout());
  assert.equal(app.auth.usuario, null);
  assert.equal(app.auth.avisoSessao.acao, 'LIMPAR_CREDENCIAL');
  await act(async () =>
    assert.rejects(app.auth.login('outra@example.com', 'senha'), { status: 0 }),
  );
  Object.assign(secureStore, originais);
  await act(async () => app.auth.tratarAviso());
  assert.equal(app.auth.avisoSessao, null);
  assert.equal(credenciais.size, 0);
});

test('tentativa de outra conta com senha errada não mantém a credencial anterior', async () => {
  credenciais.set('fcv_token', 'antiga');
  app = await montar(); // rede indisponível: sessão ainda não foi liberada
  globalThis.fetch = async () => json({ erro: 'Credenciais incorretas' }, 401);
  await act(async () =>
    assert.rejects(app.auth.login('outra@example.com', 'errada'), { status: 401 }),
  );
  assert.equal(credenciais.size, 0);
  assert.equal(app.auth.usuario, null);
});

test('login tardio não reabre uma sessão encerrada', async () => {
  app = await montar();
  const espera = adiar();
  globalThis.fetch = async () => espera.promessa;
  let entrada;
  await act(async () => {
    entrada = app.auth.login('teste@example.com', 'senha');
  });
  assert.equal(app.auth.autenticando, true);
  await act(async () => app.auth.logout());
  await act(async () => {
    espera.resolver(json({ token: 'antigo', usuario: usuario() }));
    await entrada;
  });
  assert.equal(app.auth.usuario, null);
  assert.equal(credenciais.size, 0);
});

test('logout durante gravação remove o token quando a gravação termina', async () => {
  app = await montar();
  loginSimulado();
  const espera = adiar();
  secureStore.setItemAsync = async (chave, valor) => {
    await espera.promessa;
    credenciais.set(chave, valor);
  };
  let entrada;
  let saida;
  await act(async () => {
    entrada = app.auth.login('teste@example.com', 'senha');
  });
  await act(async () => {
    saida = app.auth.logout();
  });
  assert.equal(app.auth.usuario, null);
  await act(async () => {
    espera.resolver();
    await Promise.all([entrada, saida]);
  });
  assert.equal(credenciais.size, 0);
  assert.equal(app.auth.usuario, null);
});

test('restauração antiga não substitui o login de outra conta', async () => {
  credenciais.set('fcv_token', 'antigo');
  const espera = adiar();
  globalThis.fetch = async (url) =>
    url.endsWith('/auth/eu')
      ? espera.promessa
      : json({ token: 'novo', usuario: usuario('CONVENIADO', 8) });
  app = await montar();
  await act(async () => app.auth.login('outra@example.com', 'senha'));
  await act(async () => espera.resolver(json(usuario())));
  assert.equal(app.auth.usuario.id, 8);
  assert.equal(app.auth.escopo, 'CONVENIADO');
  assert.equal(credenciais.get('fcv_token'), 'novo');
});

test('clique duplo no login inicia uma única autenticação', async () => {
  app = await montar();
  const espera = adiar();
  let chamadas = 0;
  globalThis.fetch = async () => {
    chamadas += 1;
    return espera.promessa;
  };
  let entrada;
  await act(async () => {
    entrada = app.auth.login('teste@example.com', 'senha');
    await app.auth.login('teste@example.com', 'senha');
  });
  assert.equal(chamadas, 1);
  await act(async () => {
    espera.resolver(json({ token: 'teste', usuario: usuario() }));
    await entrada;
  });
});

test('401 protegido faz logout e 403 não expira sessão', async () => {
  app = await montar();
  loginSimulado();
  await act(async () => app.auth.login('teste@example.com', 'senha'));
  globalThis.fetch = async () => json({ erro: 'Negado' }, 403);
  await assert.rejects(requisitar('/restrito'), { status: 403 });
  assert.equal(app.auth.escopo, 'COLABORADOR');
  globalThis.fetch = async () => json({ erro: 'Expirado' }, 401);
  await act(async () => assert.rejects(requisitar('/protegido'), { status: 401 }));
  assert.equal(app.auth.usuario, null);
  assert.equal(credenciais.size, 0);
  assert.match(app.auth.avisoSessao.mensagem, /expirou/);
});

test('FCV continua no portal e não tem token salvo pelo aplicativo', async () => {
  app = await montar();
  loginSimulado('FCV');
  await act(async () =>
    assert.rejects(app.auth.login('teste@example.com', 'senha'), { status: 403 }),
  );
  assert.equal(app.auth.usuario, null);
  assert.equal(credenciais.size, 0);
});

test('restauração continua correta com o ciclo duplo do StrictMode', async () => {
  credenciais.set('fcv_token', 'salvo');
  globalThis.fetch = async () => json(usuario());
  app = await montar({ estrito: true });
  assert.equal(app.auth.escopo, 'COLABORADOR');
  assert.equal(app.auth.restaurando, false);
  assert.equal(credenciais.get('fcv_token'), 'salvo');
});
