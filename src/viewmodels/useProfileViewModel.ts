import { User } from '../models/User';

export function useProfileViewModel() {
  const user: User = {
    name: 'Ana Carolina Silva',
    role: 'Colaboradora da FCV',
    matricula: '4587',
    email: 'ana.carolina@email.com',
    phone: '(31) 98765-4321',
    cpf: '123.456.789-00',
    cargo: 'Analista Administrativo',
    setor: 'Administrativo',
    emailCorporativo: 'ana.silva@fcv.org.br',
  };

  const employeeFields = [
    { icon: 'account-outline', label: 'Nome completo', value: user.name },
    { icon: 'card-account-details-outline', label: 'CPF', value: user.cpf },
    { icon: 'briefcase-outline', label: 'Cargo', value: user.cargo },
    { icon: 'domain', label: 'Setor', value: user.setor },
    { icon: 'email-outline', label: 'E-mail corporativo', value: user.emailCorporativo },
  ];

  const accountFields = [
    { icon: 'email-outline', label: 'E-mail de contato', value: user.emailCorporativo },
    { icon: 'phone-outline', label: 'Telefone', value: user.phone },
    { icon: 'lock-outline', label: 'Senha', value: '••••••••' },
  ];

  const editProfileFields = [
    { icon: 'account-outline', label: 'Nome completo', value: user.name },
    { icon: 'email-outline', label: 'E-mail pessoal', value: user.email },
    { icon: 'phone-outline', label: 'Telefone', value: user.phone },
    { icon: 'lock-outline', label: 'Senha', value: '••••••••' },
  ];

  const settingsOptions = [
    { icon: 'bell-outline', label: 'Notificações', value: 'Ativadas' },
    { icon: 'shield-check-outline', label: 'Privacidade', value: 'Gerenciar' },
    { icon: 'web', label: 'Idioma', value: 'Português (BR)' },
    { icon: 'information-outline', label: 'Sobre o app', value: 'Versão 1.0.0' },
  ];

  return { user, employeeFields, accountFields, editProfileFields, settingsOptions };
}
