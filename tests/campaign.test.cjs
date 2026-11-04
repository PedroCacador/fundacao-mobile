const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fonte } = require('./helpers/runtime.cjs');
const { situacaoDaCampanha, montarItensCampanha } = fonte('utils/campaign.ts');

const hoje = new Date(2026, 10, 3);

const campanha = (id, status, inicio, fim) => ({
  id,
  nome: `Campanha ${id}`,
  tipo: 'CAMPANHA',
  descricao: null,
  data_inicio: inicio,
  data_fim: fim,
  criterio_elegibilidade: null,
  patrocinador: null,
  status,
});

const item = (id, campanhaId, status = 'ATIVO') => ({
  id,
  campanha_id: campanhaId,
  nome: `Item ${id}`,
  descricao: null,
  tipo_beneficio: 'VALOR_FIXO',
  valor: 10,
  quantidade_maxima_utilizacoes: 1,
  status,
});

const conveniado = (id, nome, status = 'ATIVO') => ({
  id,
  usuario_id: id + 10,
  nome_fantasia: nome,
  razao_social: nome,
  categoria: 'Saúde',
  cnpj: '00000000000000',
  endereco: 'Rua A',
  status,
});

test('campanha ativa dentro do período é vigente, inclusive no último dia', () => {
  assert.equal(
    situacaoDaCampanha(campanha(1, 'ATIVA', '2026-11-01', '2026-11-30'), hoje),
    'VIGENTE',
  );
  assert.equal(
    situacaoDaCampanha(campanha(1, 'ATIVA', '2026-10-01', '2026-11-03'), hoje),
    'VIGENTE',
  );
});

test('campanha ativa com data_fim vencida ou encerrada é expirada', () => {
  assert.equal(
    situacaoDaCampanha(campanha(1, 'ATIVA', '2026-10-01', '2026-10-31'), hoje),
    'EXPIRADA',
  );
  assert.equal(
    situacaoDaCampanha(campanha(1, 'ENCERRADA', '2026-11-01', '2026-11-30'), hoje),
    'EXPIRADA',
  );
});

test('campanha planejada, cancelada ou que ainda não começou fica fora do ar', () => {
  assert.equal(
    situacaoDaCampanha(campanha(1, 'PLANEJADA', '2026-12-12', '2026-12-12'), hoje),
    'FORA_DO_AR',
  );
  assert.equal(
    situacaoDaCampanha(campanha(1, 'CANCELADA', '2026-11-01', '2026-11-30'), hoje),
    'FORA_DO_AR',
  );
  assert.equal(
    situacaoDaCampanha(campanha(1, 'ATIVA', '2026-11-10', '2026-11-30'), hoje),
    'FORA_DO_AR',
  );
});

test('itens trazem só locais ativos e escondem campanhas fora do ar', () => {
  const lista = montarItensCampanha(
    [
      campanha(1, 'ATIVA', '2026-11-01', '2026-11-30'),
      campanha(2, 'ATIVA', '2026-10-01', '2026-10-31'),
      campanha(3, 'PLANEJADA', '2026-12-01', '2026-12-31'),
    ],
    [item(1, 1), item(2, 1, 'INATIVO'), item(3, 2), item(4, 3)],
    [
      { id: 1, beneficio_campanha_id: 1, conveniado_id: 1, status: 'ATIVO' },
      { id: 2, beneficio_campanha_id: 1, conveniado_id: 2, status: 'ATIVO' },
      { id: 3, beneficio_campanha_id: 1, conveniado_id: 3, status: 'INATIVO' },
      { id: 4, beneficio_campanha_id: 3, conveniado_id: 1, status: 'ATIVO' },
    ],
    [conveniado(1, 'Farmácia'), conveniado(2, 'Academia', 'INATIVO'), conveniado(3, 'Ótica')],
    hoje,
  );
  assert.deepEqual(
    lista.map((dados) => [dados.item.id, dados.situacao, dados.conveniados.map((c) => c.id)]),
    [
      [1, 'VIGENTE', [1]],
      [3, 'EXPIRADA', [1]],
    ],
  );
});
