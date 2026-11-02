# Validação em aparelho — M02/M03

Roteiro preparado em 02/11/2026. **Ainda não executado em Android/iOS.**
O ADB instalado não encontrou aparelho/emulador conectado. Não confundir este
roteiro com evidência de teste concluído.

## Preparação

1. API e banco do FCV em execução, sem recriar seeds ou apagar dados.
2. Expo Go compatível com SDK 58, em aparelho na mesma rede do computador.
3. URL da API acessível pelo celular. O ambiente local usa a API develop na porta 3334. Configure `EXPO_PUBLIC_API_URL=http://IP_DO_COMPUTADOR:3334/api/v1` se
   necessário; `localhost` no celular aponta para o próprio celular.
4. Iniciar o projeto com Expo e abrir o QR no aparelho. Não guardar segredo do
   backend em variável `EXPO_PUBLIC_`.

## Casos para registrar

1. **Login:** entrar com a conta colaborador de teste já existente. Conferir
   dados corretos do usuário. Não expor JWT em tela, relatório ou screenshot.
2. **Escolhas:** na Carteira selecionar um filtro diferente de Todos; no Histórico
   selecionar um período diferente de Últimos 3 meses. Confirmar as abas e listas.
3. **Reabertura:** fechar e reabrir o app sem sair da conta. Aguardar validação da
   sessão na API. Conferir usuário e filtros recuperados.
4. **Logout:** abrir o perfil, cancelar a saída e conferir que a conta permanece.
   Depois confirmar. Reabrir: deve continuar na entrada, sem acesso às telas privadas.
5. **Reentrada:** entrar novamente na mesma conta; filtros devem estar nos padrões,
   porque o logout os removeu.
6. **Outra conta/escopo:** sair e entrar com outra conta autorizada, incluindo o
   conveniado disponível. Não reutilizar dados privados ou filtros da conta anterior.
   O acesso inicial do conveniado é o perfil, até sua área operacional ser integrada.
7. **Rede indisponível:** após sessão válida, reabrir com a API temporariamente
   indisponível. Não liberar usuário privado antes de validar. Restaurar a conexão
   e usar Tentar de novo; não apagar o banco nem alterar o relógio para esse teste.
8. **Falhas/expiração:** os testes automatizados cobrem 401, leitura, gravação e
   remoção com erro. Quando houver um ambiente de teste nativo apropriado, repetir
   os casos sem editar credenciais reais ou dados de produção.

Registrar modelo/SO, versão do app, data, caso, resultado e evidência sem senhas
ou tokens. Falha de leitura/gravação/remoção deve ser informada, sem travamento
e sem declarar uma limpeza que não ocorreu.

No preview web o token usa o fallback de navegador; o resultado web não comprova
SecureStore nativo. Não é necessário instalar banco local ou implementar refresh
para executar os casos acima.
