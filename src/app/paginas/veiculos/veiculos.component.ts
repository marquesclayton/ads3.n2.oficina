import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { validarPlacaBasica } from '../../core/validacoes/campos.util';
import { Cliente } from '../../modelos/cliente';
import { Veiculo } from '../../modelos/veiculo';
import { ClientesService } from '../../services/dominios/clientes.service';
import { VeiculosService } from '../../services/dominios/veiculos.service';
import { MensagemService } from '../../shared/mensagens/mensagem.service';

@Component({
  selector: 'app-veiculos',
  imports: [CommonModule, FormsModule],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.css'
})
export class VeiculosComponent implements OnInit {
  clientes: Cliente[] = [];
  veiculos: Veiculo[] = [];
  errosFormulario: string[] = [];

  novoVeiculo: Omit<Veiculo, 'id'> = this.criarVeiculoVazio();

  constructor(
    private readonly clientesService: ClientesService,
    private readonly veiculosService: VeiculosService,
    private readonly mensagemService: MensagemService
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarVeiculos();
  }

  salvarVeiculo(form: NgForm): void {
    this.errosFormulario = this.validarFormulario();

    if (form.invalid || this.errosFormulario.length) {
      this.mensagemService.aviso('Revise os campos obrigatórios antes de salvar o veículo.');
      return;
    }

    this.veiculosService.adicionar(this.novoVeiculo).subscribe({
      next: () => {
        this.mensagemService.sucesso('Veículo salvo com sucesso.');
        form.resetForm(this.criarVeiculoVazio());
        this.carregarVeiculos();
      },
      error: () => {
        this.mensagemService.erro('Não foi possível salvar o veículo no momento.');
      }
    });
  }

  nomeCliente(clienteId: string): string {
    return this.clientes.find((cliente) => cliente.id === clienteId)?.nome ?? 'Não informado';
  }

  private carregarClientes(): void {
    this.clientesService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: () => {
        this.mensagemService.erro('Falha ao carregar clientes para o cadastro de veículo.');
      }
    });
  }

  private carregarVeiculos(): void {
    this.veiculosService.listar().subscribe({
      next: (veiculos) => {
        this.veiculos = veiculos;
      },
      error: () => {
        this.mensagemService.erro('Falha ao carregar veículos.');
      }
    });
  }

  private validarFormulario(): string[] {
    const erros: string[] = [];
    const anoAtual = new Date().getFullYear();

    if (!this.novoVeiculo.clienteId) {
      erros.push('Selecione um cliente.');
    }

    if (!validarPlacaBasica(this.novoVeiculo.placa)) {
      erros.push('Informe uma placa válida (ex.: ABC-1234 ou ABC1D23).');
    }

    if (!this.novoVeiculo.modelo.trim()) {
      erros.push('Informe o modelo do veículo.');
    }

    if (!this.novoVeiculo.marca.trim()) {
      erros.push('Informe a marca do veículo.');
    }

    if (this.novoVeiculo.ano < 1950 || this.novoVeiculo.ano > anoAtual) {
      erros.push(`Informe um ano entre 1950 e ${anoAtual}.`);
    }

    return erros;
  }

  private criarVeiculoVazio(): Omit<Veiculo, 'id'> {
    return {
      clienteId: '',
      placa: '',
      modelo: '',
      marca: '',
      ano: new Date().getFullYear()
    };
  }
}
