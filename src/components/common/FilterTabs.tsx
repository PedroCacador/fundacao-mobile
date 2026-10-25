import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { Icone, NomeIcone } from './Icon';

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  icone?: NomeIcone;
}

interface FilterTabsProps<T extends string = string> {
  tabs: TabOption<T>[];
  selectedTab: T;
  onSelectTab: (tabId: T) => void;
}

export function FilterTabs<T extends string = string>({
  tabs,
  selectedTab,
  onSelectTab,
}: FilterTabsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.linha}
      style={styles.rolagem}
    >
      {tabs.map((tab) => {
        const ativo = tab.id === selectedTab;
        const cor = ativo ? cores.branco : cores.texto;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            style={[styles.aba, ativo && styles.abaAtiva]}
          >
            {tab.icone ? <Icone nome={tab.icone} tamanho={16} cor={cor} /> : null}
            <Text style={[styles.texto, { color: cor }, ativo && styles.textoAtivo]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rolagem: {
    flexGrow: 0,
    marginBottom: espaco.lg,
  },
  linha: {
    gap: espaco.sm,
  },
  aba: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: espaco.xl,
    height: 36,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaClara,
  },
  abaAtiva: {
    backgroundColor: cores.primaria,
  },
  texto: {
    fontFamily: familia.medio,
    fontSize: fonte.sm,
  },
  textoAtivo: {
    fontFamily: familia.semi,
  },
});
