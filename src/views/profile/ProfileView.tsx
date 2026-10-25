import React from 'react';
import { Alert, Platform } from 'react-native';
import { Button } from '../../components/common/Button';
import { DecorativeCircles } from '../../components/common/DecorativeCircles';
import { NomeIcone } from '../../components/common/Icon';
import { ListItem } from '../../components/common/ListItem';
import { Screen } from '../../components/common/Screen';
import { SectionCard } from '../../components/common/SectionCard';
import { TopBar } from '../../components/common/TopBar';
import { UserGreeting } from '../../components/common/UserGreeting';
import { CampoPerfil, useProfileViewModel } from '../../viewmodels/useProfileViewModel';

export default function ProfileView() {
  const { nome, cargo, matricula, dadosColaborador, dadosConta, configuracoes, logout } =
    useProfileViewModel();

  const confirmarSaida = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente sair da sua conta?')) logout();
      return;
    }
    Alert.alert('Sair da conta', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <Screen fundo={<DecorativeCircles posicoes={['topoDireita']} />}>
      <TopBar voltar />
      <UserGreeting nome={nome} cargo={cargo} matricula={matricula} tamanhoFoto={92} />

      <SecaoCampos
        icone="user"
        titulo="Dados do colaborador"
        subtitulo="Seus dados pessoais e profissionais."
        campos={dadosColaborador}
      />
      <SecaoCampos
        icone="credit-card"
        titulo="Informações da conta"
        subtitulo="Seus dados de acesso e segurança."
        campos={dadosConta}
      />
      <SecaoCampos
        icone="settings"
        titulo="Configurações"
        subtitulo="Informações do aplicativo."
        campos={configuracoes}
        valoresADireita
      />

      <Button
        titulo="Sair da conta"
        icone="log-out"
        variante="perigo"
        aoPressionar={confirmarSaida}
      />
    </Screen>
  );
}

interface SecaoCamposProps {
  icone: NomeIcone;
  titulo: string;
  subtitulo: string;
  campos: CampoPerfil[];
  valoresADireita?: boolean;
}

function SecaoCampos({ icone, titulo, subtitulo, campos, valoresADireita }: SecaoCamposProps) {
  return (
    <SectionCard icone={icone} titulo={titulo} subtitulo={subtitulo}>
      {campos.map((campo, indice) => (
        <ListItem
          key={campo.rotulo}
          icone={campo.icone}
          rotulo={campo.rotulo}
          valor={campo.valor}
          valorADireita={valoresADireita}
          ultimo={indice === campos.length - 1}
        />
      ))}
    </SectionCard>
  );
}
