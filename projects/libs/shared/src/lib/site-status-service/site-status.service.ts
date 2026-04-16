import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Inject} from '@angular/core';
import {API_URLS, Endpoints} from '../types';
import {SiteStatus} from './site-status.model';

@Injectable({providedIn: 'root'})
export class SiteStatusService {
  private appBase: string = this.config.n3cUrls.baseUrl;

  constructor(
    private http: HttpClient,
    @Inject(API_URLS) private config: Endpoints
  ) {}

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
