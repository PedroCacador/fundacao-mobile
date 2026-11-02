const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { montar, act, React, fonte, json, usuario, credenciais } = require('./helpers/react.cjs');
const { useAuth } = fonte('context/AuthContext.tsx');
const { useProfileViewModel } = fonte('viewmodels/useProfileViewModel.ts');
let app;
let perfil;
const fetchOriginal = globalThis.fetch;

function Perfil() {
  const atual = useProfileViewModel();
  React.useEffect(() => {
    perfil = atual;
  }, [atual]);
  return React.createElement('span', null, atual.tituloPerfil);
}
function Conteudo() {
  return useAuth().usuario ? React.createElement(Perfil) : null;
}
async function abrir(escopo = 'COLABORADOR') {
  globalThis.fetch = async () => json({ token: 'teste', usuario: usuario(escopo) });
  app = await montar({ Conteudo });
  await act(async () => app.auth.login('teste@example.com', 'senha'));
}
beforeEach(() => {
  credenciais.clear();
  perfil = null;
});
afterEach(async () => {
  if (app) await app.desmontar();
  app = null;
  globalThis.fetch = fetchOriginal;
});

for (const escopo of ['COLABORADOR', 'CONVENIADO']) {
  test(`perfil ${escopo} reutiliza a sessão e prepara os campos corretos`, async () => {
    await abrir(escopo);
    assert.equal(perfil.ehColaborador, escopo === 'COLABORADOR');
    const rotulos = perfil.dadosPerfil.map((campo) => campo.rotulo);
    assert.ok(rotulos.includes(escopo === 'COLABORADOR' ? 'Cargo' : 'CNPJ'));
    assert.ok(!rotulos.includes(escopo === 'COLABORADOR' ? 'CNPJ' : 'Cargo'));
    assert.equal(perfil.confirmacaoSaidaAberta, false);
  });
}

test('cancelar saída mantém sessão e confirmar remove a credencial', async () => {
  await abrir();
  await act(async () => perfil.solicitarSaida());
  assert.equal(perfil.confirmacaoSaidaAberta, true);
  await act(async () => perfil.cancelarSaida());
  assert.equal(perfil.confirmacaoSaidaAberta, false);
  assert.ok(app.auth.usuario);
  assert.equal(credenciais.get('fcv_token'), 'teste');
  await act(async () => {
    perfil.solicitarSaida();
  });
  await act(async () => perfil.confirmarSaida());
  assert.equal(app.auth.usuario, null);
  assert.equal(credenciais.size, 0);
});
