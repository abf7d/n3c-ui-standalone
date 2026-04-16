import {Injectable} from '@angular/core';
import {BaseManager} from '@odp/n3c/lib/services/base-manager/base.manager';
import * as CONST from './constants';
import {FilterDef, TotalsObject} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {DiseaseSnapshot, PatientData} from '@odp/n3c/lib/models/disease-snapshots';
import {ConfigFile, SelectedFilters} from './disease-snapshots.interface';
import {ChartGroup, ChartSegment} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar.interface';

@Injectable({
  providedIn: 'root'
})
export class DiseaseSnapshotsManager extends BaseManager<PatientData> {
  constructor() {
    super(CONST.colorSchemeMap, CONST.kpiTotalMap);
  }

  public updateTotalWithRecord(totals: TotalsObject, record: PatientData): void {
    const patientCount = record.patient_count_int;

    this.updateCategory(totals['ageTotals'], record.age, patientCount);
    this.updateCategory(totals['sexTotals'], record.sex, patientCount);
    this.updateCategory(totals['observationTotals'], record.observation, patientCount);
    this.updateCategory(
      totals['hasDiseaseLess18Totals'],
      'total',
      record.observation === 'Has Disease' && record.age === '<18' ? patientCount : 0
    );
  }

  async loadConfigs(topic: string): Promise<{config: ConfigFile; limitations: LimitationsConfig}> {
    const [config, limitations] = await Promise.all([
      import('./configs/generic.json').then((m) => m.default),
      import('./configs/limitations.json').then((m) => m.default)
    ]);
    return {config, limitations};
  }

  updateFilterMap(filteredData: PatientData[], filterMap: FilterDef[][]): FilterDef[][] {
    return [];
  }

  public newTotalsObj(): TotalsObject {
    return {
      ageTotals: {},
      sexTotals: {},
      observationTotals: {},
      hasDiseaseLess18Totals: {}
    };
  }

  public filterDataBasedOnSelectedFilters(data: PatientData[], selectedFilters: SelectedFilters): PatientData[] {
    const matchesFilter = <T>(value: T, filter: T[]) => filter.length === 0 || filter.includes(value);

    return data.filter(
      (item) => matchesFilter(item.age, selectedFilters.age) && matchesFilter(item.sex, selectedFilters.sex)
    );
  }

  buildSelectedFilters(raw: {[key: string]: string[]}): SelectedFilters {
    return {
      age: raw['Age'] || [],
      sex: raw['Sex'] || []
    };
  }

  buildGroupedChartData(rawData: DiseaseSnapshot[], groupBy: 'age' | 'sex', filterMap: FilterDef[][]): ChartGroup[] {
    const chartData: ChartGroup[] = [];

    const groupKeys = groupBy === 'age' ? filterMap[0][0].values : filterMap[0][1].values;
    const colorMap = groupBy === 'sex' ? this.colorSchemeMap['sexRange'] : this.colorSchemeMap['ageRange'];

    const observationKeys = Array.from(new Set(rawData.map((r) => r.observation)));

    // "Has Disease" count per group
    const hasDiseaseCounts: Record<string, number> = {};
    for (const groupKey of groupKeys) {
      const matchingRows = rawData.filter((row) => row.observation === 'Has Disease' && row[groupBy] === groupKey);
      hasDiseaseCounts[groupKey] = matchingRows.reduce((sum, row) => sum + (row.patient_count_int || 0), 0);
    }

    for (const obs of observationKeys) {
      const segments: ChartSegment[] = [];

      for (let i = 0; i < groupKeys.length; i++) {
        const groupKey = groupKeys[i];
        const matchingRows = rawData.filter((row) => row.observation === obs && row[groupBy] === groupKey);
        const totalCount = matchingRows.reduce((sum, row) => sum + (row.patient_count_int || 0), 0);

        // Calculate percentage relative to "Has Disease" in the same group
        const percentage =
          obs === 'Has Disease'
            ? 100
            : hasDiseaseCounts[groupKey] > 0
              ? (totalCount / hasDiseaseCounts[groupKey]) * 100
              : 0;

        segments.push({
          value: totalCount,
          color: colorMap[i],
          label: groupKey,
          percentage: +percentage.toFixed(2)
        });
      }

      chartData.push({label: obs, segments});
    }

    return chartData;
  }

  buildCharts(filtered: PatientData[], config: ConfigFile, filterMap: FilterDef[][]): ChartGroup[][] {
    return config.groupedBarCharts.map((chart) =>
      this.buildGroupedChartData(filtered, chart.legendLabel.toLowerCase() as 'age' | 'sex', filterMap)
    );
  }
}
