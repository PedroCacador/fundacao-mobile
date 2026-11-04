# Telas do colaborador (M15 a M19)

Thales · Grupo 3 · Sprint 5.

## O que foi entregue

| Tela         | O que mudou                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Início       | Atalho para o QR Code e seção "Campanhas e eventos" com os itens de cada campanha vigente e o botão Resgatar      |
| Carteira     | Abas Todos, Disponíveis, Utilizados e Expirados, com benefícios e itens de campanha                               |
| Detalhe      | Próxima renovação só aparece para benefício de calendário fixo                                                    |
| Histórico    | Cabeçalho padrão, filtro de período e de status, total e paginação vindos da API                                  |
| Locais       | Cabeçalho padrão e abas comuns, busca por nome, endereço ou categoria                                             |
| Notificações | Abas Todas, Renovação, Utilização, Benefícios e Campanhas, com a fonte de cada aviso e estados vazio/indisponível |

Componentes novos: `Pagination` e `SectionHeader` (em `components/common`), `CampaignCard` e
`CampaignItemCard` (em `components/campaign`). A aparência dos status de utilização fica em
`utils/utilization.ts` e as regras de campanha em `utils/campaign.ts`, com testes em
`tests/campaign.test.cjs`.

## De onde vem cada dado

| Dado                       | Fonte na API                                                             |
| -------------------------- | ------------------------------------------------------------------------ |
| Histórico, total e páginas | `GET /eu/utilizacoes?pagina&limite&de&status` → `{ dados, paginacao }`   |
| Aba Utilizados da Carteira | `GET /eu/utilizacoes?status=APROVADA` (ESTORNADA não conta)              |
| Campanhas e itens          | `GET /campanhas`, `/itens-campanha`, `/ofertas-campanha`, `/conveniados` |
| Próxima renovação          | Calculada de `tipo_janela`, `unidade_ciclo` e `dia_reset` do benefício   |

Regras de campanha:

- **Vigente**: campanha `ATIVA` com `data_inicio` até hoje e `data_fim` de hoje em diante, item `ATIVO`.
- **Expirada**: campanha `ENCERRADA`, ou `ATIVA` com `data_fim` já passada.
- Planejada, cancelada ou que ainda não começou não aparece.
- O botão Resgatar só aparece em item vigente com estabelecimento ativo e abre `GerarQrCode` com `itemCampanhaId`.

"Expirado" é a situação do item de campanha. Não existe status de utilização "Expirado".

## Avisos das notificações

| Aba        | Fonte mostrada no card                 | Regra                                                             |
| ---------- | -------------------------------------- | ----------------------------------------------------------------- |
| Renovação  | regra de renovação do benefício        | Benefício disponível de calendário fixo que renova em até 30 dias |
| Utilização | seu histórico de utilizações           | Até 20 utilizações dos últimos 30 dias, com o status de cada uma  |
| Benefícios | status do benefício / estabelecimentos | Benefício inativo ou ativo sem estabelecimento ativo              |
| Campanhas  | campanhas e eventos da FCV             | Campanhas vigentes                                                |

Se uma fonte falha, só os avisos dela ficam indisponíveis e aparece o botão "Tentar de novo".
Não há notificação push.

## Pendências

- **Saldo de utilizações (RF07)**: a API não informa quantas utilizações restam. A tela não mostra saldo.
- **Próxima renovação de janela móvel (RF08)**: depende do último uso/admissão e a API não devolve a data. A tela esconde.
- **Aviso de "novo benefício" do protótipo**: a API não tem data de criação do benefício.
- **Persistir a aba da Carteira**: exige atualizar `filtrosCarteira` em `models/Preferences.ts` (Samuel C.).
- **Gerar QR (`POST /eu/utilizacoes`)**: ainda não existe na develop (ver [QR Code e navegação](qrcode-e-navegacao.md)).
