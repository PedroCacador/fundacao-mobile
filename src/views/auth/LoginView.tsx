import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

export default function LoginView() {
  const { login, carregando, erro, limparErro } = useAuthViewModel();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const entrar = () => {
    if (!carregando) {
      login(usuario, senha);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topDecoration}>
            <View style={styles.decorCircle} />
          </View>

          <View style={styles.logoContainer}>
            <Text style={styles.logoTitle}>FCV</Text>
            <Text style={styles.logoSubtitle}>Fundação{'\n'}Cristiano Varella</Text>
            <Text style={styles.logoSlogan}>Pela vida.</Text>
          </View>

          <Text style={styles.platformTitle}>Plataforma de Benefícios</Text>
          <Text style={styles.platformSubtitle}>e Relacionamento</Text>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Bem-vindo(a)!</Text>
            <Text style={styles.welcomeSubtitle}>
              Acesse sua conta e acompanhe seus benefícios.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={22} color="#8E99A4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#8E99A4"
                value={usuario}
                onChangeText={(texto) => {
                  setUsuario(texto);
                  if (erro) limparErro();
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                editable={!carregando}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={22} color="#8E99A4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#8E99A4"
                value={senha}
                onChangeText={(texto) => {
                  setSenha(texto);
                  if (erro) limparErro();
                }}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                autoComplete="password"
                returnKeyType="go"
                onSubmitEditing={entrar}
                editable={!carregando}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <MaterialCommunityIcons name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'} size={22} color="#8E99A4" />
              </TouchableOpacity>
            </View>

            {erro ? (
              <View style={styles.errorBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#B3261E" />
                <Text style={styles.errorText}>{erro}</Text>
              </View>
            ) : null}

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.enterButton, carregando && styles.enterButtonDisabled]}
            onPress={entrar}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.enterButtonText}>Entrar  →</Text>
            )}
          </TouchableOpacity>

          {/* Seção de Teste e Cadastro Rápido para Desenvolvimento */}
          <View style={styles.devCard}>
            <Text style={styles.devCardTitulo}>🛠️ Modo de Teste Rápido</Text>
            <Text style={styles.devCardSub}>
              Use a conta oficial do protótipo (Ana Carolina Silva) com 1 clique:
            </Text>
            <TouchableOpacity
              style={styles.devBotaoPreencher}
              onPress={() => {
                setUsuario('ana.silva@fcv.org.br');
                setSenha('123');
              }}
            >
              <MaterialCommunityIcons name="account-arrow-right-outline" size={18} color="#1B2A4A" />
              <Text style={styles.devBotaoTexto}>Preencher: ana.silva@fcv.org.br (123)</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>Fundação Cristiano Varella</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  topDecoration: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F7FA',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  decorCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E8EDF2',
    position: 'absolute',
    top: -80,
    right: -60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1B2A4A',
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 13,
    color: '#1B2A4A',
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: '600',
  },
  logoSlogan: {
    fontSize: 12,
    color: '#1B2A4A',
    fontStyle: 'italic',
    marginTop: 2,
  },
  platformTitle: {
    fontSize: 18,
    color: '#3A5A8C',
    fontWeight: '300',
    marginTop: 16,
  },
  platformSubtitle: {
    fontSize: 18,
    color: '#3A5A8C',
    fontWeight: '300',
  },
  welcomeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 36,
    marginTop: 30,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#6B7B8D',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 36,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1B2A4A',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#3A5A8C',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '500',
  },
  enterButton: {
    backgroundColor: '#1B2A4A',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 60,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1B2A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 1,
  },
  enterButtonDisabled: {
    opacity: 0.7,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  errorText: {
    flex: 1,
    marginLeft: 8,
    color: '#B3261E',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    color: '#3A5A8C',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 16,
  },
  devCard: {
    marginTop: 16,
    width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  devCardTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B2A4A',
    marginBottom: 4,
  },
  devCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10,
    textAlign: 'center',
  },
  devBotaoPreencher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF4FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D9FE',
  },
  devBotaoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B2A4A',
  },
});
