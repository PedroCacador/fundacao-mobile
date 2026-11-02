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
  const conveniado = usuario.conveniado;
  const ehColaborador = usuario.escopo === 'COLABORADOR';

  const dadosPerfil = useMemo(
    () =>
      conveniado
        ? ([
            { icone: 'store', rotulo: 'Nome fantasia', valor: conveniado.nome_fantasia },
            { icone: 'building', rotulo: 'Razão social', valor: conveniado.razao_social },
            { icone: 'id-card', rotulo: 'CNPJ', valor: conveniado.cnpj },
            { icone: 'tag', rotulo: 'Categoria', valor: conveniado.categoria },
            { icone: 'map-pin', rotulo: 'Endereço', valor: conveniado.endereco },
            { icone: 'user', rotulo: 'Responsável', valor: usuario.nome },
            { icone: 'mail', rotulo: 'E-mail', valor: usuario.email },
          ] satisfies CampoPerfil[])
        : semVazios([
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
    [usuario, colaborador, conveniado],
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
    nome: conveniado?.nome_fantasia ?? usuario.nome,
    cargo: conveniado
      ? 'Estabelecimento conveniado'
      : (colaborador?.cargo ?? 'Colaborador(a) da FCV'),
    matricula: colaborador?.matricula ?? null,
    dadosPerfil,
    ehColaborador,
    tituloPerfil: ehColaborador ? 'Dados do colaborador' : 'Dados do conveniado',
    subtituloPerfil: ehColaborador
      ? 'Seus dados pessoais e profissionais.'
      : 'Dados cadastrais do seu estabelecimento.',
    dadosConta,
    configuracoes,
    logout,
  };
}
