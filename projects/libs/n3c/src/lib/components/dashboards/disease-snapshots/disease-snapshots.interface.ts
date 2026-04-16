import {ISelectedFilters, ConfigFile as IConfigFile} from '@odp/n3c/lib/services/base-manager/base.manager.types';

export type SelectedFilters = ISelectedFilters<'age' | 'sex'>;

export interface ConfigFile extends IConfigFile {
  groupedBarCharts: {
    title: string;
    legendLabel: string;
  }[];
}
