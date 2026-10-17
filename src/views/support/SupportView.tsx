import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSupportViewModel } from '../../viewmodels/useSupportViewModel';
import { FaqCategory } from '../../models/Support';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORIES: { label: string; value: FaqCategory | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Benefícios', value: 'beneficios' },
  { label: 'Cartão/QR', value: 'cartao' },
  { label: 'Reembolso', value: 'reembolso' },
  { label: 'Segurança', value: 'seguranca' },
  { label: 'Geral', value: 'geral' },
];

export default function SupportView() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contato' | 'chamado'>('faq');
  const vm = useSupportViewModel();

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    vm.toggleExpand(id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Abas superiores */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'faq' && styles.tabButtonActive]}
          onPress={() => setActiveTab('faq')}
        >
          <MaterialCommunityIcons
            name="frequently-asked-questions"
            size={18}
            color={activeTab === 'faq' ? '#1B2A4A' : '#8E99A4'}
          />
          <Text style={[styles.tabText, activeTab === 'faq' && styles.tabTextActive]}>FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'contato' && styles.tabButtonActive]}
          onPress={() => setActiveTab('contato')}
        >
          <MaterialCommunityIcons
            name="headset"
            size={18}
            color={activeTab === 'contato' ? '#1B2A4A' : '#8E99A4'}
          />
          <Text style={[styles.tabText, activeTab === 'contato' && styles.tabTextActive]}>Canais</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chamado' && styles.tabButtonActive]}
          onPress={() => setActiveTab('chamado')}
        >
          <MaterialCommunityIcons
            name="message-plus-outline"
            size={18}
            color={activeTab === 'chamado' ? '#1B2A4A' : '#8E99A4'}
          />
          <Text style={[styles.tabText, activeTab === 'chamado' && styles.tabTextActive]}>Abrir Chamado</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ABA 1: FAQ */}
        {activeTab === 'faq' && (
          <View>
            {/* Campo de Busca */}
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons name="magnify" size={20} color="#8E99A4" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar dúvida ou palavra-chave..."
                placeholderTextColor="#8E99A4"
                value={vm.searchQuery}
                onChangeText={vm.setSearchQuery}
              />
              {vm.searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => vm.setSearchQuery('')}>
                  <MaterialCommunityIcons name="close-circle" size={18} color="#8E99A4" />
                </TouchableOpacity>
              )}
            </View>

            {/* Categorias */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryChip,
                    vm.selectedCategory === cat.value && styles.categoryChipActive,
                  ]}
                  onPress={() => vm.setSelectedCategory(cat.value)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      vm.selectedCategory === cat.value && styles.categoryTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Lista Accordion */}
            <View style={styles.faqList}>
              {vm.faqs.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="help-circle-outline" size={48} color="#BDC3C7" />
                  <Text style={styles.emptyText}>Nenhuma dúvida encontrada para sua busca.</Text>
                </View>
              ) : (
                vm.faqs.map((faq) => {
                  const isExpanded = vm.expandedFaqId === faq.id;
                  return (
                    <View key={faq.id} style={styles.faqCard}>
                      <TouchableOpacity
                        style={styles.faqHeader}
                        onPress={() => handleToggle(faq.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                        <MaterialCommunityIcons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={24}
                          color="#1B2A4A"
                        />
                      </TouchableOpacity>
                      {isExpanded && (
                        <View style={styles.faqBody}>
                          <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          </View>
        )}

        {/* ABA 2: CANAIS DE ATENDIMENTO */}
        {activeTab === 'contato' && (
          <View style={styles.contactsContainer}>
            <Text style={styles.sectionTitle}>Como prefere falar com a gente?</Text>
            <Text style={styles.sectionSubtitle}>
              Nossa equipe de suporte está pronta para ajudar com dúvidas, cartão ou solicitações.
            </Text>

            {vm.contacts.map((contact, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.contactCard}
                onPress={() => vm.handleOpenContact(contact)}
                disabled={!contact.value}
                activeOpacity={0.7}
              >
                <View style={styles.contactIconCircle}>
                  <MaterialCommunityIcons name={contact.icon as any} size={26} color="#1B2A4A" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{contact.title}</Text>
                  <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
                </View>
                {contact.value ? (
                  <MaterialCommunityIcons name="open-in-new" size={20} color="#8E99A4" />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ABA 3: ABRIR CHAMADO */}
        {activeTab === 'chamado' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Envie uma mensagem para a Fundação</Text>
            <Text style={styles.sectionSubtitle}>
              Abra uma solicitação formal diretamente com nosso time interno de Recursos Humanos.
            </Text>

            <Text style={styles.inputLabel}>Categoria</Text>
            <View style={styles.categoryPickerRow}>
              {(['geral', 'beneficios', 'cartao', 'reembolso'] as FaqCategory[]).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.formCategoryBadge,
                    vm.ticketCategory === cat && styles.formCategoryBadgeActive,
                  ]}
                  onPress={() => vm.setTicketCategory(cat)}
                >
                  <Text
                    style={[
                      styles.formCategoryText,
                      vm.ticketCategory === cat && styles.formCategoryTextActive,
                    ]}
                  >
                    {cat.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Assunto</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Ex: Dúvida sobre limite do vale refeição"
              placeholderTextColor="#8E99A4"
              value={vm.subject}
              onChangeText={vm.setSubject}
            />

            <Text style={styles.inputLabel}>Mensagem detalhada</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Descreva seu problema, estabelecimento ou solicitação com detalhes..."
              placeholderTextColor="#8E99A4"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={vm.message}
              onChangeText={vm.setMessage}
            />

            <TouchableOpacity
              style={[styles.submitButton, vm.isSubmitting && styles.submitButtonDisabled]}
              onPress={vm.submitTicket}
              disabled={vm.isSubmitting}
            >
              {vm.isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Registrar Chamado</Text>
                </>
              )}
            </TouchableOpacity>

            {vm.createdTicket && (
              <View style={styles.protocolCard}>
                <MaterialCommunityIcons name="check-circle" size={24} color="#2E7D32" />
                <View style={styles.protocolInfo}>
                  <Text style={styles.protocolTitle}>Chamado em andamento</Text>
                  <Text style={styles.protocolCode}>Protocolo: {vm.createdTicket.protocol}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabButtonActive: {
    borderBottomColor: '#1B2A4A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E99A4',
  },
  tabTextActive: {
    color: '#1B2A4A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1B2A4A',
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EAEFF5',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#1B2A4A',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1B2A4A',
    marginRight: 8,
  },
  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E99A4',
    textAlign: 'center',
  },
  contactsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 16,
    lineHeight: 18,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  contactIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B2A4A',
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B2A4A',
    marginTop: 12,
    marginBottom: 6,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  formCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
  },
  formCategoryBadgeActive: {
    backgroundColor: '#1B2A4A',
  },
  formCategoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#718096',
  },
  formCategoryTextActive: {
    color: '#FFFFFF',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1B2A4A',
  },
  textArea: {
    height: 100,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B2A4A',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    gap: 12,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  protocolCode: {
    fontSize: 12,
    color: '#388E3C',
    marginTop: 2,
  },
});
