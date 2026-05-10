import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Usuario } from '../../modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends ApiBaseService {
  private readonly endpoint = 'usuarios';

  private usuariosMock: Usuario[] = [
    {
      id: 1,
      nome: 'Ana Atendimento',
      login: 'ana.atendimento',
      email: 'ana@oficina.local',
      perfil: 'atendente'
    }
  ];

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Usuario[]> {
    return this.get<Usuario[]>(this.endpoint).pipe(
      tap((usuarios) => {
        this.usuariosMock = [...usuarios];
      }),
      catchError(() => of([...this.usuariosMock]))
    );
  }
}
