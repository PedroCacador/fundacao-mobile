import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BeneficioCatalogo } from '../models/Catalog';
import { ApiError } from '../services/api';
import { benefitService } from '../services/benefitService';
import { montarCatalogo } from '../utils/catalog';
import { useAuth } from './AuthContext';

export interface CatalogContextData {
  itens: BeneficioCatalogo[];
  carregando: boolean;
  atualizando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
}

type EstadoCatalogo = Omit<CatalogContextData, 'recarregar'>;
const CatalogContext = createContext<CatalogContextData | undefined>(undefined);

function CatalogoDaSessao({
  children,
  habilitado,
}: {
  children: React.ReactNode;
  habilitado: boolean;
}) {
  const [estado, setEstado] = useState<EstadoCatalogo>({
    itens: [],
    carregando: habilitado,
    atualizando: false,
    erro: null,
  });
  const montado = useRef(false);
  const pendente = useRef<Promise<void> | null>(null);

  const recarregar = useCallback((): Promise<void> => {
    if (!habilitado || !montado.current) return Promise.resolve();
    if (pendente.current) return pendente.current;

    setEstado((anterior) => ({ ...anterior, atualizando: !anterior.carregando, erro: null }));
    const consulta = benefitService
      .listarCatalogo()
      .then((dados) => {
        if (montado.current) {
          setEstado({
            itens: montarCatalogo(dados.beneficios, dados.ofertas, dados.conveniados),
            carregando: false,
            atualizando: false,
            erro: null,
          });
        }
      })
      .catch((falha: unknown) => {
        if (montado.current) {
          setEstado((anterior) => ({
            ...anterior,
            carregando: false,
            atualizando: false,
            erro:
              falha instanceof ApiError
                ? falha.message
                : 'Não foi possível carregar os benefícios.',
          }));
        }
      })
      .finally(() => {
        pendente.current = null;
      });
    pendente.current = consulta;
    return consulta;
  }, [habilitado]);

  useEffect(() => {
    montado.current = true;
    void recarregar();
    return () => {
      montado.current = false;
    };
  }, [recarregar]);

  const valor = useMemo(() => ({ ...estado, recarregar }), [estado, recarregar]);
  return <CatalogContext.Provider value={valor}>{children}</CatalogContext.Provider>;
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const { usuario, idSessao } = useAuth();
  const chave = usuario ? `${usuario.escopo}:${usuario.id}:${idSessao}` : 'anonima';

  // A fronteira remonta os estados privados, inclusive após reentrar na mesma conta.
  return (
    <CatalogoDaSessao key={chave} habilitado={usuario?.escopo === 'COLABORADOR'}>
      {children}
    </CatalogoDaSessao>
  );
}

export function useCatalog(): CatalogContextData {
  const contexto = useContext(CatalogContext);
  if (!contexto) throw new Error('useCatalog precisa ser usado dentro de um CatalogProvider');
  return contexto;
}
