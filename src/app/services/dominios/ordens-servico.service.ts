import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { OrdemServico } from '../../modelos/ordem-servico';

@Injectable({
  providedIn: 'root'
})
export class OrdensServicoService extends ApiBaseService {
  private readonly endpoint = 'ordens-servico';

  private ordens: OrdemServico[] = [];

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<OrdemServico[]> {
    return this.get<OrdemServico[]>(this.endpoint).pipe(
      tap((ordens) => {
        this.ordens = [...ordens];
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(ordem: Omit<OrdemServico, 'id'>): Observable<OrdemServico> {
    return this.post<OrdemServico, Omit<OrdemServico, 'id'>>(this.endpoint, ordem).pipe(
      tap((ordemCriada) => {
        this.ordens = [...this.ordens, ordemCriada];
        // this.proximoId = this.calcularProximoId(this.ordens);

      }),
      catchError((err) => throwError(() => err))
    );
  }


}
