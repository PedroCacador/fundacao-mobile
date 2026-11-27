import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { estiloCategoria } from '../../utils/category';
import { Button } from './Button';
import { IconBox } from './Icon';

export const TODAS_CATEGORIAS = 'TODAS';

interface CategoryFilterModalProps {
  aberto: boolean;
  categorias: string[];
  categoriaSelecionada: string;
  aoFiltrar: (categoria: string) => void;
  aoLimpar: () => void;
  aoVoltar: () => void;
}

interface ModalContentProps {
  categorias: string[];
  categoriaSelecionada: string;
  aoFiltrar: (categoria: string) => void;
  aoLimpar: () => void;
  aoVoltar: () => void;
}

function ModalContent({
  categorias,
  categoriaSelecionada,
  aoFiltrar,
  aoLimpar,
  aoVoltar,
}: ModalContentProps) {
  const [selecionada, setSelecionada] = useState(categoriaSelecionada);

  const handleFiltrar = () => {
    aoFiltrar(selecionada);
  };

  const handleLimpar = () => {
    setSelecionada(TODAS_CATEGORIAS);
    aoLimpar();
  };

  const handleVoltar = () => {
    aoVoltar();
  };

  return (
    <View style={styles.cartao} accessibilityViewIsModal accessibilityLabel="Filtrar por Categoria">
      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoIcone}>
          <IconBox nome="filter" tamanho={40} cor={cores.primaria} fundo={cores.primariaClara} />
        </View>
        <View style={styles.cabecalhoTextos}>
          <Text accessibilityRole="header" style={styles.titulo}>
            Filtrar por Categoria
          </Text>
          <Text style={styles.subtitulo}>
            Selecione o tipo de estabelecimento que deseja encontrar.
          </Text>
        </View>
      </View>

      <ScrollView style={styles.listaRolagem} contentContainerStyle={styles.listaContainer}>
        <Pressable
          style={[styles.opcaoItem, selecionada === TODAS_CATEGORIAS && styles.opcaoItemAtivo]}
          onPress={() => setSelecionada(TODAS_CATEGORIAS)}
        >
          <View style={styles.opcaoEsquerda}>
            <IconBox
              nome="store"
              tamanho={36}
              cor={selecionada === TODAS_CATEGORIAS ? cores.primaria : cores.textoSecundario}
              fundo={selecionada === TODAS_CATEGORIAS ? cores.primariaClara : cores.azulSuave}
            />
            <Text
              style={[
                styles.opcaoTexto,
                selecionada === TODAS_CATEGORIAS && styles.opcaoTextoAtivo,
              ]}
            >
              Todas as categorias
            </Text>
          </View>

          <View
            style={[
              styles.circuloSelecao,
              selecionada === TODAS_CATEGORIAS && styles.circuloSelecaoAtivo,
            ]}
          >
            {selecionada === TODAS_CATEGORIAS && <View style={styles.pontoSelecao} />}
          </View>
        </Pressable>

        {categorias.map((cat) => {
          const estilo = estiloCategoria(cat);
          const ativo = selecionada === cat;
          return (
            <Pressable
              key={cat}
              style={[styles.opcaoItem, ativo && styles.opcaoItemAtivo]}
              onPress={() => setSelecionada(cat)}
            >
              <View style={styles.opcaoEsquerda}>
                <IconBox nome={estilo.icone} tamanho={36} cor={estilo.cor} fundo={estilo.fundo} />
                <Text style={[styles.opcaoTexto, ativo && styles.opcaoTextoAtivo]}>{cat}</Text>
              </View>

              <View style={[styles.circuloSelecao, ativo && styles.circuloSelecaoAtivo]}>
                {ativo && <View style={styles.pontoSelecao} />}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.rodape}>
        <Button titulo="Filtrar" variante="primaria" aoPressionar={handleFiltrar} />

        <View style={styles.botoesSecundarios}>
          <Button
            titulo="Limpar"
            variante="secundaria"
            aoPressionar={handleLimpar}
            estilo={styles.botaoMeio}
          />
          <Button
            titulo="Voltar"
            variante="secundaria"
            aoPressionar={handleVoltar}
            estilo={styles.botaoMeio}
          />
        </View>
      </View>
    </View>
  );
}

export function CategoryFilterModal({
  aberto,
  categorias,
  categoriaSelecionada,
  aoFiltrar,
  aoLimpar,
  aoVoltar,
}: CategoryFilterModalProps) {
  return (
    <Modal visible={aberto} transparent animationType="fade" onRequestClose={aoVoltar}>
      <View style={styles.fundo}>
        {aberto ? (
          <ModalContent
            key={`${aberto}:${categoriaSelecionada}`}
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
            aoFiltrar={aoFiltrar}
            aoLimpar={aoLimpar}
            aoVoltar={aoVoltar}
          />
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espaco.lg,
    backgroundColor: cores.sobreposicao,
  },
  cartao: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '85%',
    padding: espaco.xl,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
    gap: espaco.md,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
  },
  cabecalhoIcone: {
    flexShrink: 0,
  },
  cabecalhoTextos: {
    flex: 1,
  },
  titulo: {
    fontFamily: familia.titulo,
    fontSize: fonte.lg,
    color: cores.texto,
  },
  subtitulo: {
    fontFamily: familia.regular,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  listaRolagem: {
    maxHeight: 280,
    marginVertical: espaco.xs,
  },
  listaContainer: {
    gap: espaco.sm,
    paddingVertical: 2,
  },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: espaco.sm,
    paddingHorizontal: espaco.md,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  opcaoItemAtivo: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaClara,
  },
  opcaoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    flex: 1,
  },
  opcaoTexto: {
    fontFamily: familia.medio,
    fontSize: fonte.sm,
    color: cores.texto,
  },
  opcaoTextoAtivo: {
    fontFamily: familia.semi,
    color: cores.primaria,
  },
  circuloSelecao: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: cores.bordaCampo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloSelecaoAtivo: {
    borderColor: cores.primaria,
  },
  pontoSelecao: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: cores.primaria,
  },
  rodape: {
    gap: espaco.sm,
    marginTop: espaco.xs,
  },
  botoesSecundarios: {
    flexDirection: 'row',
    gap: espaco.sm,
  },
  botaoMeio: {
    flex: 1,
  },
});
