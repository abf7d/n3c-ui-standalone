import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {SelectedFilters} from '@odp/n3c/lib/components/dashboards/demographics-table/demographics-table.interface';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemTableApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

  public getCumulativeSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/irb/demographics`);
  }

  public getDemographics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/irb/demographics_long`);
  }

  public downloadExcel(selectedFilters: SelectedFilters): Observable<Blob> {
    return this.http.post<Blob>(`${this.baseUrl}/irb/demographics/download/excel`, selectedFilters, {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    });
  }
}
