import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StrapiApiService {
  private baseUrl: string = this.config.n3cUrls.restEndpoint;

  constructor(
    @Inject(API_URLS) private config: Endpoints,
    private http: HttpClient
  ) {}

  /**
   * Builds a Strapi API URL with optional query parameters.
   * @param endpoint - The API endpoint (e.g., 'mission', 'calendar')
   * @param populateFields - An array of fields to populate (supports deep nesting)
   * @param filters - Optional object representing filters (e.g., { id: { $eq: 4 } })
   * @returns Fully constructed URL
   */
  buildUrl(endpoint: string, populateFields: string[] = [], filters?: Record<string, any>): string {
    let url = `${this.baseUrl}/${endpoint}`;
    const params = new URLSearchParams();

    // Populate fields
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        // Split nested fields
        const nestedParts = field.split('.');
        let populateQuery = 'populate';

        // Build nested structure dynamically
        nestedParts.forEach((part) => {
          populateQuery += `[${part}][populate]`;
        });
        params.append(populateQuery, '*');
      });
    } else {
      params.append('populate', '*');
    }

    // Filters (e.g., filters[id][$eq]=4)
    const addFilters = (prefix: string, obj: Record<string, any>) => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = `${prefix}[${key}]`;
        if (typeof value === 'object' && value !== null) {
          addFilters(fullKey, value);
        } else {
          params.append(fullKey, String(value));
        }
      });
    };

    if (filters) {
      addFilters('filters', filters);
    }

    url += `?${params.toString()}`;
    return url;
  }

  /**
   * Performs a GET request to the Strapi API.
   * @param endpoint - The API endpoint
   * @param populateFields - Optional array of fields to populate
   * @param filters - Optional object representing filters (e.g., { id: { $eq: 4 } })
   * @returns Observable with the API response
   */
  get<T>(endpoint: string, populateFields: string[] = [], filters?: Record<string, any>): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint, populateFields, filters));
  }
}
