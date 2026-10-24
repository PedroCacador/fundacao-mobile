import React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { IconBox, NomeIcone } from '../../components/common/Icon';
import { ListItem } from '../../components/common/ListItem';
import { Screen } from '../../components/common/Screen';
import { TopBar } from '../../components/common/TopBar';
import { cores, espaco, fonte, peso, raio } from '../../theme';
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
              <MaterialCommunityIcons name="account-outline" size={14} color={cores.primaria} />
              <Text style={styles.matriculaTexto}>Matrícula: {matricula}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Secao
        icone="account-outline"
        titulo="Dados do colaborador"
        subtitulo="Seus dados pessoais e profissionais."
        campos={dadosColaborador}
      />
      <Secao
        icone="shield-account-outline"
        titulo="Informações da conta"
        subtitulo="Seus dados de acesso."
        campos={dadosConta}
      />
      <Secao
        icone="cog-outline"
        titulo="Configurações"
        subtitulo="Informações do aplicativo."
        campos={[
          { icone: 'information-outline', rotulo: 'Sobre o app', valor: `Versão ${versao}` },
        ]}
      />

      <Button
        titulo="Sair da conta"
        icone="logout"
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
    fontSize: fonte.sm,
    color: cores.textoSecundario,
  },
  nome: {
    fontSize: fonte.xl,
    fontWeight: peso.negrito,
    color: cores.texto,
  },
  cargo: {
    fontSize: fonte.sm,
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
    fontWeight: peso.semi,
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
    fontSize: fonte.md,
    fontWeight: peso.negrito,
    color: cores.texto,
  },
  secaoSubtitulo: {
    fontSize: fonte.xs,
    color: cores.textoSecundario,
  },
});
