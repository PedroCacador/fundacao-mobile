# FCV Mobile

App da Plataforma de Benefícios e Relacionamento da Fundação Cristiano Varella. Feito com React Native, Expo e TypeScript, na arquitetura MVVM. Os dados vêm da API do projeto ([fcv-backend](https://github.com/joaovictorcascardo/fcv-backend)).

## Rodar na máquina

1. Suba a API (veja o README do fcv-backend). Ela roda em `http://localhost:3333/api/v1`.
2. Instale as dependências:

```bash
npm install
```

3. Inicie o Expo:

```bash
npm start
```

4. Abra no celular com o Expo Go (mesma Wi-Fi do computador), ou aperte `w` para abrir no navegador.

O endereço da API é descoberto sozinho em `src/config/api.ts`: no celular usa o IP do computador que está rodando o Expo, no emulador Android usa `10.0.2.2` e no navegador usa `localhost`. Para forçar outro endereço, crie um `.env` na raiz:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:3333/api/v1
```

Se o celular não conectar, confira se o firewall do Windows libera a porta 3333.

## Telas

| Tela                 | O que mostra                                                                    |
| -------------------- | ------------------------------------------------------------------------------- |
| Login                | Entrada com e-mail e senha                                                      |
| Esqueci senha        | Pede o código pelo e-mail e cria uma nova senha                                 |
| Início               | Saudação, resumo, atalhos (inclusive QR Code) e campanhas vigentes              |
| Carteira             | Benefícios e itens de campanha: todos, disponíveis, utilizados e expirados      |
| Detalhe do benefício | Valor, limite, renovação e onde usar                                            |
| Locais               | Estabelecimentos conveniados, com busca e filtro por categoria                  |
| Histórico            | Utilizações paginadas, com filtro de período e de status                        |
| Notificações         | Avisos de renovação, utilização, benefícios e campanhas, com a fonte de cada um |
| Perfil               | Dados da conta e sair                                                           |

O código da recuperação de senha não volta mais na resposta da API. Enquanto ela não envia e-mail, o código aparece no terminal onde a API está rodando.

## Usuário de teste

A autenticação aceita colaboradores e conveniados ativos. No seed da API, use
`carla@fcv.org.br` ou `farmacia@parceiro.com`, ambos com senha `123456`. Contas FCV
usam o portal web. O conveniado tem acesso inicial ao perfil e à saída da conta;
suas telas operacionais ainda precisam ser integradas pelo responsável.

## Scripts

| Comando             | O que faz                            |
| ------------------- | ------------------------------------ |
| `npm start`         | Inicia o Expo                        |
| `npm run web`       | Abre no navegador                    |
| `npm run lint`      | Procura problemas no código (ESLint) |
| `npm run format`    | Formata o código (Prettier)          |
| `npm run typecheck` | Confere os tipos (TypeScript)        |

Rode `lint` e `typecheck` antes de cada commit.

Execute também `npm test` para validar serviços e providers de sessão. A suíte
usa Node 22, React DOM e jsdom, com transporte/armazenamento nativo simulados.
Ela não substitui a validação de SecureStore e navegação em Android/iOS.

O [relatório de contexto e autenticação](docs/sprint-5/relatorio-contexto-autenticacao.md)
documenta os estados de `useAuth()`, isolamento do catálogo, arquivos alterados,
testes realizados e pendências de integração.

A aba da Carteira e o período do Histórico usam AsyncStorage por conta/escopo.
Eles persistem quando o app é reaberto com a sessão válida e são removidos no
logout ou na troca de conta. O token nativo continua no SecureStore. Veja o [relatório de persistência](docs/sprint-5/relatorio-persistencia.md)
e o [roteiro de teste em aparelho](docs/sprint-5/validacao-persistencia-aparelho.md).

As regras das telas Início, Carteira, Histórico, Locais e Notificações, e o que
ainda depende da API, estão em [telas do colaborador](docs/sprint-5/telas-colaborador.md).

## Estrutura

```text
assets/              logo da FCV
src/
├── components/
│   ├── common/      componentes reaproveitados em todas as telas (Screen, Card, Button, SectionCard, Icone...)
│   ├── benefit/     componentes ligados a benefício (BenefitCard, BenefitHero, EstablishmentCard)
│   ├── campaign/    cards de campanha e de item de campanha (CampaignCard, CampaignItemCard)
│   ├── history/     card de utilização do Histórico (UtilizationCard)
│   ├── location/    card de estabelecimento da tela Locais (LocationCard)
│   └── notification/ card de notificação (NotificationCard)
├── config/          endereço da API
├── context/         estado global: sessão (AuthContext) e catálogo de benefícios (CatalogContext)
├── hooks/           hooks de interface reaproveitáveis (rolar até uma seção)
├── models/          tipos dos dados que vêm da API
├── navigation/      navegadores e tipos das rotas
├── services/        chamadas HTTP e armazenamento do token
├── theme/           cores, fontes, espaçamentos, raios e sombras
├── utils/           formatação de valores, datas e categorias
├── viewmodels/      lógica de cada tela (hooks)
└── views/           telas
```

Como as camadas conversam:

- **View** só desenha a tela e chama o ViewModel. Não tem regra nem dado fixo.
- **ViewModel** prepara o que a tela mostra, usando os contexts e os utils.
- **Context** guarda o que várias telas usam. O catálogo é buscado uma vez e compartilhado entre Início, Carteira e Detalhe.
- **Service** fala com a API. O token é colocado sozinho em toda requisição, e se a API responder 401 o app volta para o login.

## Padrões

- Cores, fontes e espaçamentos sempre do `src/theme`. Não use cor solta no `StyleSheet`.
- Texto usa `fontFamily: familia.x` (Poppins nos títulos, Inter no resto) e tamanho de `fonte`. Não use `fontWeight`: com fonte carregada ele não troca o peso no Android.
- Ícones sempre pelo componente `Icone` (Lucide). Para um ícone novo, acrescente o nome em `models/Icon.ts` e no mapa de `components/common/Icon.tsx`.
- O visual segue o protótipo (`MOBILE.pdf`). O que fica diferente é dado que a API ainda não tem.
- Antes de criar um componente, veja se já existe um em `components/common`.
- Todo dado mostrado vem da API. Se a API ainda não tem a informação, a tela não mostra nada no lugar dela.
- Rotas novas precisam ser registradas em `src/navigation/types.ts`.
- Commits no padrão `feat:`, `fix:`, `refactor:`, `style:`, `chore:` e `docs:`.
