export type StatusBeneficio = 'ATIVO' | 'INATIVO' | 'DESCONTINUADO';
export type TipoBeneficio = 'PERCENTUAL' | 'VALOR_FIXO';
export type TipoJanela = 'CALENDARIO_FIXO' | 'JANELA_MOVEL';
export type UnidadeCiclo = 'ANO' | 'MES' | 'SEMANA';
export type UnidadeIntervalo = 'DIA' | 'MES';
export type ReferenciaContagem = 'ULTIMA_UTILIZACAO' | 'DATA_ADMISSAO_COLABORADOR';

export interface Beneficio {
  id: number;
  nome: string;
  descricao: string | null;
  status: StatusBeneficio;
  tipo_beneficio: TipoBeneficio;
  valor: number;
  quantidade_maxima_utilizacoes: number;
  tipo_janela: TipoJanela;
  unidade_ciclo: UnidadeCiclo | null;
  dia_reset: string | null;
  intervalo_valor: number | null;
  intervalo_unidade: UnidadeIntervalo | null;
  referencia_contagem: ReferenciaContagem | null;
}

export interface Conveniado {
  id: number;
  usuario_id: number;
  nome_fantasia: string;
  razao_social: string;
  categoria: string;
  cnpj: string;
  endereco: string;
  status: 'ATIVO' | 'INATIVO' | 'EM_ANALISE';
}

export interface Oferta {
  id: number;
  beneficio_id: number;
  conveniado_id: number;
  status: 'ATIVO' | 'INATIVO';
}
