import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {DiseaseSnapshots} from '@odp/n3c/lib/models/disease-snapshots';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiseaseSnapshotsApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

  public callApiByTopic(topic: string): Observable<DiseaseSnapshots> {
    return this.http.get<DiseaseSnapshots>(`${this.baseUrl}/public-health/disease/${topic}`);
  }
}
