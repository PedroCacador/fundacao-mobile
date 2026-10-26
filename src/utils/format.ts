export function formatarData(data: Date) {
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function lerData(texto: string) {
  const [ano, mes, dia] = texto.slice(0, 10).split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function formatarHora(texto: string) {
  return texto.slice(11, 16);
}

export function dataParaApi(data: Date) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return telefone;
}

export function diasAte(data: Date, hoje = new Date()) {
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((data.getTime() - inicio.getTime()) / 86400000);
}

export function plural(quantidade: number, singular: string, pluralTexto: string) {
  return quantidade === 1 ? singular : pluralTexto;
}
