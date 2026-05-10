import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { validarCpfBasico, validarTelefoneBasico } from '../../core/validacoes/campos.util';
import { Cliente } from '../../modelos/cliente';
import { ClientesService } from '../../services/dominios/clientes.service';
import { MensagemService } from '../../shared/mensagens/mensagem.service';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  errosFormulario: string[] = [];

  novoCliente: Omit<Cliente, 'id'> = {
    nome: '',
    cpf: '',
    telefone: ''
  };

  constructor(
    private readonly clientesService: ClientesService,
    private readonly mensagemService: MensagemService
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  salvarCliente(form: NgForm): void {
    this.errosFormulario = this.validarFormulario();

    if (form.invalid || this.errosFormulario.length) {
      this.mensagemService.aviso('Revise os campos obrigatórios antes de salvar o cliente.');
      return;
    }

    this.clientesService.adicionar(this.novoCliente).subscribe({
      next: () => {
        this.mensagemService.sucesso('Cliente salvo com sucesso.');
        form.resetForm({ nome: '', cpf: '', telefone: '' });
        this.carregarClientes();
      },
      error: () => {
        this.mensagemService.erro('Não foi possível salvar o cliente no momento.');
      }
    });
  }

  private carregarClientes(): void {
    this.clientesService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: () => {
        this.mensagemService.erro('Falha ao carregar clientes.');
      }
    });
  }

  private validarFormulario(): string[] {
    const erros: string[] = [];

    if (!this.novoCliente.nome.trim()) {
      erros.push('Informe o nome do cliente.');
    }

    if (!validarCpfBasico(this.novoCliente.cpf)) {
      erros.push('Informe um CPF válido com 11 dígitos.');
    }

    if (!validarTelefoneBasico(this.novoCliente.telefone)) {
      erros.push('Informe um telefone válido com DDD.');
    }

    return erros;
  }
}
