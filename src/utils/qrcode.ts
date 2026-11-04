import type { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import type { Campanha, ItemCampanha, OfertaCampanha } from '../models/Campaign';
import type { EmissaoQr, LocalQr, OpcaoQr, PedidoQr, SituacaoQr } from '../models/QrCode';
import type { StatusUtilizacao } from '../models/Utilization';
import { descreverValor } from './benefit';
export interface DadosOpcoesQr {
    beneficios: Beneficio[];
    ofertas: Oferta[];
    conveniados: Conveniado[];
    campanhas: Campanha[];
    itens: ItemCampanha[];
    ofertasCampanha: OfertaCampanha[];
}
type OfertaComLocal = { id: number; conveniado_id: number; status: 'ATIVO' | 'INATIVO' };
function locaisDasOfertas(ofertas: OfertaComLocal[], ativos: Map<number, Conveniado>): LocalQr[] {
    return ofertas
        .flatMap((oferta) => {
            const conveniado = ativos.get(oferta.conveniado_id);
            return oferta.status === 'ATIVO' && conveniado ? [{ ofertaId: oferta.id, conveniado }] : [];
        })
        .sort((a, b) => a.conveniado.nome_fantasia.localeCompare(b.conveniado.nome_fantasia));
}
export function montarOpcoesQr(dados: DadosOpcoesQr): OpcaoQr[] {
    const ativos = new Map(
        dados.conveniados
            .filter((conveniado) => conveniado.status === 'ATIVO')
            .map((conveniado) => [conveniado.id, conveniado]),
    );
    const campanhasAtivas = new Map(
        dados.campanhas
            .filter((campanha) => campanha.status === 'ATIVA')
            .map((campanha) => [campanha.id, campanha]),
    );
    const deBeneficios: OpcaoQr[] = dados.beneficios
        .filter((beneficio) => beneficio.status === 'ATIVO')
        .map((beneficio) => ({
            chave: `BENEFICIO-${beneficio.id}`,
            origem: 'BENEFICIO',
            id: beneficio.id,
            nome: beneficio.nome,
            detalhe: descreverValor(beneficio),
            locais: locaisDasOfertas(
                dados.ofertas.filter((oferta) => oferta.beneficio_id === beneficio.id),
                ativos,
            ),
        }));
    const deCampanhas: OpcaoQr[] = dados.itens.flatMap((item) => {
        const campanha = campanhasAtivas.get(item.campanha_id);
        if (!campanha || item.status !== 'ATIVO') return [];
        return [
            {
                chave: `CAMPANHA-${item.id}`,
                origem: 'CAMPANHA',
                id: item.id,
                nome: item.nome,
                detalhe: `${descreverValor(item)} · ${campanha.nome}`,
                locais: locaisDasOfertas(
                    dados.ofertasCampanha.filter((oferta) => oferta.beneficio_campanha_id === item.id),
                    ativos,
                ),
            },
        ];
    });
    return [...deBeneficios, ...deCampanhas].filter((opcao) => opcao.locais.length > 0);
}
export function pedidoDoQr(opcao: OpcaoQr, local: LocalQr): PedidoQr {
    return opcao.origem === 'BENEFICIO'
        ? { beneficio_conveniado_id: local.ofertaId }
        : { beneficio_campanha_conveniado_id: local.ofertaId };
}
export function lerDataHoraApi(texto: string) {
    return new Date(texto.includes('T') ? texto : texto.replace(' ', 'T')).getTime();
}
export function calcularPrazo(emissao: EmissaoQr, recebidoEm: number): number | null {
    if (!emissao.expira_em) return null;
    const duracao = lerDataHoraApi(emissao.expira_em) - lerDataHoraApi(emissao.data_solicitacao);
    return Number.isFinite(duracao) ? recebidoEm + Math.max(0, duracao) : null;
}
export function segundosRestantes(prazo: number | null, agora: number): number | null {
    if (prazo === null) return null;
    return Math.max(0, Math.ceil((prazo - agora) / 1000));
}
export function formatarContador(segundos: number) {
    const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
    const resto = String(segundos % 60).padStart(2, '0');
    return `${minutos}:${resto}`;
}
export function situacaoDoQr(status: StatusUtilizacao, restantes: number | null): SituacaoQr {
    if (status !== 'PENDENTE') return status;
    return restantes === 0 ? 'EXPIRADO' : 'VALIDO';
}
