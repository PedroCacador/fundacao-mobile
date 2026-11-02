const runtime = require('./runtime.cjs');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = require('react');
const { createRoot } = require('react-dom/client');
const { AuthProvider, useAuth } = runtime.fonte('context/AuthContext.tsx');

async function montar({ estrito = false, Conteudo } = {}) {
  let auth;
  function Observar() {
    auth = useAuth();
    return React.createElement('output', null, auth.usuario?.escopo ?? 'ANONIMA');
  }
  const elemento = document.createElement('div');
  document.body.appendChild(elemento);
  const root = createRoot(elemento);
  const conteudo = React.createElement(
    AuthProvider,
    null,
    React.createElement(Observar),
    Conteudo ? React.createElement(Conteudo) : null,
  );
  await React.act(async () => {
    root.render(estrito ? React.createElement(React.StrictMode, null, conteudo) : conteudo);
  });
  return {
    get auth() {
      return auth;
    },
    elemento,
    async desmontar() {
      await React.act(async () => root.unmount());
      elemento.remove();
    },
  };
}

module.exports = { ...runtime, React, act: React.act, montar };
