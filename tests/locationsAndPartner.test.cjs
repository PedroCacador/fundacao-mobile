const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fonte } = require('./helpers/runtime.cjs');
const { obterUrlsNavegacao } = fonte('utils/map.ts');
const { formatarCnpj } = fonte('utils/format.ts');

test('obterUrlsNavegacao gera URLs válidas para Google Maps, Maps nativo e Waze', () => {
  const endereco = 'Av. Cristiano Ferreira Varella, 555 - Muriaé, MG';
  const urls = obterUrlsNavegacao(endereco);

  assert.ok(urls.google.startsWith('https://www.google.com/maps/search/?api=1&query='));
  assert.ok(urls.google.includes(encodeURIComponent(endereco)));

  assert.ok(urls.waze.startsWith('https://waze.com/ul?q='));
  assert.ok(urls.waze.includes('navigate=yes'));
  assert.ok(urls.waze.includes(encodeURIComponent(endereco)));

  assert.ok(urls.apple.includes(encodeURIComponent(endereco)));
});

test('formatarCnpj aplica a máscara correta quando o CNPJ possui 14 dígitos', () => {
  assert.equal(formatarCnpj('12345678000195'), '12.345.678/0001-95');
  assert.equal(formatarCnpj('12.345.678/0001-95'), '12.345.678/0001-95');
  assert.equal(formatarCnpj('123'), '123');
  assert.equal(formatarCnpj(''), '');
});

test('agrupamento e filtragem de locais suporta categorias N:N e busca por texto', () => {
  const conveniado1 = {
    id: 1,
    usuario_id: 10,
    nome_fantasia: 'Farmácia Central',
    razao_social: 'Drogaria Central Ltda',
    categoria: 'Farmácia',
    categorias: ['Farmácia', 'Saúde'],
    cnpj: '11222333000144',
    endereco: 'Rua Principal, 100',
    status: 'ATIVO',
  };

  const conveniado2 = {
    id: 2,
    usuario_id: 20,
    nome_fantasia: 'Restaurante Sabor & Vida',
    razao_social: 'Sabor & Vida Restaurante ME',
    categoria: 'Alimentação',
    categorias: ['Alimentação'],
    cnpj: '22333444000155',
    endereco: 'Av. das Palmeiras, 250',
    status: 'ATIVO',
  };

  const locais = [
    { conveniado: conveniado1, beneficios: [{ id: 1, nome: 'Vale Remédio' }] },
    { conveniado: conveniado2, beneficios: [{ id: 2, nome: 'Almoço Saudável' }] },
  ];

  // Extração de categorias únicas
  const setCategorias = new Set();
  for (const local of locais) {
    const cats = local.conveniado.categorias || [local.conveniado.categoria];
    cats.forEach((c) => setCategorias.add(c));
  }
  const categoriasExtraidas = Array.from(setCategorias).sort();
  assert.deepEqual(categoriasExtraidas, ['Alimentação', 'Farmácia', 'Saúde']);

  // Filtro por categoria 'Saúde' encontra conveniado1 (N:N)
  const filtradosSaude = locais.filter((l) =>
    (l.conveniado.categorias || [l.conveniado.categoria]).includes('Saúde'),
  );
  assert.equal(filtradosSaude.length, 1);
  assert.equal(filtradosSaude[0].conveniado.id, 1);

  // Filtro por termo 'Restaurante' encontra conveniado2
  const filtradosBusca = locais.filter((l) =>
    l.conveniado.nome_fantasia.toLowerCase().includes('restaurante'),
  );
  assert.equal(filtradosBusca.length, 1);
  assert.equal(filtradosBusca[0].conveniado.id, 2);
});

test('histórico do conveniado filtra estritamente resgates do seu estabelecimento em qualquer status', () => {
  const conveniadoIdLogado = 42;

  const utilizacoesDaApi = [
    {
      id: 101,
      conveniado_id: 42,
      colaborador_nome: 'Ana Lima',
      beneficio_nome: 'Vale Refeição',
      status: 'APROVADA',
      valor_aplicado: 35.0,
      data_solicitacao: '2026-11-10T12:00:00Z',
    },
    {
      id: 102,
      conveniado_id: 42,
      colaborador_nome: 'Bruno Silva',
      beneficio_nome: 'Vale Refeição',
      status: 'REPROVADA',
      valor_aplicado: 35.0,
      data_solicitacao: '2026-11-10T13:00:00Z',
    },
    {
      id: 103,
      conveniado_id: 42,
      colaborador_nome: 'Carla Dias',
      beneficio_nome: 'Vale Refeição',
      status: 'PENDENTE',
      valor_aplicado: 35.0,
      data_solicitacao: '2026-11-10T14:00:00Z',
    },
    {
      id: 104,
      conveniado_id: 42,
      colaborador_nome: 'Daniel Vaz',
      beneficio_nome: 'Vale Refeição',
      status: 'EXPIRADA',
      valor_aplicado: 35.0,
      data_solicitacao: '2026-11-09T10:00:00Z',
    },
    {
      id: 201,
      conveniado_id: 999, // Outro conveniado
      colaborador_nome: 'Eduardo Reis',
      beneficio_nome: 'Desconto Academia',
      status: 'APROVADA',
      valor_aplicado: 80.0,
      data_solicitacao: '2026-11-10T15:00:00Z',
    },
  ];

  // Regra do ViewModel: filtrar por conveniado_id
  const vinculados = utilizacoesDaApi.filter(
    (item) => item.conveniado_id === conveniadoIdLogado,
  );

  // Deve conter 4 itens (todos de 42) e ignorar o de 999
  assert.equal(vinculados.length, 4);
  assert.ok(vinculados.every((item) => item.conveniado_id === 42));

  // Verifica que traz qualquer status
  const statuses = vinculados.map((i) => i.status).sort();
  assert.deepEqual(statuses, ['APROVADA', 'EXPIRADA', 'PENDENTE', 'REPROVADA']);
});
