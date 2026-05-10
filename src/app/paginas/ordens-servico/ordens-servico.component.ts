import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Cliente } from '../../modelos/cliente';
import { Mecanico } from '../../modelos/mecanico';
import { OrdemServico, PecaAplicada, ServicoExecutado } from '../../modelos/ordem-servico';
import { Usuario } from '../../modelos/usuario';
import { Veiculo } from '../../modelos/veiculo';
import { DadosOficinaService } from '../../services/dados-oficina.service';

@Component({
  selector: 'app-ordens-servico',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="pagina">
      <h1>Ordens de Serviço</h1>

      <form class="formulario" (ngSubmit)="salvarOrdemServico()">
        <label>
          Cliente
          <select name="clienteId" [(ngModel)]="novaOrdem.clienteId" required>
            <option [ngValue]="0">Selecione</option>
            <option *ngFor="let cliente of clientes" [ngValue]="cliente.id">{{ cliente.nome }}</option>
          </select>
        </label>

        <label>
          Veículo
          <select name="veiculoId" [(ngModel)]="novaOrdem.veiculoId" required>
            <option [ngValue]="0">Selecione</option>
            <option *ngFor="let veiculo of veiculos" [ngValue]="veiculo.id">
              {{ veiculo.placa }} - {{ veiculo.modelo }}
            </option>
          </select>
        </label>

        <label>
          Usuário responsável
          <select name="usuarioResponsavelId" [(ngModel)]="novaOrdem.usuarioResponsavelId" required>
            <option [ngValue]="0">Selecione</option>
            <option *ngFor="let usuario of usuarios" [ngValue]="usuario.id">{{ usuario.nome }}</option>
          </select>
        </label>

        <label>
          Mecânico responsável
          <select name="mecanicoResponsavelId" [(ngModel)]="novaOrdem.mecanicoResponsavelId" required>
            <option [ngValue]="0">Selecione</option>
            <option *ngFor="let mecanico of mecanicos" [ngValue]="mecanico.id">{{ mecanico.nome }}</option>
          </select>
        </label>

        <label>
          Data de abertura
          <input name="dataAbertura" type="date" [(ngModel)]="novaOrdem.dataAbertura" required />
        </label>

        <label>
          Descrição do problema
          <textarea name="descricaoProblema" [(ngModel)]="novaOrdem.descricaoProblema" required></textarea>
        </label>

        <fieldset>
          <legend>Serviços executados</legend>
          <div class="linha-inline">
            <input
              name="servicoDescricao"
              [(ngModel)]="novoServico.descricao"
              placeholder="Descrição do serviço"
            />
            <input
              name="servicoValor"
              type="number"
              [(ngModel)]="novoServico.valor"
              placeholder="Valor"
            />
            <input
              name="servicoTempo"
              type="number"
              [(ngModel)]="novoServico.tempoExecucaoHoras"
              placeholder="Tempo (h)"
            />
            <button type="button" (click)="adicionarServico()">Adicionar serviço</button>
          </div>
          <ul>
            <li *ngFor="let servico of servicosTemp">
              {{ servico.descricao }} - R$ {{ servico.valor | number: '1.2-2' }} -
              {{ servico.tempoExecucaoHoras }}h
            </li>
          </ul>
        </fieldset>

        <fieldset>
          <legend>Peças aplicadas</legend>
          <div class="linha-inline">
            <input name="pecaDescricao" [(ngModel)]="novaPeca.descricao" placeholder="Descrição da peça" />
            <input name="pecaQuantidade" type="number" [(ngModel)]="novaPeca.quantidade" placeholder="Qtd." />
            <input
              name="pecaValorUnitario"
              type="number"
              [(ngModel)]="novaPeca.valorUnitario"
              placeholder="Valor unitário"
            />
            <button type="button" (click)="adicionarPeca()">Adicionar peça</button>
          </div>
          <ul>
            <li *ngFor="let peca of pecasTemp">
              {{ peca.descricao }} - {{ peca.quantidade }}x - R$
              {{ peca.valorUnitario | number: '1.2-2' }}
            </li>
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ordem de serviço</button>
      </form>

      <div class="lista-os" *ngFor="let ordem of ordensServico">
        <h2>OS #{{ ordem.id }} - {{ ordem.status }}</h2>
        <p><strong>Cliente:</strong> {{ nomeCliente(ordem.clienteId) }}</p>
        <p><strong>Veículo:</strong> {{ dadosVeiculo(ordem.veiculoId) }}</p>
        <p><strong>Mecânico:</strong> {{ nomeMecanico(ordem.mecanicoResponsavelId) }}</p>
        <p><strong>Problema:</strong> {{ ordem.descricaoProblema }}</p>

        <p><strong>Serviços:</strong></p>
        <ul>
          <li *ngFor="let servico of ordem.servicosExecutados">
            {{ servico.descricao }} - R$ {{ servico.valor | number: '1.2-2' }} -
            {{ servico.tempoExecucaoHoras }}h
          </li>
        </ul>

        <p><strong>Peças aplicadas:</strong></p>
        <ul>
          <li *ngFor="let peca of ordem.pecasAplicadas">
            {{ peca.descricao }} - {{ peca.quantidade }}x - R$
            {{ peca.valorUnitario | number: '1.2-2' }}
          </li>
        </ul>
      </div>
    </section>
  `,
  styles: [
    `
      .linha-inline {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.5rem;
        align-items: end;
      }

      .lista-os {
        margin-top: 1rem;
        padding: 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        background: #fff;
      }
    `
  ]
})
export class OrdensServicoComponent {
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  veiculos: Veiculo[] = [];
  mecanicos: Mecanico[] = [];
  ordensServico: OrdemServico[] = [];

  novaOrdem: Omit<OrdemServico, 'id'> = {
    clienteId: 0,
    veiculoId: 0,
    usuarioResponsavelId: 0,
    mecanicoResponsavelId: 0,
    dataAbertura: new Date().toISOString().slice(0, 10),
    status: 'aberta',
    descricaoProblema: '',
    servicosExecutados: [],
    pecasAplicadas: []
  };

  novoServico: ServicoExecutado = {
    descricao: '',
    valor: 0,
    tempoExecucaoHoras: 0
  };

  novaPeca: PecaAplicada = {
    descricao: '',
    quantidade: 1,
    valorUnitario: 0
  };

  servicosTemp: ServicoExecutado[] = [];
  pecasTemp: PecaAplicada[] = [];

  constructor(private readonly dadosOficinaService: DadosOficinaService) {
    this.clientes = this.dadosOficinaService.listarClientes();
    this.usuarios = this.dadosOficinaService.listarUsuarios();
    this.veiculos = this.dadosOficinaService.listarVeiculos();
    this.mecanicos = this.dadosOficinaService.listarMecanicos();
    this.carregarOrdens();
  }

  adicionarServico(): void {
    if (!this.novoServico.descricao || this.novoServico.valor <= 0 || this.novoServico.tempoExecucaoHoras <= 0) {
      return;
    }

    this.servicosTemp = [...this.servicosTemp, { ...this.novoServico }];
    this.novoServico = {
      descricao: '',
      valor: 0,
      tempoExecucaoHoras: 0
    };
  }

  adicionarPeca(): void {
    if (!this.novaPeca.descricao || this.novaPeca.quantidade <= 0 || this.novaPeca.valorUnitario <= 0) {
      return;
    }

    this.pecasTemp = [...this.pecasTemp, { ...this.novaPeca }];
    this.novaPeca = {
      descricao: '',
      quantidade: 1,
      valorUnitario: 0
    };
  }

  salvarOrdemServico(): void {
    if (!this.novaOrdem.clienteId || !this.novaOrdem.veiculoId || !this.novaOrdem.usuarioResponsavelId) {
      return;
    }

    this.dadosOficinaService.adicionarOrdemServico({
      ...this.novaOrdem,
      servicosExecutados: [...this.servicosTemp],
      pecasAplicadas: [...this.pecasTemp]
    });

    this.novaOrdem = {
      clienteId: 0,
      veiculoId: 0,
      usuarioResponsavelId: 0,
      mecanicoResponsavelId: 0,
      dataAbertura: new Date().toISOString().slice(0, 10),
      status: 'aberta',
      descricaoProblema: '',
      servicosExecutados: [],
      pecasAplicadas: []
    };
    this.servicosTemp = [];
    this.pecasTemp = [];
    this.carregarOrdens();
  }

  nomeCliente(clienteId: number): string {
    return this.clientes.find((cliente) => cliente.id === clienteId)?.nome ?? 'Não informado';
  }

  nomeMecanico(mecanicoId: number): string {
    return this.mecanicos.find((mecanico) => mecanico.id === mecanicoId)?.nome ?? 'Não informado';
  }

  dadosVeiculo(veiculoId: number): string {
    const veiculo = this.veiculos.find((item) => item.id === veiculoId);
    return veiculo ? `${veiculo.placa} - ${veiculo.modelo}` : 'Não informado';
  }

  private carregarOrdens(): void {
    this.ordensServico = this.dadosOficinaService.listarOrdensServico();
  }
}
