import { useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import {
  calcularProximaRenovacao,
  descreverLimite,
  descreverRenovacao,
  descreverValor,
} from '../utils/benefit';
import { diasAte, formatarData, plural } from '../utils/format';

export type AbaDetalhe = 'ONDE_USAR' | 'REGRAS' | 'QUANTIDADE' | 'ESTABELECIMENTOS';

export function useBenefitDetailsViewModel(beneficioId: number) {
  const { itens, carregando } = useCatalog();
  const [aba, setAba] = useState<AbaDetalhe>('ONDE_USAR');

  const item = useMemo(
    () => itens.find((atual) => atual.beneficio.id === beneficioId) ?? null,
    [itens, beneficioId],
  );

  const detalhes = useMemo(() => {
    if (!item) return null;
    const { beneficio, conveniados } = item;
    const renovacao = calcularProximaRenovacao(beneficio);
    const dias = renovacao ? diasAte(renovacao) : null;
    const categorias = Array.from(new Set(conveniados.map((c) => c.categoria)));

    return {
      valor: descreverValor(beneficio),
      limite: descreverLimite(beneficio),
      renovacao: renovacao ? formatarData(renovacao) : 'Após o último uso',
      emQuantosDias: dias !== null ? `em ${dias} ${plural(dias, 'dia', 'dias')}` : null,
      categorias,
      regras: [
        descreverValor(beneficio),
        `Até ${descreverLimite(beneficio)}`,
        descreverRenovacao(beneficio),
        'Válido apenas nos estabelecimentos conveniados deste benefício',
      ],
    };
  }, [item]);

  return { item, detalhes, aba, setAba, carregando };
}
