export interface DiseaseSnapshot {
  age: string;
  sex: string;
  observation: string;
  patient_count: string;
  patient_count_int: number;
}

export interface DiseaseSnapshots {
  rows: DiseaseSnapshot[];
}

export type PatientData = DiseaseSnapshot;
