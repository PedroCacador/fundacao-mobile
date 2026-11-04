import React from 'react';
import { Button } from '../../components/common/Button';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { DecorativeCircles } from '../../components/common/DecorativeCircles';
import { NomeIcone } from '../../components/common/Icon';
import { ListItem } from '../../components/common/ListItem';
import { Screen } from '../../components/common/Screen';
import { SectionCard } from '../../components/common/SectionCard';
import { TopBar } from '../../components/common/TopBar';
import { UserGreeting } from '../../components/common/UserGreeting';
import { CampoPerfil, useProfileViewModel } from '../../viewmodels/useProfileViewModel';

export default function ProfileView() {
  const {
    nome,
    cargo,
    matricula,
    dadosPerfil,
    tituloPerfil,
    subtituloPerfil,
    ehColaborador,
    dadosConta,
    configuracoes,
    confirmacaoSaidaAberta,
    solicitarSaida,
    cancelarSaida,
    confirmarSaida,
  } = useProfileViewModel();

  return (
    <Screen fundo={<DecorativeCircles posicoes={['topoDireita']} />}>
      <TopBar voltar={ehColaborador} notificacoes={ehColaborador} />
      <UserGreeting nome={nome} cargo={cargo} matricula={matricula} tamanhoFoto={92} />

      <SecaoCampos
        icone="user"
        titulo={tituloPerfil}
        subtitulo={subtituloPerfil}
        campos={dadosPerfil}
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
        aoPressionar={solicitarSaida}
      />
      <ConfirmationModal
        aberto={confirmacaoSaidaAberta}
        titulo="Sair da conta"
        mensagem="Deseja realmente sair da sua conta?"
        textoConfirmar="Sair"
        aoCancelar={cancelarSaida}
        aoConfirmar={confirmarSaida}
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
