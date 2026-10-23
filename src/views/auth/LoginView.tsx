import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { Screen } from '../../components/common/Screen';
import { ErrorMessage } from '../../components/common/StateMessage';
import { TextField } from '../../components/common/TextField';
import { cores, espaco, fonte, peso } from '../../theme';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

export default function LoginView() {
  const { email, setEmail, senha, setSenha, login, carregando, erro } = useAuthViewModel();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen bordas={['top', 'bottom']} estiloConteudo={styles.conteudo}>
        <View style={styles.logo}>
          <Text style={styles.sigla}>FCV</Text>
          <View>
            <Text style={styles.nomeFundacao}>Fundação</Text>
            <Text style={styles.nomeFundacao}>Cristiano Varella</Text>
            <Text style={styles.slogan}>Pela vida.</Text>
          </View>
        </View>

        <Text style={styles.plataforma}>Plataforma de Benefícios</Text>
        <Text style={styles.plataformaLinha}>e Relacionamento</Text>

        <Text style={styles.boasVindas} accessibilityRole="header">
          Bem-vindo(a)!
        </Text>
        <Text style={styles.instrucao}>Acesse sua conta e acompanhe seus benefícios.</Text>

        <View style={styles.formulario}>
          <TextField
            icone="account-outline"
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
            icone="lock-outline"
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
    paddingHorizontal: espaco.xl,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
  },
  sigla: {
    fontSize: 44,
    fontWeight: peso.negrito,
    color: cores.primaria,
    letterSpacing: 2,
  },
  nomeFundacao: {
    fontSize: fonte.sm,
    fontWeight: peso.semi,
    color: cores.primaria,
    lineHeight: 16,
  },
  slogan: {
    fontSize: fonte.xs,
    fontStyle: 'italic',
    color: cores.primaria,
  },
  plataforma: {
    marginTop: espaco.xl,
    fontSize: fonte.lg,
    fontWeight: peso.semi,
    color: cores.texto,
    textAlign: 'center',
  },
  plataformaLinha: {
    fontSize: fonte.lg,
    color: cores.texto,
    textAlign: 'center',
  },
  boasVindas: {
    marginTop: espaco.xxl,
    fontSize: fonte.xxl,
    fontWeight: peso.negrito,
    color: cores.primaria,
  },
  instrucao: {
    marginTop: espaco.xs,
    fontSize: fonte.md,
    color: cores.textoSecundario,
    lineHeight: 22,
  },
  formulario: {
    marginTop: espaco.xl,
    marginBottom: espaco.xl,
    gap: espaco.md,
  },
  rodape: {
    marginTop: espaco.xl,
    fontSize: fonte.xs,
    color: cores.textoSecundario,
    textAlign: 'center',
  },
});
