import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectGraphApiService {
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}
  public getDUROrg(): Observable<any> {
    return this.http.get(`${this.baseUrl}/project_organization_graph`);
  }
  public getPersonRsrch(): Observable<any> {
    return this.http.get(`${this.baseUrl}/project_graph`);
  }
  public getPersonOps(): Observable<any> {
    return this.http.get(`${this.baseUrl}/project_operational_graph`);
  }
  public getChallengeIndv(): Observable<any> {
    return this.http.get(`${this.baseUrl}/project_challenge_graph`);
  }
  public getChallengeOrg(): Observable<any> {
    return this.http.get(`${this.baseUrl}/project_challenge_organization_graph`);
  }
}
