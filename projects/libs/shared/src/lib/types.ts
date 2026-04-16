import {InjectionToken} from '@angular/core';
import {EventService} from '../public-api';

export interface AppConfig {
  odp: Endpoints;
}

export interface N3CEndpoints {
  restEndpoint: string;
  dashboardEndpoint: string; //Remove this
  strapiUrl: string;
  baseUrl: string; // odp fastapi
  dashboard: string;
}
export interface Endpoints {
  variantApiUrl: string;
  graphqlEndpoint: string;
  covid19ApiUrl: string;
  n3cUrls: N3CEndpoints;
}
export const APP_CONF = new InjectionToken<AppConfig>('ncats.odp.app.config');
export const API_URLS = new InjectionToken<AppConfig>('ncats.odp.api.urls');
export const EVENT_SERVICE = new InjectionToken<EventService>('ncats.odp.event.service');
