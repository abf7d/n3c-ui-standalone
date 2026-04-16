import {KpiColumnConfig, KpiPanelConfig} from '../../components/shared/kpi-panel/kpi-panel.interface';
import {
  ConfigFile,
  FilterDef,
  KpiTotalMap,
  ISelectedFilters,
  TitleMap,
  Totals,
  TotalsCategory,
  TotalsObject
} from './base.manager.types';

export abstract class BaseManager<T> {
  protected colorSchemeMap!: Record<string, string[]>;
  private kpiTxtValues = new Map<string, any>();
  protected kpiTotalMap!: KpiTotalMap[];
  public displayMode: 'bar' | 'percent' | 'pie' = 'bar';

  constructor(colorSchemeMap: Record<string, string[]>, kpiTotalMap: KpiTotalMap[]) {
    this.colorSchemeMap = colorSchemeMap;
    this.kpiTotalMap = kpiTotalMap;
  }

  // Todo: Abstract out PatientRecord so other record types can be used
  abstract updateTotalWithRecord(totals: TotalsObject, record: T): void;

  abstract filterDataBasedOnSelectedFilters(data: T[], selectedFilters: ISelectedFilters): T[];

  abstract updateFilterMap(filteredData: any[], filterMap: FilterDef[][]): FilterDef[][];

  abstract newTotalsObj(): TotalsObject;

  public setKPIStatState(varname: string, value: any, suffix: string, decimals: number): void {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const formattedValue = this.nFormatter(numericValue, decimals);
      const finalValue = formattedValue.endsWith(suffix) ? formattedValue : formattedValue + suffix; // Avoid double suffix
      this.kpiTxtValues.set(varname, finalValue);
    } else {
      console.error(`setKPIStat failed: invalid number for ${suffix}`, value);
    }
  }

  public updateCategory(category: TotalsCategory, key: string | number | undefined, patientCount: number): void {
    if (!key) return;

    if (key in category) {
      category[key].count += patientCount;
    } else {
      category[key] = {count: patientCount, percent: 0};
    }
  }

  public updateKpiVals(totals: TotalsObject, decimalPlcs: number) {
    const kpiTotalMap = this.kpiTotalMap;
    kpiTotalMap.forEach((item) => {
      let nameParts = item.prop.split('.');
      let totalsObj: any;

      // Get the totals object for a given count
      if (nameParts.length === 1) {
        totalsObj = (totals as any)[nameParts[0]];
      } else if (nameParts.length === 2) {
        totalsObj = (totals as any)[nameParts[0]]?.[nameParts[1]];
      }

      // Get the count and set the kpi stat
      if (totalsObj) {
        let count: number;
        if (item.reduce) {
          count = Object.values(totalsObj as any[]).reduce((sum, item) => sum + item.count, 0);
        } else {
          count = totalsObj?.count || 0;
        }
        this.setKPIStatState(item.stat, count, '', decimalPlcs); // updates kpiTxtValues which are used later
      }
    });
  }

  public calculateTotals(records: T[], decimalPlcs: number): TotalsObject {
    const totals = this.newTotalsObj();
    records.forEach((record, index) => {
      this.updateTotalWithRecord(totals, record);
    });

    this.caculatePercentages(totals);

    // Updates state for kpi map
    this.updateKpiVals(totals, decimalPlcs);

    return totals;
  }

  // Used for creating chart objects
  public initializeChartsConfig(totalsMap: TotalsObject | null, pageConfig: ConfigFile): any[] {
    if (!pageConfig) {
      console.warn('No configuration available.');
      return [];
    }

    let totalsObj: TotalsObject;
    if (totalsMap) {
      totalsObj = totalsMap;
    } else {
      totalsObj = this.newTotalsObj();
    }

    const {chartTotals, colorScheme, numCharts, filterGroupNames} = pageConfig;
    const colorSchemeMap = this.colorSchemeMap;

    // Dynamically create chart configurations based on numCharts
    const chartsConfig = Object.keys(chartTotals)
      .slice(0, numCharts)
      .map((key) => {
        const totalsKey = chartTotals[key];
        const totals = totalsObj[totalsKey as keyof typeof totalsObj] || {};

        // Convert `totals` to an array if it is an object
        const data = Array.isArray(totals)
          ? totals
          : Object.entries(totals).map(([label, value]) => ({
              abbrev: label,
              ...(typeof value === 'object' && value !== null ? value : {}) // Ensure `value` is an object
            }));

        const labels = data.map((item) => item.abbrev); // Extract labels from the array

        return {
          id: `${key}`,
          title: this.getTitleForChart(pageConfig, key as keyof TitleMap, this.displayMode),
          data, // Pass the transformed array
          colors: colorSchemeMap[colorScheme[key]],
          displayMode: this.displayMode,
          labels,
          titleMap: pageConfig?.titleMap[key],
          groupName: pageConfig?.filterGroupNames[key]
        };
      });
    return chartsConfig;
  }

  public sortChartBars(data: T[]): Map<string, Map<string, number>> {
    const firstObj = data[0]!;

    const baseMap = new Map<string, Map<string, number>>();
    Object.keys(firstObj).map((label) => {
      const map = new Map<string, number>();
      // @ts-ignore
      if (firstObj[`${label}_seq`] !== undefined) {
        data.forEach((item) => {
          // @ts-ignore
          map.set(item[label], item[`${label}_seq`]);
        });
        baseMap.set(label, map);
      }
    });
    return baseMap;
  }

  // This is used to create objects that build the kpi panel in the template
  public updateKpiConfigs(currentConfig: ConfigFile): KpiPanelConfig | null {
    if (!currentConfig || !currentConfig.kpiPanelConfig) {
      console.error('KPI panel configuration is missing from the current dataset configuration.');
      return null;
    }

    // Map the kpiPanelConfig from the dataset configuration to the kpiConfigs
    const kpiConfigs = currentConfig.kpiPanelConfig.map((column) => {
      const items = column.items.map((item) => {
        const valueKey = item.value as string;

        return {
          title: item.title,
          value: this.kpiTxtValues.get(valueKey) || '', // Dynamically resolve the value property
          icon: item.icon,
          tooltipTitle: item.tooltipTitle,
          tooltipContent: item.tooltipContent,
          footer: item.footer || '',
          limitationsLink: item.limitationsLink || '',
          progress: item.progress || null // Optional progress for section 2
        };
      });

      return {
        separator: column.separator,
        items,
        rows: column.rows
      } as KpiColumnConfig;
    });
    return kpiConfigs;
  }

  // Update just the progress bar part of the config objects
  public updateKpiProgressBar(
    kpiConfigs: KpiPanelConfig,
    filteredCount: number,
    originalTotalCount: number,
    indexInKpiToolTip: number
  ): KpiPanelConfig {
    const progress = (Number(filteredCount) / Number(originalTotalCount)) * 100; // Ensure both are numbers

    // Create a new array reference to trigger Angular's change detection
    const updatedConfigs = [...kpiConfigs];
    updatedConfigs[indexInKpiToolTip] = {
      separator: updatedConfigs[indexInKpiToolTip].separator,
      items: [
        {
          title: updatedConfigs[indexInKpiToolTip].items[0].title,
          value: updatedConfigs[indexInKpiToolTip].items[0].value,
          icon: updatedConfigs[indexInKpiToolTip].items[0].icon,
          tooltipTitle: updatedConfigs[indexInKpiToolTip].items[0].tooltipTitle,
          tooltipContent: updatedConfigs[indexInKpiToolTip].items[0].tooltipContent,
          footer: updatedConfigs[indexInKpiToolTip].items[0].footer,
          limitationsLink: updatedConfigs[indexInKpiToolTip].items[0].limitationsLink,
          progress: {
            value: progress,
            tooltip: `${progress.toFixed(2)}% of total patients`
          }
        }
      ],
      rows: updatedConfigs[indexInKpiToolTip].rows
    };

    return updatedConfigs;
  }

  // General helpers:
  protected nFormatter(num: number, digits: number): string {
    const units = ['', 'K', 'M', 'B', 'T']; // Single M for millions
    let unitIndex = 0;

    while (Math.abs(num) >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    return num.toFixed(digits) + units[unitIndex];
  }

  protected getTitleForChart(pageConfig: ConfigFile, key: keyof TitleMap, mode: 'bar' | 'percent' | 'pie'): string {
    return pageConfig?.titleMap[key]?.[mode] ?? 'Title Not Found';
  }

  private caculatePercentages(totals: TotalsObject) {
    const calculateCategoryPercentages = (category: Totals) => {
      const total = Object.values(category).reduce((sum, entry) => sum + entry.count, 0);
      if (total > 0) {
        Object.keys(category).forEach((key) => {
          category[key].percent = (category[key].count / total) * 100;
        });
      }
    };

    Object.keys(totals).forEach((key) => {
      const category = totals[key as keyof TotalsObject];
      if (category && typeof category === 'object') {
        calculateCategoryPercentages(category as Totals);
      }
    });
  }

  toggleChartFilter<K extends ISelectedFilters>(current: K, selected: {label: string; groupName: string}): K {
    const key = selected.groupName.toLowerCase() as keyof K;
    const existing = current[key] || [];

    return {
      ...current,
      [key]: existing.includes(selected.label)
        ? existing.filter((val) => val !== selected.label)
        : [...existing, selected.label]
    };
  }
}
