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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterView({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

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
          </View>

          <Text style={styles.platformTitle}>Plataforma de Benefícios</Text>
          <Text style={styles.platformSubtitle}>e Relacionamento</Text>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Criar Conta</Text>
            <Text style={styles.welcomeSubtitle}>
              Preencha os dados abaixo para{'\n'}se cadastrar.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={22} color="#8E99A4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#8E99A4"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={22} color="#8E99A4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#8E99A4"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="card-account-details-outline" size={22} color="#8E99A4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="CPF"
                placeholderTextColor="#8E99A4"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={22} color="#8E99A4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#8E99A4"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!senhaVisivel}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <MaterialCommunityIcons name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'} size={22} color="#8E99A4" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={22} color="#8E99A4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="#8E99A4"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!confirmarSenhaVisivel}
              />
              <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}>
                <MaterialCommunityIcons name={confirmarSenhaVisivel ? 'eye-outline' : 'eye-off-outline'} size={22} color="#8E99A4" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.registerButtonText}>Cadastrar  →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>
              Já tem conta? <Text style={styles.loginLinkBold}>Faça login</Text>
            </Text>
          </TouchableOpacity>

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
    height: 100,
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
    marginTop: -10,
    marginBottom: 8,
  },
  logoTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1B2A4A',
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 12,
    color: '#1B2A4A',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '600',
  },
  platformTitle: {
    fontSize: 16,
    color: '#3A5A8C',
    fontWeight: '300',
    marginTop: 10,
  },
  platformSubtitle: {
    fontSize: 16,
    color: '#3A5A8C',
    fontWeight: '300',
  },
  welcomeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 36,
    marginTop: 24,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7B8D',
    lineHeight: 21,
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
    marginBottom: 14,
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
  registerButton: {
    backgroundColor: '#1B2A4A',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 60,
    width: '80%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#1B2A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 1,
  },
  loginLink: {
    color: '#6B7B8D',
    fontSize: 14,
    marginBottom: 30,
  },
  loginLinkBold: {
    color: '#1B2A4A',
    fontWeight: 'bold',
  },
  footer: {
    color: '#3A5A8C',
    fontSize: 13,
    fontWeight: '500',
  },
});
