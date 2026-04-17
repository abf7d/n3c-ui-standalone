import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataDownloadApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

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
