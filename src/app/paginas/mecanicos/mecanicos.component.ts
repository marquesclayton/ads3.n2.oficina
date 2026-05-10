import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { validarTelefoneBasico } from '../../core/validacoes/campos.util';
import { Mecanico } from '../../modelos/mecanico';
import { MecanicosService } from '../../services/dominios/mecanicos.service';
import { MensagemService } from '../../shared/mensagens/mensagem.service';

@Component({
  selector: 'app-mecanicos',
  imports: [CommonModule, FormsModule],
  templateUrl: './mecanicos.component.html',
  styleUrl: './mecanicos.component.css'
})
export class MecanicosComponent implements OnInit {
  mecanicos: Mecanico[] = [];
  errosFormulario: string[] = [];

  novoMecanico: Omit<Mecanico, 'id'> = {
    nome: '',
    especialidade: '',
    telefone: ''
  };

  constructor(
    private readonly mecanicosService: MecanicosService,
    private readonly mensagemService: MensagemService
  ) {}

  ngOnInit(): void {
    this.carregarMecanicos();
  }

  salvarMecanico(form: NgForm): void {
    this.errosFormulario = this.validarFormulario();

    if (form.invalid || this.errosFormulario.length) {
      this.mensagemService.aviso('Revise os campos obrigatórios antes de salvar o mecânico.');
      return;
    }

    this.mecanicosService.adicionar(this.novoMecanico).subscribe({
      next: () => {
        this.mensagemService.sucesso('Mecânico salvo com sucesso.');
        form.resetForm({ nome: '', especialidade: '', telefone: '' });
        this.carregarMecanicos();
      },
      error: () => {
        this.mensagemService.erro('Não foi possível salvar o mecânico no momento.');
      }
    });
  }

  private carregarMecanicos(): void {
    this.mecanicosService.listar().subscribe({
      next: (mecanicos) => {
        this.mecanicos = mecanicos;
      },
      error: () => {
        this.mensagemService.erro('Falha ao carregar mecânicos.');
      }
    });
  }

  private validarFormulario(): string[] {
    const erros: string[] = [];

    if (!this.novoMecanico.nome.trim()) {
      erros.push('Informe o nome do mecânico.');
    }

    if (!this.novoMecanico.especialidade.trim()) {
      erros.push('Informe a especialidade do mecânico.');
    }

    if (!validarTelefoneBasico(this.novoMecanico.telefone)) {
      erros.push('Informe um telefone válido com DDD.');
    }

    return erros;
  }
}
