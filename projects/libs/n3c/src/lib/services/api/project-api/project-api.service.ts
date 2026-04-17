import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

  public getEmbeddedProjectRoster(): Observable<any> {
    return this.http.get(`${this.baseUrl}/embedded_project_roster_3`);
  }
}
