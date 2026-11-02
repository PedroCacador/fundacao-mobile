import type { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import type { BeneficioCatalogo } from '../models/Catalog';

export function montarCatalogo(
  beneficios: Beneficio[],
  ofertas: Oferta[],
  conveniados: Conveniado[],
): BeneficioCatalogo[] {
  const conveniadosAtivos = new Map(
    conveniados
      .filter((conveniado) => conveniado.status === 'ATIVO')
      .map((conveniado) => [conveniado.id, conveniado]),
  );
  const locaisPorBeneficio = new Map<number, Map<number, Conveniado>>();
  for (const oferta of ofertas) {
    const conveniado = conveniadosAtivos.get(oferta.conveniado_id);
    if (oferta.status !== 'ATIVO' || !conveniado) continue;
    let locais = locaisPorBeneficio.get(oferta.beneficio_id);
    if (!locais) {
      locais = new Map();
      locaisPorBeneficio.set(oferta.beneficio_id, locais);
    }
    locais.set(conveniado.id, conveniado);
  }

  return beneficios
    .filter((beneficio) => beneficio.status !== 'DESCONTINUADO')
    .map((beneficio) => {
      const locais = [...(locaisPorBeneficio.get(beneficio.id)?.values() ?? [])];
      return {
        beneficio,
        conveniados: locais,
        categoria: locais[0]?.categoria ?? 'Outros',
        // Oferta ativa no catálogo não comprova saldo ou elegibilidade para resgate.
        disponivel: beneficio.status === 'ATIVO' && locais.length > 0,
      };
    });
}
