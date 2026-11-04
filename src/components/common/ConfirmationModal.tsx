import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Button } from './Button';

interface ConfirmationModalProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}

export function ConfirmationModal({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  aoConfirmar,
  aoCancelar,
}: ConfirmationModalProps) {
  return (
    <Modal visible={aberto} transparent animationType="fade" onRequestClose={aoCancelar}>
      <View style={styles.fundo}>
        <View style={styles.cartao} accessibilityViewIsModal accessibilityLabel={titulo}>
          <Text accessibilityRole="header" style={styles.titulo}>
            {titulo}
          </Text>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <Button titulo="Cancelar" variante="secundaria" aoPressionar={aoCancelar} />
          <Button titulo={textoConfirmar} variante="perigo" aoPressionar={aoConfirmar} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaco.xl,
    backgroundColor: cores.sobreposicao,
  },
  cartao: {
    width: '100%',
    maxWidth: 420,
    padding: espaco.xl,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
    gap: espaco.lg,
  },
  titulo: { fontFamily: familia.semi, fontSize: fonte.titulo, color: cores.texto },
  mensagem: {
    fontFamily: familia.regular,
    fontSize: fonte.base,
    lineHeight: 22,
    color: cores.textoSecundario,
  },
});
