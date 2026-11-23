import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { UserGreeting } from '../../components/common/UserGreeting';
import { ChoiceChip } from '../../components/qrcode/ChoiceChip';
import { QrCodeCard } from '../../components/qrcode/QrCodeCard';
import { QrTips } from '../../components/qrcode/QrTips';
import { EstablishmentCard } from '../../components/benefit/EstablishmentCard';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';

import { useQrCodeViewModel } from '../../viewmodels/useQrCodeViewModel';
type QrCodeViewProps = RootScreenProps<'GerarQrCode'>;
export default function QrCodeView({ navigation, route }: QrCodeViewProps) {
    const {

        nome,
        cargo,
        opcoes,
        carregandoOpcoes,
        erroOpcoes,
        recarregarOpcoes,
        opcao,
        local,
        escolherOpcao,
        emissao,
        situacao,
        restantes,
        emitindo,
        erroEmissao,
        emitir,
        consultarStatus,
        trocar,
    } = useQrCodeViewModel(route.params);
    const opcoesExibidas =
        route.params?.solicitarAposConfirmacao && route.params.beneficioId !== undefined
            ? opcoes.filter((item) => item.chave === `BENEFICIO-${route.params?.beneficioId}`)
            : opcoes;
    const decidido = situacao === 'APROVADA' || situacao === 'REPROVADA' || situacao === 'ESTORNADA';
    const confirmarEmissao = () => {
        if (route.params?.solicitarAposConfirmacao) {
            void emitir();
            return;
        }
        if (!opcao) return;
        Alert.alert(
            'Confirmar uso do benefício',
            `Deseja solicitar "${opcao.nome}"? O QR Code será gerado após a confirmação.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => void emitir() },
            ],
        );
    };
    return (
        <Screen>
            <PageHeader titulo="QR Code" subtitulo="Apresente no estabelecimento" />
            <UserGreeting nome={nome} cargo={cargo} tamanhoFoto={64} />
            {emissao && situacao ? (
                <>
                    <QrCodeCard
                        id={emissao.id}
                        token={emissao.token_qrcode}
                        codigoValidacao={emissao.codigo_validacao}
                        titulo={opcao?.nome ?? 'Benefício solicitado'}
                        local={local?.conveniado.nome_fantasia}
                        situacao={situacao}
                        restantes={restantes}
                    />
                    <QrTips />
                    {erroEmissao ? <ErrorMessage mensagem={erroEmissao} /> : null}
                    <View style={styles.acoes}>
                        {decidido ? (
                            <Button titulo="Gerar outro QR Code" icone="scan-qr-code" aoPressionar={trocar} />
                        ) : (
                            <Button
                                titulo="Atualizar status"
                                icone="refresh-cw"
                                aoPressionar={() => void consultarStatus()}
                                carregando={emitindo}
                            />
                        )}
                        {decidido ? null : (
                            <Button titulo="Trocar benefício" variante="secundaria" aoPressionar={trocar} />
                        )}
                    </View>
                </>
            ) : carregandoOpcoes ? (
                <Loading texto="Carregando seus benefícios..." />
            ) : erroOpcoes ? (
                <ErrorMessage mensagem={erroOpcoes} aoTentarDeNovo={recarregarOpcoes} />
            ) : opcoesExibidas.length === 0 ? (
                <EmptyState
                    icone="ticket"
                    titulo={
                        route.params?.solicitarAposConfirmacao
                            ? 'Benefício indisponível'
                            : 'Nenhum benefício para usar agora'
                    }
                    texto={
                        route.params?.solicitarAposConfirmacao
                            ? 'Este benefício não está mais disponível para solicitação.'
                            : 'Quando houver benefícios ativos em estabelecimentos, eles aparecem aqui.'
                    }
                />
            ) : (
                <>
                    <Card estilo={styles.passo}>
                        <Text style={styles.passoTitulo}>1. Escolha o benefício</Text>
                        <View style={styles.opcoes}>
                            {opcoesExibidas.map((item) => (
                                <ChoiceChip
                                    key={item.chave}
                                    titulo={item.nome}
                                    detalhe={item.detalhe}
                                    escolhido={item.chave === opcao?.chave}
                                    aoPressionar={() => escolherOpcao(item.chave)}
                                />
                            ))}
                        </View>
                    </Card>
                    {opcao ? (
                        <Card estilo={styles.passo}>
                            <Text style={styles.passoTitulo}>2. Locais onde pode ser usado</Text>
                            <View style={styles.locais}>
                                {opcao.locais.map((item) => (
                                    <EstablishmentCard
                                        key={item.ofertaId}
                                        conveniado={item.conveniado}
                                        aoPressionar={() =>
                                            navigation.navigate('LocationDetails', {
                                                conveniadoId: item.conveniado.id,
                                            })
                                        }
                                    />
                                ))}
                            </View>
                        </Card>
                    ) : null}
                    {erroEmissao ? <ErrorMessage mensagem={erroEmissao} /> : null}
                    <View style={styles.acoes}>
                        <Button
                            titulo="Solicitar uso e gerar QR Code"
                            icone="scan-qr-code"
                            aoPressionar={confirmarEmissao}
                            carregando={emitindo}
                            desabilitado={!opcao}
                        />
                    </View>
                </>
            )}
        </Screen>
    );
}
const styles = StyleSheet.create({
    passo: {
        marginBottom: espaco.md,
        gap: espaco.md,
    },
    passoTitulo: {
        fontFamily: familia.titulo,
        fontSize: fonte.lg,
        color: cores.texto,
    },
    opcoes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: espaco.sm,
    },
    locais: {
        gap: espaco.sm,
    },
    acoes: {
        marginTop: espaco.md,
        gap: espaco.md,
    },
});
