import { useMemo } from 'react';
import Constants from 'expo-constants';
import { NomeIcone } from '../models/Icon';
import { useAuth, useUsuario } from '../context/AuthContext';
import { formatarData, formatarTelefone, lerData } from '../utils/format';

export interface CampoPerfil {
  icone: NomeIcone;
  rotulo: string;
  valor: string;
}

function semVazios(campos: (CampoPerfil | null)[]) {
  return campos.filter((campo): campo is CampoPerfil => campo !== null);
}

export function useProfileViewModel() {
  const usuario = useUsuario();
  const { logout } = useAuth();
  const colaborador = usuario.colaborador;

  const dadosColaborador = useMemo(
    () =>
      semVazios([
        { icone: 'user', rotulo: 'Nome completo', valor: usuario.nome },
        colaborador ? { icone: 'briefcase', rotulo: 'Cargo', valor: colaborador.cargo } : null,
        colaborador ? { icone: 'building', rotulo: 'Setor', valor: colaborador.setor } : null,
        colaborador
          ? {
              icone: 'calendar',
              rotulo: 'Admissão',
              valor: formatarData(lerData(colaborador.data_admissao)),
            }
          : null,
        { icone: 'mail', rotulo: 'E-mail', valor: usuario.email },
      ]),
    [usuario, colaborador],
  );

  const dadosConta = useMemo(
    () =>
      semVazios([
        colaborador?.telefone
          ? {
              icone: 'phone',
              rotulo: 'Telefone',
              valor: formatarTelefone(colaborador.telefone),
            }
          : null,
        { icone: 'lock', rotulo: 'Senha', valor: '••••••••' },
        {
          icone: 'calendar-check',
          rotulo: 'Conta criada em',
          valor: formatarData(lerData(usuario.data_criacao)),
        },
      ]),
    [usuario, colaborador],
  );

  const versao = Constants.expoConfig?.version ?? '1.0.0';
  const configuracoes: CampoPerfil[] = [
    { icone: 'globe', rotulo: 'Idioma', valor: 'Português (BR)' },
    { icone: 'info', rotulo: 'Sobre o app', valor: `Versão ${versao}` },
  ];

  return {
    nome: usuario.nome,
    cargo: colaborador?.cargo ?? 'Colaborador(a) da FCV',
    matricula: colaborador?.matricula ?? null,
    dadosColaborador,
    dadosConta,
    configuracoes,
    logout,
  };
}
