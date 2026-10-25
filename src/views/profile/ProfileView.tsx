import React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Icone, IconBox, NomeIcone } from '../../components/common/Icon';
import { ListItem } from '../../components/common/ListItem';
import { Screen } from '../../components/common/Screen';
import { TopBar } from '../../components/common/TopBar';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import { CampoPerfil, useProfileViewModel } from '../../viewmodels/useProfileViewModel';

export default function ProfileView() {
  const { nome, cargo, matricula, dadosColaborador, dadosConta, versao, logout } =
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
    <Screen>
      <TopBar />

      <View style={styles.perfil}>
        <Avatar nome={nome} tamanho={80} />
        <View style={styles.perfilInfo}>
          <Text style={styles.ola}>Olá,</Text>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.cargo}>{cargo}</Text>
          {matricula ? (
            <View style={styles.matricula}>
              <Icone nome="user" tamanho={14} cor={cores.primaria} />
              <Text style={styles.matriculaTexto}>Matrícula: {matricula}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Secao
        icone="user"
        titulo="Dados do colaborador"
        subtitulo="Seus dados pessoais e profissionais."
        campos={dadosColaborador}
      />
      <Secao
        icone="credit-card"
        titulo="Informações da conta"
        subtitulo="Seus dados de acesso."
        campos={dadosConta}
      />
      <Secao
        icone="settings"
        titulo="Configurações"
        subtitulo="Informações do aplicativo."
        campos={[{ icone: 'info', rotulo: 'Sobre o app', valor: `Versão ${versao}` }]}
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

function Secao({
  icone,
  titulo,
  subtitulo,
  campos,
}: {
  icone: NomeIcone;
  titulo: string;
  subtitulo: string;
  campos: CampoPerfil[];
}) {
  return (
    <Card estilo={styles.secao}>
      <View style={styles.secaoTopo}>
        <IconBox nome={icone} tamanho={44} redondo />
        <View style={styles.secaoTextos}>
          <Text style={styles.secaoTitulo}>{titulo}</Text>
          <Text style={styles.secaoSubtitulo}>{subtitulo}</Text>
        </View>
      </View>
      {campos.map((campo, indice) => (
        <ListItem
          key={campo.rotulo}
          icone={campo.icone}
          rotulo={campo.rotulo}
          valor={campo.valor}
          ultimo={indice === campos.length - 1}
        />
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.lg,
    marginBottom: espaco.xl,
  },
  perfilInfo: {
    flex: 1,
  },
  ola: {
    fontSize: fonte.md,
    color: cores.textoSecundario,
  },
  nome: {
    fontSize: fonte.tituloTela,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  cargo: {
    fontSize: fonte.md,
    color: cores.textoSecundario,
  },
  matricula: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espaco.xs,
    marginTop: espaco.sm,
    paddingHorizontal: espaco.sm,
    paddingVertical: 2,
    borderRadius: raio.sm,
    backgroundColor: cores.primariaClara,
  },
  matriculaTexto: {
    fontSize: fonte.xs,
    fontFamily: familia.semi,
    color: cores.primaria,
  },
  secao: {
    marginBottom: espaco.md,
  },
  secaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    marginBottom: espaco.sm,
  },
  secaoTextos: {
    flex: 1,
  },
  secaoTitulo: {
    fontSize: fonte.lg,
    fontFamily: familia.negrito,
    color: cores.texto,
  },
  secaoSubtitulo: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
});
