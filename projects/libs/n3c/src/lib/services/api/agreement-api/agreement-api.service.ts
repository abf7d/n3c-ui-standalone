import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgreementApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.variantApiUrl + '/n3c';

  public getAgreements(): Observable<any> {
    return this.http.get(`${this.baseUrl}/registration/agreements`);
  }
  public getAgreementTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/registration/agreement_types`);
  }
  public getTenantGroups(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/registration/tenant_groups`);
  }
}
