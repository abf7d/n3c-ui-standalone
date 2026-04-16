import {ConfigFile as IConfigFile, ISelectedFilters} from '@odp/n3c/lib/services/base-manager/base.manager.types';

export interface PatientData {
  race: string;
  race_abbrev?: string;
  sex: 'Female' | 'Male' | 'Other' | 'Unknown' | '';
  nonHispanic: number;
  hispanic: number;
  unknown: number;
  total: number;
  ethnicity?: string;
  ethnicity_abbrev?: string;
  patient_count?: number;
  isParent?: boolean;
}

export interface ConfigFile extends IConfigFile {
  stackedBarCharts: {
    title: string;
    legendLabel: string;
  }[];
}

export type SelectedFilters = ISelectedFilters<'sex' | 'race' | 'ethnicity'>;
