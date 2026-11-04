import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconBox, NomeIcone } from '../common/Icon';
import { cores, espaco, familia, fonte, raio } from '../../theme';
const dicas: { icone: NomeIcone; titulo: string; texto: string }[] = [
    { icone: 'user', titulo: 'Identificação', texto: 'O código mostra quem você é.' },
    { icone: 'shield-check', titulo: 'Validação', texto: 'O estabelecimento aprova o uso.' },
    { icone: 'info', titulo: 'Dica', texto: 'Tela visível e com boa luz.' },
];
export function QrTips() {
    return (
        <View style={styles.faixa}>
            {dicas.map((dica, indice) => (
                <View key={dica.titulo} style={[styles.coluna, indice > 0 && styles.divisoria]}>
                    <IconBox nome={dica.icone} tamanho={36} redondo fundo={cores.superficie} />
                    <Text style={styles.titulo}>{dica.titulo}</Text>
                    <Text style={styles.texto}>{dica.texto}</Text>
                </View>
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    faixa: {
        flexDirection: 'row',
        backgroundColor: cores.azulSuave,
        borderRadius: raio.lg,
        paddingVertical: espaco.md,
        marginBottom: espaco.lg,
    },
    coluna: {
        flex: 1,
        paddingHorizontal: espaco.sm,
        gap: espaco.xs,
    },
    divisoria: {
        borderLeftWidth: 1,
        borderLeftColor: cores.bordaAzul,
    },
    titulo: {
        marginTop: espaco.xs,
        fontFamily: familia.semi,
        fontSize: fonte.sm,
        color: cores.texto,
    },
    texto: {
        fontFamily: familia.regular,
        fontSize: fonte.xs,
        lineHeight: 15,
        color: cores.textoSecundario,
    },
});