# Etapa 3 — Serviços de sessão, HTTP e credencial

Samuel C. · Grupo 3 · 02/11/2026 · M02/M05 (infraestrutura).

## O que mudou

- `api.ts`: token explícito `null` significa requisição pública. Requisições
  autenticadas registram a versão da sessão; respostas de uma sessão anterior
  são descartadas com `ApiError.status === -1`. Um 401 atual invalida o token
  antes de notificar o contexto, evitando logout repetido. 403 preserva a sessão.
  O timeout também abrange o corpo; JSON inválido em sucesso gera erro 502 local.
- `authService.ts`: login e recuperação são públicos, sem Bearer de outra conta.
- `sessionService.ts`: reaproveita `authService`, valida token e vínculo ativo
  de COLABORADOR/CONVENIADO e orienta FCV ao portal. Não renova JWT nem substitui
  autorização do servidor.
- `Auth.ts`: tipos `UsuarioMobile` e `SessaoMobile` reutilizam os contratos
  existentes e distinguem os vínculos dos dois escopos.
- `tokenStorage.ts`: mantém SecureStore nativo e fallback web; serializa leitura,
  gravação e remoção. Logout não pode ser ultrapassado por gravação já iniciada.
  Falhas chegam ao chamador; armazenamento web bloqueado não simula sucesso.
- `tests/`: testes com `node:test` e TypeScript já instalado. Só os módulos
  nativos e o transporte são substituídos no processo de teste; os serviços são
  os arquivos reais. `npm test` executa a suíte. ESLint reconhece `__dirname`
  apenas nos testes CommonJS.

## Validação

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, zero avisos.
- `npm test`: 28 testes aprovados, zero falhas.
- Formatação e diff conferidos antes do commit.

Cobertura: Bearer, rotas públicas, 401 concorrentes, 403, respostas tardias 200/401,
restauração explícita, rede, corpo lento, JSON inválido, escopos e vínculos,
serialização da credencial, falhas de armazenamento e fallback web.
O Node 22 emite um aviso experimental para MockTimers, usado no caso de timeout.

O primeiro teste no sandbox não iniciou os subprocessos (`spawn EPERM`); a
execução autorizada fora desse bloqueio passou. Isso não foi uma falha da API.

## Limites e arquitetura

Camada Model contém tipos; Service cuida de contratos, transporte e credencial.
Não foram alteradas Views, navegação, banco ou backend. A integração desses
serviços no AuthContext é a próxima etapa; este commit isolado ainda preserva
a restrição antiga do contexto a colaboradores.

Os testes do SecureStore usam um adaptador simulado e não comprovam criptografia
ou comportamento num aparelho. A conferência nativa continua necessária.
AsyncStorage, banco local, refresh token e telas operacionais de outros integrantes
não fazem parte desta etapa.

Referência de armazenamento: [Expo SecureStore, SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/).
