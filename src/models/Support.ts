export type FaqCategory = 'geral' | 'beneficios' | 'cartao' | 'reembolso' | 'seguranca';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

export interface SupportContact {
  type: 'whatsapp' | 'email' | 'phone' | 'hours';
  title: string;
  subtitle: string;
  value: string;
  icon: string;
}

export interface SupportTicketInput {
  subject: string;
  category: FaqCategory;
  message: string;
}

export interface SupportTicket extends SupportTicketInput {
  id: string;
  protocol: string;
  createdAt: string;
  status: 'aberto' | 'em_analise' | 'respondido' | 'fechado';
}
