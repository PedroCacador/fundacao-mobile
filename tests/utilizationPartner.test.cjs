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

test('buscarPorTokenOuCodigo consulta o endpoint de validação com o código informado', async () => {
  const item = {
    id: 12,
    status: 'PENDENTE',
    valor_aplicado: 30,
    colaborador_nome: 'Carlos Souza',
    beneficio_nome: 'Almoço',
    token_qrcode: 'token-uuid-1234',
    codigo_validacao: 'FCV012',
  };

  globalThis.fetch = async (url) => {
    assert.equal(url, 'http://api.test/api/v1/validacao/FCV012');
    return json(item);
  };

  const resgate = await utilizationService.buscarPorTokenOuCodigo('FCV012');
  assert.equal(resgate.id, 12);
  assert.equal(resgate.codigo_validacao, 'FCV012');
});

test('decidirUtilizacao usa a rota e o corpo de aprovação da API', async () => {
  let metodoChamado = '';
  let corpoEnviado = null;
  let urlChamado = '';

  globalThis.fetch = async (url, opcoes) => {
    urlChamado = url;
    metodoChamado = opcoes.method;
    corpoEnviado = JSON.parse(opcoes.body);
    return json({ id: 10, status: 'APROVADA', canal_validacao: 'APP_CONVENIADO' });
  };

  await utilizationService.decidirUtilizacao('FCV010', 'APROVADA');

  assert.equal(urlChamado, 'http://api.test/api/v1/validacao/FCV010/aprovar');
  assert.equal(metodoChamado, 'POST');
  assert.deepEqual(corpoEnviado, { canal_validacao: 'APP_CONVENIADO' });
});

test('decidirUtilizacao envia o motivo no campo esperado pela rota de reprovação', async () => {
  let metodoChamado = '';
  let corpoEnviado = null;
  let urlChamado = '';

  globalThis.fetch = async (url, opcoes) => {
    urlChamado = url;
    metodoChamado = opcoes.method;
    corpoEnviado = JSON.parse(opcoes.body);
    return json({ id: 10, status: 'REPROVADA', canal_validacao: 'APP_CONVENIADO' });
  };

  await utilizationService.decidirUtilizacao('FCV010', 'REPROVADA', 'Motivo da reprovação');

  assert.equal(urlChamado, 'http://api.test/api/v1/validacao/FCV010/reprovar');
  assert.equal(metodoChamado, 'POST');
  assert.deepEqual(corpoEnviado, {
    canal_validacao: 'APP_CONVENIADO',
    motivo: 'Motivo da reprovação',
  });
});
