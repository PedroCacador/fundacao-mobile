import { AppState } from 'react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../models/User';
import { Beneficio, Conveniado, Oferta } from '../models/Benefit';
import { mapearUsuario } from '../models/mapearUsuario';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';
import { benefitService } from '../services/benefitService';

export function useHomeViewModel() {
  const { usuario, token } = useAuth();
  const user: User = useMemo(() => mapearUsuario(usuario!), [usuario]);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [conveniados, setConveniados] = useState<Conveniado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const requisicaoEmAndamento = useRef(false);

  const carregarBeneficios = useCallback(
    async (mostrarCarregamento = true) => {
      if (!token) {
        setErro('Não foi possível obter o token da sessão.');
        setCarregando(false);
        return;
      }
      if (requisicaoEmAndamento.current) return;

      requisicaoEmAndamento.current = true;
      if (mostrarCarregamento) setCarregando(true);
      setErro(null);
      try {
        const listaBeneficios = await benefitService.listarBeneficios(token);
        setBeneficios(listaBeneficios);

        try {
          const relacoes = await benefitService.listarRelacoes(token);
          setOfertas(relacoes.ofertas);
          setConveniados(relacoes.conveniados);
        } catch (falhaRelacoes) {
          setOfertas([]);
          setConveniados([]);
          setErro(
            falhaRelacoes instanceof ApiError
              ? `Benefícios carregados. Não foi possível carregar conveniados e ofertas: ${falhaRelacoes.message}`
              : 'Benefícios carregados, mas não foi possível carregar conveniados e ofertas.',
          );
        }
      } catch (falha) {
        setErro(
          falha instanceof ApiError
            ? falha.message
            : 'Não foi possível carregar o catálogo de benefícios.',
        );
      } finally {
        requisicaoEmAndamento.current = false;
        setCarregando(false);
      }
    },
    [token],
  );

  useFocusEffect(
    useCallback(() => {
      let focada = true;
      carregarBeneficios(true);

      const intervalo = setInterval(() => {
        if (focada) carregarBeneficios(false);
      }, 30000);
      const assinaturaAppState = AppState.addEventListener('change', (estado) => {
        if (focada && estado === 'active') carregarBeneficios(false);
      });

      return () => {
        focada = false;
        clearInterval(intervalo);
        assinaturaAppState.remove();
      };
    }, [carregarBeneficios]),
  );

  const beneficiosAtivos = beneficios.filter((beneficio) => beneficio.status === 'ATIVO').length;
  const categorias = useMemo(() => {
    const grupos = new Map<
      string,
      {
        conveniados: Map<
          number,
          {
            conveniado: Conveniado;
            beneficios: Map<number, { beneficio: Beneficio; statusOferta: Oferta['status'] }>;
          }
        >;
        beneficiosSemConveniado: Map<number, Beneficio>;
      }
    >();

    for (const oferta of ofertas) {
      const beneficio = beneficios.find((item) => item.id === oferta.beneficio_id);
      const conveniado = conveniados.find((item) => item.id === oferta.conveniado_id);
      if (!beneficio || !conveniado) continue;

      let conveniadosDaCategoria = grupos.get(conveniado.categoria);
      if (!conveniadosDaCategoria) {
        conveniadosDaCategoria = {
          conveniados: new Map(),
          beneficiosSemConveniado: new Map(),
        };
        grupos.set(conveniado.categoria, conveniadosDaCategoria);
      }

      let entrada = conveniadosDaCategoria.conveniados.get(conveniado.id);
      if (!entrada) {
        entrada = { conveniado, beneficios: new Map() };
        conveniadosDaCategoria.conveniados.set(conveniado.id, entrada);
      }
      entrada.beneficios.set(beneficio.id, { beneficio, statusOferta: oferta.status });
    }

    const beneficiosVinculados = new Set<number>();
    for (const grupo of grupos.values()) {
      for (const conveniado of grupo.conveniados.values()) {
        for (const beneficioId of conveniado.beneficios.keys()) {
          beneficiosVinculados.add(beneficioId);
        }
      }
    }

    const semCategoria = 'Sem conveniado vinculado';
    for (const beneficio of beneficios) {
      if (beneficiosVinculados.has(beneficio.id)) continue;

      let grupo = grupos.get(semCategoria);
      if (!grupo) {
        grupo = { conveniados: new Map(), beneficiosSemConveniado: new Map() };
        grupos.set(semCategoria, grupo);
      }
      grupo.beneficiosSemConveniado.set(beneficio.id, beneficio);
    }

    return Array.from(grupos, ([nome, grupo]) => ({
      nome,
      conveniados: Array.from(grupo.conveniados.values()).map(({ conveniado, beneficios }) => ({
        conveniado,
        beneficios: Array.from(beneficios.values()),
      })),
      beneficiosSemConveniado: Array.from(grupo.beneficiosSemConveniado.values()),
    }));
  }, [beneficios, ofertas, conveniados]);

  return {
    user,
    beneficios,
    ofertas,
    conveniados,
    beneficiosAtivos,
    categorias,
    carregando,
    erro,
    recarregar: carregarBeneficios,
  };
}
