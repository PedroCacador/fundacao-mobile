import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Chip } from './Chip';
import { Icone } from './Icon';
import { TextField } from './TextField';

interface FiltroCategoriaProps {
  categoria: string | null;
  aoAbrir: () => void;
  aoLimpar: () => void;
}

interface SearchBarProps {
  value: string;
  onChangeText: (texto: string) => void;
  placeholder: string;
  filtroCategoria?: FiltroCategoriaProps;
}

export function SearchBar({ value, onChangeText, placeholder, filtroCategoria }: SearchBarProps) {
  const filtroAtivo = filtroCategoria?.categoria != null;

  return (
    <>
      <View style={styles.barra}>
        <View style={styles.campo}>
          <TextField
            icone="search"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            returnKeyType="search"
          />
        </View>

        {filtroCategoria ? (
          <Pressable
            style={[styles.botaoFiltro, filtroAtivo && styles.botaoFiltroAtivo]}
            onPress={filtroCategoria.aoAbrir}
            accessibilityRole="button"
            accessibilityLabel="Abrir filtro por categoria"
          >
            <Icone
              nome="filter"
              tamanho={22}
              cor={filtroAtivo ? cores.branco : cores.primaria}
            />
            {filtroAtivo ? <View style={styles.pontoFiltroAtivo} /> : null}
          </Pressable>
        ) : null}
      </View>

      {filtroCategoria?.categoria != null ? (
        <View style={styles.tagFiltroLinha}>
          <Text style={styles.tagFiltroTexto}>Filtrado por:</Text>
          <Chip
            texto={filtroCategoria.categoria}
            icone="tag"
            cor={cores.primaria}
            fundo={cores.primariaClara}
          />
          <Pressable onPress={filtroCategoria.aoLimpar} hitSlop={8} style={styles.botaoLimparTag}>
            <Icone nome="x" tamanho={16} cor={cores.textoSecundario} />
          </Pressable>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    marginBottom: espaco.md,
  },
  campo: {
    flex: 1,
  },
  botaoFiltro: {
    width: 56,
    height: 56,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  botaoFiltroAtivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  pontoFiltroAtivo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.branco,
  },
  tagFiltroLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    marginBottom: espaco.md,
  },
  tagFiltroTexto: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
  botaoLimparTag: {
    padding: 2,
  },
});
