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
const { useAuth } = fonte('context/AuthContext.tsx');
const { CatalogProvider } = fonte('context/CatalogContext.tsx');
const { useWalletViewModel } = fonte('viewmodels/useWalletViewModel.ts');
const { useHistoryViewModel } = fonte('viewmodels/useHistoryViewModel.ts');
const originais = { ...asyncStorage };
const fetchOriginal = globalThis.fetch;
let app;
let carteira;
let historico;
let consultas;

function pagina(dados) {
  return json({
    dados,
    paginacao: { pagina: 1, limite: 10, total: dados.length, totalPaginas: dados.length ? 1 : 0 },
  });
}

function Filtros() {
  const atualCarteira = useWalletViewModel();
  const atualHistorico = useHistoryViewModel();
  React.useEffect(() => {
    carteira = atualCarteira;
    historico = atualHistorico;
  }, [atualCarteira, atualHistorico]);
  return React.createElement('span', null, `${atualCarteira.filtro}/${atualHistorico.periodo}`);
}
function Conteudo() {
  const { usuario: atual } = useAuth();
  return React.createElement(CatalogProvider, null, atual ? React.createElement(Filtros) : null);
}

beforeEach(() => {
  credenciais.clear();
  preferenciasGuardadas.clear();
  Object.assign(asyncStorage, originais);
  consultas = [];
  globalThis.fetch = async (url) => {
    if (url.endsWith('/auth/login')) return json({ token: 'teste', usuario: usuario() });
    if (url.endsWith('/auth/eu')) return json(usuario());
    consultas.push(url);
    if (url.includes('/eu/utilizacoes?')) return pagina([]);
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

test('Carteira e Histórico recuperam filtros reais sem refazer a consulta com período padrão', async () => {
  app = await montar({ Conteudo });
  await entrar();
  await act(async () => {
    carteira.setFiltro('DISPONIVEIS');
    historico.setPeriodo('MES');
  });
  await app.desmontar();
  app = null;
  consultas = [];
  app = await montar({ Conteudo });
  assert.equal(carteira.filtro, 'DISPONIVEIS');
  assert.equal(historico.periodo, 'MES');
  assert.equal(consultas.filter((url) => url.includes('/eu/utilizacoes?')).length, 1);
  const inicio = new Date();
  inicio.setMonth(inicio.getMonth() - 1);
  const esperado = fonte('utils/format.ts').dataParaApi(inicio);
  assert.equal(
    new URL(consultas.find((url) => url.includes('/eu/utilizacoes?'))).searchParams.get('de'),
    esperado,
  );
});

test('resposta antiga do Histórico não substitui a lista do período atual', async () => {
  const anterior = globalThis.fetch;
  const espera = adiar();
  let primeiraConsulta = true;
  globalThis.fetch = async (url, opcoes) => {
    if (!url.includes('/eu/utilizacoes?')) return anterior(url, opcoes);
    if (primeiraConsulta) {
      primeiraConsulta = false;
      return espera.promessa;
    }
    return pagina([{ id: 2 }]);
  };
  app = await montar({ Conteudo });
  await entrar();
  await act(async () => historico.setPeriodo('MES'));
  assert.equal(historico.lista[0].id, 2);
  await act(async () => espera.resolver(pagina([{ id: 1 }])));
  assert.equal(historico.periodo, 'MES');
  assert.equal(historico.lista[0].id, 2);
});
