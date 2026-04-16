export interface CollaborationProfile {
  ror_id: string;
  name: string;
  users: {enclave_users: number; additional_users: number};
  institutions: {org_type: string; count: number}[];
  inst_sum: number;
  inst_count: number;
  grants: {count: number; amount: number};
  subcontracts: number;
  sites: {investigator_count: number; project_count: number; membership_count: number};
  publications: {publication_count: number; author_count: number; citation_count: number};
}
