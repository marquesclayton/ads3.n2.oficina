import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Mecanico } from '../../modelos/mecanico';

@Injectable({
  providedIn: 'root'
})
export class MecanicosService extends ApiBaseService {
  private readonly endpoint = 'mecanicos';

  private mecanicosMock: Mecanico[] = [
    {
      id: 1,
      nome: 'João Mecânico',
      especialidade: 'Suspensão',
      telefone: '(62) 98888-0001'
    }
  ];

  private proximoId = 2;

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Mecanico[]> {
    return this.get<Mecanico[]>(this.endpoint).pipe(
      tap((mecanicos) => {
        this.mecanicosMock = [...mecanicos];
        this.proximoId = this.calcularProximoId(mecanicos);
      }),
      catchError(() => of([...this.mecanicosMock]))
    );
  }

  adicionar(mecanico: Omit<Mecanico, 'id'>): Observable<Mecanico> {
    return this.post<Mecanico, Omit<Mecanico, 'id'>>(this.endpoint, mecanico).pipe(
      tap((mecanicoCriado) => {
        this.mecanicosMock = [...this.mecanicosMock, mecanicoCriado];
        this.proximoId = this.calcularProximoId(this.mecanicosMock);
      }),
      catchError(() => {
        const mecanicoMock: Mecanico = { id: this.proximoId++, ...mecanico };
        this.mecanicosMock = [...this.mecanicosMock, mecanicoMock];
        return of(mecanicoMock);
      })
    );
  }

  private calcularProximoId(mecanicos: Mecanico[]): number {
    return mecanicos.length ? Math.max(...mecanicos.map((mecanico) => mecanico.id)) + 1 : 1;
  }
}
