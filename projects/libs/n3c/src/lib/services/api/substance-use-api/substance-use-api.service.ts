import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubstanceUseApiService {
  constructor(private http: HttpClient) {}

  public getAlcoholOpioidDataClusteredCount(): Observable<any> {
    return this.http.get(
      'https://covid.cd2h.org/dashboard/new_ph/substance_use/feeds/heatmap_clustered_alc_opi.jsp?covid_count=true'
    );
  }
  // For "Substance Use" Alcohol & Opioid Heatmap
  public getAlcoholOpioidDataClustered(): Observable<any> {
    return this.http.get('https://covid.cd2h.org/dashboard/new_ph/substance_use/feeds/heatmap_clustered_alc_opi.jsp');
  }
  public getAlcoholOpioidData(): Observable<any> {
    return this.http.get('https://covid.cd2h.org/dashboard/new_ph/substance_use/feeds/heatmap_alc_opi.jsp');
  }
}
