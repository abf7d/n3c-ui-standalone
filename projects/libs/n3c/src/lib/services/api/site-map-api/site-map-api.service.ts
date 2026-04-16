import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';
import {
  AdminFactSheet,
  AdminInstCount,
  AdminUserCount,
  CurrentNotes,
  CurrentRelease,
  DomainTeamData,
  DuaEntry,
  FeatureCollection,
  InstitutionSummary,
  MapData,
  RoseterData,
  SiteLocations,
  StateInfo
} from '../../../models/admin-models';

@Injectable({
  providedIn: 'root'
})
export class SitemapApiService {
  private dashboardUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  private appBase: string = this.config.n3cUrls.baseUrl;
  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  public getMapData(): Observable<MapData> {
    return this.http.get<MapData>(`${this.dashboardUrl}/map_data`);
  }
  public getStates(): Observable<StateInfo> {
    return this.http.get<StateInfo>(`./assets/data/gz_2010_us_040_00_5m.json`);
  }
  public getMapCounties(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(`./assets/data/gz_2010_us_050_00_5m.json`);
  }
  public getCountyLevelData(): Observable<any> {
    return this.http.get<any>(`${this.appBase}/api/n3c/rest/n3c_alexis/census_county`); //`https://covid.cd2h.org/dashboard/feeds/census_counties.jsp`);
  }
  public getOchinLocations(): Observable<SiteLocations> {
    return this.http.get<SiteLocations>(`${this.dashboardUrl}/ochin_locations`);
  }
  public getSiteLocations(): Observable<SiteLocations> {
    return this.http.get<SiteLocations>(`${this.dashboardUrl}/site_locations`);
  }
  public getDuaData(): Observable<DuaEntry[]> {
    return this.http.get<DuaEntry[]>(`${this.dashboardUrl}/line_dua_dta_regs`);
  }
  public getDomainTeams(): Observable<DomainTeamData> {
    return this.http.get<DomainTeamData>(`${this.dashboardUrl}/domain_team_roster`);
  }
  public getProjectRoster(): Observable<RoseterData> {
    return this.http.get<RoseterData>(`${this.dashboardUrl}/project_roster`);
  }
  // public getFactSheet(): Observable<AdminFactSheet> {
  //   return this.http.get<AdminFactSheet>(`${this.dashboardUrl}/enclave_stats`);
  // }
  public getFactSheet(): Observable<CurrentRelease> {
    return this.http.get<CurrentRelease>(`${this.appBase}/api/n3c/current_release`);
  }
  public getFactSheetCurrentRelease(): Observable<CurrentRelease> {
    return this.http.get<CurrentRelease>(`${this.appBase}/api/n3c/current_release`);
  }
  public getInstitutionSummary(): Observable<InstitutionSummary> {
    return this.http.get<InstitutionSummary>(`${this.appBase}/api/n3c/institution_summary`);
  }
  public getFactSheetCurrentNotes(): Observable<CurrentNotes> {
    return this.http.get<CurrentNotes>(`${this.appBase}/api/n3c/current_notes`);
  }
  public adminInstitutions(): Observable<AdminInstCount> {
    return this.http.get<AdminInstCount>(`${this.dashboardUrl}/admin_institutions`);
  }
  public adminUsers(): Observable<AdminUserCount> {
    return this.http.get<AdminUserCount>(`${this.dashboardUrl}/admin_users`);
  }
}
