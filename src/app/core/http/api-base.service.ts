import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(protected readonly http: HttpClient) {}

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  protected post<T, TPayload>(endpoint: string, payload: TPayload): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, payload);
  }

  protected put<T, TPayload>(endpoint: string, id: string, payload: TPayload): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, payload);
  }

  protected delete(endpoint: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
  }
}
