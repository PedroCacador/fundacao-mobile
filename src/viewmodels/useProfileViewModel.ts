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
        { icone: 'account-outline', rotulo: 'Nome completo', valor: usuario.nome },
        colaborador
          ? { icone: 'briefcase-outline', rotulo: 'Cargo', valor: colaborador.cargo }
          : null,
        colaborador ? { icone: 'domain', rotulo: 'Setor', valor: colaborador.setor } : null,
        colaborador
          ? {
              icone: 'calendar-outline',
              rotulo: 'Admissão',
              valor: formatarData(lerData(colaborador.data_admissao)),
            }
          : null,
      ]),
    [usuario, colaborador],
  );

  const dadosConta = useMemo(
    () =>
      semVazios([
        { icone: 'email-outline', rotulo: 'E-mail', valor: usuario.email },
        colaborador?.telefone
          ? {
              icone: 'phone-outline',
              rotulo: 'Telefone',
              valor: formatarTelefone(colaborador.telefone),
            }
          : null,
        {
          icone: 'calendar-check-outline',
          rotulo: 'Conta criada em',
          valor: formatarData(lerData(usuario.data_criacao)),
        },
      ]),
    [usuario, colaborador],
  );

  return {
    nome: usuario.nome,
    cargo: colaborador?.cargo ?? 'Colaborador(a) da FCV',
    matricula: colaborador?.matricula ?? null,
    dadosColaborador,
    dadosConta,
    versao: Constants.expoConfig?.version ?? '1.0.0',
    logout,
  };
}
