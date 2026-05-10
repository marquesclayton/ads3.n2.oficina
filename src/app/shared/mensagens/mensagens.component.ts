import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MensagemService } from './mensagem.service';

@Component({
  selector: 'app-mensagens',
  imports: [CommonModule],
  templateUrl: './mensagens.component.html',
  styleUrl: './mensagens.component.css'
})
export class MensagensComponent {
  constructor(private readonly mensagemService: MensagemService) {}

  get mensagens$() {
    return this.mensagemService.mensagens$;
  }

  fecharMensagem(id: number): void {
    this.mensagemService.remover(id);
  }
}
