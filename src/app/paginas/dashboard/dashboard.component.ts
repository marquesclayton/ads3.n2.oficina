import { Component } from '@angular/core';

import { DadosOficinaService } from '../../services/dados-oficina.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <section class="pagina">
      <h1>Dashboard da Oficina</h1>
      <p>Aplicação acadêmica para gestão dos principais fluxos da oficina mecânica.</p>

      <div class="grid">
        <article class="card">
          <h2>Clientes</h2>
          <strong>{{ totalClientes }}</strong>
        </article>
        <article class="card">
          <h2>Veículos</h2>
          <strong>{{ totalVeiculos }}</strong>
        </article>
        <article class="card">
          <h2>Mecânicos</h2>
          <strong>{{ totalMecanicos }}</strong>
        </article>
        <article class="card">
          <h2>Ordens de Serviço</h2>
          <strong>{{ totalOrdensServico }}</strong>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .card {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 1rem;
        background: #fff;
      }

      .card h2 {
        margin: 0;
        font-size: 1rem;
      }

      .card strong {
        display: block;
        margin-top: 0.5rem;
        font-size: 1.8rem;
      }
    `
  ]
})
export class DashboardComponent {
  constructor(private readonly dadosOficinaService: DadosOficinaService) {}

  get totalClientes(): number {
    return this.dadosOficinaService.listarClientes().length;
  }

  get totalVeiculos(): number {
    return this.dadosOficinaService.listarVeiculos().length;
  }

  get totalMecanicos(): number {
    return this.dadosOficinaService.listarMecanicos().length;
  }

  get totalOrdensServico(): number {
    return this.dadosOficinaService.listarOrdensServico().length;
  }
}
