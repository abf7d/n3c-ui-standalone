import {inject, Injectable} from '@angular/core';
import {Chart} from '../../../models/hive-plot';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HiveApiService {
  private http = inject(HttpClient);

  public getHiveData(): Observable<Chart> {
    return this.http.get<Chart>('https://covid.cd2h.org/dashboard/feeds/hive_data.jsp');
  }
}
