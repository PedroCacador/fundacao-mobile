import { NomeIcone } from '../models/Icon';
import { coresCategoria } from '../theme';

export interface EstiloCategoria {
  icone: NomeIcone;
  cor: string;
  fundo: string;
}

const regras: { padrao: RegExp; icone: NomeIcone; tom: keyof typeof coresCategoria }[] = [
  { padrao: /farmac|drogaria|medicamento/, icone: 'pill', tom: 'azul' },
  { padrao: /academ|fitness|muscula/, icone: 'dumbbell', tom: 'roxo' },
  { padrao: /otica|oculos|visao/, icone: 'glasses', tom: 'ciano' },
  { padrao: /aliment|restaurante|refeic|padaria/, icone: 'utensils', tom: 'vermelho' },
  { padrao: /saude|bem.?estar|clinica|odonto/, icone: 'heart-pulse', tom: 'roxo' },
  { padrao: /cultura|lazer|cinema|teatro/, icone: 'gift', tom: 'verde' },
  { padrao: /educa|curso|escola/, icone: 'graduation-cap', tom: 'azul' },
  { padrao: /transporte|mobilidade|combustivel/, icone: 'bus', tom: 'laranja' },
];

export function estiloCategoria(categoria: string): EstiloCategoria {
  const normalizada = categoria.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const regra = regras.find((item) => item.padrao.test(normalizada));
  if (!regra) {
    return { icone: 'tag', ...coresCategoria.cinza };
  }
  return { icone: regra.icone, ...coresCategoria[regra.tom] };
}
