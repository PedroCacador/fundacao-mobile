import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUsuario } from '../context/AuthContext';
import type { EmissaoQr, OpcaoQr, ParametrosQr } from '../models/QrCode';
import { ApiError } from '../services/api';
import { qrCodeService } from '../services/qrCodeService';
import {
    calcularPrazo,
    montarOpcoesQr,
    pedidoDoQr,
    segundosRestantes,
    situacaoDoQr,
} from '../utils/qrcode';
const INTERVALO_STATUS_MS = 5000;
const ROTA_INEXISTENTE = 'Rota não encontrada';
const EMISSAO_INDISPONIVEL =
    'A geração do QR Code ainda não está disponível no servidor. Tente novamente mais tarde.';
interface EstadoOpcoes {
    opcoes: OpcaoQr[];
    carregando: boolean;
    erro: string | null;
}
interface QrAtual {
    emissao: EmissaoQr;
    prazo: number | null;
}
function rotaInexistente(falha: unknown) {
    return falha instanceof ApiError && falha.status === 404 && falha.message === ROTA_INEXISTENTE;
}
function mensagemDe(falha: unknown, padrao: string) {
    if (rotaInexistente(falha)) return EMISSAO_INDISPONIVEL;
    return falha instanceof ApiError ? falha.message : padrao;
}
function chaveDosParametros(parametros?: ParametrosQr) {
    if (parametros?.beneficioId !== undefined) return `BENEFICIO-${parametros.beneficioId}`;
    if (parametros?.itemCampanhaId !== undefined) return `CAMPANHA-${parametros.itemCampanhaId}`;
    return null;
}
export function useQrCodeViewModel(parametros?: ParametrosQr) {
    const usuario = useUsuario();
    const [estadoOpcoes, setEstadoOpcoes] = useState<EstadoOpcoes>({
        opcoes: [],
        carregando: true,
        erro: null,
    });
    const [chave, setChave] = useState<string | null>(null);
    const [conveniadoId, setConveniadoId] = useState<number | null>(null);
    const [qr, setQr] = useState<QrAtual | null>(null);
    const [emitindo, setEmitindo] = useState(false);
    const [erroEmissao, setErroEmissao] = useState<string | null>(null);
    const [agora, setAgora] = useState(() => Date.now());
    const montado = useRef(false);
    const emissaoEmAndamento = useRef(false);
    const consultaEmAndamento = useRef(false);
    const consultaIndisponivel = useRef(false);
    const pedidoDaNavegacao = chaveDosParametros(parametros);
    const marcaDaNavegacao = pedidoDaNavegacao
        ? `${pedidoDaNavegacao}:${parametros?.conveniadoId ?? ''}`
        : null;
    const [navegacaoAplicada, setNavegacaoAplicada] = useState<string | null>(null);
    if (marcaDaNavegacao !== navegacaoAplicada) {
        setNavegacaoAplicada(marcaDaNavegacao);
        if (pedidoDaNavegacao) {
            setChave(pedidoDaNavegacao);
            setConveniadoId(parametros?.conveniadoId ?? null);
            setQr(null);
            setErroEmissao(null);
        }
    }
    const carregarOpcoes = useCallback(async () => {
        setEstadoOpcoes((anterior) => ({ ...anterior, carregando: true, erro: null }));
        try {
            const dados = await qrCodeService.listarDadosDasOpcoes();
            if (montado.current) {
                setEstadoOpcoes({ opcoes: montarOpcoesQr(dados), carregando: false, erro: null });
            }
        } catch (falha) {
            if (montado.current) {
                setEstadoOpcoes((anterior) => ({
                    ...anterior,
                    carregando: false,
                    erro: mensagemDe(falha, 'Não foi possível carregar seus benefícios.'),
                }));
            }
        }
    }, []);
    useEffect(() => {
        montado.current = true;
        void carregarOpcoes();
        return () => {
            montado.current = false;
        };
    }, [carregarOpcoes]);
    const opcao = estadoOpcoes.opcoes.find((item) => item.chave === chave) ?? null;
    const local = opcao
        ? (opcao.locais.find((item) => item.conveniado.id === conveniadoId) ??
            (opcao.locais.length === 1 ? opcao.locais[0] : null))
        : null;
    const escolherOpcao = useCallback((novaChave: string) => {
        setChave(novaChave);
        setConveniadoId(null);
        setQr(null);
        setErroEmissao(null);
    }, []);
    const escolherLocal = useCallback((id: number) => {
        setConveniadoId(id);
        setQr(null);
        setErroEmissao(null);
    }, []);
    const trocar = useCallback(() => {
        setQr(null);
        setErroEmissao(null);
    }, []);
    const emitir = useCallback(async () => {
        if (!opcao || !local || emissaoEmAndamento.current) return;
        emissaoEmAndamento.current = true;
        setEmitindo(true);
        setErroEmissao(null);
        try {
            const emissao = await qrCodeService.emitir(pedidoDoQr(opcao, local));
            const recebidoEm = Date.now();
            if (montado.current) {
                consultaIndisponivel.current = false;
                setQr({ emissao, prazo: calcularPrazo(emissao, recebidoEm) });
                setAgora(recebidoEm);
            }
        } catch (falha) {
            if (montado.current) setErroEmissao(mensagemDe(falha, 'Não foi possível gerar o QR Code.'));
        } finally {
            emissaoEmAndamento.current = false;
            if (montado.current) setEmitindo(false);
        }
    }, [opcao, local]);
    const idEmissao = qr?.emissao.id ?? null;
    const temPrazo = qr !== null && qr.prazo !== null;
    const restantes = segundosRestantes(qr?.prazo ?? null, agora);
    const situacao = qr ? situacaoDoQr(qr.emissao.status, restantes) : null;
    const aguardando = situacao === 'VALIDO';
    const consultarStatus = useCallback(async () => {
        if (idEmissao === null || consultaEmAndamento.current || consultaIndisponivel.current) return;
        consultaEmAndamento.current = true;
        try {
            const atual = await qrCodeService.consultar(idEmissao);
            if (montado.current) {
                setQr((anterior) =>
                    anterior && anterior.emissao.id === atual.id
                        ? { ...anterior, emissao: { ...anterior.emissao, status: atual.status } }
                        : anterior,
                );
            }
        } catch (falha) {
            if (rotaInexistente(falha)) consultaIndisponivel.current = true;
        } finally {
            consultaEmAndamento.current = false;
        }
    }, [idEmissao]);
    useFocusEffect(
        useCallback(() => {
            if (!aguardando) return undefined;
            setAgora(Date.now());
            const relogio = temPrazo ? setInterval(() => setAgora(Date.now()), 1000) : null;
            const status = setInterval(() => void consultarStatus(), INTERVALO_STATUS_MS);
            const assinatura = AppState.addEventListener('change', (estado) => {
                if (estado !== 'active') return;
                setAgora(Date.now());
                void consultarStatus();
            });
            return () => {
                if (relogio) clearInterval(relogio);
                clearInterval(status);
                assinatura.remove();
            };
        }, [aguardando, temPrazo, consultarStatus]),
    );
    return {
        nome: usuario.nome,
        cargo: usuario.colaborador?.cargo ?? 'Colaborador(a) da FCV',
        opcoes: estadoOpcoes.opcoes,
        carregandoOpcoes: estadoOpcoes.carregando,
        erroOpcoes: estadoOpcoes.erro,
        recarregarOpcoes: carregarOpcoes,
        opcao,
        local,
        escolherOpcao,
        escolherLocal,
        emissao: qr?.emissao ?? null,
        situacao,
        restantes,
        emitindo,
        erroEmissao,
        emitir,
        trocar,
    };
}
