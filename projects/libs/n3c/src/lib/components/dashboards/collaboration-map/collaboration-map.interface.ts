export interface SiteCollaborationLegend {
  count: number;
  org_type: string;
  site_seq: number;
}

export interface SiteCollaborationLegends {
  sites: SiteCollaborationLegend[];
}

export interface SiteCollaboration {
  id: string;
  url: string;
  type: string;
  site: string;
  count: number;
  target_count: number;
  aggregate_count: number;
  latitude: number;
  longitude: number;
}

export interface SiteCollaborations {
  sites: SiteCollaboration[];
}
