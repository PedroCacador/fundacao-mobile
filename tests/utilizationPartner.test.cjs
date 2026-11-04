const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { fonte, json } = require('./helpers/runtime.cjs');
const { utilizationService } = fonte('services/utilizationService.ts');

const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

test('listarPendentes chama /eu/utilizacoes com status=PENDENTE', async () => {
  const dados = [
    {
      id: 10,
      status: 'PENDENTE',
      valor_aplicado: 25.5,
      colaborador_nome: 'João Silva',
      beneficio_nome: 'Vale Farmácia',
    },
  ];

  globalThis.fetch = async (url) => {
    assert.ok(url.includes('/eu/utilizacoes?status=PENDENTE'));
    return json(dados);
  };

  const resultado = await utilizationService.listarPendentes();
  assert.deepEqual(resultado, dados);
});

test('listarHistoricoConveniado monta os filtros de data corretamente', async () => {
  const dados = [
    {
      id: 5,
      status: 'APROVADA',
      valor_aplicado: 50,
      colaborador_nome: 'Maria Santos',
      beneficio_nome: 'Desconto Academia',
    },
  ];

  globalThis.fetch = async (url) => {
    assert.ok(url.includes('/eu/utilizacoes?de=2026-11-01&ate=2026-11-04'));
    return json(dados);
  };

  const resultado = await utilizationService.listarHistoricoConveniado({
    de: '2026-11-01',
    ate: '2026-11-04',
  });
  assert.deepEqual(resultado, dados);
});

test('buscarPorTokenOuCodigo resolve tanto por ID numérico quanto por texto', async () => {
  const item = {
    id: 12,
    status: 'PENDENTE',
    valor_aplicado: 30,
    colaborador_nome: 'Carlos Souza',
    beneficio_nome: 'Almoço',
    token_qrcode: 'token-uuid-1234',
  };

  globalThis.fetch = async (url) => {
    if (url.includes('/eu/utilizacoes/12')) {
      return json(item);
    }
    return json([item]);
  };

  // Busca por ID numérico
  const porId = await utilizationService.buscarPorTokenOuCodigo('12');
  assert.equal(porId.id, 12);

  // Busca por Token UUID
  const porToken = await utilizationService.buscarPorTokenOuCodigo('token-uuid-1234');
  assert.equal(porToken.id, 12);
});

test('decidirUtilizacao envia o status correto e canal APP_CONVENIADO', async () => {
  let metodoChamado = '';
  let corpoEnviado = null;

  globalThis.fetch = async (url, opcoes) => {
    metodoChamado = opcoes.method;
    corpoEnviado = JSON.parse(opcoes.body);
    return json({ id: 10, status: 'APROVADA', canal_validacao: 'APP_CONVENIADO' });
  };

  await utilizationService.decidirUtilizacao(10, 'APROVADA', 'Aprovado pelo balcão');

  assert.equal(metodoChamado, 'PUT');
  assert.equal(corpoEnviado.status, 'APROVADA');
  assert.equal(corpoEnviado.canal_validacao, 'APP_CONVENIADO');
  assert.equal(corpoEnviado.observacoes, 'Aprovado pelo balcão');
});
