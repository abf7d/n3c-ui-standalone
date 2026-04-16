export interface SiteCollaborationHeader {
  value: string;
  label: string;
}

export interface SiteCollaborationRow {
  site: string;
  id: string;
  type: string;
  count?: number;
  aggregate_count?: number;
  target_count?: number;
  latitude?: number;
  longitude?: number;
  url?: string | null;
}

export interface SiteCollaborationsResponse {
  headers: SiteCollaborationHeader[];
  sites: SiteCollaborationRow[];
}

export interface CollaborationEdge {
  source: string;
  target: string;
  count?: number;
  weight?: number;
}
export interface CollaborationEdgesResponse {
  edges: CollaborationEdge[];
}

export interface SiteLocation {
  site: string;
  id: string;
  type: string;
  data_model: string;
  status: string;
  latitude: number;
  longitude: number;
  url: string | null;
}
export interface SiteLocationsResponse {
  sites: SiteLocation[];
}

export type UsRegionsGeoJson = unknown;
