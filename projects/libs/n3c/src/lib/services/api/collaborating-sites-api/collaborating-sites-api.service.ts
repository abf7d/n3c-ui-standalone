import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {CollaborationProfile} from '../../../models/collaboration-profile';
import {GrantsData} from '../../../models/site-grants';
import {SiteProjectsResponse} from '../../../models/site-projects';
import {SitePublicationsResponse} from '../../../models/site-publications';
import {
  SiteCollaborationsResponse,
  CollaborationEdgesResponse,
  SiteLocationsResponse,
  UsRegionsGeoJson
} from '../../../models/collaboration-map';

@Injectable({
  providedIn: 'root'
})
export class CollaboratingSitesApiService {
  private config = inject(API_URLS) as unknown as Endpoints;
  private http = inject(HttpClient);
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;
  private staticBaseUrl: string = this.config.n3cUrls.baseUrl + '/static/pdf/n3c/collab';

  public getRegions(): Observable<UsRegionsGeoJson> {
    return this.http.get<UsRegionsGeoJson>('/data/gz_2010_us_040_00_5m.json');
  }

  public getSiteCollaborations(): Observable<SiteCollaborationsResponse> {
    return this.http.get<SiteCollaborationsResponse>(`${this.baseUrl}/site_collaborations`);
  }

  public getEdges(): Observable<CollaborationEdgesResponse> {
    return this.http.get<CollaborationEdgesResponse>(`${this.baseUrl}/site_collaboration_edges`);
  }

  public getContributingSiteLocations(): Observable<SiteLocationsResponse> {
    return this.http.get<SiteLocationsResponse>(`${this.baseUrl}/site_locations`);
  }

  public getSitePublications(rorId: string): Observable<SitePublicationsResponse> {
    const p = encodeURIComponent(this.toApiRorParam(rorId));
    return this.http.get<SitePublicationsResponse>(`${this.baseUrl}/collaboration_publications?ror_id=${p}`);
  }

  public getSiteProjects(rorId: string): Observable<SiteProjectsResponse> {
    const p = encodeURIComponent(this.toApiRorParam(rorId));
    return this.http.get<SiteProjectsResponse>(`${this.baseUrl}/collaboration_projects?ror_id=${p}`);
  }

  public getSiteGrants(rorId: string): Observable<GrantsData> {
    const p = encodeURIComponent(this.toApiRorParam(rorId));
    return this.http.get<GrantsData>(`${this.baseUrl}/collaboration_grants?ror_id=${p}`);
  }

  public getCollaborationProfile(rorId: string): Observable<CollaborationProfile> {
    const p = encodeURIComponent(this.toApiRorParam(rorId));
    return this.http.get<CollaborationProfile>(`${this.baseUrl}/collaboration_profile?ror_id=${p}`);
  }

  public getCollaborationProfilePdfUrl(siteName: string): string {
    const safeSiteName = siteName.replace(/ /g, '_');
    return `${this.staticBaseUrl}/${safeSiteName}.pdf`;
  }

  public getPublishingSitesImageUrl(siteId: string): string | null {
    return this.buildStaticImageUrl('publications_sites', siteId);
  }
  public getCollaboratingSitesMapImageUrl(siteId: string): string | null {
    return this.buildStaticImageUrl('projects_sites', siteId);
  }
  public getCollaboratingInstitutionsImageUrl(siteId: string): string | null {
    return this.buildStaticImageUrl('collaborators_sites', siteId);
  }

  private buildStaticImageUrl(
    folder: 'projects_sites' | 'collaborators_sites' | 'publications_sites',
    key?: string | null
  ): string | null {
    const k = (key ?? '').trim();
    if (!k) return null;
    return `${this.staticBaseUrl}/${folder}/${encodeURIComponent(k)}.png`;
  }

  private toApiRorParam(v: string): string {
    const s = (v || '').trim();
    if (!s) return s;
    if (/^https?:\/\//i.test(s)) return s;
    if (s.includes('.')) return s;
    return `https://ror.org/${s}`;
  }

  private normalizeForRoute(v: string): string {
    const s = (v || '').trim();
    if (!s) return '';
    const m = s.match(/ror\.org\/([^/]+)/i);
    return (m?.[1] || s).toLowerCase();
  }

  public encodeIdForRouteFromAny(id: string): string {
    return this.b64urlEncode(this.normalizeForRoute(id));
  }

  public decodeIdFromRoute(token: string): string {
    try {
      return this.b64urlDecode(token);
    } catch {
      return token;
    }
  }

  public toComparableId(v: string | null | undefined): string {
    const s = (v ?? '').trim();
    if (!s) return '';
    const full = this.toApiRorParam(s);
    return full.replace(/\/$/, '').toLowerCase();
  }

  private b64urlEncode(s: string): string {
    const b64 = btoa(s);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  private b64urlDecode(t: string): string {
    let s = t.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) s += '='.repeat(4 - pad);
    return atob(s);
  }
}
