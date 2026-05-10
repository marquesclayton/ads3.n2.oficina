import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Cliente } from '../../modelos/cliente';
@Injectable({
  providedIn: 'root'
})
export class ClientesService extends ApiBaseService {
  private readonly endpoint = 'clientes';

  private clientes: Cliente[] = [];


  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Cliente[]> {
    return this.get<Cliente[]>(this.endpoint).pipe(
      tap((clientes) => {
        this.clientes = [...clientes];
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.post<Cliente, Omit<Cliente, 'id'>>(this.endpoint, cliente).pipe(
      tap((clienteCriado) => {
        this.clientes = [...this.clientes, clienteCriado];
      }),
      catchError((err) => throwError(() => err))
    );
  }
}
