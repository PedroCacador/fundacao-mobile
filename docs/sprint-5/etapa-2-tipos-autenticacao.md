# Etapa 2 — Tipos de autenticação e vínculos

Data: 02/11/2026. Responsável: Samuel C., Grupo 3.

## Resultado

O modelo `UsuarioAutenticado` agora descreve o vínculo de conveniado que a API já
envia no login e em `/auth/eu`. A mudança reutiliza `Conveniado`, definido em
`src/models/Benefit.ts`, e mantém a arquitetura MVVM existente.

Esta é a etapa 2 do roteiro de implementação: tipos e contrato de autenticação.
Ela cobre a parte de tipos de M05 do PDF **FCV-Sprint5-Tarefas-por-Integrante**,
página 1. Não conclui M05 inteiro nem as demais tarefas de Samuel C.

## Arquivos alterados

### `src/models/Auth.ts`

- Importação de `Conveniado` com `import type`, sem código adicional em execução.
- Inclusão de `conveniado: Conveniado | null` em `UsuarioAutenticado`.
- Ajuste de `colaborador?: Colaborador | null` para `colaborador: Colaborador | null`.
  O campo é obrigatório na resposta atual da API; a ausência do vínculo é
  representada por `null`, não pela ausência da propriedade.
- Preservação dos demais campos de usuário, do modelo `Colaborador` e dos
  contratos `RespostaLogin` e `RespostaCodigo`.

Os campos de conveniado são os do modelo existente: `id`, `usuario_id`,
`nome_fantasia`, `razao_social`, `categoria`, `cnpj`, `endereco` e `status`.
Os estados continuam `ATIVO`, `INATIVO` e `EM_ANALISE`.

### `docs/sprint-5/etapa-2-tipos-autenticacao.md`

Este relatório registra escopo, decisões, validação e pendências da etapa junto
ao código, para consulta dos integrantes.

## Reutilização e arquitetura

Não foi criado um segundo tipo de conveniado ou um serviço paralelo de login.
O `authService` existente já usa `RespostaLogin` e `UsuarioAutenticado`, portanto
recebe a atualização dos tipos sem modificar endpoints ou repetir requisições.
O catálogo continua usando o mesmo `Conveniado`.

A mudança pertence à camada Model. Contexts e ViewModels continuam consumindo
os serviços; Views continuam responsáveis pela apresentação. Não foi necessário
criar componentes visuais para representar um contrato de dados.

Não houve alteração de dependências, estilos, telas, navegação, armazenamento ou
regras de negócio. O import de tipo é eliminado na compilação, sem nova consulta
à API ou nova rotina de renderização.

## Contrato conferido

Referência de código: backend `joaovictorcascardo/fcv-backend`, branch `develop`,
commit `f4cd1d441b3c9831140e3d763eab0d3c4e43ea04`.
Foram consultados `src/controllers/AuthController.ts` e `src/models/acessoModel.ts`.
O backend não foi modificado nesta etapa.

- `COLABORADOR`: `colaborador` contém o cadastro e `conveniado` é `null`.
- `CONVENIADO`: `conveniado` contém o cadastro e `colaborador` é `null`.
- `FCV`: a implementação do backend devolve ambos como `null`. Esse caso foi
  conferido no código; não houve login real de FCV nesta etapa.
- Os vínculos são anuláveis porque a API usa `registro ?? null`.
- Login e `/auth/eu` usam o mesmo modelo de usuário. Os tipos não alteram o JSON
  enviado pela API, nem removem campos adicionais que ela já devolve.

TypeScript descreve o contrato em compilação; não valida automaticamente um JSON
recebido em execução. Autorização e bloqueio de cadastros continuam no backend.

## Validações realizadas

- `npm run typecheck`: aprovado, sem erros.
- `npm run lint`: aprovado, sem erros ou avisos.
- Prettier nos arquivos alterados: aprovado.
- `git diff --check`: aprovado.
- API local de `develop`, em `http://127.0.0.1:3334/api/v1`: login e `/auth/eu`
  para COLABORADOR e CONVENIADO; quatro respostas HTTP 200.
- Conferência dos vínculos: registro do escopo correto, outro vínculo `null`,
  `usuario_id` correspondente e ausência do campo `senha` na raiz.
- Igualdade do usuário recebido pelo login e por `/auth/eu` em cada conta:
  aprovada.
- Compilação de quatro formas de resposta reais, anonimizadas, contra
  `RespostaLogin` e `UsuarioAutenticado`: aprovada. Valores cadastrais e token
  foram substituídos antes da gravação; os formatos e enums foram preservados.

Essas chamadas validaram o contrato da API. Não representam um teste de entrada
do conveniado pela interface: o `AuthContext` ainda permite somente colaborador.

Os logs e as evidências locais ficam fora do repositório, na pasta do workspace
`output/relatorios/mobile-etapa-2-2026-11-02`. O projeto não possui script `build`
ou suíte `test`; não foi declarado um build ou teste inexistente.

## Relação com os requisitos e próximos passos

Esta alteração prepara o suporte aos dois escopos e aos dados cadastrais
(RF02/RF05), mantendo o contrato JSON compartilhado (RNF15/RNF16).
Ela não comprova o atendimento integral desses requisitos.

Permanecem para as etapas seguintes de Samuel C.:

1. **M01:** permitir COLABORADOR/CONVENIADO na entrada e restauração da sessão,
   mantendo FCV no portal e coordenando a navegação com Heitor.
2. **M02:** refinar leitura, gravação e remoção no SecureStore, falhas, expiração
   e logout; validar em Android/iOS disponível.
3. **M03:** persistir preferências/filtros com AsyncStorage, isolados por
   usuário/escopo, sem token ou senha nesse armazenamento.
4. **M04:** revisar limpeza do catálogo e respostas tardias na troca de sessão,
   preservando as regras oficiais no backend.
5. **M05 restante:** revisar o cliente HTTP para 401/403, rede e troca de sessão,
   sem loops de autenticação ou refresh inexistente.

Banco local e refresh token continuam opcionais. QR, câmera, telas do conveniado
e ajustes visuais dos demais integrantes não foram implementados nesta etapa.

As sete recomendações de atualização de versões do Expo registradas na etapa 1
não foram alteradas nem reavaliadas aqui. Não houve teste nativo ou nova execução
da suíte completa do backend.

## Controle de versão

Trabalho na branch individual `feat/samuel-c-sessao-persistencia`, inicialmente
baseada em `885799254cb4902a827ac98b44d44c0a3ad669bb` de `origin/master`.
Esta etapa é registrada em um commit `feat` após as validações acima. Não inclui
push, PR ou integração em `master`, `main` ou `develop`.
