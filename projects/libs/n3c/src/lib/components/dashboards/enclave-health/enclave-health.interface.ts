import {ISelectedFilters} from '@odp/n3c/lib/services/base-manager/base.manager.types';

export type SelectedFilters = ISelectedFilters<
  | 'age'
  | 'sex'
  | 'race'
  | 'severity'
  | 'covidstatus'
  | 'longcovidstatus'
  | 'vaccinationstatus'
  | 'mortalitystatus'
  | 'condition'
  | 'comorbidity'
  | 'cmstype'
>;
