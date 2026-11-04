import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ContaPreferencias, PreferenciasConta } from '../models/Preferences';
import { normalizarPreferencias } from '../models/Preferences';
import { criarFilaAssincrona } from '../utils/asyncQueue';

const CHAVE_CONTA = '@fcv:v1:preferencias:conta-atual';
const PADRAO_CHAVE = /^@fcv:v1:conta:(COLABORADOR|CONVENIADO):[1-9]\d*:preferencias$/;
const executarEmOrdem = criarFilaAssincrona();

function validarConta(valor: unknown): ContaPreferencias | null {
  if (!valor || typeof valor !== 'object' || !('id' in valor) || !('escopo' in valor)) return null;
  if (typeof valor.id !== 'number' || !Number.isSafeInteger(valor.id) || valor.id <= 0) return null;
  if (valor.escopo !== 'COLABORADOR' && valor.escopo !== 'CONVENIADO') return null;
  return { id: valor.id, escopo: valor.escopo };
}

function chaveDaConta(conta: ContaPreferencias): string {
  const valida = validarConta(conta);
  if (!valida) throw new Error('Conta inválida para as preferências locais.');
  return `@fcv:v1:conta:${valida.escopo}:${valida.id}:preferencias`;
}

function lerJson(texto: string | null): unknown {
  if (texto === null) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

async function contaAtual(): Promise<ContaPreferencias | null> {
  return validarConta(lerJson(await AsyncStorage.getItem(CHAVE_CONTA)));
}

async function removerPreferencias(conta: ContaPreferencias | null) {
  if (conta) {
    await AsyncStorage.removeItem(chaveDaConta(conta));
  } else {
    // Recuperação de marcador ausente/corrompido: só as nossas chaves conhecidas.
    const chaves = (await AsyncStorage.getAllKeys()).filter((chave) => PADRAO_CHAVE.test(chave));
    if (chaves.length) await AsyncStorage.multiRemove(chaves);
  }
}

export const storageService = {
  carregarPreferencias(conta: ContaPreferencias): Promise<PreferenciasConta> {
    const chave = chaveDaConta(conta);
    return executarEmOrdem(async () => {
      const anterior = await contaAtual();
      if (!anterior || chaveDaConta(anterior) !== chave) {
        await removerPreferencias(anterior);
        // Só id/escopo para a limpeza; este marcador nunca autentica o usuário.
        await AsyncStorage.setItem(
          CHAVE_CONTA,
          JSON.stringify({ id: conta.id, escopo: conta.escopo }),
        );
      }
      const texto = await AsyncStorage.getItem(chave);
      const preferencias = normalizarPreferencias(lerJson(texto));
      const canonico = JSON.stringify(preferencias);
      if (texto !== null && texto !== canonico) await AsyncStorage.setItem(chave, canonico);
      return preferencias;
    });
  },

  salvarPreferencias(conta: ContaPreferencias, preferencias: PreferenciasConta): Promise<void> {
    const chave = chaveDaConta(conta);
    // Construção explícita limita a persistência aos enums permitidos.
    const texto = JSON.stringify(normalizarPreferencias(preferencias));
    return executarEmOrdem(async () => {
      const atual = await contaAtual();
      if (!atual || chaveDaConta(atual) !== chave) {
        throw new Error('As preferências pertencem a uma sessão encerrada ou a outra conta.');
      }
      await AsyncStorage.setItem(chave, texto);
    });
  },

  limparConta(): Promise<void> {
    return executarEmOrdem(async () => {
      await removerPreferencias(await contaAtual());
      // O marcador só sai depois dos dados, permitindo repetir uma limpeza com falha.
      await AsyncStorage.removeItem(CHAVE_CONTA);
    });
  },
};
