import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiBaseService } from '../../core/http/api-base.service';
import { Veiculo } from '../../modelos/veiculo';
@Injectable({
  providedIn: 'root'
})
export class VeiculosService extends ApiBaseService {
  private readonly endpoint = 'veiculos';

   private veiculos: Veiculo[] = [];


  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Veiculo[]> {
    return this.get<Veiculo[]>(this.endpoint).pipe(
      tap((veiculos) => {
        this.veiculos = [...veiculos];
        // UUIDs used for ids; no numeric next id calculation needed
      }),
      catchError((err) => throwError(() => err))
    );
  }

  adicionar(veiculo: Omit<Veiculo, 'id'>): Observable<Veiculo> {
    return this.post<Veiculo, Omit<Veiculo, 'id'>>(this.endpoint, veiculo).pipe(
      tap((veiculoCriado) => {
        this.veiculos = [...this.veiculos, veiculoCriado];
      }),
      catchError((err) => throwError(() => err))
    );
  }

}
