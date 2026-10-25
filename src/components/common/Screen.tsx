import React from 'react';
import { RefreshControl, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { cores, espaco } from '../../theme';

interface ScreenProps {
  children: React.ReactNode;
  rolavel?: boolean;
  bordas?: Edge[];
  atualizando?: boolean;
  aoAtualizar?: () => void;
  estiloConteudo?: StyleProp<ViewStyle>;
  fundo?: React.ReactNode;
  refRolagem?: React.Ref<React.ComponentRef<typeof ScrollView>>;
}

export function Screen({
  children,
  rolavel = true,
  bordas = ['top'],
  atualizando = false,
  aoAtualizar,
  estiloConteudo,
  fundo,
  refRolagem,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.tela} edges={bordas}>
      {fundo}
      {rolavel ? (
        <ScrollView
          ref={refRolagem}
          contentContainerStyle={[styles.conteudo, estiloConteudo]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            aoAtualizar ? (
              <RefreshControl
                refreshing={atualizando}
                onRefresh={aoAtualizar}
                colors={[cores.primaria]}
                tintColor={cores.primaria}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.conteudo, styles.fixo, estiloConteudo]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    overflow: 'hidden',
  },
  conteudo: {
    paddingHorizontal: espaco.xl,
    paddingTop: espaco.md,
    paddingBottom: espaco.xxl,
  },
  fixo: {
    flex: 1,
  },
});
