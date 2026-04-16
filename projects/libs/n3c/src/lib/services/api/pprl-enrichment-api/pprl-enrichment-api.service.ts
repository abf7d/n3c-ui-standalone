import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {CmsBarFeedTotals} from '@odp/n3c/lib/models/pprl-enrichment';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PprlEnrichmentApiService {
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  public getMedicareTableFeed(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pprl/summary/medicare`);
  }
  public getMedicaidTableFeed(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pprl/summary/medicaid`);
  }
  public getMortalityTableFeed(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pprl/summary/mortality`);
  }
  public getViralFeed(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pprl/summary/viral`);
  }
  public getCmsBarFeed(): Observable<CmsBarFeedTotals> {
    return this.http.get<CmsBarFeedTotals>(`${this.baseUrl}/pprl/total_counts`);
  }
}
