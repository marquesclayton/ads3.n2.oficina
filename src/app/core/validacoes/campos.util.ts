export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

/**
 * Validação simplificada: verifica apenas formato com 11 dígitos.
 * Não aplica cálculo dos dígitos verificadores do CPF.
 */
export function validarCpfBasico(cpf: string): boolean {
  return /^\d{11}$/.test(somenteDigitos(cpf));
}

export function validarTelefoneBasico(telefone: string): boolean {
  return /^\d{10,11}$/.test(somenteDigitos(telefone));
}

export function validarPlacaBasica(placa: string): boolean {
  const placaNormalizada = placa.trim().toUpperCase();
  return /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/.test(placaNormalizada);
}
