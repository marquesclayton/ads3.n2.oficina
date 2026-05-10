import { describe, expect, it } from 'vitest';

import { somenteDigitos, validarCpfBasico, validarPlacaBasica, validarTelefoneBasico } from './campos.util';

describe('campos.util', () => {
  it('deve manter apenas dígitos', () => {
    expect(somenteDigitos('(62) 99999-0001')).toBe('62999990001');
  });

  it('deve validar CPF básico com 11 dígitos', () => {
    expect(validarCpfBasico('123.456.789-01')).toBe(true);
    expect(validarCpfBasico('1234567890')).toBe(false);
  });

  it('deve validar telefone com 10 ou 11 dígitos', () => {
    expect(validarTelefoneBasico('(62) 99999-0001')).toBe(true);
    expect(validarTelefoneBasico('9999')).toBe(false);
  });

  it('deve validar placa antiga e Mercosul', () => {
    expect(validarPlacaBasica('ABC-1234')).toBe(true);
    expect(validarPlacaBasica('ABC1D23')).toBe(true);
    expect(validarPlacaBasica('AB-1234')).toBe(false);
  });
});
