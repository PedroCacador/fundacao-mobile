import { Linking, Platform } from 'react-native';

export type TipoNavegador = 'google' | 'apple' | 'waze';

export interface UrlsNavegacao {
  google: string;
  apple: string;
  waze: string;
}

export function obterUrlsNavegacao(endereco: string): UrlsNavegacao {
  const enderecoCodificado = encodeURIComponent(endereco.trim());

  return {
    google: `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`,
    apple:
      Platform.OS === 'ios'
        ? `maps:0,0?q=${enderecoCodificado}`
        : `https://maps.apple.com/?q=${enderecoCodificado}`,
    waze: `https://waze.com/ul?q=${enderecoCodificado}&navigate=yes`,
  };
}

export async function abrirNavegador(tipo: TipoNavegador, endereco: string): Promise<boolean> {
  const urls = obterUrlsNavegacao(endereco);
  const urlAlvo = urls[tipo];

  try {
    const podeAbrir = await Linking.canOpenURL(urlAlvo).catch(() => false);
    if (podeAbrir) {
      await Linking.openURL(urlAlvo);
      return true;
    }

    // Fallback universal para Google Maps na web se aplicativo específico não responder
    const urlFallback = urls.google;
    await Linking.openURL(urlFallback);
    return true;
  } catch {
    return false;
  }
}
