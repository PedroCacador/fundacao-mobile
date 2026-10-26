import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { DecorativeCircles } from '../../components/common/DecorativeCircles';
import { Logo } from '../../components/common/Logo';
import { Screen } from '../../components/common/Screen';
import { ErrorMessage } from '../../components/common/StateMessage';
import { TextField } from '../../components/common/TextField';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte } from '../../theme';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

export default function LoginView({ navigation }: RootScreenProps<'Login'>) {
  const { email, setEmail, senha, setSenha, login, carregando, erro } = useAuthViewModel();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen
        bordas={['top', 'bottom']}
        estiloConteudo={styles.conteudo}
        fundo={<DecorativeCircles posicoes={['topoEsquerda', 'baseDireita']} />}
      >
        <View style={styles.logo}>
          <Logo largura={230} />
        </View>

        <Text style={styles.plataforma}>Plataforma de Benefícios</Text>
        <Text style={styles.plataformaLinha}>e Relacionamento</Text>

        <Text style={styles.boasVindas} accessibilityRole="header">
          Bem-vindo(a)!
        </Text>
        <Text style={styles.instrucao}>Acesse sua conta e acompanhe seus benefícios.</Text>

        <View style={styles.formulario}>
          <TextField
            icone="user"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
            editable={!carregando}
          />
          <TextField
            icone="lock"
            placeholder="Senha"
            senha
            value={senha}
            onChangeText={setSenha}
            textContentType="password"
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={login}
            editable={!carregando}
          />
          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            hitSlop={8}
            accessibilityRole="link"
            style={styles.esqueci}
          >
            <Text style={styles.esqueciTexto}>Esqueceu sua senha?</Text>
          </Pressable>
          {erro ? <ErrorMessage mensagem={erro} /> : null}
        </View>

        <Button titulo="Entrar" icone="arrow-right" aoPressionar={login} carregando={carregando} />

        <Text style={styles.rodape}>Fundação Cristiano Varella</Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    alignItems: 'center',
  },
  plataforma: {
    marginTop: espaco.xxl,
    fontFamily: familia.tituloMedio,
    fontSize: fonte.titulo,
    lineHeight: 28,
    color: cores.primaria,
    textAlign: 'center',
  },
  plataformaLinha: {
    fontFamily: familia.tituloRegular,
    fontSize: fonte.titulo,
    lineHeight: 28,
    color: cores.primariaMedia,
    textAlign: 'center',
  },
  boasVindas: {
    marginTop: 44,
    fontFamily: familia.negrito,
    fontSize: fonte.display,
    color: cores.primaria,
  },
  instrucao: {
    marginTop: espaco.sm,
    maxWidth: 280,
    fontFamily: familia.regular,
    fontSize: fonte.xl,
    color: cores.textoSecundario,
    lineHeight: 23,
  },
  formulario: {
    marginTop: 28,
    marginBottom: 28,
    gap: espaco.lg,
  },
  esqueci: {
    alignSelf: 'flex-end',
  },
  esqueciTexto: {
    fontFamily: familia.medio,
    fontSize: fonte.md,
    color: cores.primaria,
  },
  rodape: {
    marginTop: 28,
    fontFamily: familia.regular,
    fontSize: fonte.sm,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
