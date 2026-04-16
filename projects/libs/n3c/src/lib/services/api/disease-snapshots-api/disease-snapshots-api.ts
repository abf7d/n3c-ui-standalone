import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {DiseaseSnapshots} from '@odp/n3c/lib/models/disease-snapshots';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiseaseSnapshotsApiService {
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  public callApiByTopic(topic: string): Observable<DiseaseSnapshots> {
    return this.http.get<DiseaseSnapshots>(`${this.baseUrl}/public-health/disease/${topic}`);
  }
}
