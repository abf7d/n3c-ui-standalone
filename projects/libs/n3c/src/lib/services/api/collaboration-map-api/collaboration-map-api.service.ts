import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {
  SiteCollaborationLegends,
  SiteCollaborations
} from '@odp/n3c/lib/components/dashboards/collaboration-map/collaboration-map.interface';

@Injectable({
  providedIn: 'root'
})
export class CollaborationMapApiService {
  protected baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  public getRegions(): Observable<any> {
    return this.http.get<{count: string}[]>('/assets/data/gz_2010_us_040_00_5m.json');
  }
  public getSiteData(): Observable<SiteCollaborations> {
    return this.http.get<SiteCollaborations>(`${this.baseUrl}/site_collaborations`);
  }
  public getEdges(): Observable<any> {
    return this.http.get(`${this.baseUrl}/site_collaboration_edges`);
  }
  public getLegends(): Observable<SiteCollaborationLegends> {
    return this.http.get<SiteCollaborationLegends>(`${this.baseUrl}/site_collaboration_legend`);
  }
}
