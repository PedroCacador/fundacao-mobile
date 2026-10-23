# 📱 Fundação Mobile

Aplicativo mobile corporativo desenvolvido com **React Native**, **Expo** e **TypeScript**, estruturado sob a arquitetura **MVVM (Model-View-ViewModel)** com separação clara de responsabilidades, tipagem estrita e foco em estabilidade e escalabilidade.

---

## 🚀 Tecnologias e Versões

O projeto adota uma stack padronizada para o ecossistema Expo:

| Tecnologia             | Versão    | Função                                              |
| :--------------------- | :-------- | :-------------------------------------------------- |
| **Expo SDK**           | `~52.0.x` | Plataforma e runtime de desenvolvimento móvel       |
| **React**              | `18.3.1`  | Biblioteca de UI e gerenciamento de estado          |
| **React Native**       | `0.76.7`  | Framework móvel nativo                              |
| **TypeScript**         | `^5.3.3`  | Tipagem estática e segurança em tempo de compilação |
| **React Navigation**   | `^7.x`    | Navegação por Stack e Bottom Tabs                   |
| **React Native Paper** | `^5.13.x` | Biblioteca de componentes Material Design           |
| **Expo SecureStore**   | `~14.0.x` | Armazenamento criptografado de tokens de sessão     |

---

## 🏛 Arquitetura do Projeto

O código está organizado dentro da pasta `src/` seguindo o padrão **MVVM** e princípios de modularidade:

```text
fundacao-mobile/
├── assets/                  # Imagens, ícones e fontes estáticas
├── src/
│   ├── config/              # Configurações globais e resolução dinâmica de URL da API
│   │   └── api.ts
│   ├── context/             # Gerenciamento de estado global (ex: autenticação)
│   │   └── AuthContext.tsx
│   ├── models/              # Interfaces de dados, contratos TypeScript e mappers
│   │   ├── Auth.ts
│   │   ├── Benefit.ts
│   │   ├── User.ts
│   │   └── mapearUsuario.ts
│   ├── navigation/          # Rotas e navegadores (Stack & Bottom Tabs)
│   │   └── AppNavigator.tsx
│   ├── services/            # Comunicação HTTP, endpoints REST e persistência segura
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── benefitService.ts
│   │   └── tokenStorage.ts
│   ├── viewmodels/          # Camada de lógica de negócio e hooks reativos (MVVM)
│   │   ├── useAuthViewModel.ts
│   │   ├── useHomeViewModel.ts
│   │   ├── useProfileViewModel.ts
│   │   └── useQrCodeViewModel.ts
│   └── views/               # Telas e componentes visuais de apresentação
│       ├── auth/            # Login e autenticação
│       ├── history/         # Histórico de transações e atividades
│       ├── home/            # Painel principal
│       ├── locations/       # Unidades e locais de atendimento
│       ├── notifications/   # Central de notificações
│       ├── profile/         # Perfil, edição, dados do colaborador e configurações
│       ├── qrcode/          # Apresentação e leitura de QR Code
│       └── wallet/          # Carteira digital e saldos de benefícios
├── App.tsx                  # Ponto de entrada com Providers (Theme, Safe Area, Auth)
├── app.json                 # Configuração do Expo (plugins, slug, permissões)
├── index.ts                 # Registro de inicialização do Expo
├── package.json             # Dependências e scripts
└── tsconfig.json            # Configuração do compilador TypeScript
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18, 20 ou superior recomendada)
- **NPM** (versão 9+)
- Dispositivo móvel com o app **Expo Go** instalado (disponível na Google Play Store e Apple App Store) ou um emulador Android/iOS configurado.

---

## 📦 Instalação

1. Clone o repositório e navegue até a pasta do projeto:

```bash
cd fundacao-mobile
```

2. Instale as dependências:

```bash
npm install
```

---

## 🌐 Configuração da API

A URL da API é resolvida automaticamente pelo arquivo `src/config/api.ts`:

- **Dispositivo físico com Expo Go:** Detecta automaticamente o IP da sua máquina na mesma rede Wi-Fi na porta `3333`.
- **Emulador Android:** Utiliza `http://10.0.2.2:3333/api/v1`.
- **Navegador Web / Simulador iOS:** Utiliza `http://localhost:3333/api/v1`.

### Sobrescrevendo a URL manualmente (Opcional):

Crie um arquivo `.env` na raiz do projeto com:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3333/api/v1
```

---

## 🏃 Como Executar

### 1. Iniciar o servidor Expo (Metro Bundler)

```bash
npm start
```

ou:

```bash
npx expo start
```

### 2. Testar nos Ambientes:

- **📱 Celular Físico (Android ou iOS):**
  1. Conecte o celular na mesma rede Wi-Fi do computador.
  2. No Android: abra o aplicativo **Expo Go** e selecione **"Scan QR code"** para escanear o código gerado no terminal.
  3. No iPhone: abra a câmera do sistema e escaneie o QR code para abrir via **Expo Go**.

- **🤖 Emulador Android:**
  Com o emulador aberto, pressione a tecla `a` no terminal ou execute:

  ```bash
  npm run android
  ```

- **🍎 Simulador iOS (macOS):**
  Pressione a tecla `i` no terminal ou execute:

  ```bash
  npm run ios
  ```

- **💻 Navegador Web:**
  Pressione a tecla `w` no terminal ou execute:
  ```bash
  npm run web
  ```

---

## 🔍 Scripts Disponíveis

| Script    | Comando           | Descrição                                               |
| :-------- | :---------------- | :------------------------------------------------------ |
| `start`   | `npm start`       | Inicia o Metro Bundler interativo do Expo               |
| `android` | `npm run android` | Executa o app diretamente no emulador Android conectado |
| `ios`     | `npm run ios`     | Executa o app diretamente no simulador iOS              |
| `web`     | `npm run web`     | Roda a versão web no navegador                          |

---

## 🛡️ Boas Práticas Adotadas

- **Separação de Preocupações (SoC):** Views são responsáveis apenas pela apresentação; a lógica de negócio, chamadas assíncronas e tratativas de erro residem nos ViewModels.
- **Segurança de Sessão:** Tokens JWT e credenciais persistidas através do `expo-secure-store`, utilizando Keychain (iOS) e Keystore (Android).
- **Tipagem Estrita:** TypeScript configurado em modo estrito (`strict: true`), garantindo tipagem consistente de rotas, modelos e serviços.
- **Resolução de Rede Automática:** Conexão facilitada para testes locais entre computador e celular sem necessidade de alterar código-fonte a cada troca de IP.
