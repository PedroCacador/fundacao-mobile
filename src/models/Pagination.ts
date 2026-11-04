export interface Paginacao {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

export interface RespostaPaginada<T> {
  dados: T[];
  paginacao: Paginacao;
}
