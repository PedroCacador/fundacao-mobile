import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, NomeIcone } from './Icon';

interface TextFieldProps extends TextInputProps {
  icone: NomeIcone;
  senha?: boolean;
}

export function TextField({ icone, senha = false, style, ...props }: TextFieldProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={styles.campo}>
      <Icone nome={icone} tamanho={22} cor={cores.texto} espessura={1.5} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={cores.textoSecundario}
        secureTextEntry={senha && !visivel}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {senha ? (
        <Pressable
          onPress={() => setVisivel(!visivel)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={visivel ? 'Esconder senha' : 'Mostrar senha'}
        >
          <Icone
            nome={visivel ? 'eye-off' : 'eye'}
            tamanho={22}
            cor={cores.texto}
            espessura={1.5}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    borderRadius: raio.md,
    paddingHorizontal: espaco.lg,
    minHeight: 56,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: familia.regular,
    fontSize: fonte.xl,
    color: cores.texto,
    paddingVertical: espaco.md,
  },
});
