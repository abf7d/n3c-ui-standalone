export interface Comorbidities {
  rows: Comorbidity[];
}

export interface DemographicsRows {
  rows: Demographics[];
}

export interface Outcomes {
  rows: Outcome[];
}

export interface Comorbidity {
  sex: string;
  long_covid: string;
  covid_status: string;
  mortality: string;
  vaccinated: string;
  comorbidity: string;
  patient_count_int: number;
  patient_count: string;
}

export interface Demographics {
  age: string;
  cms: string;
  sex: string;
  race: string;
  race_abbrev: string;
  birth: number;
  covid_status: string;
  condition: string;
  mortality: string;
  patient_count_int: number;
  patient_count: string;
  other_conditions: number;
  low_risk_conditions: number;
  record_of_gestation: number;
  high_risk_conditions: number;
  postpartum_conditions: number;
  assist_reproductive_tech: number;
  behavioral_health_conditions: number;
}

export interface Outcome {
  age: string;
  long_covid: string;
  cms: string;
  sex: string;
  race: string;
  birth: number;
  covid_status: string;
  severity: string;
  condition: string;
  mortality: string;
  patient_count_int: number;
  patient_count: string;
  other_conditions: number;
  low_risk_conditions: number;
  record_of_gestation: number;
  high_risk_conditions: number;
  postpartum_conditions: number;
  assist_reproductive_tech: number;
  behavioral_health_conditions: number;
}

export type PatientData = Comorbidity & Demographics & Outcome;
