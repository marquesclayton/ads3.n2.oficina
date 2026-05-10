import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { OrdemServico } from '../../modelos/ordem-servico';
import { generateUuid } from '../../core/utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class OrdensServicoService extends ApiBaseService {
  private readonly endpoint = 'ordens-servico';

  // Mock usado apenas como fallback quando a API não estiver disponível (somente para testes).
  private ordensMock: OrdemServico[] = [
    {
      id: generateUuid(),
      clienteId: generateUuid(),
      veiculoId: generateUuid(),
      usuarioResponsavelId: generateUuid(),
      mecanicoResponsavelId: generateUuid(),
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

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<OrdemServico[]> {
    return this.get<OrdemServico[]>(this.endpoint).pipe(
      tap((ordens) => {
        this.ordensMock = [...ordens];
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(ordem: Omit<OrdemServico, 'id'>): Observable<OrdemServico> {
    return this.post<OrdemServico, Omit<OrdemServico, 'id'>>(this.endpoint, ordem).pipe(
      tap((ordemCriada) => {
        this.ordensMock = [...this.ordensMock, ordemCriada];
        // this.proximoId = this.calcularProximoId(this.ordensMock);
      }),
      catchError((err) => throwError(() => err))
    );
  }


}
