import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { OrdemServico } from '../../modelos/ordem-servico';

@Injectable({
  providedIn: 'root'
})
export class OrdensServicoService extends ApiBaseService {
  private readonly endpoint = 'ordens-servico';

  private ordensMock: OrdemServico[] = [
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

  private proximoId = 2;

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<OrdemServico[]> {
    return this.get<OrdemServico[]>(this.endpoint).pipe(
      tap((ordens) => {
        this.ordensMock = [...ordens];
        this.proximoId = this.calcularProximoId(ordens);
      }),
      catchError(() => of([...this.ordensMock]))
    );
  }

  adicionar(ordem: Omit<OrdemServico, 'id'>): Observable<OrdemServico> {
    return this.post<OrdemServico, Omit<OrdemServico, 'id'>>(this.endpoint, ordem).pipe(
      tap((ordemCriada) => {
        this.ordensMock = [...this.ordensMock, ordemCriada];
        this.proximoId = this.calcularProximoId(this.ordensMock);
      }),
      catchError(() => {
        const ordemMock: OrdemServico = { id: this.proximoId++, ...ordem };
        this.ordensMock = [...this.ordensMock, ordemMock];
        return of(ordemMock);
      })
    );
  }

  private calcularProximoId(ordens: OrdemServico[]): number {
    return ordens.length ? Math.max(...ordens.map((ordem) => ordem.id)) + 1 : 1;
  }
}
