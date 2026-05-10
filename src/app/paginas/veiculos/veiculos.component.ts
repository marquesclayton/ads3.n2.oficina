import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Cliente } from '../../modelos/cliente';
import { Veiculo } from '../../modelos/veiculo';
import { DadosOficinaService } from '../../services/dados-oficina.service';

@Component({
  selector: 'app-veiculos',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="pagina">
      <h1>Veículos</h1>

      <form class="formulario" (ngSubmit)="salvarVeiculo()">
        <label>
          Cliente
          <select name="clienteId" [(ngModel)]="novoVeiculo.clienteId" required>
            <option [ngValue]="0">Selecione</option>
            <option *ngFor="let cliente of clientes" [ngValue]="cliente.id">
              {{ cliente.nome }}
            </option>
          </select>
        </label>

        <label>
          Placa
          <input name="placa" [(ngModel)]="novoVeiculo.placa" required />
        </label>

        <label>
          Modelo
          <input name="modelo" [(ngModel)]="novoVeiculo.modelo" required />
        </label>

        <label>
          Marca
          <input name="marca" [(ngModel)]="novoVeiculo.marca" required />
        </label>

        <label>
          Ano
          <input name="ano" type="number" [(ngModel)]="novoVeiculo.ano" required />
        </label>

        <button type="submit">Adicionar veículo</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Ano</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let veiculo of veiculos">
            <td>{{ nomeCliente(veiculo.clienteId) }}</td>
            <td>{{ veiculo.placa }}</td>
            <td>{{ veiculo.modelo }}</td>
            <td>{{ veiculo.marca }}</td>
            <td>{{ veiculo.ano }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class VeiculosComponent {
  clientes: Cliente[] = [];
  veiculos: Veiculo[] = [];

  novoVeiculo: Omit<Veiculo, 'id'> = {
    clienteId: 0,
    placa: '',
    modelo: '',
    marca: '',
    ano: new Date().getFullYear()
  };

  constructor(private readonly dadosOficinaService: DadosOficinaService) {
    this.clientes = this.dadosOficinaService.listarClientes();
    this.carregarVeiculos();
  }

  salvarVeiculo(): void {
    if (!this.novoVeiculo.clienteId) {
      return;
    }

    this.dadosOficinaService.adicionarVeiculo(this.novoVeiculo);
    this.novoVeiculo = {
      clienteId: 0,
      placa: '',
      modelo: '',
      marca: '',
      ano: new Date().getFullYear()
    };
    this.carregarVeiculos();
  }

  nomeCliente(clienteId: number): string {
    return this.clientes.find((cliente) => cliente.id === clienteId)?.nome ?? 'Não informado';
  }

  private carregarVeiculos(): void {
    this.veiculos = this.dadosOficinaService.listarVeiculos();
  }
}
