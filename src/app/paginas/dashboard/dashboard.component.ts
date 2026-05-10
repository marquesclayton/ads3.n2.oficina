import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { ClientesService } from '../../services/dominios/clientes.service';
import { MecanicosService } from '../../services/dominios/mecanicos.service';
import { OrdensServicoService } from '../../services/dominios/ordens-servico.service';
import { VeiculosService } from '../../services/dominios/veiculos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalClientes = 0;
  totalVeiculos = 0;
  totalMecanicos = 0;
  totalOrdensServico = 0;

  constructor(
    private readonly clientesService: ClientesService,
    private readonly veiculosService: VeiculosService,
    private readonly mecanicosService: MecanicosService,
    private readonly ordensServicoService: OrdensServicoService
  ) {}

  ngOnInit(): void {
    forkJoin({
      clientes: this.clientesService.listar(),
      veiculos: this.veiculosService.listar(),
      mecanicos: this.mecanicosService.listar(),
      ordens: this.ordensServicoService.listar()
    }).subscribe(({ clientes, veiculos, mecanicos, ordens }) => {
      this.totalClientes = clientes.length;
      this.totalVeiculos = veiculos.length;
      this.totalMecanicos = mecanicos.length;
      this.totalOrdensServico = ordens.length;
    });
  }
}
