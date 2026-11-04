# QR Code e navegação (M06 a M09)
Heitor · Grupo 3 · Sprint 5.
## O que foi entregue
- Aba **QR Code** no meio da barra do colaborador (Início, Carteira, QR Code, Histórico, Perfil), como no protótipo.
- Rota de pilha `GerarQrCode`, usada quando o QR é aberto por cima do Detalhe ou da Carteira. Voltar devolve para a tela de origem.
- `QrCodeView` + `useQrCodeViewModel`: escolher benefício ou item de campanha, escolher o estabelecimento, gerar, ver validade e
status.
- Componentes `ChoiceChip`, `QrCodeCard` e `QrTips` em `components/qrcode`.
- Regras puras em `utils/qrcode.ts` com testes em `tests/qrcode.test.cjs`.
- Ícones novos: `scan-qr-code`, `refresh-cw`, `shield-check`, `circle-x`.
## Como abrir o QR a partir de outra tela
| De onde | Chamada |
| -------------------- | ---------------------------------------------------------------------- |
| Início (atalho) | `navigation.navigate('Main', { screen: 'QrCode' })` |
| Detalhe do benefício | `navigation.navigate('GerarQrCode', { beneficioId, conveniadoId })` |
| Carteira | `navigation.navigate('GerarQrCode', { beneficioId })` |
| Campanha | `navigation.navigate('GerarQrCode', { itemCampanhaId, conveniadoId })` |
Todos os parâmetros são opcionais. Se o benefício tem um só estabelecimento, ele já vem escolhido.
Caminho mais curto: aba QR Code, benefício, Gerar (3 toques).
## Contrato que o app espera da API (pendente com o Grupo 1)
| Chamada | Corpo | Resposta
|
| ------------------------- | --------------------------------------------------------------------------------- | --------------
----------------------------------------------------------- |
| `POST /eu/utilizacoes` | `{ "beneficio_conveniado_id": 1 }` ou `{ "beneficio_campanha_conveniado_id": 1 }` | `201` com
`id`, `token_qrcode`, `status`, `data_solicitacao`, `expira_em` |
| `GET /eu/utilizacoes/:id` | | o mesmo
formato, com o `status` atual |
- O prazo vem da API (`expira_em`). O app não fixa 60 segundos. Sem `expira_em`, a tela mostra "Aguardando leitura" sem
contador.
- O contador usa a duração `expira_em - data_solicitacao` a partir da hora em que o QR chegou, então o relógio do celular não
interfere.
- Saldo, vigência e elegibilidade são da API: qualquer erro dela aparece na tela com a mensagem que ela mandar.
- Recarregar pede um QR novo. Invalidar o anterior é responsabilidade da API.
Hoje as duas rotas **não existem** na develop. A tela mostra "A geração do QR Code ainda não está disponível no servidor" e não
inventa um QR local.
## Testado
- `npm run typecheck`, `npm run lint`, `npm test`.
- Navegador (Expo web) contra uma cópia da API com as duas rotas acima: gerar, contador, expirar, recarregar, aprovado e
reprovado (atualizam sozinhos a cada 5 s), erro da API, rota inexistente, toque duplo (gera um só), entrada pela aba e pela
pilha, voltar.
## Falta testar no celular
- Voltar do segundo plano: o contador se ajusta e o status é consultado de novo.
- Sair da tela: contador e consultas param (a aba continua montada, por isso foi usado `useFocusEffect`).
## Área do conveniado
Quando a frente do Samuel S. entregar o `PartnerNavigator`, trocar no `AppNavigator.tsx` a linha
`<Stack.Screen name="PartnerProfile" component={ProfileView} />` pela área nova.
