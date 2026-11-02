export function criarFilaAssincrona() {
  let fila: Promise<unknown> = Promise.resolve();
  return function executarEmOrdem<T>(operacao: () => Promise<T>): Promise<T> {
    const resultado = fila.then(operacao);
    fila = resultado.then(
      () => undefined,
      () => undefined,
    );
    return resultado;
  };
}
