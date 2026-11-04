const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fonte } = require('./helpers/runtime.cjs');
const {
    montarOpcoesQr,
    pedidoDoQr,
    calcularPrazo,
    segundosRestantes,
    formatarContador,
    situacaoDoQr,
} = fonte('utils/qrcode.ts');
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
const beneficio = (id, status = 'ATIVO') => ({
    id,
    nome: `Benefício ${id}`,
    descricao: null,
    status,
    tipo_beneficio: 'PERCENTUAL',
    valor: 10,
    quantidade_maxima_utilizacoes: 2,
    tipo_janela: 'CALENDARIO_FIXO',
    unidade_ciclo: 'MES',
    dia_reset: null,
    intervalo_valor: null,
    intervalo_unidade: null,
    referencia_contagem: null,
});
const dados = {
    beneficios: [beneficio(1), beneficio(2, 'INATIVO'), beneficio(3)],
    ofertas: [
        { id: 11, beneficio_id: 1, conveniado_id: 2, status: 'ATIVO' },
        { id: 12, beneficio_id: 1, conveniado_id: 1, status: 'ATIVO' },
        { id: 13, beneficio_id: 1, conveniado_id: 3, status: 'ATIVO' },
        { id: 14, beneficio_id: 2, conveniado_id: 1, status: 'ATIVO' },
        { id: 15, beneficio_id: 3, conveniado_id: 1, status: 'INATIVO' },
    ],
    conveniados: [
        conveniado(1, 'Academia'),
        conveniado(2, 'Farmácia'),
        conveniado(3, 'Ótica', 'EM_ANALISE'),
    ],
    campanhas: [
        { id: 1, nome: 'Outubro Rosa', status: 'ATIVA' },
        { id: 2, nome: 'Natal', status: 'PLANEJADA' },
    ],
    itens: [
        {
            id: 21,
            campanha_id: 1,
            nome: 'Exame',
            tipo_beneficio: 'VALOR_FIXO',
            valor: 80,
            status: 'ATIVO',
        },
        {
            id: 22,
            campanha_id: 2,
            nome: 'Ceia',
            tipo_beneficio: 'VALOR_FIXO',
            valor: 50,
            status: 'ATIVO',
        },
    ],
    ofertasCampanha: [
        { id: 31, beneficio_campanha_id: 21, conveniado_id: 1, status: 'ATIVO' },
        { id: 32, beneficio_campanha_id: 22, conveniado_id: 1, status: 'ATIVO' },
    ],
};
test('mostra só benefício e item de campanha ativos com estabelecimento ativo', () => {
    const opcoes = montarOpcoesQr(dados);
    assert.deepEqual(
        opcoes.map((opcao) => opcao.chave),
        ['BENEFICIO-1', 'CAMPANHA-21'],
    );
    assert.deepEqual(
        opcoes[0].locais.map((local) => local.conveniado.nome_fantasia),
        ['Academia', 'Farmácia'],
    );
    assert.match(opcoes[1].detalhe, /80,00 de desconto · Outubro Rosa$/);
});
test('monta o pedido com o campo certo para cada origem', () => {
    const [doBeneficio, daCampanha] = montarOpcoesQr(dados);
    assert.deepEqual(pedidoDoQr(doBeneficio, doBeneficio.locais[0]), { beneficio_conveniado_id: 12 });
    assert.deepEqual(pedidoDoQr(daCampanha, daCampanha.locais[0]), {
        beneficio_campanha_conveniado_id: 31,
    });
});
test('o prazo usa a duração da API a partir do momento em que o QR chegou', () => {
    const emissao = {
        id: 1,
        token_qrcode: 'abc',
        status: 'PENDENTE',
        data_solicitacao: '2026-11-03 10:00:00',
        expira_em: '2026-11-03 10:05:00',
    };
    const recebidoEm = 1_000_000;
    const prazo = calcularPrazo(emissao, recebidoEm);
    assert.equal(prazo, recebidoEm + 300_000);
    assert.equal(segundosRestantes(prazo, recebidoEm), 300);
    assert.equal(segundosRestantes(prazo, recebidoEm + 299_001), 1);
    assert.equal(segundosRestantes(prazo, recebidoEm + 400_000), 0);
    assert.equal(calcularPrazo({ ...emissao, expira_em: null }, recebidoEm), null);
    assert.equal(segundosRestantes(null, recebidoEm), null);
});
test('formata o contador em minutos e segundos', () => {
    assert.equal(formatarContador(300), '05:00');
    assert.equal(formatarContador(61), '01:01');
    assert.equal(formatarContador(0), '00:00');
});
test('a situação respeita o status da API e só expira quando o prazo acaba', () => {
    assert.equal(situacaoDoQr('PENDENTE', 10), 'VALIDO');
    assert.equal(situacaoDoQr('PENDENTE', null), 'VALIDO');
    assert.equal(situacaoDoQr('PENDENTE', 0), 'EXPIRADO');
    assert.equal(situacaoDoQr('APROVADA', 0), 'APROVADA');
    assert.equal(situacaoDoQr('REPROVADA', 10), 'REPROVADA');
});
