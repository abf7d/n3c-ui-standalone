import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {
  SiteCollaborationLegends,
  SiteCollaborations
} from '@odp/n3c/lib/components/dashboards/collaboration-map/collaboration-map.interface';
import {CollaborationMapApiService} from '../collaboration-map-api/collaboration-map-api.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationsMapApiService extends CollaborationMapApiService {
  protected override baseUrl: string = this.configPub.n3cUrls.baseUrl + '/api/n3c/dashboard';
  constructor(
    @Inject(API_URLS) private configPub: Endpoints,
    private httpPub: HttpClient
  ) {
    super(configPub, httpPub);
  }

  public override getRegions(): Observable<any> {
    return this.httpPub.get<{count: string}[]>('/assets/data/gz_2010_us_040_00_5m.json');
  }

  public override getSiteData(): Observable<SiteCollaborations> {
    return this.httpPub.get<SiteCollaborations>(`${this.baseUrl}/site_publications`).pipe(
      map((data: any) => {
        return {
          ...data,
          sites: data.rows,
          rows: undefined
        };
      })
    );
  }
  public override getEdges(): Observable<any> {
    return this.httpPub.get(`${this.baseUrl}/site_publication_edges`);
  }
  public override getLegends(): Observable<SiteCollaborationLegends> {
    return this.httpPub.get<SiteCollaborationLegends>(`${this.baseUrl}/site_publication_summary`);
  }
}
