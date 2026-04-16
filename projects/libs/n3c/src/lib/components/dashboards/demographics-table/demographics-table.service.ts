import {Injectable} from '@angular/core';
import {BaseManager} from '@odp/n3c/lib/services/base-manager/base.manager';
import * as CONST from './constants';
import {ConfigFile, PatientData, SelectedFilters} from './demographics-table.interface';
import {FilterDef, TotalsObject} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {ColDef} from 'ag-grid-community';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {ChartGroup, ChartSegment} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar.interface';

@Injectable({
  providedIn: 'root'
})
export class N3cDemTableManager extends BaseManager<PatientData> {
  constructor() {
    super(CONST.colorSchemeMap, CONST.kpiTotalMap);
  }

  private raceMapping: {[key: string]: string} = {
    'American Indian or Alaska Native': 'AI/AN',
    'Black or African American': 'Black',
    'Native Hawaiian or Other Pacific Islander': 'NHPI'
  };

  private ethnicityMapping: {[key: string]: string} = {
    'Not Hispanic or Latino': 'Not Hisp/Lat',
    'Hispanic or Latino': 'Hisp/lat'
  };

  updateTotalWithRecord(totals: TotalsObject, record: PatientData): void {
    if (record.isParent) return;

    const count = record.patient_count ?? record.total;
    const patientCount = parseInt(count.toString(), 10);
    if (isNaN(patientCount) || patientCount < 20) return;

    this.updateCategory(totals['totals'], 'Total', patientCount);
    this.updateCategory(totals['sexTotals'], record.sex, patientCount);

    const raceKey = this.raceMapping[record.race] || record.race;
    this.updateCategory(totals['raceTotals'], raceKey, patientCount);

    if (record.ethnicity) {
      const ethnicityKey = this.ethnicityMapping[record.ethnicity] || record.ethnicity;
      this.updateCategory(totals['ethnicityTotals'], ethnicityKey, patientCount);
    } else {
      this.updateCategory(totals['ethnicityTotals'], 'Not Hisp/Lat', record.nonHispanic);
      this.updateCategory(totals['ethnicityTotals'], 'Hisp/Lat', record.hispanic);
      this.updateCategory(totals['ethnicityTotals'], 'Unknown', record.unknown);
    }
  }

  updateFilterMap(filteredData: PatientData[], filterMap: FilterDef[][]): FilterDef[][] {
    return [];
  }

  public newTotalsObj(): TotalsObject {
    return {
      totals: {},
      sexTotals: {},
      raceTotals: {},
      ethnicityTotals: {}
    };
  }

  filterDataBasedOnSelectedFilters(data: PatientData[], selectedFilters: SelectedFilters): PatientData[] {
    const selectedRaces = new Set(selectedFilters.race);
    const selectedSexes = new Set(selectedFilters.sex);
    const filteredGroups: Record<string, {parent: PatientData; children: PatientData[]}> = {};

    data.forEach((row) => {
      if (!row.isParent) {
        if (
          (!selectedRaces.size || selectedRaces.has(this.raceMapping[row.race] || row.race)) &&
          (!selectedSexes.size || selectedSexes.has(row.sex))
        ) {
          if (!filteredGroups[row.race]) {
            filteredGroups[row.race] = {
              parent: {
                race: row.race,
                sex: '',
                nonHispanic: 0,
                hispanic: 0,
                unknown: 0,
                total: 0,
                isParent: true
              },
              children: []
            };
          }
          filteredGroups[row.race].children.push(row);

          // Accumulate counts for the race (parent row)
          filteredGroups[row.race].parent.nonHispanic += row.nonHispanic;
          filteredGroups[row.race].parent.hispanic += row.hispanic;
          filteredGroups[row.race].parent.unknown += row.unknown;
          filteredGroups[row.race].parent.total += row.total;
        }
      }
    });

    const filteredRows: PatientData[] = [];
    Object.values(filteredGroups).forEach(({parent, children}) => {
      filteredRows.push(parent, ...children);
    });

    return filteredRows;
  }

  filterDemoDataBasedOnSelectedFilters(data: PatientData[], selectedFilters: SelectedFilters): PatientData[] {
    return data.filter((item: PatientData) => {
      const sexFilter = selectedFilters.sex.length === 0 || selectedFilters.sex.includes(item.sex);

      let raceFilter = false;
      if (item.race_abbrev)
        raceFilter = selectedFilters.race.length === 0 || selectedFilters.race.includes(item.race_abbrev);
      let ethnicityFilter = false;
      if (item.ethnicity_abbrev)
        ethnicityFilter =
          selectedFilters.ethnicity.length === 0 || selectedFilters.ethnicity.includes(item.ethnicity_abbrev);

      // Return true if all filters match
      return sexFilter && raceFilter && ethnicityFilter;
    });
  }

  filterSelectedData(data: PatientData[], filters: SelectedFilters, isFirstTopic: boolean): PatientData[] {
    return isFirstTopic
      ? this.filterDataBasedOnSelectedFilters(data, filters)
      : this.filterDemoDataBasedOnSelectedFilters(data, filters);
  }

  groupDataByRaceWithParentSummary(data: any[]): PatientData[] {
    const groups: Record<string, {parent: PatientData; children: PatientData[]}> = {};

    data.forEach((row) => {
      const raceKey = row.race;
      if (!groups[raceKey]) {
        groups[raceKey] = {
          parent: {
            race: raceKey,
            sex: '', // Empty for parent rows
            nonHispanic: 0,
            hispanic: 0,
            unknown: 0,
            total: 0,
            isParent: true
          },
          children: []
        };
      }
      groups[raceKey].parent.nonHispanic += row.count_non_hispanic;
      groups[raceKey].parent.hispanic += row.count_hispanic;
      groups[raceKey].parent.unknown += row.count_ethnicity_unknown;
      groups[raceKey].parent.total += row.total;

      // Add child row (sex-specific row)
      groups[raceKey].children.push({
        race: raceKey,
        sex: row.sex,
        nonHispanic: row.count_non_hispanic,
        hispanic: row.count_hispanic,
        unknown: row.count_ethnicity_unknown,
        total: row.total
      });
    });

    // Flatten the groups into the final array
    const result: PatientData[] = [];
    Object.values(groups).forEach((group) => {
      result.push(group.parent, ...group.children);
    });
    return result;
  }

  private buildStackedChartData(
    rawData: PatientData[],
    groupBy: 'ethnicity' | 'sex',
    filterMap: FilterDef[][]
  ): ChartGroup[] {
    const chartData: ChartGroup[] = [];

    const groupKeys = groupBy === 'ethnicity' ? filterMap[0][0].values : filterMap[0][2].values;
    const colorMap = groupBy === 'ethnicity' ? this.colorSchemeMap['ethnicityRange'] : this.colorSchemeMap['sexRange'];
    const raceKeys = filterMap[0][1].values;

    for (const race of raceKeys) {
      const segments: ChartSegment[] = [];

      for (let i = 0; i < groupKeys.length; i++) {
        const groupKey = groupKeys[i];

        // Get all matching rows
        const matchingRows = rawData.filter((row) => {
          return (
            row.race_abbrev === race &&
            (groupBy === 'ethnicity' ? row.ethnicity_abbrev === groupKey : row.sex === groupKey)
          );
        });

        const totalCount = matchingRows.reduce((sum, row) => sum + (row.patient_count || 0), 0);

        segments.push({
          value: totalCount,
          color: colorMap[i],
          label: groupKey
        });
      }

      chartData.push({label: race, segments});
    }

    return chartData;
  }

  async loadConfigs(topic: string): Promise<{config: ConfigFile; limitations: LimitationsConfig}> {
    const [config, limitations] = await Promise.all([
      import(`./configs/${topic}.json`).then((m) => m.default),
      import('./configs/limitations.json').then((m) => m.default)
    ]);
    return {config, limitations};
  }

  transformPatientData(rows: any[], isFirstTopic: boolean): PatientData[] {
    return isFirstTopic ? this.groupDataByRaceWithParentSummary(rows) : rows;
  }

  getColumnDefs(isFirstTopic: boolean): ColDef[] {
    return isFirstTopic ? CONST.columnDefs : CONST.demoColumnDefs;
  }

  buildSelectedFilters(raw: {[key: string]: string[]}): SelectedFilters {
    return {
      sex: raw['Sex'] || [],
      race: raw['Race'] || [],
      ethnicity: raw['Ethnicity'] || []
    };
  }

  buildCharts(filtered: PatientData[], config: ConfigFile, filterMap: FilterDef[][], isFirst: boolean): ChartGroup[][] {
    if (isFirst) return [];

    return config.stackedBarCharts.map((chart) =>
      this.buildStackedChartData(filtered, chart.legendLabel.toLowerCase() as 'ethnicity' | 'sex', filterMap)
    );
  }
}
