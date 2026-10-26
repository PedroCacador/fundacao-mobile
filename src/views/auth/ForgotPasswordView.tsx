import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../components/common/BackHeader';
import { Button } from '../../components/common/Button';
import { DecorativeCircles } from '../../components/common/DecorativeCircles';
import { Icone, IconBox } from '../../components/common/Icon';
import { Screen } from '../../components/common/Screen';
import { ErrorMessage } from '../../components/common/StateMessage';
import { TextField } from '../../components/common/TextField';
import { RootScreenProps } from '../../navigation/types';
import { cores, espaco, familia, fonte, raio } from '../../theme';
import {
  EtapaRecuperacao,
  useForgotPasswordViewModel,
} from '../../viewmodels/useForgotPasswordViewModel';

const textos: Record<EtapaRecuperacao, { titulo: string; instrucao: string }> = {
  EMAIL: {
    titulo: 'Esqueceu sua senha?',
    instrucao:
      'Informe o e-mail da sua conta. Vamos gerar um código para você criar uma nova senha.',
  },
  CODIGO: {
    titulo: 'Crie uma nova senha',
    instrucao: 'Digite o código e escolha a sua nova senha.',
  },
  CONCLUIDO: {
    titulo: 'Senha alterada!',
    instrucao: 'Agora é só entrar com o seu e-mail e a nova senha.',
  },
};

export default function ForgotPasswordView({ navigation }: RootScreenProps<'ForgotPassword'>) {
  const {
    etapa,
    email,
    setEmail,
    aviso,
    codigo,
    setCodigo,
    novaSenha,
    setNovaSenha,
    confirmacao,
    setConfirmacao,
    carregando,
    erro,
    enviarEmail,
    redefinir,
  } = useForgotPasswordViewModel();
  const concluido = etapa === 'CONCLUIDO';

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
        <BackHeader titulo="Recuperar senha" />
        <View style={styles.icone}>
          <IconBox
            nome={concluido ? 'circle-check' : 'key-round'}
            cor={concluido ? cores.sucesso : cores.primaria}
            fundo={concluido ? cores.sucessoFundo : cores.primariaClara}
            tamanho={72}
            redondo
          />
        </View>
        <Text style={styles.titulo} accessibilityRole="header">
          {textos[etapa].titulo}
        </Text>
        <Text style={styles.instrucao}>{textos[etapa].instrucao}</Text>
        {etapa === 'EMAIL' ? (
          <View style={styles.formulario}>
            <TextField
              icone="mail"
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="send"
              onSubmitEditing={enviarEmail}
              editable={!carregando}
            />
            {erro ? <ErrorMessage mensagem={erro} /> : null}
            <Button
              titulo="Enviar código"
              icone="arrow-right"
              aoPressionar={enviarEmail}
              carregando={carregando}
            />
          </View>
        ) : null}
        {etapa === 'CODIGO' ? (
          <View style={styles.formulario}>
            {aviso ? (
              <View style={styles.aviso}>
                <Icone nome="info" tamanho={18} cor={cores.primaria} />
                <Text style={styles.avisoTexto}>{aviso}</Text>
              </View>
            ) : null}
            <TextField
              icone="key-round"
              placeholder="Código de 6 dígitos"
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="number-pad"
              maxLength={6}
              editable={!carregando}
            />
            <TextField
              icone="lock"
              placeholder="Nova senha"
              senha
              value={novaSenha}
              onChangeText={setNovaSenha}
              editable={!carregando}
            />
            <TextField
              icone="lock"
              placeholder="Confirme a nova senha"
              senha
              value={confirmacao}
              onChangeText={setConfirmacao}
              returnKeyType="done"
              onSubmitEditing={redefinir}
              editable={!carregando}
            />
            {erro ? <ErrorMessage mensagem={erro} /> : null}
            <Button titulo="Redefinir senha" aoPressionar={redefinir} carregando={carregando} />
          </View>
        ) : null}
        {concluido ? (
          <View style={styles.formulario}>
            <Button
              titulo="Voltar para o login"
              icone="arrow-right"
              aoPressionar={() => navigation.goBack()}
            />
          </View>
        ) : null}
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
    paddingHorizontal: 32,
  },
  icone: {
    alignItems: 'center',
    marginTop: espaco.xl,
    marginBottom: espaco.xl,
  },
  titulo: {
    fontFamily: familia.negrito,
    fontSize: fonte.grande,
    color: cores.primaria,
  },
  instrucao: {
    marginTop: espaco.sm,
    fontFamily: familia.regular,
    fontSize: fonte.lg,
    lineHeight: 22,
    color: cores.textoSecundario,
  },
  formulario: {
    marginTop: 28,
    gap: espaco.lg,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.azulSuave,
  },
  avisoTexto: {
    flex: 1,
    fontFamily: familia.regular,
    fontSize: fonte.md,
    lineHeight: 18,
    color: cores.texto,
  },
});
