import { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import { Campanha, ItemCampanha, OfertaCampanha } from '../models/Campaign';
import { EmissaoQr, ResgateQr } from '../models/QrCode';
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
    emitir(beneficioId: number) {
        return requisitar<EmissaoQr>('/resgates', {
            metodo: 'POST',
            corpo: { beneficio_id: beneficioId },
        });
    },
    consultar(id: number) {
        return requisitar<ResgateQr>(`/resgates/${id}`);
    },
};