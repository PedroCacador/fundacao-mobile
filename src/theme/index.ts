export const cores = {
  primaria: '#0C3A80',
  primariaClara: '#E8F0FB',
  texto: '#152755',
  textoSecundario: '#5C6B82',
  textoFraco: '#8C98AB',
  fundo: '#F6F8FC',
  superficie: '#FFFFFF',
  borda: '#E3E9F2',
  branco: '#FFFFFF',
  sucesso: '#1E8A55',
  sucessoFundo: '#E2F5EA',
  alerta: '#A86A12',
  alertaFundo: '#FDF2DC',
  erro: '#B3261E',
  erroFundo: '#FDECEA',
};

export const coresCategoria = {
  azul: { cor: '#2F66B3', fundo: '#E8F0FB' },
  roxo: { cor: '#7B4BC4', fundo: '#F1E9FC' },
  vermelho: { cor: '#D2574D', fundo: '#FDECEB' },
  verde: { cor: '#2E8B57', fundo: '#E5F5EC' },
  laranja: { cor: '#C77716', fundo: '#FFF3E0' },
  ciano: { cor: '#1F8296', fundo: '#E3F4F7' },
  cinza: { cor: '#5C6B82', fundo: '#EEF1F6' },
};

export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const raio = {
  sm: 8,
  md: 12,
  lg: 16,
  pilula: 999,
};

export const fonte = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export const peso = {
  regular: '400',
  medio: '500',
  semi: '600',
  negrito: '700',
} as const;

export const sombra = {
  card: {
    shadowColor: '#152755',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  destaque: {
    shadowColor: '#0C3A80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const tema = { cores, coresCategoria, espaco, raio, fonte, peso, sombra };
