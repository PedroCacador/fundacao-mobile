# Etapa 4 — Contexto de autenticação e acesso por escopo

Samuel C. · Grupo 3 · 02/11/2026 · M01/M02/M05.

## Implementação

`AuthContext` reaproveita os serviços da etapa 3 e compartilha uma sessão única.
O reducer puro em `context/authState.ts` organiza restauração, entrada, sessão
autenticada, saída e anonimato. HTTP e SecureStore ficam fora do reducer.

- Login e restauração aceitam COLABORADOR e CONVENIADO com vínculo ativo.
- FCV é orientado ao portal. O servidor permanece responsável pela autorização.
- O usuário só é liberado depois de validar a resposta e salvar a credencial.
- Restauração lê o token e valida `/auth/eu`; ausência de token termina anônima.
- 401/403/404 na restauração removem a credencial; rede/5xx preservam o token,
  bloqueiam dados privados e oferecem uma nova tentativa.
- Falhas de leitura, gravação e remoção são tratadas. Se a remoção falhar,
  o acesso em memória termina, há aviso e ação de limpeza; um novo login não
  usa a credencial anterior silenciosamente.
- Cada operação tem um identificador. Logout e novas operações invalidam
  resultados antigos, inclusive login e restauração ainda pendentes.
- As operações no armazenamento são serializadas pelo serviço. Uma nova
  tentativa de conta remove a credencial anterior antes de autenticar.
- Clique duplo é bloqueado no contexto. Ações automáticas de expiração e
  logout não deixam rejeições de armazenamento sem tratamento.

## Contrato para os colegas

`useAuth()` disponibiliza `usuario`, `escopo`, `perfil`, `idSessao`, `restaurando`,
`autenticando`, `saindo`, `avisoSessao`, `login`, `logout` e `tratarAviso`.
`useUsuario()` continua exigindo sessão validada e retorna `UsuarioMobile`.
Não persistir cópias do usuário ou criar uma segunda sessão nas telas.

`idSessao` identifica a operação de sessão, sem conter a credencial. Ele muda
mesmo quando a mesma conta entra novamente, para permitir limpar estados locais.
Um aviso pode pedir `RESTAURAR`, `LIMPAR_CREDENCIAL` ou apenas informar o usuário.

## Views e navegação

`useAuthViewModel` utiliza o carregamento compartilhado e prepara avisos para a
`LoginView`, que reutiliza `ErrorMessage` e sua ação de tentar novamente.
Uma falha de limpeza bloqueia a entrada até a credencial ser removida.

O Stack é reconstruído quando a sessão autenticada muda. O conveniado recebe
apenas a rota `PartnerProfile`, reaproveitando `ProfileView`, seu ViewModel,
`UserGreeting`, `SectionCard`, `ListItem` e o botão de saída. O ViewModel prepara
os dados do estabelecimento que já vieram da API. A TopBar oculta os atalhos do
colaborador nesse acesso, sem alterar seu padrão para as telas atuais.

Essa é a integração mínima para testar entrada, restauração e saída do conveniado
sem abrir sua conta nas telas do colaborador. **Câmera, pendentes, decisão e
histórico do conveniado continuam com os responsáveis por essas telas.** Heitor
pode substituir esse ponto de entrada pela área completa sem criar outro login.
O retorno `dadosColaborador` do ProfileViewModel passou a `dadosPerfil`, agora
com título e subtítulo preparados por escopo.

## Validação

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, zero avisos.
- `npm test`: 48 testes aprovados, zero falhas (28 da etapa anterior e 20 novos).
- Formatação e diff conferidos antes do commit.

Os novos testes montam o AuthProvider real com React DOM, `act()` e jsdom.
Conferem os dois escopos, restauração/reabertura, logout, falhas de armazenamento,
401/403/404, rede/500, clique duplo, operações tardias, logout durante gravação,
troca de conta e StrictMode. O transporte e a plataforma nativa são simulados.

jsdom 26.1.0 foi adicionado **apenas em devDependencies**, com lockfile. A versão
foi escolhida por suportar o Node 22.19 instalado; a versão mais recente exige
uma revisão superior do Node. Não há uma nova dependência de produção.

## Limites

SecureStore no aparelho ainda precisa de teste Android/iOS. Os testes React não
comprovam seu funcionamento criptográfico nativo nem substituem a conferência
visual de navegação. Nenhum refresh token, banco local ou alteração na API foi
incluído. AsyncStorage (M03) continua uma etapa distinta.

O catálogo ainda precisa da proteção completa contra recargas tardias e limpeza
de sessão: será a etapa seguinte. Não considerar toda a Sprint 5 concluída.

Referências: [useReducer](https://react.dev/reference/react/useReducer),
[act](https://react.dev/reference/react/act) e
[fluxo de autenticação do React Navigation](https://reactnavigation.org/docs/auth-flow/).
