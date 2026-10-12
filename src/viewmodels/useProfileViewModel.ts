import { useMemo } from 'react';
import { User } from '../models/User';
import { mapearUsuario } from '../models/mapearUsuario';
import { useAuth } from '../context/AuthContext';

export function useProfileViewModel() {
  const { usuario, logout } = useAuth();
  const user: User = useMemo(() => mapearUsuario(usuario!), [usuario]);

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

  return { user, employeeFields, accountFields, editProfileFields, settingsOptions, logout };
}
