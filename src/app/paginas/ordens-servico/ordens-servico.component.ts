import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Cliente } from '../../modelos/cliente';
import { Mecanico } from '../../modelos/mecanico';
import { OrdemServico, PecaAplicada, ServicoExecutado } from '../../modelos/ordem-servico';
import { Usuario } from '../../modelos/usuario';
import { Veiculo } from '../../modelos/veiculo';
import { ClientesService } from '../../services/dominios/clientes.service';
import { MecanicosService } from '../../services/dominios/mecanicos.service';
import { OrdensServicoService } from '../../services/dominios/ordens-servico.service';
import { UsuariosService } from '../../services/dominios/usuarios.service';
import { VeiculosService } from '../../services/dominios/veiculos.service';
import { MensagemService } from '../../shared/mensagens/mensagem.service';

@Component({
  selector: 'app-ordens-servico',
  imports: [CommonModule, FormsModule],
  templateUrl: './ordens-servico.component.html',
  styleUrl: './ordens-servico.component.css'
})
export class OrdensServicoComponent implements OnInit {
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  veiculos: Veiculo[] = [];
  mecanicos: Mecanico[] = [];
  ordensServico: OrdemServico[] = [];
  errosFormulario: string[] = [];

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

  constructor(
    private readonly clientesService: ClientesService,
    private readonly usuariosService: UsuariosService,
    private readonly veiculosService: VeiculosService,
    private readonly mecanicosService: MecanicosService,
    private readonly ordensServicoService: OrdensServicoService,
    private readonly mensagemService: MensagemService
  ) {}

  ngOnInit(): void {
    forkJoin({
      clientes: this.clientesService.listar(),
      usuarios: this.usuariosService.listar(),
      veiculos: this.veiculosService.listar(),
      mecanicos: this.mecanicosService.listar()
    }).subscribe({
      next: ({ clientes, usuarios, veiculos, mecanicos }) => {
        this.clientes = clientes;
        this.usuarios = usuarios;
        this.veiculos = veiculos;
        this.mecanicos = mecanicos;
      },
      error: () => {
        this.mensagemService.erro('Falha ao carregar dados de apoio para ordens de serviço.');
      }
    });

    this.carregarOrdens();
  }

  adicionarServico(): void {
    if (!this.novoServico.descricao.trim() || this.novoServico.valor <= 0 || this.novoServico.tempoExecucaoHoras <= 0) {
      this.mensagemService.aviso('Preencha descrição, valor e tempo do serviço antes de adicionar.');
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
    if (!this.novaPeca.descricao.trim() || this.novaPeca.quantidade <= 0 || this.novaPeca.valorUnitario <= 0) {
      this.mensagemService.aviso('Preencha descrição, quantidade e valor unitário da peça antes de adicionar.');
      return;
    }

    this.pecasTemp = [...this.pecasTemp, { ...this.novaPeca }];
    this.novaPeca = {
      descricao: '',
      quantidade: 1,
      valorUnitario: 0
    };
  }

  salvarOrdemServico(form: NgForm): void {
    this.errosFormulario = this.validarFormulario();

    if (form.invalid || this.errosFormulario.length) {
      this.mensagemService.aviso('Revise os campos obrigatórios antes de cadastrar a ordem de serviço.');
      return;
    }

    this.ordensServicoService
      .adicionar({
        ...this.novaOrdem,
        servicosExecutados: [...this.servicosTemp],
        pecasAplicadas: [...this.pecasTemp]
      })
      .subscribe({
        next: () => {
          this.mensagemService.sucesso('Ordem de serviço cadastrada com sucesso.');
          form.resetForm({
            clienteId: 0,
            veiculoId: 0,
            usuarioResponsavelId: 0,
            mecanicoResponsavelId: 0,
            dataAbertura: new Date().toISOString().slice(0, 10),
            descricaoProblema: ''
          });
          this.servicosTemp = [];
          this.pecasTemp = [];
          this.carregarOrdens();
        },
        error: () => {
          this.mensagemService.erro('Não foi possível cadastrar a ordem de serviço no momento.');
        }
      });
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
    this.ordensServicoService.listar().subscribe({
      next: (ordensServico) => {
        this.ordensServico = ordensServico;
      },
      error: () => {
        this.mensagemService.erro('Falha ao carregar ordens de serviço.');
      }
    });
  }

  private validarFormulario(): string[] {
    const erros: string[] = [];

    if (!this.novaOrdem.clienteId) {
      erros.push('Selecione um cliente.');
    }

    if (!this.novaOrdem.veiculoId) {
      erros.push('Selecione um veículo.');
    }

    if (!this.novaOrdem.usuarioResponsavelId) {
      erros.push('Selecione um usuário responsável.');
    }

    if (!this.novaOrdem.mecanicoResponsavelId) {
      erros.push('Selecione um mecânico responsável.');
    }

    if (!this.novaOrdem.dataAbertura) {
      erros.push('Informe a data de abertura.');
    }

    if (this.novaOrdem.descricaoProblema.trim().length < 10) {
      erros.push('Descreva o problema com ao menos 10 caracteres.');
    }

    if (!this.servicosTemp.length) {
      erros.push('Adicione ao menos um serviço executado.');
    }

    return erros;
  }
}
