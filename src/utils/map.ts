import { Linking, Platform } from 'react-native';

export type TipoNavegador = 'google' | 'apple' | 'waze';

const esquemaNavegador: Record<TipoNavegador, string> = {
  google: 'comgooglemaps://',
  apple: 'maps:',
  waze: 'waze://',
};

export async function obterNavegadoresDisponiveis(): Promise<TipoNavegador[]> {
  const verificacoes = await Promise.all(
    (Object.entries(esquemaNavegador) as [TipoNavegador, string][]).map(async ([tipo, esquema]) => {
      try {
        return (await Linking.canOpenURL(esquema)) ? tipo : null;
      } catch {
        return null;
      }
    }),
  );
  return verificacoes.filter((tipo): tipo is TipoNavegador => tipo !== null);
}

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

export async function abrirMapaPadrao(endereco: string): Promise<boolean> {
  const url = `geo:0,0?q=${encodeURIComponent(endereco.trim())}`;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
