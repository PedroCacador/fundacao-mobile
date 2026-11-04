# Etapa 6 — Confirmação de saída reutilizável

Samuel C. · Grupo 3 · 02/11/2026 · RF04 e integração de M01/M02.

A confirmação antiga com `window.confirm` bloqueou o controle do preview durante
o teste. Foi substituída por `ConfirmationModal`, usando Modal do React Native,
tema e Button existentes. O componente recebe conteúdo e ações por propriedades;
não conhece o AuthContext, não guarda token e pode ser reutilizado.

`useProfileViewModel` controla abertura, cancelamento e confirmação.
`ProfileView` apenas apresenta o componente e chama essas ações. Confirmar chama
o mesmo logout central, inclusive seu tratamento de falhas de remoção; cancelar
preserva a sessão. Não existe uma segunda implementação de autenticação.

O tema recebeu apenas o token de cor `sobreposicao`. README e relatório geral
foram atualizados para descrever o acesso dos dois escopos e como rodar os testes.

## Validação final

- Typecheck, lint e formatação aprovados; lint sem avisos.
- `npm test`: 60 testes aprovados e zero falhas; três casos novos verificam o
  ViewModel dos perfis e os caminhos de cancelar/confirmar saída.
- `expo export --platform web`: aprovado; artefatos fora do repositório.
- Preview com API real de develop: login do conveniado, perfil, restauração ao
  recarregar, cancelar saída, confirmar saída e reabrir permanecendo no login.
- Senha incorreta: mensagem real da API, sem liberar sessão.
- Troca para colaborador: login, catálogo real, perfil com matrícula/cargo/setor,
  restauração e saída; após recarregar continuou no login.

A confirmação final foi exercitada por teclado no navegador; os testes de
armazenamento nativo continuam simulados. Não declarar aprovação em aparelho,
teste por toque nativo, de todos os requisitos ou de toda a sprint.

Screenshots e logs da conferência ficam na pasta local do workspace
`output/relatorios/mobile-contexto-autenticacao-2026-11-02`.
