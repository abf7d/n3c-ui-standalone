export interface AdminFactSheet {
  covid_positive_patients: string;
  drug_exposure_rows: string;
  measurement_rows: string;
  observation_rows: string;
  person_rows: string;
  procedure_rows: string;
  release_date: string;
  release_name: string;
  sites_ingested: string;
  total_rows: string;
  visit_rows: string;
}
export interface CurrentRelease {
  covid_positive_patients: number;
  drug_exposure_rows: number;
  measurement_rows: number;
  observation_rows: number;
  person_rows: number;
  procedure_rows: number;
  release: string;
  release_date: string;
  release_id: number;
  sites_ingested: number;
  total_rows: number;
  visit_rows: number;
}
export interface InstitutionSummary {
  n_institutions: number;
  n_with_users: number;
  n_with_dtas: number;
  n_domain_teams: number;
}

export interface CurrentNotes {
  cdm_mapping_version: string;
  omop_vocabulary_version: string;
  phenotype: string;
  release_id: number;
  source_cdm: string;
  target_cdm: string;
  vocabulary_update_date: string;
}
export interface AdminInstCount {
  n_institutions: number;
  n_with_dtas: number;
  n_with_users: number;
}
export interface AdminUserCount {
  n_registrations: string;
  n_enclave: string;
  n_duas: string;
}

export interface MapRegion {
  id: number;
  name: string;
  cumulative: number;
}
export interface MapState {
  region: number;
  name: string;
  abbreviation: string;
  count: number;
}
export interface MapData {
  regions: MapRegion[];
  states: MapState[];
}
export interface StateInfo {
  type: string;
  features: {
    geommetry: any;
    properties: any;
    type: string;
  }[];
}
export interface Site {
  data_model: string;
  id: string;
  latitude: number;
  longitude: number;
  site: string;
  status: string;
  type: string;
  url: string;
}

export interface SiteLocations {
  sites: Site[];
}

export interface DuaEntry {
  date: Date;
  dtas: number;
  duas: number;
  registrations: number;
}

export interface Header {
  label: string;
  value: string;
}
export interface DomainRow {
  created: string;
  cross_cutting: boolean;
  description: string;
  nid: number;
  title: string;
  url: string;
}
export interface RosterRow {
  accessing_institution: string;
  description: string;
  dur_project_id: string;
  id: string;
  pi_name: string;
  task_team: boolean;
  title: string;
}
export interface DomainTeamData {
  headers: Header[];
  rows: DomainRow[];
}
export interface RoseterData {
  headers: Header[];
  rows: RosterRow[];
}
export interface DataPoint {
  date: Date;
  registrations: number;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: {
    GEO_ID: string;
    STATE: string;
    COUNTY: string;
    NAME: string;
    LSAD: string;
    CENSUSAREA: number;
  };
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}
