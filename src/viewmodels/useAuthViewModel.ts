export function useAuthViewModel() {
  const login = (usuario: string, senha: string) => {};
  const register = (nome: string, email: string, cpf: string, senha: string) => {};

  return { login, register };
}
