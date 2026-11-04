import type { Conveniado } from './Benefit';
import type { StatusUtilizacao } from './Utilization';
export type OrigemQr = 'BENEFICIO' | 'CAMPANHA';
export interface LocalQr {
    ofertaId: number;
    conveniado: Conveniado;
}
export interface OpcaoQr {
    chave: string;
    origem: OrigemQr;
    id: number;
    nome: string;
    detalhe: string;
    locais: LocalQr[];
}
export type PedidoQr =
    { beneficio_conveniado_id: number } | { beneficio_campanha_conveniado_id: number };
export interface EmissaoQr {
    id: number;
    token_qrcode: string;
    status: StatusUtilizacao;
    data_solicitacao: string;
    expira_em?: string | null;
}
export type SituacaoQr = 'VALIDO' | 'EXPIRADO' | Exclude<StatusUtilizacao, 'PENDENTE'>;
export interface ParametrosQr {
    beneficioId?: number;
    itemCampanhaId?: number;
    conveniadoId?: number;
}
