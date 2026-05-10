import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Mecanico } from '../../modelos/mecanico';
import { generateUuid } from '../../core/utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class MecanicosService extends ApiBaseService {
  private readonly endpoint = 'mecanicos';

  // Mock usado apenas como fallback quando a API não estiver disponível (somente para testes).
  private mecanicosMock: Mecanico[] = [
    {
      id: generateUuid(),
      nome: 'João Mecânico',
      especialidade: 'Suspensão',
      telefone: '(62) 98888-0001'
    }
  ];

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Mecanico[]> {
    return this.get<Mecanico[]>(this.endpoint).pipe(
      tap((mecanicos) => {
        this.mecanicosMock = [...mecanicos];
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(mecanico: Omit<Mecanico, 'id'>): Observable<Mecanico> {
    return this.post<Mecanico, Omit<Mecanico, 'id'>>(this.endpoint, mecanico).pipe(
      tap((mecanicoCriado) => {
        this.mecanicosMock = [...this.mecanicosMock, mecanicoCriado];
      }),
      catchError((err) => throwError(() => err))
    );
  }

}
