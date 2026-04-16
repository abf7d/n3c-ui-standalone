import {KpiPanelConfig} from '../../components/shared/kpi-panel/kpi-panel.interface';

export interface KpiTotalMap {
  prop: string;
  reduce: boolean;
  stat: string;
}

export interface TitleMap {
  [key: string]: {bar: string; percent: string; pie: string}; // Generic keys
}

export interface Totals {
  [key: string]: {count: number; percent: number};
}

export interface TotalsCategory {
  [key: string]: {count: number; percent?: number};
}

export interface TotalsObject {
  [key: string]: TotalsCategory;
}

export interface ConfigFile {
  pageName: string;
  supplSource: string;
  dataFactor: string;
  titleMap: TitleMap;
  kpiPanelConfig: KpiPanelConfig; // Define a stricter type if possible
  filterGroupNames: Record<string, string>;
  chartTotals: Record<string, string>; // Keys for totals, values are the keys in totalsMap
  colorScheme: Record<string, string>; // Keys for charts, values are keys in colorSchemeMap
  numCharts: number; // The number of charts to render
}

export interface FilterDef {
  title: string;
  values: string[];
}

export type ISelectedFilters<K extends string = string> = {
  [P in K]: string[];
};
