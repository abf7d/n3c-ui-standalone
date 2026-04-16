import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CovidHomeApiService {
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  public getEmbeddedEnclaveMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/embedded_enclave_metrics`);
  }
  public getEmbeddedPeopleMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/embedded_people_metrics`);
  }
}
