# Etapa 5 — Catálogo compartilhado e isolamento da sessão

Samuel C. · Grupo 3 · 02/11/2026 · M04 e isolamento de M01/M05.

## Implementação

`CatalogContext` mantém sua interface: `itens`, `carregando`, `atualizando`,
`erro` e `recarregar`. Home, Carteira e Detalhes continuam consumindo a mesma
fonte de dados, sem criar um catálogo por tela.

- Uma fronteira interna é identificada por escopo, usuário e `idSessao`.
  Ao encerrar ou trocar a sessão ela é remontada, descartando os estados privados
  e seus consumidores. Reentrar na mesma conta também começa com dados novos.
- O carregamento só consulta o catálogo do colaborador com sessão validada.
  A entrada mínima do conveniado não busca dados destinados à carteira.
- Respostas de providers desmontados não atualizam o estado. Uma referência
  antiga a `recarregar` também não inicia chamadas depois da desmontagem.
- Recargas simultâneas compartilham uma promessa, evitando duplicar as três
  listagens do serviço existente.
- Erros terminam o carregamento e permitem nova tentativa. Na atualização, os
  últimos itens da mesma sessão são preservados com erro explícito; não é criado
  cache persistente ou uma autorização para resgate offline.
- `utils/catalog.ts` contém a transformação pura dos dados. As ofertas são
  agrupadas em uma passagem por benefício/local, sem percorrer a lista inteira
  para cada benefício. Locais repetidos são eliminados.

## Regras preservadas

Os endpoints e `benefitService` continuam os existentes. Benefícios
DESCONTINUADO ficam fora da listagem; estabelecimentos/ofertas inativos não
entram nos locais ativos. `disponivel` conserva o indicador visual de benefício
ativo com oferta ativa. **Esse indicador não comprova saldo, renovação ou
elegibilidade do usuário.** Essas regras e toda decisão de resgate são da API.

Não foram inventados saldos ou datas e não houve alteração no backend, no banco,
no histórico do servidor ou em fluxos QR/câmera dos demais integrantes.

## Validação

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, zero avisos.
- `npm test`: 57 testes aprovados, zero falhas (nove novos nesta etapa).
- Formatação e diff conferidos antes do commit.

Os novos casos cobrem ausência de sessão, catálogo do colaborador, conveniado,
recargas simultâneas, erro e recuperação, logout/reentrada da mesma conta,
resposta tardia da conta A após entrar na B, atualização com falha e agrupamento
das ofertas. Os providers reais são montados; transporte e módulos nativos são
simulados. Testes em aparelho e AsyncStorage permanecem etapas distintas.

Na conferência visual integrada, o login real e a restauração do conveniado
funcionaram. A antiga confirmação de saída com `window.confirm` bloqueou o
controle do preview; a conclusão da conferência visual do logout fica para o
ajuste de confirmação seguinte. Isso não foi declarado como teste visual aprovado.
