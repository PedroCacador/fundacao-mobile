# Etapa 7 — Serviços de preferências e SecureStore

Samuel C. · Grupo 3 · 02/11/2026 · M02/M03.

## Alterações

- AsyncStorage 2.2.0 instalado com `expo install`, conforme
  `expo/bundledNativeModules.json` do SDK 58, com lockfile.
- `models/Preferences.ts`: enums e padrões dos filtros já existentes na Carteira
  e Histórico. O modelo não admite token, senha, cadastro ou histórico completo.
- `storageService.ts`: leitura, normalização, gravação e limpeza. As chaves
  incluem versão, escopo e id da conta. Um marcador guarda apenas id/escopo para
  localizar os dados a limpar; não valida ou restaura uma sessão autenticada.
- A gravação é construída explicitamente com os dois enums. Campos extras de um
  objeto em execução não são serializados. JSON inválido é normalizado.
- Mudança de conta limpa os filtros da conta anterior. Logout remove seus dados
  e depois o marcador, permitindo repetir uma remoção com falha. Sem marcador
  válido, a recuperação limita a limpeza às nossas chaves conhecidas de filtros;
  nunca chama `AsyncStorage.clear()`.
- Gravações verificam o proprietário dentro da fila; uma escrita atrasada de uma
  conta encerrada não pode recriar preferências ou sobrescrever a conta atual.
- `utils/asyncQueue.ts`: fila reaproveitada por preferências e credencial, com
  instâncias independentes e propagação de falhas.
- `tokenStorage.ts`: continua usando SecureStore nativo. No iOS, a gravação usa
  `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, sem adicionar biometria ou mudar a chave
  existente. O fallback web continua específico do preview.

## Validação

TypeScript e lint aprovados; 72 testes passaram, zero falhas. São os 60 casos
anteriores, 11 do serviço de preferências e um da opção nativa do token.
Formatação e diff foram conferidos antes do commit.

Os testes cobrem reabertura, conta/escopo distintos, limpeza seletiva, campos
proibidos, dados corrompidos, falhas, escrita lenta seguida de logout e tentativas
de escrita depois da limpeza. AsyncStorage/SecureStore são simulados nos testes.

O ADB instalado foi consultado: nenhum aparelho ou emulador conectado. A
configuração nativa não foi declarada validada em hardware. Ainda não há uso das
preferências pelas telas neste commit; a etapa 8 integra Context, ViewModels e
limpeza de autenticação, reaproveitando os filtros da interface.

A instalação fez um audit automático: 27 ocorrências reportadas (1 baixa, 23
moderadas, 3 altas), sem atribuição feita nesta etapa a um pacote específico.
Não foi executado `audit fix` ou atualização forçada do SDK. Testes funcionais
aprovados não equivalem a uma auditoria de segurança aprovada.

Referências: [AsyncStorage no SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/)
e [Expo SecureStore](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/).
