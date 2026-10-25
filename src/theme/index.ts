export const cores = {
  primaria: '#0C3A80',
  primariaClara: '#E6EEFA',
  primariaMedia: '#3F5E9A',
  primariaSuave: '#5B7DBF',
  primariaTraco: '#9DB6E3',
  texto: '#152755',
  textoSecundario: '#5F6E86',
  textoFraco: '#8D99AE',
  fundo: '#F6F8FC',
  superficie: '#FFFFFF',
  borda: '#E6ECF4',
  azulSuave: '#EEF4FC',
  bordaAzul: '#DCE6F5',
  bordaCampo: '#B9C7E0',
  decoracao: '#E9F0FA',
  branco: '#FFFFFF',
  sucesso: '#1F8A4C',
  sucessoFundo: '#DFF4E6',
  alerta: '#A86A12',
  alertaFundo: '#FDF2DC',
  erro: '#B3261E',
  erroFundo: '#FDECEA',
};

export const coresCategoria = {
  azul: { cor: '#2F66B3', fundo: '#E6EEFA' },
  roxo: { cor: '#7B4BC4', fundo: '#F0E8FC' },
  vermelho: { cor: '#E0524A', fundo: '#FDE9E8' },
  verde: { cor: '#2E8B57', fundo: '#E3F3E8' },
  laranja: { cor: '#E08A16', fundo: '#FFF1DC' },
  ciano: { cor: '#1F8296', fundo: '#E1F3F6' },
  cinza: { cor: '#5F6E86', fundo: '#EDF0F5' },
};

export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
};

export const raio = {
  sm: 8,
  md: 12,
  lg: 16,
  pilula: 999,
};

export const fonte = {
  xxs: 10,
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 16,
  xxl: 17,
  titulo: 21,
  tituloTela: 22,
  grande: 24,
  display: 30,
};

export const familia = {
  regular: 'Inter_400Regular',
  medio: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  negrito: 'Inter_700Bold',
  titulo: 'Poppins_600SemiBold',
  tituloMedio: 'Poppins_500Medium',
  tituloRegular: 'Poppins_400Regular',
};

export const sombra = {
  card: {
    shadowColor: '#152755',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  destaque: {
    shadowColor: '#0C3A80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
};

export const tema = { cores, coresCategoria, espaco, raio, fonte, familia, sombra };
