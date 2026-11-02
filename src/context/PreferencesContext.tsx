import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type {
  ContaPreferencias,
  FiltroCarteira,
  PeriodoHistorico,
  PreferenciasConta,
} from '../models/Preferences';
import { filtrosCarteira, periodosHistorico } from '../models/Preferences';
import { storageService } from '../services/storageService';
import { useAuth } from './AuthContext';
import { estadoPreferenciasInicial, preferencesReducer } from './preferencesState';

export interface PreferencesContextData {
  preferencias: Readonly<PreferenciasConta>;
  carregando: boolean;
  salvando: boolean;
  erro: string | null;
  definirFiltroCarteira: (filtro: FiltroCarteira) => void;
  definirPeriodoHistorico: (periodo: PeriodoHistorico) => void;
  tentarDeNovo: () => void;
}

const PreferencesContext = createContext<PreferencesContextData | undefined>(undefined);

function PreferenciasDaSessao({
  conta,
  children,
}: {
  conta: ContaPreferencias | null;
  children: React.ReactNode;
}) {
  const [estado, dispatch] = useReducer(
    preferencesReducer,
    conta !== null,
    estadoPreferenciasInicial,
  );
  const [tentativaLeitura, setTentativaLeitura] = useState(0);
  const montado = useRef(false);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  useEffect(() => {
    if (!conta) return;
    let ativo = true;
    dispatch({ tipo: 'CARREGAR' });
    storageService
      .carregarPreferencias(conta)
      .then((valores) => {
        if (ativo) dispatch({ tipo: 'CARREGADO', valores });
      })
      .catch(() => {
        if (ativo)
          dispatch({
            tipo: 'FALHA_LEITURA',
            mensagem:
              'Não foi possível recuperar seus filtros salvos. Você pode usar os padrões ou tentar novamente.',
          });
      });
    return () => {
      ativo = false;
    };
  }, [conta, tentativaLeitura]);

  useEffect(() => {
    if (!conta || estado.carregando || !estado.hidratado || !Object.keys(estado.alteracoes).length)
      return;
    let ativo = true;
    const revisao = estado.revisao;
    dispatch({ tipo: 'SALVANDO', revisao });
    storageService
      .salvarPreferencias(conta, estado.valores)
      .then(() => {
        if (ativo) dispatch({ tipo: 'SALVO', revisao });
      })
      .catch(() => {
        if (ativo)
          dispatch({
            tipo: 'FALHA_GRAVACAO',
            revisao,
            mensagem:
              'O filtro foi aplicado, mas não pôde ser salvo. Tente novamente para mantê-lo ao reabrir o app.',
          });
      });
    return () => {
      ativo = false;
    };
  }, [
    conta,
    estado.carregando,
    estado.hidratado,
    estado.alteracoes,
    estado.valores,
    estado.revisao,
  ]);

  const definirFiltroCarteira = useCallback(
    (filtro: FiltroCarteira) => {
      if (conta && montado.current && filtrosCarteira.some((valor) => valor === filtro)) {
        dispatch({ tipo: 'ALTERAR', valores: { filtroCarteira: filtro } });
      }
    },
    [conta],
  );
  const definirPeriodoHistorico = useCallback(
    (periodo: PeriodoHistorico) => {
      if (conta && montado.current && periodosHistorico.some((valor) => valor === periodo)) {
        dispatch({ tipo: 'ALTERAR', valores: { periodoHistorico: periodo } });
      }
    },
    [conta],
  );
  const tentarDeNovo = useCallback(() => {
    if (!conta || !montado.current) return;
    if (!estado.hidratado) setTentativaLeitura((anterior) => anterior + 1);
    else dispatch({ tipo: 'REPETIR_GRAVACAO' });
  }, [conta, estado.hidratado]);

  const valor = useMemo<PreferencesContextData>(
    () => ({
      preferencias: estado.valores,
      carregando: estado.carregando,
      salvando: estado.salvando,
      erro: estado.erro,
      definirFiltroCarteira,
      definirPeriodoHistorico,
      tentarDeNovo,
    }),
    [
      estado.valores,
      estado.carregando,
      estado.salvando,
      estado.erro,
      definirFiltroCarteira,
      definirPeriodoHistorico,
      tentarDeNovo,
    ],
  );
  return <PreferencesContext.Provider value={valor}>{children}</PreferencesContext.Provider>;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { usuario, idSessao } = useAuth();
  const conta = useMemo(
    () => (usuario ? { id: usuario.id, escopo: usuario.escopo } : null),
    [usuario],
  );
  const chave = conta ? `${conta.escopo}:${conta.id}:${idSessao}` : 'anonima';
  return (
    <PreferenciasDaSessao key={chave} conta={conta}>
      {children}
    </PreferenciasDaSessao>
  );
}

export function usePreferences(): PreferencesContextData {
  const contexto = useContext(PreferencesContext);
  if (!contexto)
    throw new Error('usePreferences precisa ser usado dentro de um PreferencesProvider');
  return contexto;
}
