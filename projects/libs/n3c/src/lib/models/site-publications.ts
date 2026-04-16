export interface PublicationRow {
  title: string;
  authors: string[];
  external_url?: string;
}

export interface PublicationHeader {
  value: string;
  label: string;
}

export interface PublicationsData {
  headers: PublicationHeader[];
  rows: PublicationRow[];
}

export interface SitePublicationsResponse {
  rows: PublicationRow[];
}
