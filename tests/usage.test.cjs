const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fonte } = require('./helpers/runtime.cjs');
const { dataInicioUsos, resumirUsoBeneficio } = fonte('utils/usage.ts');

const beneficio = (extra = {}) => ({
  id: 1,
  nome: 'Vale farmácia',
  descricao: null,
  status: 'ATIVO',
  tipo_beneficio: 'PERCENTUAL',
  valor: 10,
  quantidade_maxima_utilizacoes: 4,
  tipo_janela: 'CALENDARIO_FIXO',
  unidade_ciclo: 'MES',
  dia_reset: '2026-11-01',
  intervalo_valor: null,
  intervalo_unidade: null,
  referencia_contagem: null,
  ...extra,
});

test('usa o começo do ciclo atual como limite da consulta de histórico', () => {
  const inicio = dataInicioUsos([beneficio()], new Date('2026-11-26T12:00:00'));
  assert.equal(inicio, '2026-11-01');
});

test('conta resgates aprovados e pendentes contra o limite do ciclo', () => {
  const uso = resumirUsoBeneficio(
    beneficio(),
    [
      {
        id: 1,
        beneficio_id: 1,
        status: 'APROVADA',
        data_validacao: '2026-11-10T12:00:00',
      },
    ],
    [
      {
        id: 2,
        beneficio_id: 1,
        status: 'PENDENTE',
        segundos_restantes: 10_740,
      },
    ],
    new Date('2026-11-26T12:00:00'),
  );
  assert.equal(uso.disponiveis, 2);
  assert.equal(uso.pendentes, 1);
  assert.equal(uso.usados, 1);
  assert.equal(uso.total, 4);
  assert.equal(uso.segundosRestantes, 10_740);
});

test('calcula quando um uso de janela móvel volta a ficar disponível', () => {
  const uso = resumirUsoBeneficio(
    beneficio({
      quantidade_maxima_utilizacoes: 1,
      tipo_janela: 'JANELA_MOVEL',
      unidade_ciclo: null,
      dia_reset: null,
      intervalo_valor: 30,
      intervalo_unidade: 'DIA',
    }),
    [
      {
        id: 1,
        beneficio_id: 1,
        status: 'APROVADA',
        data_validacao: '2026-11-01T12:00:00',
      },
    ],
    [],
    new Date('2026-11-26T12:00:00'),
  );
  assert.equal(uso.disponiveis, 0);
  assert.equal(uso.proximaData.toISOString().slice(0, 10), '2026-12-01');
});
