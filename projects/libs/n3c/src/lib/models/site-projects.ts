export interface ProjectRow {
  workspace_status: string;
  title: string;
  lead_investigator: string;
  members: string[];
  collaborators: string[];
}

export interface ProjectHeader {
  value: string;
  label: string;
}

export interface ProjectsData {
  headers: ProjectHeader[];
  rows: ProjectRow[];
}

export interface SiteProjectsResponse {
  rows: ProjectRow[];
}
