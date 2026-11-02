# Relatório — Contextos e autenticação do FCV Mobile

Samuel C. · Grupo 3 · Sprint 5 · 02/11/2026.
Branch: `feat/samuel-c-sessao-persistencia`, repositório `PedroCacador/fundacao-mobile`.
Base anterior: `e20e789` (etapa 2, tipos de usuário e conveniado).

## Resultado entregue

O aplicativo usa uma sessão compartilhada para COLABORADOR e CONVENIADO ativos.
Valida credenciais na API real, guarda apenas o token no serviço seguro nativo,
restaura a sessão com `/auth/eu` e encerra o acesso centralmente no logout/401.
Os dados do catálogo pertencem à sessão atual e são descartados ao sair, trocar
de conta ou reentrar na mesma conta. Erros de rede e armazenamento são tratados.

O trabalho implementa a infraestrutura de M01, M02, M04 e M05 da divisão por
integrante, página 1. A aceitação em aparelho de M02 ainda está pendente.
**Não conclui M03/AsyncStorage nem toda a parte de Samuel C. ou do grupo.**

## O que faltava e como ficou

Antes, o AuthContext recusava conveniados e nem todas as falhas de armazenamento
eram tratadas. Um 401 de uma chamada antiga podia derrubar outra sessão; o
catálogo retinha estado da conta anterior e a recarga manual não descartava
resultados tardios. A sessão não tinha um estado compartilhado de entrada/saída.

Agora:

- O `sessionService` reutiliza `authService` e valida escopo, conta ativa, vínculo
  ativo e correspondência de `usuario_id`. FCV recebe orientação para o portal.
- `authReducer` é puro e organiza estados de restauração, entrada, autenticação,
  saída e anonimato. Efeitos, HTTP e persistência permanecem fora do reducer.
- O provider só disponibiliza o usuário depois da validação e da gravação do
  token. Não salva senha ou cópia integral do cadastro para restaurar a sessão.
- Restauração exige `/auth/eu`; 401/403/404 removem a credencial inválida.
  Rede e erros transitórios do servidor preservam o token, sem liberar dados
  privados, com ação de tentar novamente.
- Falha de leitura é informada. Falha de gravação não libera o usuário. Falha
  de remoção encerra a sessão em memória e pede nova limpeza, bloqueando login
  até concluir essa operação. Se o dispositivo impedir a remoção, não é possível
  afirmar que a credencial persistida já foi apagada.
- Leitura/gravação/remoção são serializadas. Operações antigas não podem reabrir
  sessão encerrada ou sobrescrever os dados da conta atual. Nova tentativa de
  conta remove a credencial anterior antes de autenticar.
- Requisições públicas não recebem Bearer. 401 atual invalida uma vez; 403 mantém
  a sessão e informa acesso negado. Respostas de sessão antiga são descartadas
  (`ApiError.status === -1`), sem refresh ou novas tentativas automáticas.
- Catálogo é carregado uma vez por sessão do colaborador; recargas simultâneas
  compartilham a consulta. Logout descarta estados e consumidores privados.
  Erro de atualização pode preservar os últimos itens da mesma conta com erro
  explícito; não existe cache persistente novo.
- A montagem de ofertas usa Map por benefício/local, eliminando a filtragem
  integral repetida e locais duplicados.
- A saída usa um modal compartilhado com tema e botões existentes; a ViewModel
  controla seu estado, e a View só apresenta e encaminha as ações.

## Componentização e arquitetura

Foi mantido React Native + Expo + TypeScript + MVVM. Nenhum Redux, novo cliente
HTTP ou framework de estilos foi introduzido. Não houve mudança em CSS do portal,
MVC, Knex, MySQL, migrations ou contratos do backend.

- **Model:** `UsuarioMobile`/`SessaoMobile` reutilizam `UsuarioAutenticado`,
  `Colaborador` e `Conveniado` existentes.
- **Service:** `api.ts`, `authService.ts`, `sessionService.ts` e `tokenStorage.ts`
  centralizam transporte, contratos e credencial.
- **Context:** `AuthContext.tsx`, `authState.ts` e `CatalogContext.tsx` compartilham
  estado e gerenciam o ciclo da sessão.
- **Utilitário puro:** `utils/catalog.ts` transforma listagens, sem HTTP/estado.
- **ViewModel:** hooks de login e perfil preparam estado, avisos e ações.
- **View/componentes:** Login/Profile reutilizam o tema, ErrorMessage, Button,
  TopBar, UserGreeting, SectionCard e ListItem. ConfirmationModal é apresentacional.

Não foi criado um componente por cada campo ou função. A separação acompanha
responsabilidades e reaproveita os componentes já existentes.

## Arquivos alterados ou criados

Código de aplicação:

- `src/models/Auth.ts` — tipos da sessão dos dois perfis.
- `src/services/api.ts` — 401/403, versão da sessão, timeout e JSON.
- `src/services/authService.ts` — chamadas públicas sem token anterior.
- `src/services/sessionService.ts` — novo serviço de sessão/validação do vínculo.
- `src/services/tokenStorage.ts` — armazenamento em ordem e propagação de falhas.
- `src/context/authState.ts` — novo reducer e tipos de estado/aviso.
- `src/context/AuthContext.tsx` — fluxo compartilhado de sessão.
- `src/context/CatalogContext.tsx` — isolamento, limpeza e recarga compartilhada.
- `src/utils/catalog.ts` — transformação otimizada do catálogo.
- `src/viewmodels/useAuthViewModel.ts` — formulário e avisos do contexto.
- `src/viewmodels/useProfileViewModel.ts` — dados por escopo e confirmação de saída.
- `src/views/auth/LoginView.tsx` — reaproveitamento do estado de erro/repetição.
- `src/views/profile/ProfileView.tsx` — perfil compartilhado e modal.
- `src/components/common/TopBar.tsx` — opção de ocultar atalhos do colaborador.
- `src/components/common/ConfirmationModal.tsx` — novo componente de confirmação.
- `src/navigation/AppNavigator.tsx` e `types.ts` — acesso inicial do conveniado e
  reinício das rotas quando a sessão muda.
- `src/theme/index.ts` — token de sobreposição do modal.

Suporte: README, package.json/lockfile, eslint.config.js, testes e documentação
das etapas 3–6. `jsdom` foi adicionado somente em devDependencies; não há nova
dependência de produção. O app não importa o código de teste.

## Interface de integração

`useAuth()` fornece `usuario`, `escopo`, `perfil`, `idSessao`, `restaurando`,
`autenticando`, `saindo`, `avisoSessao`, `login`, `logout` e `tratarAviso`.
`useUsuario()` exige sessão validada e retorna `UsuarioMobile`.

`useCatalog()` preserva `itens`, `carregando`, `atualizando`, `erro` e `recarregar`.
Ele serve às telas do catálogo do colaborador; não substitui dados operacionais
do conveniado ou autorização de resgate. Estados privados não devem ser copiados
para outra sessão, nem deve ser criado um segundo token/contexto de login.

O conveniado recebe inicialmente `PartnerProfile`, reutilizando o perfil com seus
dados reais e saída. Heitor pode integrar o navegador completo nesse ponto; as
telas de câmera, pendentes, decisões e histórico continuam com seus responsáveis.
O ProfileViewModel usa `dadosPerfil`, título e subtítulo por escopo.

## Evidências e testes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, zero erros/avisos.
- `npm test`: **60 testes aprovados**, zero falhas, cancelamentos ou pulos.
- Prettier e `git diff --check`: aprovados antes dos commits.
- `expo export --platform web`: exportação de produção concluída.

Os testes usam Node 22, TypeScript já instalado, React DOM, `act()` e jsdom.
Montam providers e ViewModels reais; HTTP e módulos nativos são simulados.
Cobrem ambos os escopos, persistência/restauração, status/vínculos impedidos,
clique duplo, 401/403/404, rede/5xx, JSON/timeout, erros de armazenamento,
concorrência de login/logout, conta A/B, limpeza/reentrada, recargas e modal.
O Node emite um aviso experimental de MockTimers no teste de timeout.

Preview com API real de `develop`, commit backend
`f4cd1d441b3c9831140e3d763eab0d3c4e43ea04`, em `/api/v1` na porta 3334:

1. Conveniado: login, perfil cadastral e restauração ao recarregar.
2. Cancelar saída: sessão preservada. Confirmar: retorno ao login; recarregar
   não restaura a conta encerrada.
3. Senha incorreta do colaborador: erro real da API, sem liberar sessão.
4. Login do colaborador após o conveniado: Home e catálogo com dados reais,
   perfil com matrícula, cargo, setor e telefone da sua conta.
5. Colaborador: restauração, saída e recarga permanecendo no login.

O modal final foi acionado por teclado no navegador. Os logs, screenshots e
exportação ficam fora do repositório, em
`output/relatorios/mobile-contexto-autenticacao-2026-11-02` do workspace.
JWTs não foram registrados. Não houve escrita de dados de negócio, seed,
migration ou teste completo novo do backend.

## Pendências e limites

- **M02:** testar leitura/gravação/remoção real do SecureStore, reinício,
  expiração e logout em Android/iOS disponível. Preview web e mock não comprovam
  armazenamento criptografado ou toque/navegação nativa.
- **M03:** AsyncStorage ainda não foi instalado/implementado. Preferências e
  filtros por conta/escopo permanecem a próxima entrega; não guardar token/senha.
- **Integração:** área operacional do conveniado, QR/câmera e demais telas dos
  integrantes ainda não fazem parte desta entrega.
- **Dados oficiais:** `disponivel` no catálogo significa oferta ativa, não saldo
  ou elegibilidade. O cálculo local de próxima renovação já existente em
  `utils/benefit.ts` não foi alterado e não foi homologado contra uma resposta
  oficial de saldo/renovação da API; essa integração continua pendente.
- As sete recomendações de versões do Expo registradas na etapa 1 continuam
  fora deste ajuste; não houve upgrade de SDK ou reavaliação de compatibilidade.
- Banco local e refresh token continuam opcionais. `/auth/eu` não renova JWT.
- Logout limpa a sessão deste app; não há endpoint novo de revogação de JWT no
  backend. Não foi afirmado que o token é invalidado no servidor após sair.

Isso não equivale a aprovação integral de RF/RNF, da Sprint 5 ou do professor.
As mudanças apoiam RF01–RF05, RNF02/03/05/06 e os contratos RNF15/16, mantendo
as regras oficiais de benefício no backend.

## Etapas e commits

- `c28841b` — serviços HTTP/credencial e política dos dois perfis; 28 testes.
- `40bd0ac` — contexto de autenticação e acesso por escopo; 48 testes.
- `2220b96` — catálogo isolado e montagem otimizada; 57 testes.
- Etapa 6 — modal, integração e relatório; 60 testes, lint/typecheck e exportação.

Todos usam `feat` na branch individual. O hash da etapa 6 e a confirmação do
push ficam no registro local da entrega e no histórico Git; sem merge em
`main`, `master` ou `develop` e sem PR automático.

Referências técnicas consultadas: [useReducer](https://react.dev/reference/react/useReducer),
[act](https://react.dev/reference/react/act),
[React Navigation Auth Flow](https://reactnavigation.org/docs/auth-flow/) e
[Expo SecureStore SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/).
As aulas 10/12/16/17/18 e a divisão por integrante orientaram a implementação;
exemplos de bibliotecas e endpoints não foram tratados como novos requisitos.
