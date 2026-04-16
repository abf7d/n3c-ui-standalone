import {KpiPanelConfig} from '../../../shared/kpi-panel/kpi-panel.interface';

export interface PatientRecord {
  age: '<18' | '18-64' | '65+' | 'Unknown';
  sex: 'Female' | 'Male' | 'Unknown';
  race: string;
  ethnicity: string;
  severity: 'Mild' | 'Mild in ED' | 'Moderate' | 'Severe' | 'Mortality' | 'Unavailable';
  metformin_occurrence: 'Before COVID' | 'After COVID' | 'Unknown or N/A';
  paxlovid_status: 'Paxlovid' | 'Unknown';
  covid_status: 'Positive' | 'Unknown';
  long_covid_status: 'Long COVID' | 'Unknown';
  vaccination_status: 'Vaccinated' | 'Unvaccinated' | 'Unknown';
  diabetes_status: 'Diabetes' | 'Non-Diabetes';
  metformin_status: 'Metformin' | 'Non-Metformin';
  mortality: 'Mortality' | 'No Mortality' | 'Unknown';
  patient_count: string;
  cci_score: string;
  vaccination_doses: string;
  days: string;
}

export interface Totals {
  [key: string]: {count: number; percent: number; shortLabel?: string};
}

export interface TotalsObject {
  ageTotals: Totals;
  sexTotals: Totals;
  raceTotals: Totals;
  metforminSeverityTotals: Totals;
  ethnicityTotals: Totals;
  paxlovidStatusTotals: Totals;
  paxlovidDaysTotals: Totals;
  medOccurrenceTotals: Totals;
  covidStatusTotals: Totals;
  longCovidStatusTotals: Totals;
  vaccinationStatusTotals: Totals;
  mortalityTotals: Totals;
  // Severity totals
  nonMetforminSeverityTotals: Totals;
  diabeticNonMetforminSeverityTotals: Totals;
  diabeticMetforminSeverityTotals: Totals;
  nonDiabeticNonMetforminSeverityTotals: Totals;
  nonDiabeticMetforminSeverityTotals: Totals;
  // Long COVID totals
  nonMetforminLongCovidTotals: Totals;
  metforminLongCovidTotals: Totals;
  diabeticNonMetforminLongCovidTotals: Totals;
  diabeticMetforminLongCovidTotals: Totals;
  nonDiabeticNonMetforminLongCovidTotals: Totals;
  nonDiabeticMetforminLongCovidTotals: Totals;
  // Mortality totals
  nonMetforminMortalityTotals: Totals;
  metforminMortalityTotals: Totals;
  diabeticNonMetforminMortalityTotals: Totals;
  diabeticMetforminMortalityTotals: Totals;
  nonDiabeticNonMetforminMortalityTotals: Totals;
  nonDiabeticMetforminMortalityTotals: Totals;
}

export interface TitleMap {
  [key: string]: {bar: string; percent: string; pie: string}; // Generic keys
}

export interface ConfigFile {
  chartIdPrefix: string;
  titleMap: TitleMap;
  kpiPanelConfig: KpiPanelConfig;
  chartTotals: Record<string, string>; // Keys for totals, values are the keys in totalsMap
  colorScheme: Record<string, string>; // Keys for charts, values are keys in colorSchemeMap
  numCharts: number; // The number of charts to render
}

export interface ChartConfig {
  id: string;
  title: string;
  data: any[];
  colors: string[];
}
