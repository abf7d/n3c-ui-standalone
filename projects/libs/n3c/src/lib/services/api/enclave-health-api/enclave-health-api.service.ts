import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Comorbidities, DemographicsRows, Outcomes} from '@odp/n3c/lib/models/enclave-health';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnclaveHealthApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

  public getComorbidities(): Observable<Comorbidities> {
    return this.http.get<Comorbidities>(`${this.baseUrl}/public-health/all_comorbidities`);
  }

  public getDemographics(): Observable<DemographicsRows> {
    return this.http.get<DemographicsRows>(`${this.baseUrl}/public-health/maternal_comorbidities`);
  }

  public getOutcomes(): Observable<Outcomes> {
    return this.http.get<Outcomes>(`${this.baseUrl}/public-health/maternal_health`);
  }

  private apiMap: Record<string, () => Observable<Comorbidities | DemographicsRows | Outcomes>> = {
    comorbidities: () => this.getComorbidities(),
    demographics: () => this.getDemographics(),
    outcomes: () => this.getOutcomes()
  };

  public callApiByTopic(topic: string): Observable<Comorbidities | DemographicsRows | Outcomes> {
    const fn = this.apiMap[topic];
    if (!fn) throw new Error(`Unknown API: ${topic}`);
    return fn();
  }
}
