import { useCallback, useRef } from 'react';
import { ScrollView } from 'react-native';
import { espaco } from '../theme';

export function useScrollToSection<T extends string>(secaoInicial?: T) {
  const refRolagem = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const posicoes = useRef<Partial<Record<T, number>>>({});
  const pendente = useRef<T | undefined>(secaoInicial);

  const rolar = useCallback((y: number, animado: boolean) => {
    refRolagem.current?.scrollTo({ y: Math.max(0, y - espaco.md), animated: animado });
  }, []);

  const posicionar = useCallback(
    (id: T, y: number) => {
      posicoes.current[id] = y;
      if (pendente.current === id) {
        pendente.current = undefined;
        rolar(y, false);
      }
    },
    [rolar],
  );

  const rolarPara = useCallback(
    (id: T) => {
      const y = posicoes.current[id];
      if (y !== undefined) rolar(y, true);
    },
    [rolar],
  );

  return { refRolagem, posicionar, rolarPara };
}
