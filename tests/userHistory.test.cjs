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
  json,
  usuario,
} = require('./helpers/react.cjs');
const { useAuth } = fonte('context/AuthContext.tsx');
const { CatalogProvider } = fonte('context/CatalogContext.tsx');
const { useHistoryViewModel } = fonte('viewmodels/useHistoryViewModel.ts');
const { dataParaApi } = fonte('utils/format.ts');
const {
  buscarUtilizacoes,
  consultarHistorico,
  filtrarUltimosMeses,
  inicioDoPeriodo,
  statusUtilizacao,
} = fonte('utils/utilization.ts');

const originais = { ...asyncStorage };
const fetchOriginal = globalThis.fetch;
let app;
let historico;
let consultas;
let paginas;

function diasAtras(dias) {
  return dataParaApi(new Date(Date.now() - dias * 86400000));
}

function utilizacao(id, extra = {}) {
  return {
    id,
    status: 'APROVADA',
    valor_aplicado: 10,
    canal_validacao: null,
    data_solicitacao: `${diasAtras(10)}T10:00:00`,
    data_confirmacao: null,
    observacoes: null,
    origem: 'BENEFICIO',
    beneficio_id: id,
    item_campanha_id: null,
    beneficio_nome: `Benefício ${id}`,
    conveniado_id: 1,
    conveniado_nome_fantasia: 'Loja',
    conveniado_categoria: 'Farmácia',
    conveniado_endereco: 'Rua A',
    colaborador_nome: 'Carla',
    ...extra,
  };
}

function resposta(dados, pagina, totalPaginas) {
  return json({
    dados,
    paginacao: { pagina, limite: 50, total: dados.length, totalPaginas },
  });
}

function Historico() {
  const atual = useHistoryViewModel();
  React.useEffect(() => {
    historico = atual;
  }, [atual]);
  return React.createElement('span', null, String(atual.lista.length));
}
function Conteudo() {
  const { usuario: logado } = useAuth();
  return React.createElement(CatalogProvider, null, logado ? React.createElement(Historico) : null);
}

beforeEach(() => {
  credenciais.clear();
  preferenciasGuardadas.clear();
  Object.assign(asyncStorage, originais);
  consultas = [];
  paginas = [[]];
  globalThis.fetch = async (url) => {
    if (url.endsWith('/auth/login')) return json({ token: 'teste', usuario: usuario() });
    if (url.endsWith('/auth/eu')) return json(usuario());
    if (url.includes('/eu/utilizacoes?pagina=')) {
      consultas.push(url);
      const numero = Number(new URL(url).searchParams.get('pagina'));
      return resposta(paginas[numero - 1] ?? [], numero, paginas.length);
    }
    return json([]);
  };
});
afterEach(async () => {
  if (app) await app.desmontar();
  app = null;
  globalThis.fetch = fetchOriginal;
});
async function entrar() {
  await act(async () => app.auth.login('teste@example.com', 'senha'));
}

test('inicioDoPeriodo usa 6 meses de calendário e respeita meses mais curtos', () => {
  assert.equal(dataParaApi(inicioDoPeriodo(new Date(2026, 10, 21))), '2026-05-21');
  assert.equal(dataParaApi(inicioDoPeriodo(new Date(2026, 7, 31))), '2026-02-28');
  assert.equal(dataParaApi(inicioDoPeriodo(new Date(2024, 7, 31))), '2024-02-29');
  assert.equal(dataParaApi(inicioDoPeriodo(new Date(2026, 0, 15))), '2025-07-15');
});

test('filtrarUltimosMeses usa data_solicitacao e inclui o dia de corte', () => {
  const agora = new Date(2026, 10, 21, 15, 0);
  const lista = [
    utilizacao(1, { data_solicitacao: '2026-05-21T00:00:00' }),
    utilizacao(2, { data_solicitacao: '2026-05-20T23:59:59' }),
    utilizacao(3, { data_solicitacao: '2026-11-20T09:00:00' }),
    utilizacao(4, { data_solicitacao: '2025-01-10T09:00:00' }),
  ];
  assert.deepEqual(
    filtrarUltimosMeses(lista, agora).map((item) => item.id),
    [1, 3],
  );
});

test('buscarUtilizacoes procura no nome e na descrição, sem acento nem maiúsculas', () => {
  const lista = [
    utilizacao(1, { beneficio_nome: 'Vale Remédio' }),
    utilizacao(2, { beneficio_nome: 'Almoço' }),
    utilizacao(3, { beneficio_nome: 'Brinde de Natal', beneficio_id: null, origem: 'CAMPANHA' }),
  ];
  const descricoes = new Map([
    [1, 'Desconto em farmácias'],
    [2, 'Refeição em restaurantes'],
  ]);
  const ids = (termo) => buscarUtilizacoes(lista, termo, descricoes).map((item) => item.id);

  assert.deepEqual(ids('remedio'), [1]);
  assert.deepEqual(ids('REFEICAO'), [2]);
  assert.deepEqual(ids('farmacias'), [1]);
  assert.deepEqual(ids('natal'), [3]);
  assert.deepEqual(ids('desconto em'), [1]);
  assert.deepEqual(ids('   '), [1, 2, 3]);
  assert.deepEqual(ids('inexistente'), []);
});

test('consultarHistorico mantém todos os status, ordena do mais recente e aplica a busca', () => {
  const agora = new Date(2026, 10, 21);
  const lista = statusUtilizacao.map((status, indice) =>
    utilizacao(indice + 1, {
      status,
      data_solicitacao: `2026-${String(indice + 6).padStart(2, '0')}-15T10:00:00`,
    }),
  );
  lista.push(utilizacao(99, { data_solicitacao: '2025-01-01T10:00:00' }));

  const todos = consultarHistorico({ utilizacoes: lista, agora, termo: '', descricoes: new Map() });
  assert.deepEqual(
    todos.map((item) => item.status),
    [...statusUtilizacao].reverse(),
  );

  const busca = consultarHistorico({
    utilizacoes: lista,
    agora,
    termo: 'benefício 2',
    descricoes: new Map(),
  });
  assert.deepEqual(
    busca.map((item) => item.id),
    [2],
  );
});

test('o Histórico pede só os últimos 6 meses e percorre todas as páginas', async () => {
  paginas = [[utilizacao(1), utilizacao(2)], [utilizacao(3, { status: 'EXPIRADA' })]];
  app = await montar({ Conteudo });
  await entrar();

  assert.equal(historico.carregando, false);
  assert.equal(historico.erro, null);
  assert.deepEqual(
    consultas.map((url) => new URL(url).searchParams.get('pagina')),
    ['1', '2'],
  );
  const esperado = dataParaApi(inicioDoPeriodo(new Date()));
  for (const url of consultas) {
    assert.equal(new URL(url).searchParams.get('de'), esperado);
    assert.equal(new URL(url).searchParams.get('status'), null);
  }
  assert.equal(historico.lista.length, 3);
  assert.match(historico.resumoTotal, /3 resgates nos últimos 6 meses/);
});

test('o Histórico descarta resgates fora dos 6 meses e filtra pela busca', async () => {
  paginas = [
    [
      utilizacao(1, { beneficio_nome: 'Vale Remédio' }),
      utilizacao(2, { beneficio_nome: 'Almoço' }),
      utilizacao(3, { data_solicitacao: '2020-01-01T10:00:00' }),
    ],
  ];
  app = await montar({ Conteudo });
  await entrar();
  assert.deepEqual(
    historico.lista.map((item) => item.id),
    [1, 2],
  );

  await act(async () => historico.setBusca('almoco'));
  assert.deepEqual(
    historico.lista.map((item) => item.id),
    [2],
  );
  assert.equal(historico.buscaAtiva, true);

  await act(async () => historico.setBusca('nada'));
  assert.equal(historico.lista.length, 0);
});

test('o Histórico avisa quando a versão da API não devolve paginação', async () => {
  const anterior = globalThis.fetch;
  globalThis.fetch = async (url, opcoes) => {
    if (url.includes('/eu/utilizacoes?pagina=')) return json([{ id: 1 }]);
    return anterior(url, opcoes);
  };
  app = await montar({ Conteudo });
  await entrar();

  assert.equal(historico.carregando, false);
  assert.match(historico.erro, /histórico paginado/i);
});
