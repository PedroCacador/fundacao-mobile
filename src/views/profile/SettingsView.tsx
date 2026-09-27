import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

export default function SettingsView() {
  const { settingsOptions } = useProfileViewModel();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {settingsOptions.map((option, index) => (
        <View key={index} style={styles.fieldRow}>
          <MaterialCommunityIcons name={option.icon as any} size={20} color="#3A5A8C" style={styles.fieldIcon} />
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>{option.label}</Text>
          </View>
          <Text style={styles.fieldValue}>{option.value}</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#C0C8D1" style={styles.chevron} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldIcon: {
    marginRight: 14,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 15,
    color: '#1B2A4A',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 13,
    color: '#8E99A4',
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 8,
  },
});
