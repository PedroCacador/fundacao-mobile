import { FaqItem, SupportContact, SupportTicket, SupportTicketInput } from '../models/Support';

export const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    category: 'beneficios',
    question: 'Quando o saldo dos meus benefícios é recarregado?',
    answer: 'A recarga dos benefícios corporativos (Vale Alimentação, Refeição, Mobilidade) ocorre sempre no primeiro dia útil de cada mês, automaticamente.',
  },
  {
    id: '2',
    category: 'cartao',
    question: 'Como utilizar o QR Code em estabelecimentos credenciados?',
    answer: 'Na aba "QR Code" no menu inferior, apresente o código gerado no caixa do estabelecimento ou selecione a opção de pagamento por aproximação/código do benefício.',
  },
  {
    id: '3',
    category: 'beneficios',
    question: 'O saldo não utilizado acumula para o mês seguinte?',
    answer: 'Sim, para Alimentação e Refeição o saldo acumula integralmente por até 90 dias conforme a política de benefícios da Fundação.',
  },
  {
    id: '4',
    category: 'reembolso',
    question: 'Como solicitar reembolso de consultas ou exames?',
    answer: 'O colaborador deve enviar a nota fiscal com comprovante de pagamento através do portal do colaborador ou anexar abrindo um chamado pelo suporte com até 30 dias após o evento.',
  },
  {
    id: '5',
    category: 'seguranca',
    question: 'Esqueci minha senha ou perdi o acesso ao aplicativo',
    answer: 'Na tela de login clique em "Esqueceu a senha?". Um link com token temporário de redefinição será enviado para seu e-mail corporativo cadastrado.',
  },
  {
    id: '6',
    category: 'geral',
    question: 'Como atualizar meus dados cadastrais e dependentes?',
    answer: 'Acesse o menu Perfil > Dados do Colaborador. Alterações cadastrais de dependentes e contas bancárias passam por validação do RH em até 48 horas úteis.',
  },
];

export const SUPPORT_CONTACTS: SupportContact[] = [
  {
    type: 'whatsapp',
    title: 'WhatsApp Oficial',
    subtitle: 'Atendimento rápido e automatizado',
    value: 'https://wa.me/5511999999999?text=Ol%C3%A1%2C+preciso+de+suporte+no+app+Funda%C3%A7%C3%A3o',
    icon: 'whatsapp',
  },
  {
    type: 'email',
    title: 'E-mail de Suporte',
    subtitle: 'suporte@fundacao.org.br',
    value: 'mailto:suporte@fundacao.org.br?subject=Suporte%20App%20Fundacao',
    icon: 'email-outline',
  },
  {
    type: 'phone',
    title: 'Central Telefônica',
    subtitle: '0800 123 4567 (Ligação Gratuita)',
    value: 'tel:08001234567',
    icon: 'phone-outline',
  },
  {
    type: 'hours',
    title: 'Horário de Atendimento',
    subtitle: 'Segunda a Sexta, das 08h às 18h',
    value: '',
    icon: 'clock-outline',
  },
];

class SupportService {
  async getFaqs(): Promise<FaqItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(FAQ_DATA), 200);
    });
  }

  async getContacts(): Promise<SupportContact[]> {
    return SUPPORT_CONTACTS;
  }

  async createTicket(input: SupportTicketInput): Promise<SupportTicket> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket: SupportTicket = {
          ...input,
          id: String(Date.now()),
          protocol: `FND-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
          status: 'aberto',
        };
        resolve(ticket);
      }, 500);
    });
  }
}

export const supportService = new SupportService();
