import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {PositiveCases} from '@odp/n3c/lib/models/covid-cases';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CovidCasesApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

  public getPositiveCases(): Observable<PositiveCases> {
    return this.http.get<PositiveCases>(`${this.baseUrl}/public-health/timeline`);
  }
}
