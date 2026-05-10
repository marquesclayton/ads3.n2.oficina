import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Cliente } from '../../modelos/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService extends ApiBaseService {
  private readonly endpoint = 'clientes';

  private clientesMock: Cliente[] = [
    {
      id: 1,
      nome: 'Carlos Silva',
      cpf: '12345678901',
      telefone: '(62) 99999-0001'
    }
  ];

  private proximoId = 2;

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Cliente[]> {
    return this.get<Cliente[]>(this.endpoint).pipe(
      tap((clientes) => {
        this.clientesMock = [...clientes];
        this.proximoId = this.calcularProximoId(clientes);
      }),
      catchError(() => of([...this.clientesMock]))
    );
  }

  adicionar(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.post<Cliente, Omit<Cliente, 'id'>>(this.endpoint, cliente).pipe(
      tap((clienteCriado) => {
        this.clientesMock = [...this.clientesMock, clienteCriado];
        this.proximoId = this.calcularProximoId(this.clientesMock);
      }),
      catchError(() => {
        const clienteMock: Cliente = { id: this.proximoId++, ...cliente };
        this.clientesMock = [...this.clientesMock, clienteMock];
        return of(clienteMock);
      })
    );
  }

  private calcularProximoId(clientes: Cliente[]): number {
    return clientes.length ? Math.max(...clientes.map((cliente) => cliente.id)) + 1 : 1;
  }
}
