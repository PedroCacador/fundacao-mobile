import { User } from '../models/User';
import { UsuarioAutenticado } from '../models/Auth';

const NAO_INFORMADO = 'Não informado';

function formatarTelefone(telefone?: string | null): string {
  if (!telefone) return NAO_INFORMADO;
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return telefone;
}

/** Converte o usuário da API no formato usado pelas telas. */
export function mapearUsuario(usuario: UsuarioAutenticado): User {
  const colaborador = usuario.colaborador;

  return {
    name: usuario.nome,
    role: colaborador?.cargo ?? 'Colaborador(a) da FCV',
    matricula: colaborador?.matricula ?? NAO_INFORMADO,
    email: usuario.email,
    phone: formatarTelefone(colaborador?.telefone),
    cpf: NAO_INFORMADO,
    cargo: colaborador?.cargo ?? NAO_INFORMADO,
    setor: colaborador?.setor ?? NAO_INFORMADO,
    emailCorporativo: usuario.email,
  };
}
