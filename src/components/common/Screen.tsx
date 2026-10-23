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
}

export function Screen({
  children,
  rolavel = true,
  bordas = ['top'],
  atualizando = false,
  aoAtualizar,
  estiloConteudo,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.tela} edges={bordas}>
      {rolavel ? (
        <ScrollView
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
  },
  conteudo: {
    padding: espaco.lg,
    paddingBottom: espaco.xxl,
  },
  fixo: {
    flex: 1,
  },
});
