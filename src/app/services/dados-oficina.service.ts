import { Injectable } from '@angular/core';

import { Cliente } from '../modelos/cliente';
import { Mecanico } from '../modelos/mecanico';
import { OrdemServico } from '../modelos/ordem-servico';
import { Usuario } from '../modelos/usuario';
import { Veiculo } from '../modelos/veiculo';

@Injectable({
  providedIn: 'root'
})
export class DadosOficinaService {
  private usuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Ana Atendimento',
      login: 'ana.atendimento',
      email: 'ana@oficina.local',
      perfil: 'atendente'
    }
  ];

  private clientes: Cliente[] = [
    {
      id: 1,
      nome: 'Carlos Silva',
      cpf: '12345678901',
      telefone: '(62) 99999-0001'
    }
  ];

  private veiculos: Veiculo[] = [
    {
      id: 1,
      clienteId: 1,
      placa: 'ABC-1234',
      modelo: 'Onix',
      marca: 'Chevrolet',
      ano: 2021
    }
  ];

  private mecanicos: Mecanico[] = [
    {
      id: 1,
      nome: 'João Mecânico',
      especialidade: 'Suspensão',
      telefone: '(62) 98888-0001'
    }
  ];

  private ordensServico: OrdemServico[] = [
    {
      id: 1,
      clienteId: 1,
      veiculoId: 1,
      usuarioResponsavelId: 1,
      mecanicoResponsavelId: 1,
      dataAbertura: '2026-05-10',
      status: 'aberta',
      descricaoProblema: 'Ruído ao frear em baixa velocidade.',
      servicosExecutados: [
        {
          descricao: 'Inspeção do sistema de freio',
          valor: 120,
          tempoExecucaoHoras: 1
        }
      ],
      pecasAplicadas: [
        {
          descricao: 'Pastilha de freio dianteira',
          quantidade: 1,
          valorUnitario: 180
        }
      ]
    }
  ];

  private proximoId = {
    cliente: 2,
    veiculo: 2,
    mecanico: 2,
    ordemServico: 2
  };

  listarUsuarios(): Usuario[] {
    return [...this.usuarios];
  }

  listarClientes(): Cliente[] {
    return [...this.clientes];
  }

  adicionarCliente(cliente: Omit<Cliente, 'id'>): void {
    this.clientes = [
      ...this.clientes,
      {
        id: this.proximoId.cliente++,
        ...cliente
      }
    ];
  }

  listarVeiculos(): Veiculo[] {
    return [...this.veiculos];
  }

  adicionarVeiculo(veiculo: Omit<Veiculo, 'id'>): void {
    this.veiculos = [
      ...this.veiculos,
      {
        id: this.proximoId.veiculo++,
        ...veiculo
      }
    ];
  }

  listarMecanicos(): Mecanico[] {
    return [...this.mecanicos];
  }

  adicionarMecanico(mecanico: Omit<Mecanico, 'id'>): void {
    this.mecanicos = [
      ...this.mecanicos,
      {
        id: this.proximoId.mecanico++,
        ...mecanico
      }
    ];
  }

  listarOrdensServico(): OrdemServico[] {
    return [...this.ordensServico];
  }

  adicionarOrdemServico(ordemServico: Omit<OrdemServico, 'id'>): void {
    this.ordensServico = [
      ...this.ordensServico,
      {
        id: this.proximoId.ordemServico++,
        ...ordemServico
      }
    ];
  }
}
