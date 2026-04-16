import {KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';

export interface TotalsObject {
  ageTotals: Record<string, {count: number; percent: number}>;
  sexTotals: Record<string, {count: number; percent: number}>;
  raceTotals: Record<string, {count: number; percent: number}>;
  metforminSeverityTotals: Record<string, {count: number; percent: number}>;
  ethnicityTotals: Record<string, {count: number; percent: number}>;
  medOccurrenceTotals: Record<string, {count: number; percent: number}>;
  covidStatusTotals: Record<string, {count: number; percent: number}>;
  longCovidStatusTotals: Record<string, {count: number; percent: number}>;
  vaccinationStatusTotals: Record<string, {count: number; percent: number}>;
  mortalityTotals: Record<string, {count: number; percent: number}>;
  // Severity totals
  nonMetforminSeverityTotals: Record<string, {count: number; percent: number}>;
  diabeticNonMetforminSeverityTotals: Record<string, {count: number; percent: number}>;
  diabeticMetforminSeverityTotals: Record<string, {count: number; percent: number}>;
  nonDiabeticNonMetforminSeverityTotals: Record<string, {count: number; percent: number}>;
  nonDiabeticMetforminSeverityTotals: Record<string, {count: number; percent: number}>;
  // Long Covid totals
  nonMetforminLongCovidTotals: Record<string, {count: number; percent: number}>;
  metforminLongCovidTotals: Record<string, {count: number; percent: number}>;
  diabeticNonMetforminLongCovidTotals: Record<string, {count: number; percent: number}>;
  diabeticMetforminLongCovidTotals: Record<string, {count: number; percent: number}>;
  nonDiabeticNonMetforminLongCovidTotals: Record<string, {count: number; percent: number}>;
  nonDiabeticMetforminLongCovidTotals: Record<string, {count: number; percent: number}>;
  // Mortality totals
  nonMetforminMortalityTotals: Record<string, {count: number; percent: number}>;
  metforminMortalityTotals: Record<string, {count: number; percent: number}>;
  diabeticNonMetforminMortalityTotals: Record<string, {count: number; percent: number}>;
  diabeticMetforminMortalityTotals: Record<string, {count: number; percent: number}>;
  nonDiabeticNonMetforminMortalityTotals: Record<string, {count: number; percent: number}>;
  nonDiabeticMetforminMortalityTotals: Record<string, {count: number; percent: number}>;
}

export interface PatientRecord {
  age: '<18' | '18-64' | '65+' | 'Unknown';
  sex: 'Female' | 'Male' | 'Unknown';
  race: string;
  ethnicity: string;
  severity: 'Mild' | 'Mild in ED' | 'Moderate' | 'Severe' | 'Mortality' | 'Unavailable';
  metformin_occurrence: 'Before COVID' | 'After COVID' | 'Unknown or N/A'; //// dont change to med_occurrence
  covid_status: 'Positive' | 'Unknown';
  long_covid_status: 'Long COVID' | 'Unknown';
  vaccination_status: 'Vaccinated' | 'Unvaccinated' | 'Unknown';
  diabetes_status: 'Diabetes' | 'Non-Diabetes';
  metformin_status: 'Metformin' | 'Non-Metformin';
  mortality: 'Mortality' | 'No Mortality' | 'Unknown';
  patient_count: string;
  cci_score: string;
}

export interface Totals {
  [key: string]: {count: number; percent: number};
}
export interface TitleMap {
  [key: string]: {bar: string; percent: string; pie: string}; // Generic keys
}
export interface ConfigFile {
  titleMap: TitleMap;
  kpiPanelConfig: KpiPanelConfig; // Define a stricter type if possible
  chartTotals: Record<string, string>; // Keys for totals, values are the keys in totalsMap
  colorScheme: Record<string, string>; // Keys for charts, values are keys in colorSchemeMap
  numCharts: number; // The number of charts to render
}

export interface SelectedFilters {
  age: string[];
  sex: string[];
  race: string[];
  severity: string[];
  ethnicity: string[];
  medoccurrence: string[];
  covidstatus: string[];
  longcovidstatus: string[];
  vaccinationstatus: string[];
  mortality: string[];
  cciscore: string[];
}
export interface KpiTotalMap {
  prop: string;
  reduce: boolean;
  stat: string;
}

