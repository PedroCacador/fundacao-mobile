import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { IconBox, NomeIcone } from '../common/Icon';
import type { SituacaoQr } from '../../models/QrCode';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { formatarContador } from '../../utils/qrcode';
const TAMANHO_QR = 180;
interface Aparencia {
    texto: string;
    icone: NomeIcone;
    cor: string;
    fundo: string;
}
function aparencia(situacao: SituacaoQr, restantes: number | null): Aparencia {
    switch (situacao) {
        case 'VALIDO':
            return {
                texto:
                    restantes === null ? 'Aguardando leitura' : `Expira em ${formatarContador(restantes)}`,
                icone: 'clock',
                cor: cores.primaria,
                fundo: cores.primariaClara,
            };
        case 'EXPIRADO':
            return {
                texto: 'QR Code expirado',
                icone: 'circle-alert',
                cor: cores.alerta,
                fundo: cores.alertaFundo,
            };
        case 'APROVADA':
            return {
                texto: 'Utilização aprovada',
                icone: 'circle-check',
                cor: cores.sucesso,
                fundo: cores.sucessoFundo,
            };
        case 'REPROVADA':
            return {
                texto: 'Utilização reprovada',
                icone: 'circle-x',
                cor: cores.erro,
                fundo: cores.erroFundo,
            };
        case 'ESTORNADA':
            return {
                texto: 'Utilização estornada',
                icone: 'circle-x',
                cor: cores.textoSecundario,
                fundo: cores.borda,
            };
    }
}
interface QrCodeCardProps {
    token: string;
    titulo: string;
    local: string;
    situacao: SituacaoQr;
    restantes: number | null;
}
export function QrCodeCard({ token, titulo, local, situacao, restantes }: QrCodeCardProps) {
    const visual = aparencia(situacao, restantes);
    const apagado = situacao !== 'VALIDO';
    return (
        <Card estilo={styles.card}>
            <View style={styles.topo}>
                <IconBox nome="scan-qr-code" tamanho={52} redondo />
                <View style={styles.textos}>
                    <Text style={styles.titulo}>Seu QR Code</Text>
                    <Text style={styles.subtitulo}>
                        Apresente este código no estabelecimento para validar seu benefício.
                    </Text>
                </View>
            </View>
            <View style={styles.moldura} accessible accessibilityLabel={`QR Code. ${visual.texto}`}>
                <View style={[styles.canto, styles.cantoTopoEsquerda]} />
                <View style={[styles.canto, styles.cantoTopoDireita]} />
                <View style={[styles.canto, styles.cantoBaseEsquerda]} />
                <View style={[styles.canto, styles.cantoBaseDireita]} />
                <View style={[styles.codigo, apagado && styles.apagado]}>
                    <QRCode
                        value={token}
                        size={TAMANHO_QR}
                        color={cores.texto}
                        backgroundColor={cores.branco}
                    />
                </View>
            </View>
            <View style={styles.situacao}>
                <Chip texto={visual.texto} icone={visual.icone} cor={visual.cor} fundo={visual.fundo} />
            </View>
            <View style={styles.resumo}>
                <Text style={styles.resumoTitulo} numberOfLines={1}>
                    {titulo}
                </Text>
                <Text style={styles.resumoLocal} numberOfLines={1}>
                    {local}
                </Text>
            </View>
        </Card>
    );
}
const CANTO = 26;
const styles = StyleSheet.create({
    card: {
        marginBottom: espaco.md,
        gap: espaco.lg,
    },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaco.md,
    },
    textos: {
        flex: 1,
    },
    titulo: {
        fontFamily: familia.titulo,
        fontSize: fonte.xl,
        color: cores.texto,
    },
    subtitulo: {
        marginTop: 2,
        fontFamily: familia.regular,
        fontSize: fonte.md,
        lineHeight: 18,
        color: cores.textoSecundario,
    },
    moldura: {
        alignSelf: 'center',
        padding: espaco.md,
    },
    codigo: {
        padding: espaco.md,
        borderRadius: raio.md,
        backgroundColor: cores.branco,
    },
    apagado: {
        opacity: 0.15,
    },
    canto: {
        position: 'absolute',
        width: CANTO,
        height: CANTO,
        borderColor: cores.primaria,
    },
    cantoTopoEsquerda: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: raio.md,
    },
    cantoTopoDireita: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderTopRightRadius: raio.md,
    },
    cantoBaseEsquerda: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderBottomLeftRadius: raio.md,
    },
    cantoBaseDireita: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomRightRadius: raio.md,
    },
    situacao: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resumo: {
        alignItems: 'center',
        paddingTop: espaco.md,
        borderTopWidth: 1,
        borderTopColor: cores.borda,
    },
    resumoTitulo: {
        fontFamily: familia.semi,
        fontSize: fonte.base,
        color: cores.texto,
    },
    resumoLocal: {
        marginTop: 2,
        fontFamily: familia.regular,
        fontSize: fonte.md,
        color: cores.textoSecundario,
    },
});