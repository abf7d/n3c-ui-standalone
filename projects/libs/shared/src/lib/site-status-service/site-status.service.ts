import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {API_URLS, Endpoints} from '../types';
import {SiteStatus} from './site-status.model';

@Injectable({providedIn: 'root'})
export class SiteStatusService {
  private http = inject(HttpClient);
  private config = inject(API_URLS) as unknown as Endpoints;
  private appBase: string = this.config.n3cUrls.baseUrl;

  getSiteStatus() {
    return firstValueFrom(
      this.http.get<SiteStatus>(`${this.appBase}/api/global_flag`, {
        headers: new HttpHeaders({
          'Cache-Control': 'no-cache'
        })
      })
    );
  }
}
