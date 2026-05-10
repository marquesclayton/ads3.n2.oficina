import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Mecanico } from '../../modelos/mecanico';
import { DadosOficinaService } from '../../services/dados-oficina.service';

@Component({
  selector: 'app-mecanicos',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="pagina">
      <h1>Mecânicos</h1>

      <form class="formulario" (ngSubmit)="salvarMecanico()">
        <label>
          Nome
          <input name="nome" [(ngModel)]="novoMecanico.nome" required />
        </label>

        <label>
          Especialidade
          <input name="especialidade" [(ngModel)]="novoMecanico.especialidade" required />
        </label>

        <label>
          Telefone
          <input name="telefone" [(ngModel)]="novoMecanico.telefone" required />
        </label>

        <button type="submit">Adicionar mecânico</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let mecanico of mecanicos">
            <td>{{ mecanico.nome }}</td>
            <td>{{ mecanico.especialidade }}</td>
            <td>{{ mecanico.telefone }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class MecanicosComponent {
  mecanicos: Mecanico[] = [];

  novoMecanico: Omit<Mecanico, 'id'> = {
    nome: '',
    especialidade: '',
    telefone: ''
  };

  constructor(private readonly dadosOficinaService: DadosOficinaService) {
    this.carregarMecanicos();
  }

  salvarMecanico(): void {
    this.dadosOficinaService.adicionarMecanico(this.novoMecanico);
    this.novoMecanico = {
      nome: '',
      especialidade: '',
      telefone: ''
    };
    this.carregarMecanicos();
  }

  private carregarMecanicos(): void {
    this.mecanicos = this.dadosOficinaService.listarMecanicos();
  }
}
