import { Routes } from '@angular/router';

import { ClientesComponent } from './paginas/clientes/clientes.component';
import { DashboardComponent } from './paginas/dashboard/dashboard.component';
import { MecanicosComponent } from './paginas/mecanicos/mecanicos.component';
import { OrdensServicoComponent } from './paginas/ordens-servico/ordens-servico.component';
import { VeiculosComponent } from './paginas/veiculos/veiculos.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  },
  {
    path: 'veiculos',
    component: VeiculosComponent
  },
  {
    path: 'mecanicos',
    component: MecanicosComponent
  },
  {
    path: 'ordens-servico',
    component: OrdensServicoComponent
  }
];
