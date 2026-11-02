import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const CHAVE_TOKEN = 'fcv_token';
let fila: Promise<unknown> = Promise.resolve();

function executarEmOrdem<T>(operacao: () => Promise<T>): Promise<T> {
  const resultado = fila.then(operacao);
  fila = resultado.then(
    () => undefined,
    () => undefined,
  );
  return resultado;
}

function armazenamentoWeb(): Storage {
  if (typeof localStorage === 'undefined') {
    throw new Error('O armazenamento do navegador está indisponível.');
  }
  return localStorage;
}

export const tokenStorage = {
  obter(): Promise<string | null> {
    return executarEmOrdem(async () =>
      Platform.OS === 'web'
        ? armazenamentoWeb().getItem(CHAVE_TOKEN)
        : SecureStore.getItemAsync(CHAVE_TOKEN),
    );
  },

  salvar(token: string): Promise<void> {
    return executarEmOrdem(async () => {
      if (Platform.OS === 'web') {
        armazenamentoWeb().setItem(CHAVE_TOKEN, token);
      } else {
        await SecureStore.setItemAsync(CHAVE_TOKEN, token);
      }
    });
  },

  remover(): Promise<void> {
    return executarEmOrdem(async () => {
      if (Platform.OS === 'web') {
        armazenamentoWeb().removeItem(CHAVE_TOKEN);
      } else {
        await SecureStore.deleteItemAsync(CHAVE_TOKEN);
      }
    });
  },
};
