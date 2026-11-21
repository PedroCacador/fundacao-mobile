export function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function contemTexto(texto: string | null | undefined, termoNormalizado: string) {
  return normalizarTexto(texto ?? '').includes(termoNormalizado);
}
