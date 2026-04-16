export interface ConceptSet {
  doi: string;
  type: string;
  title: string;
  issues: string;
  creator: string;
  published: string;
  codeset_id: number;
  created_by: string;
  provenance: string;
  limitations: string;
}

export interface ConceptSets {
  rows: ConceptSet[];
}
