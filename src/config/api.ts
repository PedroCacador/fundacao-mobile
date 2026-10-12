import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORTA_API = 3333;

/**
 * Descobre o endereço da API:
 * 1. EXPO_PUBLIC_API_URL, se definida (ex.: EXPO_PUBLIC_API_URL=http://192.168.0.10:3333/api/v1)
 * 2. O mesmo IP do computador que serve o Expo (funciona no celular com Expo Go)
 * 3. 10.0.2.2 no emulador Android / localhost nos demais casos
 */
function resolverUrlBase(): string {
  const definida = process.env.EXPO_PUBLIC_API_URL;
  if (definida) {
    return definida.replace(/\/$/, '');
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const ip = hostUri?.split(':')[0];
  if (Platform.OS !== 'web' && ip) {
    return `http://${ip}:${PORTA_API}/api/v1`;
  }

  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${PORTA_API}/api/v1`;
}

export const API_URL = resolverUrlBase();
export const TEMPO_LIMITE_MS = 10000;
