import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

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
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const ativo = tab.id === selectedTab;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onSelectTab(tab.id)}
              style={[styles.tab, ativo && styles.tabAtiva]}
            >
              <Text style={[styles.texto, ativo && styles.textoAtivo]}>{tab.label}</Text>
              {tab.count !== undefined ? (
                <View style={[styles.contador, ativo && styles.contadorAtivo]}>
                  <Text style={[styles.contadorTexto, ativo && styles.contadorTextoAtivo]}>
                    {tab.count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabAtiva: {
    backgroundColor: '#1B2A4A',
  },
  texto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  textoAtivo: {
    color: '#FFFFFF',
  },
  contador: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  contadorAtivo: {
    backgroundColor: '#2E416B',
  },
  contadorTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  contadorTextoAtivo: {
    color: '#FFFFFF',
  },
});
