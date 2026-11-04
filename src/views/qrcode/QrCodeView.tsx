import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Screen } from '../../components/common/Screen';
import { EmptyState, ErrorMessage, Loading } from '../../components/common/StateMessage';
import { UserGreeting } from '../../components/common/UserGreeting';
import { ChoiceChip } from '../../components/qrcode/ChoiceChip';
import { QrCodeCard } from '../../components/qrcode/QrCodeCard';
import { QrTips } from '../../components/qrcode/QrTips';
import { RootScreenProps, TabScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';

import { useQrCodeViewModel } from '../../viewmodels/useQrCodeViewModel';
type QrCodeViewProps = TabScreenProps<'QrCode'> | RootScreenProps<'GerarQrCode'>;
export default function QrCodeView({ route }: QrCodeViewProps) {
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
        escolherLocal,
        emissao,
        situacao,
        restantes,
        emitindo,
        erroEmissao,
        emitir,
        trocar,
    } = useQrCodeViewModel(route.params);
    const decidido = situacao === 'APROVADA' || situacao === 'REPROVADA' || situacao === 'ESTORNADA';
    return (
        <Screen>
            <PageHeader titulo="QR Code" subtitulo="Apresente no estabelecimento" />
            <UserGreeting nome={nome} cargo={cargo} tamanhoFoto={64} />
            {emissao && situacao && opcao && local ? (
                <>
                    <QrCodeCard
                        id={emissao.id}
                        token={emissao.token_qrcode}
                        titulo={opcao.nome}
                        local={local.conveniado.nome_fantasia}
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
                                titulo="Recarregar QR Code"
                                icone="refresh-cw"
                                aoPressionar={emitir}
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
            ) : opcoes.length === 0 ? (
                <EmptyState
                    icone="ticket"
                    titulo="Nenhum benefício para usar agora"
                    texto="Quando houver benefícios ativos em estabelecimentos, eles aparecem aqui."
                />
            ) : (
                <>
                    <Card estilo={styles.passo}>
                        <Text style={styles.passoTitulo}>1. Escolha o benefício</Text>
                        <View style={styles.opcoes}>
                            {opcoes.map((item) => (
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
                            <Text style={styles.passoTitulo}>2. Escolha o estabelecimento</Text>
                            <View style={styles.opcoes}>
                                {opcao.locais.map((item) => (
                                    <ChoiceChip
                                        key={item.ofertaId}
                                        titulo={item.conveniado.nome_fantasia}
                                        detalhe={item.conveniado.categoria}
                                        escolhido={item.conveniado.id === local?.conveniado.id}
                                        aoPressionar={() => escolherLocal(item.conveniado.id)}
                                    />
                                ))}
                            </View>
                        </Card>
                    ) : null}
                    {erroEmissao ? <ErrorMessage mensagem={erroEmissao} /> : null}
                    <View style={styles.acoes}>
                        <Button
                            titulo="Gerar QR Code"
                            icone="scan-qr-code"
                            aoPressionar={emitir}
                            carregando={emitindo}
                            desabilitado={!local}
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
    acoes: {
        marginTop: espaco.md,
        gap: espaco.md,
    },
});
