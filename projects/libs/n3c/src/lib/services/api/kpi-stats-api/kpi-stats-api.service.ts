import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KpiStatsApiService {
  constructor(private http: HttpClient) {}

  public getEnclaveMetrics(): Observable<any> {
    return this.http.get('https://covid.cd2h.org/dashboard/feeds/embedded_enclave_metrics.jsp');
  }
  public getFactSheet(): Observable<any> {
    return this.http.get('https://covid.cd2h.org/dashboard/feeds/embedded_fact_sheet.jsp');
  }
  public getPeopleMetrics(): Observable<any> {
    return this.http.get('https://covid.cd2h.org/dashboard/feeds/embedded_people_metrics.jsp');
  }
}
