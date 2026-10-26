import { useState } from 'react';
import { ApiError } from '../services/api';
import { authService } from '../services/authService';

export type EtapaRecuperacao = 'EMAIL' | 'CODIGO' | 'CONCLUIDO';
 
const TAMANHO_MINIMO_SENHA = 6;

function mensagemDeErro(falha: unknown) {
  return falha instanceof ApiError ? falha.message : 'Não foi possível continuar. Tente novamente.';
}

export function useForgotPasswordViewModel() {
  const [etapa, setEtapa] = useState<EtapaRecuperacao>('EMAIL');
  const [email, setEmail] = useState('');
  const [codigoRecebido, setCodigoRecebido] = useState<string | null>(null);
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  const enviarEmail = async () => {
    if (carregando) return;
    if (!email.trim()) {
      setErro('Informe o seu e-mail.');
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      const resposta = await authService.solicitarCodigo(email.trim());
      setCodigoRecebido(resposta.codigo);
      setEtapa('CODIGO');
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    } finally {
      setCarregando(false);
    }
  };

  const redefinir = async () => {
    if (carregando) return;
    if (!codigo.trim()) {
      setErro('Informe o código que você recebeu.');
      return;
    }
    if (novaSenha.length < TAMANHO_MINIMO_SENHA) {
      setErro(`A nova senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`);
      return;
    }
    if (novaSenha !== confirmacao) {
      setErro('As senhas não são iguais.');
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      await authService.redefinirSenha(email.trim(), codigo.trim(), novaSenha);
      setEtapa('CONCLUIDO');
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    } finally {
      setCarregando(false);
    }
  };

  return {
    etapa,
    email,
    setEmail,
    codigoRecebido,
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
  };
}
