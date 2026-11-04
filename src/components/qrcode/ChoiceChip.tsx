import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
interface ChoiceChipProps {
    titulo: string;
    detalhe?: string;
    escolhido: boolean;
    aoPressionar: () => void;
}
export function ChoiceChip({ titulo, detalhe, escolhido, aoPressionar }: ChoiceChipProps) {
    return (
        <Pressable
            onPress={aoPressionar}
            accessibilityRole="radio"
            accessibilityState={{ checked: escolhido }}
            style={({ pressed }) => [
                styles.chip,
                escolhido && styles.escolhido,
                pressed && styles.pressionado,
            ]}
        >
            <Text style={[styles.titulo, escolhido && styles.tituloEscolhido]} numberOfLines={1}>
                {titulo}
            </Text>
            {detalhe ? (
                <Text style={[styles.detalhe, escolhido && styles.detalheEscolhido]} numberOfLines={1}>
                    {detalhe}
                </Text>
            ) : null}
        </Pressable>
    );
}
const styles = StyleSheet.create({
    chip: {
        maxWidth: '100%',
        paddingHorizontal: espaco.md,
        paddingVertical: espaco.sm,
        borderRadius: raio.md,
        borderWidth: 1,
        borderColor: cores.bordaAzul,
        backgroundColor: cores.superficie,
    },
    escolhido: {
        borderColor: cores.primaria,
        backgroundColor: cores.primaria,
    },
    pressionado: {
        opacity: 0.8,
    },
    titulo: {
        fontFamily: familia.semi,
        fontSize: fonte.md,
        color: cores.texto,
    },
    tituloEscolhido: {
        color: cores.branco,
    },
    detalhe: {
        marginTop: 2,
        fontFamily: familia.regular,
        fontSize: fonte.xs,
        color: cores.textoSecundario,
    },
    detalheEscolhido: {
        color: cores.primariaClara,
    },
});
