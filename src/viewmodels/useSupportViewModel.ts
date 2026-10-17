import { useState, useEffect, useMemo } from 'react';
import { Linking, Alert, Platform } from 'react-native';
import { FaqCategory, FaqItem, SupportContact, SupportTicket } from '../models/Support';
import { supportService } from '../services/supportService';

export function useSupportViewModel() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [contacts, setContacts] = useState<SupportContact[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Estados do formulário de novo chamado
  const [subject, setSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<FaqCategory>('geral');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [faqList, contactList] = await Promise.all([
      supportService.getFaqs(),
      supportService.getContacts(),
    ]);
    setFaqs(faqList);
    setContacts(contactList);
  };

  const toggleExpand = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory = selectedCategory === 'todas' || item.category === selectedCategory;
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const handleOpenContact = async (contact: SupportContact) => {
    if (!contact.value) return;

    try {
      const supported = await Linking.canOpenURL(contact.value);
      if (supported) {
        await Linking.openURL(contact.value);
      } else {
        showAlert('Atenção', `Não foi possível abrir o link do ${contact.title}.`);
      }
    } catch {
      showAlert('Erro', `Falha ao tentar abrir o canal de atendimento.`);
    }
  };

  const submitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      showAlert('Campos obrigatórios', 'Por favor, preencha o assunto e a mensagem para enviar o chamado.');
      return false;
    }

    setIsSubmitting(true);
    try {
      const ticket = await supportService.createTicket({
        subject: subject.trim(),
        category: ticketCategory,
        message: message.trim(),
      });

      setCreatedTicket(ticket);
      setSubject('');
      setMessage('');
      showAlert('Chamado Aberto com Sucesso!', `Seu protocolo é: ${ticket.protocol}. Nossa equipe responderá em breve.`);
      return true;
    } catch {
      showAlert('Erro', 'Houve uma falha ao registrar o chamado. Tente novamente.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  return {
    faqs: filteredFaqs,
    contacts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    expandedFaqId,
    toggleExpand,
    handleOpenContact,
    // Formulário
    subject,
    setSubject,
    ticketCategory,
    setTicketCategory,
    message,
    setMessage,
    isSubmitting,
    createdTicket,
    submitTicket,
  };
}
