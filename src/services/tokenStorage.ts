import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const CHAVE_TOKEN = 'fcv_token';

/** No celular o token fica no armazenamento seguro; na web usa localStorage. */
export const tokenStorage = {
  async obter(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(CHAVE_TOKEN) : null;
    }
    return SecureStore.getItemAsync(CHAVE_TOKEN);
  },

  async salvar(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(CHAVE_TOKEN, token);
      return;
    }
    await SecureStore.setItemAsync(CHAVE_TOKEN, token);
  },

  async remover(): Promise<void> {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(CHAVE_TOKEN);
      return;
    }
    await SecureStore.deleteItemAsync(CHAVE_TOKEN);
  },
};
