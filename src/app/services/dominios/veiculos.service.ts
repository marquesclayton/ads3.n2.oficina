import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Veiculo } from '../../modelos/veiculo';

@Injectable({
  providedIn: 'root'
})
export class VeiculosService extends ApiBaseService {
  private readonly endpoint = 'veiculos';

  private veiculosMock: Veiculo[] = [
    {
      id: 1,
      clienteId: 1,
      placa: 'ABC-1234',
      modelo: 'Onix',
      marca: 'Chevrolet',
      ano: 2021
    }
  ];

  private proximoId = 2;

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Veiculo[]> {
    return this.get<Veiculo[]>(this.endpoint).pipe(
      tap((veiculos) => {
        this.veiculosMock = [...veiculos];
        this.proximoId = this.calcularProximoId(veiculos);
      }),
      catchError(() => of([...this.veiculosMock]))
    );
  }

  adicionar(veiculo: Omit<Veiculo, 'id'>): Observable<Veiculo> {
    return this.post<Veiculo, Omit<Veiculo, 'id'>>(this.endpoint, veiculo).pipe(
      tap((veiculoCriado) => {
        this.veiculosMock = [...this.veiculosMock, veiculoCriado];
        this.proximoId = this.calcularProximoId(this.veiculosMock);
      }),
      catchError(() => {
        const veiculoMock: Veiculo = { id: this.proximoId++, ...veiculo };
        this.veiculosMock = [...this.veiculosMock, veiculoMock];
        return of(veiculoMock);
      })
    );
  }

  private calcularProximoId(veiculos: Veiculo[]): number {
    return veiculos.length ? Math.max(...veiculos.map((veiculo) => veiculo.id)) + 1 : 1;
  }
}
