import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationeApiService {
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  public getPublications(): Observable<PublicationResponse> {
    return this.http.get<PublicationResponse>(`${this.baseUrl}/publications`);
  }
}

export interface PublicationResponse {
  headers: PublicationHeader[];
  rows: PublicationRow[];
}
export interface PublicationRow {
  id: number;
  url: string;
  date: string;
  type: string;
  title: string;
  outlet: string;
  authors: string;
}
export interface PublicationHeader {
  value: string;
  label: string;
}
