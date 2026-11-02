# Relatório — AsyncStorage e SecureStore

Samuel C. · Grupo 3 · Sprint 5 · 02/11/2026.
Branch individual: `feat/samuel-c-sessao-persistencia`.

## Resultado

M03 está implementado: os filtros existentes de Carteira e Histórico são
persistidos por usuário/escopo e restaurados na reabertura com sessão válida.
Logout, expiração e tentativa de troca de conta limpam os dados pertinentes.
M02 foi reaproveitado e refinado; o teste real do SecureStore em aparelho ainda
não foi realizado porque o ADB não encontrou dispositivo ou emulador conectado.

O projeto mantém Expo/React Native/TypeScript e MVVM. Não houve alteração no
backend, MySQL/Knex, regras de resgate, CSS do portal ou branches principais.

## O que foi gerado e alterado

- **Model:** `models/Preferences.ts` define `FiltroCarteira`, `PeriodoHistorico`,
  os valores padrão e a normalização. Os ViewModels reexportam os tipos antigos
  para preservar os imports usados pelas telas.
- **Service:** `services/storageService.ts` centraliza AsyncStorage. A versão
  2.2.0 foi instalada por `expo install`, conforme o SDK 58, com lockfile.
- **Fila compartilhada:** `utils/asyncQueue.ts` é reaproveitada pelos serviços
  de credencial e preferências, com filas independentes. Erros não inutilizam a
  próxima operação nem são escondidos do chamador.
- **SecureStore:** `tokenStorage.ts` preserva sua chave e operações assíncronas.
  No iOS, usa `WHEN_UNLOCKED_THIS_DEVICE_ONLY` na gravação. Não foi criada uma
  exigência de biometria. Android continua com o mecanismo nativo do SecureStore.
- **Context:** `PreferencesContext.tsx` fornece valores, carregamento, gravação,
  erros, repetição e ações tipadas. `preferencesState.ts` contém o reducer puro;
  não há HTTP ou armazenamento dentro do reducer.
- **Providers:** `App.tsx` mantém AuthProvider antes dos demais, acrescentando
  PreferencesProvider. Uma fronteira por conta/escopo/identificador da sessão
  descarta estados de outra conta e callbacks de componentes desmontados.
- **Autenticação:** AuthContext limpa preferências e credencial de forma tratada.
  Falha no AsyncStorage não impede tentar remover o token. O aviso
  `LIMPAR_PREFERENCIAS` permite repetir a limpeza e impede nova entrada até ela
  terminar. Iniciar sem token também limpa sobras de uma saída interrompida.
- **ViewModels:** Carteira e Histórico usam o contexto, sem chamar AsyncStorage
  nas Views. Histórico aguarda a leitura do período antes da consulta à API e
  descarta respostas de períodos anteriores e componentes desmontados.
- **Views:** WalletView/HistoryView reutilizam abas, tema e ErrorMessage. As abas
  ficam desabilitadas durante a leitura; falhas de persistência têm nova tentativa.
  FilterTabs recebeu a opção `desabilitado`, preservando seu padrão nas demais telas.
- **Testes/documentação:** mocks nativos existentes reaproveitados, novos testes
  de serviço/contexto/integração dos filtros, README e roteiro de aparelho.

## Política de dados

Somente dois valores são gravados: `filtroCarteira` e `periodoHistorico`, ambos
enums. Token, senha, nome, e-mail, cadastro e histórico não fazem parte do esquema.
O serializador seleciona os campos permitidos mesmo quando um objeto em execução
contém propriedades extras.

As chaves seguem `@fcv:v1:conta:<escopo>:<id>:preferencias`. Um marcador separado
contém apenas id/escopo para localizar a limpeza quando não houver mais usuário
em memória. Ele não autentica, valida JWT ou substitui `/auth/eu`.

Gravações verificam o proprietário dentro da fila. Uma gravação antiga não pode
recriar dados depois do logout nem escrever na conta seguinte. Dados corrompidos
são normalizados para padrões. Se o marcador estiver ausente/corrompido, a
recuperação remove somente as chaves conhecidas de preferências do FCV;
`AsyncStorage.clear()` não é usado. Chaves de outros recursos são preservadas.

Reabrir com sessão válida preserva os filtros. Logout e troca de conta removem
esses filtros; a nova sessão começa com os padrões. Nada é apagado no servidor.
Não foi adicionado cache de dados privados, banco local ou refresh token.

No app nativo, a credencial é armazenada no SecureStore. No preview web permanece
o fallback já existente de token no localStorage, que não equivale à proteção
nativa; AsyncStorage web também usa armazenamento do navegador. O serviço de
preferências não grava nem restaura a credencial.

## Comportamento em falhas

- Falha ao ler: filtros padrão continuam disponíveis, erro é informado e a
  leitura pode ser repetida. Edições locais são mescladas ao recuperar os dados.
- Falha ao salvar: o filtro funciona em memória e o aviso informa que ele não
  pôde ser persistido; a repetição tenta salvar a escolha atual.
- Mudanças rápidas: a revisão atual prevalece e as escritas ficam em ordem.
- Falha ao limpar: o acesso em memória termina e a remoção do token é tentada;
  o contexto informa a pendência e permite repetir. Não afirmar que os dados
  persistidos foram removidos enquanto o armazenamento retornar erro.

## Validações efetivamente realizadas

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, zero erros/avisos.
- `npm test`: **85 testes aprovados**, zero falhas/cancelamentos/pulos.
- Prettier e `git diff --check`: conferidos antes do commit.
- `expo export --platform web`: aprovado, artefatos fora do repositório.

A suíte usa providers, reducers, serviços e ViewModels reais, com transporte e
armazenamento nativo simulados. Os novos casos cobrem separação por usuário e
escopo, reabertura, filtros reais das telas, hidratação lenta, valores inválidos,
campos proibidos, falhas e repetição, logout/401, troca durante gravação,
StrictMode e resposta antiga do Histórico. Os 60 testes anteriores continuam na
suíte. MockTimers emite o aviso experimental já conhecido do Node.

Não houve nova conferência visual nesta rodada: o controle do navegador retornou
indisponibilidade antes de acessar o preview. Não foi produzido screenshot novo
ou declarado teste visual aprovado. A compilação e os testes não substituem essa
conferência ou o armazenamento real em Android/iOS.

O audit automático da instalação reportou 27 ocorrências (1 baixa, 23 moderadas,
3 altas). Elas não foram atribuídas/corrigidas neste bloco; não foi aplicado
`audit fix --force` ou upgrade de SDK. Isto permanece uma pendência de dependências,
sem afirmar aprovação de segurança a partir dos testes funcionais.

## Entrega e limites

- Etapa 7: commit `af757c8`, serviços de persistência e refinamento do SecureStore.
- Etapa 8: integração do contexto, filtros e limpeza, testes e este relatório.
- Commits `feat` na branch individual; sem merge ou PR automático. O registro
  local e o histórico Git registram o hash final e a confirmação do push.
- M03 está implementado, com teste nativo/visual ainda a executar.
- M02 tem código e testes automatizados; comprovação nativa permanece pendente.
- As telas operacionais do conveniado, QR/câmera e os dados oficiais de
  saldo/renovação continuam com suas frentes. O cálculo local preexistente de
  renovação não foi homologado como resposta oficial da API.
- Banco local e refresh token são opcionais e não foram implementados.

Ver o [roteiro de validação em aparelho](validacao-persistencia-aparelho.md).
Este relatório apoia M02/M03 e RNF02/05/06/13; não representa aceite integral
dos requisitos ou da avaliação do professor.

Referências: [AsyncStorage no SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/)
e [Expo SecureStore](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/), além
das aulas 16–18 e da divisão de tarefas por integrante, página 1.
