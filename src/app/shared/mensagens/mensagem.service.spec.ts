import { describe, expect, it, vi } from 'vitest';

import { MensagemService } from './mensagem.service';

describe('MensagemService', () => {
  it('deve adicionar e remover mensagem manualmente', () => {
    const service = new MensagemService();
    let mensagensAtuais = [] as { id: number; texto: string }[];

    service.mensagens$.subscribe((mensagens) => {
      mensagensAtuais = mensagens;
    });

    service.sucesso('Operação concluída');
    expect(mensagensAtuais).toHaveLength(1);

    service.remover(mensagensAtuais[0].id);
    expect(mensagensAtuais).toHaveLength(0);
  });

  it('deve remover automaticamente após timeout', () => {
    vi.useFakeTimers();

    const service = new MensagemService();
    let quantidade = 0;

    service.mensagens$.subscribe((mensagens) => {
      quantidade = mensagens.length;
    });

    service.erro('Falha de integração');
    expect(quantidade).toBe(1);

    vi.advanceTimersByTime(5000);
    expect(quantidade).toBe(0);

    vi.useRealTimers();
  });
});
