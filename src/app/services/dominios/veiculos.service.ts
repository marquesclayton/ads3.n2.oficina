import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Veiculo } from '../../modelos/veiculo';
import { generateUuid } from '../../core/utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class VeiculosService extends ApiBaseService {
  private readonly endpoint = 'veiculos';

  // Mock usado apenas como fallback quando a API não estiver disponível (somente para testes).
  private veiculosMock: Veiculo[] = [
    {
      id: generateUuid(),
      clienteId: generateUuid(),
      placa: 'ABC-1234',
      modelo: 'Onix',
      marca: 'Chevrolet',
      ano: 2021
    }
  ];


  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Veiculo[]> {
    return this.get<Veiculo[]>(this.endpoint).pipe(
      tap((veiculos) => {
        this.veiculosMock = [...veiculos];
        // UUIDs used for ids; no numeric next id calculation needed
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(veiculo: Omit<Veiculo, 'id'>): Observable<Veiculo> {
    return this.post<Veiculo, Omit<Veiculo, 'id'>>(this.endpoint, veiculo).pipe(
      tap((veiculoCriado) => {
        this.veiculosMock = [...this.veiculosMock, veiculoCriado];
      }),
      catchError((err) => throwError(() => err))
    );
  }

}
