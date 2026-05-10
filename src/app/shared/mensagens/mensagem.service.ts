import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TipoMensagem = 'sucesso' | 'erro' | 'aviso' | 'info';

export interface MensagemApp {
  id: number;
  tipo: TipoMensagem;
  texto: string;
}

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private readonly mensagensSubject = new BehaviorSubject<MensagemApp[]>([]);
  readonly mensagens$ = this.mensagensSubject.asObservable();

  private sequencia = 1;

  sucesso(texto: string): void {
    this.adicionar('sucesso', texto);
  }

  erro(texto: string): void {
    this.adicionar('erro', texto);
  }

  aviso(texto: string): void {
    this.adicionar('aviso', texto);
  }

  info(texto: string): void {
    this.adicionar('info', texto);
  }

  remover(id: number): void {
    this.mensagensSubject.next(this.mensagensSubject.value.filter((mensagem) => mensagem.id !== id));
  }

  private adicionar(tipo: TipoMensagem, texto: string): void {
    const id = this.sequencia++;
    this.mensagensSubject.next([...this.mensagensSubject.value, { id, tipo, texto }]);

    setTimeout(() => this.remover(id), 5000);
  }
}
