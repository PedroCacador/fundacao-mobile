import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { cores, espaco, fonte, peso, raio } from '../../theme';

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
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
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            style={[styles.aba, ativo && styles.abaAtiva]}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>
              {tab.count !== undefined ? `${tab.label} (${tab.count})` : tab.label}
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
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.sm,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaClara,
  },
  abaAtiva: {
    backgroundColor: cores.primaria,
  },
  texto: {
    fontSize: fonte.sm,
    fontWeight: peso.semi,
    color: cores.primaria,
  },
  textoAtivo: {
    color: cores.branco,
  },
});
