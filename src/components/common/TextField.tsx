import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, espaco, fonte, raio } from '../../theme';
import { NomeIcone } from './Icon';

interface TextFieldProps extends TextInputProps {
  icone: NomeIcone;
  senha?: boolean;
}

export function TextField({ icone, senha = false, style, ...props }: TextFieldProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={styles.campo}>
      <MaterialCommunityIcons name={icone} size={22} color={cores.textoFraco} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={cores.textoFraco}
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
          <MaterialCommunityIcons
            name={visivel ? 'eye-outline' : 'eye-off-outline'}
            size={22}
            color={cores.textoFraco}
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
    borderColor: cores.borda,
    borderRadius: raio.md,
    paddingHorizontal: espaco.lg,
    minHeight: 54,
  },
  input: {
    flex: 1,
    fontSize: fonte.md,
    color: cores.texto,
    paddingVertical: espaco.md,
  },
});
