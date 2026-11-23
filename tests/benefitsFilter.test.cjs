const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fonte } = require('./helpers/runtime.cjs');
const { estiloCategoria } = fonte('utils/category.ts');
const {
  beneficiosAtivos,
  categoriasDoConveniado,
  filtrarBeneficios,
  listarCategorias,
} = fonte('utils/benefit.ts');

function conveniado(id, extra = {}) {
  return {
    id,
    usuario_id: id * 10,
    nome_fantasia: `Loja ${id}`,
    razao_social: `Loja ${id} Ltda`,
    categoria: 'Farmácia',
    cnpj: '11222333000144',
    endereco: 'Rua A',
    status: 'ATIVO',
    ...extra,
  };
}

function item(id, nome, descricao, conveniados, extra = {}) {
  const { status = 'ATIVO', disponivel = true } = extra;
  return {
    beneficio: { id, nome, descricao, status },
    conveniados,
    categoria: '',
    disponivel,
  };
}

const farmacia = conveniado(1, { categoria: 'Farmácia', categorias: ['Farmácia', 'Saúde'] });
const restaurante = conveniado(2, { categoria: 'Alimentação', categorias: ['Alimentação'] });
const legado = conveniado(3, { categoria: 'Educação' });
const semCategoria = conveniado(4, { categoria: '', categorias: [] });
const categoriaAusente = conveniado(6, { categoria: undefined, categorias: [null, { id: 3 }] });
const categoriasDaApi = conveniado(5, {
  categoria: 'Farmácia',
  categorias: [
    { id: 1, nome: 'Farmácia' },
    { id: 2, nome: 'Saúde' },
  ],
});

const itens = [
  item(1, 'Vale Remédio', 'Desconto em medicamentos', [farmacia]),
  item(2, 'Almoço Saudável', 'Refeição com desconto', [restaurante, farmacia]),
  item(3, 'Curso de Idiomas', null, [legado]),
  item(4, 'Benefício Inativo', 'Não deve aparecer', [farmacia], { status: 'INATIVO' }),
  item(5, 'Benefício Indisponível', 'Fora da janela', [farmacia], { disponivel: false }),
  item(6, 'Benefício Descontinuado', 'Antigo', [farmacia], { status: 'DESCONTINUADO' }),
];

const ids = (lista) => lista.map((entrada) => entrada.beneficio.id);

test('beneficiosAtivos remove inativos, descontinuados e indisponíveis', () => {
  assert.deepEqual(ids(beneficiosAtivos(itens)), [1, 2, 3]);
});

test('categoriasDoConveniado usa categorias N:N e cai no campo legado', () => {
  assert.deepEqual(categoriasDoConveniado(farmacia), ['Farmácia', 'Saúde']);
  assert.deepEqual(categoriasDoConveniado(categoriasDaApi), ['Farmácia', 'Saúde']);
  assert.deepEqual(categoriasDoConveniado(legado), ['Educação']);
  assert.deepEqual(categoriasDoConveniado(semCategoria), []);
  assert.deepEqual(categoriasDoConveniado(categoriaAusente), []);
});

test('categorias ausentes ou inválidas usam estilo padrão sem interromper a tela', () => {
  assert.deepEqual(estiloCategoria(undefined), estiloCategoria(''));
  assert.deepEqual(estiloCategoria(null), estiloCategoria(''));
  assert.deepEqual(estiloCategoria('Farmácia'), estiloCategoria('Farmacia'));
});

test('listarCategorias reúne categorias únicas dos conveniados em ordem alfabética', () => {
  assert.deepEqual(listarCategorias(beneficiosAtivos(itens)), [
    'Alimentação',
    'Educação',
    'Farmácia',
    'Saúde',
  ]);
});

test('categorias da API em formato de objeto viram nomes filtráveis', () => {
  const itemApi = item(7, 'Benefício para saúde', null, [categoriasDaApi]);

  assert.deepEqual(listarCategorias([itemApi]), ['Farmácia', 'Saúde']);
  assert.deepEqual(ids(filtrarBeneficios([itemApi], '', 'Saúde')), [7]);
});

test('filtrarBeneficios por categoria aceita N:N, legado e conveniados mistos', () => {
  const ativos = beneficiosAtivos(itens);
  assert.deepEqual(ids(filtrarBeneficios(ativos, '', 'Saúde')), [1, 2]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, '', 'Alimentação')), [2]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, '', 'Educação')), [3]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, '', 'Inexistente')), []);
  assert.deepEqual(ids(filtrarBeneficios(ativos, '', null)), [1, 2, 3]);
});

test('filtrarBeneficios busca por nome ou descrição sem acento nem maiúsculas', () => {
  const ativos = beneficiosAtivos(itens);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'ALMOCO', null)), [2]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'medicamentos', null)), [1]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'refeicao', null)), [2]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'idiomas', null)), [3]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'desconto', null)), [1, 2]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, '   ', null)), [1, 2, 3]);
});

test('filtrarBeneficios combina busca e categoria', () => {
  const ativos = beneficiosAtivos(itens);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'desconto', 'Alimentação')), [2]);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'remedio', 'Alimentação')), []);
  assert.deepEqual(ids(filtrarBeneficios(ativos, 'vale', 'Farmácia')), [1]);
});

test('filtrarBeneficios nunca devolve inativos, mesmo que a busca combine', () => {
  const resultado = filtrarBeneficios(beneficiosAtivos(itens), 'inativo', null);
  assert.deepEqual(ids(resultado), []);
});
