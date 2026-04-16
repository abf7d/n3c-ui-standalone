import {ISelectedFilters} from '@odp/n3c/lib/services/base-manager/base.manager.types';

export interface PatientRecord {
  age: '<18' | '18-64' | '65+' | 'Unknown';
  sex: 'Female' | 'Male' | 'Unknown';
  race: string;
  race_abbrev: string;
  ethnicity: string;
  ethnicity_abbrev: string;
  severity: 'Mild' | 'Mild in ED' | 'Moderate' | 'Severe' | 'Mortality' | 'Unavailable';
  covid_status: 'Positive' | 'Unknown';
  long_covid: 'Long COVID' | 'Unknown';
  vaccinated: 'Vaccinated' | 'Unvaccinated' | 'Unknown';
  mortality: 'Mortality' | 'No Mortality' | 'Unknown';
  patient_count: string;
}

export interface KpiResult {
  enclave_total: number;
  covid_count: number;
  demographic_count: number;
}

export interface KpiPageStats {
  countInType: number;
  enclaveTotal: number;
}

export type SelectedFilters = ISelectedFilters<
  | 'age'
  | 'sex'
  | 'race'
  | 'ethnicity'
  | 'severity'
  | 'covidstatus'
  | 'longcovidstatus'
  | 'vaccinationstatus'
  | 'mortalitystatus'
>;
