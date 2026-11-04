import { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import { Campanha, ItemCampanha, OfertaCampanha } from '../models/Campaign';
import { EmissaoQr, PedidoQr } from '../models/QrCode';
import { DadosOpcoesQr } from '../utils/qrcode';
import { requisitar } from './api';
export const qrCodeService = {
    async listarDadosDasOpcoes(): Promise<DadosOpcoesQr> {
        const [beneficios, ofertas, conveniados, campanhas, itens, ofertasCampanha] = await Promise.all(
            [
                requisitar<Beneficio[]>('/beneficios'),
                requisitar<Oferta[]>('/ofertas'),
                requisitar<Conveniado[]>('/conveniados'),
                requisitar<Campanha[]>('/campanhas'),
                requisitar<ItemCampanha[]>('/itens-campanha'),
                requisitar<OfertaCampanha[]>('/ofertas-campanha'),
            ],
        );
        return { beneficios, ofertas, conveniados, campanhas, itens, ofertasCampanha };
    },
    emitir(pedido: PedidoQr) {
        return requisitar<EmissaoQr>('/eu/utilizacoes', { metodo: 'POST', corpo: pedido });
    },
    consultar(id: number) {
        return requisitar<EmissaoQr>(`/eu/utilizacoes/${id}`);
    },
};