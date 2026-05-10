import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Cliente } from '../../modelos/cliente';
import { DadosOficinaService } from '../../services/dados-oficina.service';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="pagina">
      <h1>Clientes</h1>

      <form class="formulario" (ngSubmit)="salvarCliente()">
        <label>
          Nome
          <input name="nome" [(ngModel)]="novoCliente.nome" required />
        </label>

        <label>
          CPF
          <input name="cpf" [(ngModel)]="novoCliente.cpf" required />
        </label>

        <label>
          Telefone
          <input name="telefone" [(ngModel)]="novoCliente.telefone" required />
        </label>

        <button type="submit">Adicionar cliente</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cliente of clientes">
            <td>{{ cliente.nome }}</td>
            <td>{{ cliente.cpf }}</td>
            <td>{{ cliente.telefone }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class ClientesComponent {
  clientes: Cliente[] = [];

  novoCliente: Omit<Cliente, 'id'> = {
    nome: '',
    cpf: '',
    telefone: ''
  };

  constructor(private readonly dadosOficinaService: DadosOficinaService) {
    this.carregarClientes();
  }

  salvarCliente(): void {
    this.dadosOficinaService.adicionarCliente(this.novoCliente);
    this.novoCliente = {
      nome: '',
      cpf: '',
      telefone: ''
    };
    this.carregarClientes();
  }

  private carregarClientes(): void {
    this.clientes = this.dadosOficinaService.listarClientes();
  }
}
