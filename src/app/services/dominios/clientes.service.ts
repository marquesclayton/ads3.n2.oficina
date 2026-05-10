import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Cliente } from '../../modelos/cliente';
import { generateUuid } from '../../core/utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class ClientesService extends ApiBaseService {
  private readonly endpoint = 'clientes';

  // Mock usado apenas como fallback quando a API não estiver disponível (somente para testes).
  private clientesMock: Cliente[] = [
    {
      id: generateUuid(),
      nome: 'Carlos Silva',
      cpf: '12345678901',
      telefone: '(62) 99999-0001'
    }
  ];


  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Cliente[]> {
    return this.get<Cliente[]>(this.endpoint).pipe(
      tap((clientes) => {
        this.clientesMock = [...clientes];
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.post<Cliente, Omit<Cliente, 'id'>>(this.endpoint, cliente).pipe(
      tap((clienteCriado) => {
        this.clientesMock = [...this.clientesMock, clienteCriado];
      }),
      catchError((err) => throwError(() => err))
    );
  }
}
