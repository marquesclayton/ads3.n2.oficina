import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Usuario } from '../../modelos/usuario';
import { generateUuid } from '../../core/utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends ApiBaseService {
  private readonly endpoint = 'usuarios';

  // Mock usado apenas como fallback quando a API não estiver disponível (somente para testes).
  private usuariosMock: Usuario[] = [
    {
      id: generateUuid(),
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
      catchError((err) => throwError(() => err))
    );
  }
}
