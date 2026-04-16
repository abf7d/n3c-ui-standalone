export interface GrantRow {
  project_num: string;
  project_title: string;
  ic: string;
  contact_pi: string;
  fiscal_year: number;
  award_amount: number;
}

export interface GrantHeader {
  value: string;
  label: string;
}

export interface SubcontractRow {
  project_number: string;
  title: string;
  primary_site: string;
}

export interface SubcontractHeader {
  value: string;
  label: string;
}

export interface GrantsData {
  grants: {
    headers: GrantHeader[];
    rows: GrantRow[];
  };
  subcontracts: {
    headers: SubcontractHeader[];
    rows: SubcontractRow[];
  };
}
