import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataDownloadApiService {
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  public getDownloads(): Observable<any> {
    return this.http.get(`${this.baseUrl}/download_detail`);
  }
  public getFile(tableSchema: string, file: string, downloadType: 'json' | 'csv'): Observable<any> {
    let route = downloadType === 'json' ? 'download_json' : 'download_csv';

    downloadType === 'json' ? 'json' : 'text';

    if (downloadType === 'json') {
      // Explicitly set responseType to 'json'
      return this.http.get<any>(`${this.baseUrl}/${route}/?schema=${tableSchema}&table=${file}`, {
        responseType: 'json'
      });
    } else {
      // Explicitly set responseType to 'text'
      return this.http.get(`${this.baseUrl}/${route}/?schema=${tableSchema}&table=${file}`, {
        responseType: 'text'
      });
    }
  }
}
