const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const {
  montar,
  act,
  React,
  fonte,
  asyncStorage,
  preferenciasGuardadas,
  credenciais,
  adiar,
  json,
  usuario,
} = require('./helpers/react.cjs');
const { usePreferences } = fonte('context/PreferencesContext.tsx');
const { requisitar } = fonte('services/api.ts');
const originais = { ...asyncStorage };
const fetchOriginal = globalThis.fetch;
const chave = '@fcv:v1:conta:COLABORADOR:3:preferencias';
let app;
let preferencias;

function Conteudo() {
  const contexto = usePreferences();
  React.useEffect(() => {
    preferencias = contexto;
  }, [contexto]);
  return React.createElement('span', null, contexto.preferencias.filtroCarteira);
}
function api(escopo = 'COLABORADOR', id = 3) {
  globalThis.fetch = async (url) =>
    url.endsWith('/auth/eu')
      ? json(usuario(escopo, id))
      : json({ token: `teste-${id}`, usuario: usuario(escopo, id) });
}
async function entrar() {
  await act(async () => app.auth.login('teste@example.com', 'senha'));
}

beforeEach(() => {
  credenciais.clear();
  preferenciasGuardadas.clear();
  Object.assign(asyncStorage, originais);
  preferencias = null;
  api();
});
afterEach(async () => {
  if (app) await app.desmontar();
  app = null;
  globalThis.fetch = fetchOriginal;
});

test('não cria dados de preferências sem uma sessão validada', async () => {
  app = await montar({ Conteudo });
  await act(async () => preferencias.definirFiltroCarteira('DISPONIVEIS'));
  assert.equal(preferenciasGuardadas.size, 0);
  assert.equal(preferencias.preferencias.filtroCarteira, 'TODOS');
});

test('filtros persistem ao fechar e reabrir o app com a sessão ainda válida', async () => {
  app = await montar({ Conteudo });
  await entrar();
  await act(async () => {
    preferencias.definirFiltroCarteira('DISPONIVEIS');
    preferencias.definirPeriodoHistorico('SEMESTRE');
  });
  assert.deepEqual(JSON.parse(preferenciasGuardadas.get(chave)), {
    filtroCarteira: 'DISPONIVEIS',
    periodoHistorico: 'SEMESTRE',
  });
  await app.desmontar();
  app = null;
  app = await montar({ Conteudo });
  assert.equal(app.auth.escopo, 'COLABORADOR');
  assert.equal(preferencias.preferencias.filtroCarteira, 'DISPONIVEIS');
  assert.equal(preferencias.preferencias.periodoHistorico, 'SEMESTRE');
});

test('edição durante leitura lenta é mesclada sem perder o outro filtro salvo', async () => {
  const espera = adiar();
  asyncStorage.getItem = async (item) =>
    item === chave ? espera.promessa : originais.getItem(item);
  app = await montar({ Conteudo });
  await entrar();
  assert.equal(preferencias.carregando, true);
  await act(async () => preferencias.definirFiltroCarteira('DISPONIVEIS'));
  await act(async () =>
    espera.resolver(
      JSON.stringify({ filtroCarteira: 'INDISPONIVEIS', periodoHistorico: 'SEMESTRE' }),
    ),
  );
  assert.deepEqual(preferencias.preferencias, {
    filtroCarteira: 'DISPONIVEIS',
    periodoHistorico: 'SEMESTRE',
  });
  assert.equal(preferencias.salvando, false);
});

test('falha de leitura mantém uso local e repetir mescla a escolha feita pelo usuário', async () => {
  asyncStorage.getItem = async (item) => {
    if (item === chave) throw new Error('leitura bloqueada');
    return originais.getItem(item);
  };
  app = await montar({ Conteudo });
  await entrar();
  assert.match(preferencias.erro, /recuperar/);
  await act(async () => preferencias.definirPeriodoHistorico('MES'));
  assert.equal(preferencias.preferencias.periodoHistorico, 'MES');
  Object.assign(asyncStorage, originais);
  await act(async () => preferencias.tentarDeNovo());
  assert.equal(preferencias.erro, null);
  assert.equal(JSON.parse(preferenciasGuardadas.get(chave)).periodoHistorico, 'MES');
});

test('falha de gravação informa que a escolha só está em memória e permite repetir', async () => {
  app = await montar({ Conteudo });
  await entrar();
  asyncStorage.setItem = async (item, valor) => {
    if (item === chave) throw new Error('gravação bloqueada');
    return originais.setItem(item, valor);
  };
  await act(async () => preferencias.definirFiltroCarteira('UTILIZADOS'));
  assert.equal(preferencias.preferencias.filtroCarteira, 'UTILIZADOS');
  assert.match(preferencias.erro, /não pôde ser salvo/);
  Object.assign(asyncStorage, originais);
  await act(async () => preferencias.tentarDeNovo());
  assert.equal(preferencias.erro, null);
  assert.equal(JSON.parse(preferenciasGuardadas.get(chave)).filtroCarteira, 'UTILIZADOS');
});

test('logout limpa só os dados pertinentes e reentrada usa os padrões', async () => {
  preferenciasGuardadas.set('@outro-modulo', 'preservar');
  app = await montar({ Conteudo });
  await entrar();
  await act(async () => preferencias.definirFiltroCarteira('DISPONIVEIS'));
  const escolherAntigo = preferencias.definirFiltroCarteira;
  await act(async () => app.auth.logout());
  await act(async () => escolherAntigo('EXPIRADOS'));
  assert.deepEqual([...preferenciasGuardadas.entries()], [['@outro-modulo', 'preservar']]);
  await entrar();
  assert.equal(preferencias.preferencias.filtroCarteira, 'TODOS');
});

test('troca de conta com gravação antiga pendente não transfere filtros nem erros', async () => {
  app = await montar({ Conteudo });
  await entrar();
  const espera = adiar();
  asyncStorage.setItem = async (item, valor) => {
    if (item === chave) await espera.promessa;
    return originais.setItem(item, valor);
  };
  await act(async () => preferencias.definirFiltroCarteira('DISPONIVEIS'));
  let saida;
  let entrada;
  await act(async () => {
    saida = app.auth.logout();
  });
  api('COLABORADOR', 8);
  await act(async () => {
    entrada = app.auth.login('outra@example.com', 'senha');
  });
  await act(async () => {
    espera.resolver();
    await Promise.all([saida, entrada]);
  });
  assert.equal(app.auth.usuario.id, 8);
  assert.equal(preferencias.preferencias.filtroCarteira, 'TODOS');
  assert.equal(preferencias.erro, null);
  assert.equal(preferenciasGuardadas.has(chave), false);
});

test('401 protegido remove token e preferências da mesma sessão', async () => {
  app = await montar({ Conteudo });
  await entrar();
  await act(async () => preferencias.definirPeriodoHistorico('MES'));
  globalThis.fetch = async () => json({ erro: 'Sessão expirada' }, 401);
  await act(async () => assert.rejects(requisitar('/protegido'), { status: 401 }));
  assert.equal(app.auth.usuario, null);
  assert.equal(credenciais.size, 0);
  assert.equal(preferenciasGuardadas.size, 0);
});

test('falha na limpeza de preferências não impede remover token e pode ser repetida', async () => {
  app = await montar({ Conteudo });
  await entrar();
  await act(async () => preferencias.definirFiltroCarteira('DISPONIVEIS'));
  asyncStorage.removeItem = async (item) => {
    if (item === chave) throw new Error('remoção bloqueada');
    return originais.removeItem(item);
  };
  await act(async () => app.auth.logout());
  assert.equal(credenciais.size, 0);
  assert.equal(app.auth.avisoSessao.acao, 'LIMPAR_PREFERENCIAS');
  await act(async () =>
    assert.rejects(app.auth.login('teste@example.com', 'senha'), { status: 0 }),
  );
  Object.assign(asyncStorage, originais);
  await act(async () => app.auth.tratarAviso());
  assert.equal(app.auth.avisoSessao, null);
  assert.equal(preferenciasGuardadas.size, 0);
});

test('iniciar sem token remove sobras de preferências de uma saída interrompida', async () => {
  preferenciasGuardadas.set(
    '@fcv:v1:preferencias:conta-atual',
    JSON.stringify({ id: 3, escopo: 'COLABORADOR' }),
  );
  preferenciasGuardadas.set(
    chave,
    JSON.stringify({ filtroCarteira: 'DISPONIVEIS', periodoHistorico: 'MES' }),
  );
  app = await montar({ Conteudo });
  assert.equal(app.auth.usuario, null);
  assert.equal(preferenciasGuardadas.size, 0);
});

test('StrictMode não duplica a sessão nem perde a preferência salva', async () => {
  app = await montar({ Conteudo });
  await entrar();
  await act(async () => preferencias.definirFiltroCarteira('DISPONIVEIS'));
  await app.desmontar();
  app = null;
  app = await montar({ Conteudo, estrito: true });
  assert.equal(preferencias.preferencias.filtroCarteira, 'DISPONIVEIS');
  assert.equal(preferencias.erro, null);
});
