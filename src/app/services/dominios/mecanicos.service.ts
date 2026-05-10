import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Mecanico } from '../../modelos/mecanico';

@Injectable({
  providedIn: 'root'
})
export class MecanicosService extends ApiBaseService {
  private readonly endpoint = 'mecanicos';

  private mecanicos: Mecanico[] = [];

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Mecanico[]> {
    return this.get<Mecanico[]>(this.endpoint).pipe(
      tap((mecanicos) => {
        this.mecanicos = [...mecanicos];
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(mecanico: Omit<Mecanico, 'id'>): Observable<Mecanico> {
    return this.post<Mecanico, Omit<Mecanico, 'id'>>(this.endpoint, mecanico).pipe(
      tap((mecanicoCriado) => {
        this.mecanicos = [...this.mecanicos, mecanicoCriado];
      }),
      catchError((err) => throwError(() => err))
    );
  }

}
