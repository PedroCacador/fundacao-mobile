const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const {
  montar,
  act,
  React,
  fonte,
  secureStore,
  credenciais,
  adiar,
  json,
  usuario,
} = require('./helpers/react.cjs');
const { CatalogProvider, useCatalog } = fonte('context/CatalogContext.tsx');
const { montarCatalogo } = fonte('utils/catalog.ts');
const originais = { ...secureStore };
const fetchOriginal = globalThis.fetch;
let app;
let catalogo;
let chamadas;

function beneficio(nome = 'Benefício de teste', id = 1) {
  return {
    id,
    nome,
    descricao: null,
    status: 'ATIVO',
    tipo_beneficio: 'PERCENTUAL',
    valor: 10,
    quantidade_maxima_utilizacoes: 1,
    tipo_janela: 'JANELA_MOVEL',
    unidade_ciclo: null,
    dia_reset: null,
    intervalo_valor: 30,
    intervalo_unidade: 'DIA',
    referencia_contagem: 'ULTIMA_UTILIZACAO',
  };
}
function dados(nome) {
  return {
    '/beneficios': [beneficio(nome)],
    '/ofertas': [{ id: 1, beneficio_id: 1, conveniado_id: 2, status: 'ATIVO' }],
    '/conveniados': [usuario('CONVENIADO').conveniado],
  };
}
function ObservarCatalogo() {
  const contexto = useCatalog();
  React.useEffect(() => {
    catalogo = contexto;
  }, [contexto]);
  return React.createElement(
    'span',
    { 'data-catalogo': true },
    contexto.itens.map((item) => item.beneficio.nome).join(','),
  );
}
function Conteudo() {
  return React.createElement(CatalogProvider, null, React.createElement(ObservarCatalogo));
}
function api({ nome = 'Catálogo A', escopo = 'COLABORADOR', id = 3, consultar } = {}) {
  globalThis.fetch = async (url) => {
    const caminho = new URL(url).pathname.replace('/api/v1', '');
    if (caminho === '/auth/login')
      return json({ token: `teste-${id}`, usuario: usuario(escopo, id) });
    chamadas.push(caminho);
    return consultar ? consultar(caminho) : json(dados(nome)[caminho]);
  };
}
async function entrar() {
  await act(async () => app.auth.login('teste@example.com', 'senha'));
}

beforeEach(() => {
  credenciais.clear();
  Object.assign(secureStore, originais);
  chamadas = [];
  catalogo = null;
  api();
});
afterEach(async () => {
  if (app) await app.desmontar();
  app = null;
  globalThis.fetch = fetchOriginal;
});

test('não consulta nem libera catálogo sem sessão validada', async () => {
  app = await montar({ Conteudo });
  assert.equal(chamadas.length, 0);
  assert.deepEqual(catalogo.itens, []);
  assert.equal(catalogo.carregando, false);
});

test('colaborador recebe um catálogo compartilhado a partir das três listagens', async () => {
  app = await montar({ Conteudo });
  await entrar();
  assert.equal(chamadas.length, 3);
  assert.equal(catalogo.carregando, false);
  assert.equal(catalogo.itens[0].beneficio.nome, 'Catálogo A');
  assert.equal(catalogo.itens[0].conveniados[0].id, 2);
  assert.equal(catalogo.itens[0].disponivel, true);
});

test('conveniado não dispara consultas do catálogo exclusivo do colaborador', async () => {
  api({ escopo: 'CONVENIADO' });
  app = await montar({ Conteudo });
  await entrar();
  assert.equal(chamadas.length, 0);
  assert.deepEqual(catalogo.itens, []);
});

test('recargas simultâneas compartilham a mesma consulta e exibem estado de atualização', async () => {
  app = await montar({ Conteudo });
  await entrar();
  const espera = adiar();
  api({
    consultar: async (caminho) => {
      await espera.promessa;
      return json(dados('Atualizado')[caminho]);
    },
  });
  let primeira;
  let segunda;
  await act(async () => {
    primeira = catalogo.recarregar();
    segunda = catalogo.recarregar();
  });
  assert.equal(catalogo.atualizando, true);
  assert.equal(catalogo.itens[0].beneficio.nome, 'Catálogo A');
  assert.equal(chamadas.length, 6);
  await act(async () => {
    espera.resolver();
    await Promise.all([primeira, segunda]);
  });
  assert.equal(catalogo.atualizando, false);
  assert.equal(catalogo.itens[0].beneficio.nome, 'Atualizado');
});

test('falha de carregamento tem mensagem e pode ser recuperada', async () => {
  api({ consultar: async () => json({ erro: 'Catálogo indisponível' }, 503) });
  app = await montar({ Conteudo });
  await entrar();
  assert.equal(catalogo.erro, 'Catálogo indisponível');
  assert.equal(catalogo.carregando, false);
  api({ nome: 'Recuperado' });
  await act(async () => catalogo.recarregar());
  assert.equal(catalogo.erro, null);
  assert.equal(catalogo.itens[0].beneficio.nome, 'Recuperado');
});

test('logout limpa o catálogo e a mesma conta recebe dados novos ao reentrar', async () => {
  app = await montar({ Conteudo });
  await entrar();
  const sessaoAnterior = app.auth.idSessao;
  await act(async () => app.auth.logout());
  assert.deepEqual(catalogo.itens, []);
  assert.equal(app.elemento.querySelector('[data-catalogo]').textContent, '');
  api({ nome: 'Nova sessão' });
  await entrar();
  assert.notEqual(app.auth.idSessao, sessaoAnterior);
  assert.equal(catalogo.itens[0].beneficio.nome, 'Nova sessão');
});

test('recarga tardia da conta A não altera o catálogo nem o carregamento da conta B', async () => {
  app = await montar({ Conteudo });
  await entrar();
  const espera = adiar();
  api({
    consultar: async (caminho) => {
      await espera.promessa;
      return json(dados('Dado privado A')[caminho]);
    },
  });
  let recargaAntiga;
  const recarregarAntigo = catalogo.recarregar;
  await act(async () => {
    recargaAntiga = catalogo.recarregar();
  });
  await act(async () => app.auth.logout());
  api({ nome: 'Catálogo B', id: 8 });
  await entrar();
  const totalAntes = chamadas.length;
  await act(async () => {
    espera.resolver();
    await recargaAntiga;
    await recarregarAntigo();
  });
  assert.equal(chamadas.length, totalAntes);
  assert.equal(catalogo.itens[0].beneficio.nome, 'Catálogo B');
  assert.equal(catalogo.atualizando, false);
  assert.equal(catalogo.erro, null);
  assert.ok(!app.elemento.textContent.includes('Dado privado A'));
});

test('falha de atualização preserva os dados da sessão atual e informa o erro', async () => {
  app = await montar({ Conteudo });
  await entrar();
  api({ consultar: async () => json({ erro: 'Servidor indisponível' }, 500) });
  await act(async () => catalogo.recarregar());
  assert.equal(catalogo.erro, 'Servidor indisponível');
  assert.equal(catalogo.itens[0].beneficio.nome, 'Catálogo A');
  assert.equal(catalogo.atualizando, false);
});

test('montagem agrupa ofertas uma vez, elimina locais duplicados e preserva estados do contrato', () => {
  const ativo = usuario('CONVENIADO').conveniado;
  const inativo = { ...ativo, id: 9, status: 'INATIVO' };
  const resultado = montarCatalogo(
    [
      beneficio('Ativo', 1),
      { ...beneficio('Inativo', 2), status: 'INATIVO' },
      { ...beneficio('Descontinuado', 3), status: 'DESCONTINUADO' },
      beneficio('Sem oferta', 4),
    ],
    [
      { beneficio_id: 1, conveniado_id: 2, status: 'ATIVO' },
      { beneficio_id: 1, conveniado_id: 2, status: 'ATIVO' },
      { beneficio_id: 1, conveniado_id: 9, status: 'ATIVO' },
      { beneficio_id: 4, conveniado_id: 2, status: 'INATIVO' },
    ],
    [ativo, inativo],
  );
  assert.equal(resultado.length, 3);
  assert.equal(resultado[0].conveniados.length, 1);
  assert.equal(resultado[0].disponivel, true);
  assert.equal(resultado[1].disponivel, false);
  assert.equal(resultado[2].disponivel, false);
  assert.equal(resultado[2].categoria, 'Outros');
});
