import {Injectable} from '@angular/core';
import {SelectedFilters} from '../types';
import {ConfigFile, PatientRecord, TitleMap, Totals, TotalsObject} from '../types';
import * as CONST_COLORS from '../const';
import {KpiColumnConfig, KpiPanelConfig} from '../../../shared/kpi-panel/kpi-panel.interface';

@Injectable({
  providedIn: 'root'
})
export class MetforminManager {
  constructor() {}

  totals!: TotalsObject;
  displayMode: 'bar' | 'percent' | 'pie' = 'bar';

  nFormatter(num: number, digits: number): string {
    const units = ['', 'K', 'M', 'B', 'T']; // Single M for millions
    let unitIndex = 0;

    while (Math.abs(num) >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    return num.toFixed(digits) + units[unitIndex];
  }

  setKPIStat(varname: string, value: any, suffix: string, decimals: number): void {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const formattedValue = this.nFormatter(numericValue, decimals);
      const finalValue = formattedValue.endsWith(suffix) ? formattedValue : formattedValue + suffix; // Avoid double suffix
      //   (this[varname] as string) = finalValue; // Dynamically assign the value to the property
      this.kpiTxtValues.set(varname, finalValue);
    } else {
      console.error(`setKPIStat failed: invalid number for ${suffix}`, value);
    }
  }

  updateTotalWithRecord(
    totals: TotalsObject,
    record: PatientRecord,
    raceMapping: {[key: string]: string},
    ethnicityMapping: {[key: string]: string}
  ) {
    if (record.patient_count?.trim() !== '<20') {
      const patientCount = parseInt(record.patient_count, 10);
      if (!isNaN(patientCount) && patientCount >= 20) {
        // Age Totals
        if (record.age in totals.ageTotals) {
          totals.ageTotals[record.age].count += patientCount;
        } else if (record.age) {
          //console.warn(`Unknown age: ${record.age} at record index ${index}`);
          totals.ageTotals[record.age] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Sex Totals
        if (record.sex in totals.sexTotals) {
          totals.sexTotals[record.sex].count += patientCount;
        } else if (record.sex) {
          //console.warn(`Unknown sex: ${record.sex} at record index ${index}`);
          totals.sexTotals[record.sex] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Race Totals
        const raceKey = raceMapping[record.race] || record.race;
        if (raceKey in totals.raceTotals) {
          totals.raceTotals[raceKey].count += patientCount;
        } else if (raceKey) {
          //console.warn(`Unknown race: ${raceKey} at record index ${index}`);
          totals.raceTotals[raceKey] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Ethnicity Totals
        const ethnicityKey = ethnicityMapping[record.ethnicity] || record.ethnicity;
        if (ethnicityKey in totals.ethnicityTotals) {
          totals.ethnicityTotals[ethnicityKey].count += patientCount;
        } else if (ethnicityKey) {
          //console.warn(`Unknown ethnicity: ${ethnicityKey} at record index ${index}`);
          totals.ethnicityTotals[ethnicityKey] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Medication Occurrence Totals
        if (record.metformin_occurrence in totals.medOccurrenceTotals) {
          totals.medOccurrenceTotals[record.metformin_occurrence].count += patientCount;
        } else if (record.metformin_occurrence) {
          //console.warn(`Unknown metformin_occurrence: ${record.metformin_occurrence} at record index ${index}`);
          totals.medOccurrenceTotals[record.metformin_occurrence] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // COVID Status Totals
        if (record.covid_status in totals.covidStatusTotals) {
          totals.covidStatusTotals[record.covid_status].count += patientCount;
        } else if (record.covid_status) {
          //console.warn(`Unknown covid_status: ${record.covid_status} at record index ${index}`);
          totals.covidStatusTotals[record.covid_status] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Long COVID Status Totals
        if (record.long_covid_status in totals.longCovidStatusTotals) {
          totals.longCovidStatusTotals[record.long_covid_status].count += patientCount;
        } else if (record.long_covid_status) {
          //console.warn(`Unknown long_covid_status: ${record.long_covid_status} at record index ${index}`);
          totals.longCovidStatusTotals[record.long_covid_status] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Vaccination Status Totals
        if (record.vaccination_status in totals.vaccinationStatusTotals) {
          totals.vaccinationStatusTotals[record.vaccination_status].count += patientCount;
        } else if (record.vaccination_status) {
          //console.warn(`Unknown vaccination_status: ${record.vaccination_status} at record index ${index}`);
          totals.vaccinationStatusTotals[record.vaccination_status] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Mortality Totals for dataset metformin_1
        if (record.mortality in totals.mortalityTotals) {
          totals.mortalityTotals[record.mortality].count += patientCount;
        } else if (record.mortality) {
          //console.warn(`Unknown mortality: ${record.mortality} at record index ${index}`);
          totals.mortalityTotals[record.mortality] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Infer diabetes and metformin status from actual fields
        const isMetformin = record.metformin_status === 'Metformin';
        const isDiabetic = record.diabetes_status === 'Diabetes';

        // Severity Totals
        if (record.severity in totals.metforminSeverityTotals) {
          totals.metforminSeverityTotals[record.severity].count += patientCount;
        } else if (record.severity) {
          //console.warn(`Unknown severity: ${record.severity} at record index ${index}`);
          totals.metforminSeverityTotals[record.severity] = {count: patientCount, percent: 0}; // Optional dynamic addition
        }

        // Non-Metformin Severity Totals
        if (!isMetformin && record.severity in totals.nonMetforminSeverityTotals) {
          totals.nonMetforminSeverityTotals[record.severity].count += patientCount;
        } else if (!isMetformin && record.severity) {
          totals.nonMetforminSeverityTotals[record.severity] = {count: patientCount, percent: 0};
        }

        // Diabetic Non-Metformin Severity Totals
        if (isDiabetic && !isMetformin && record.severity in totals.diabeticNonMetforminSeverityTotals) {
          totals.diabeticNonMetforminSeverityTotals[record.severity].count += patientCount;
        } else if (isDiabetic && !isMetformin && record.severity) {
          totals.diabeticNonMetforminSeverityTotals[record.severity] = {count: patientCount, percent: 0};
        }

        // Diabetic Metformin Severity Totals
        if (isDiabetic && isMetformin && record.severity in totals.diabeticMetforminSeverityTotals) {
          totals.diabeticMetforminSeverityTotals[record.severity].count += patientCount;
        } else if (isDiabetic && isMetformin && record.severity) {
          totals.diabeticMetforminSeverityTotals[record.severity] = {count: patientCount, percent: 0};
        }

        // Non-Diabetic Non-Metformin Severity Totals
        if (!isDiabetic && !isMetformin && record.severity in totals.nonDiabeticNonMetforminSeverityTotals) {
          totals.nonDiabeticNonMetforminSeverityTotals[record.severity].count += patientCount;
        } else if (!isDiabetic && !isMetformin && record.severity) {
          totals.nonDiabeticNonMetforminSeverityTotals[record.severity] = {count: patientCount, percent: 0};
        }

        // Non-Diabetic Metformin Severity Totals
        if (!isDiabetic && isMetformin && record.severity in totals.nonDiabeticMetforminSeverityTotals) {
          totals.nonDiabeticMetforminSeverityTotals[record.severity].count += patientCount;
        } else if (!isDiabetic && isMetformin && record.severity) {
          totals.nonDiabeticMetforminSeverityTotals[record.severity] = {count: patientCount, percent: 0};
        }

        // LONG COVID TOTALS
        // Patients not prescribed Metformin
        if (!isMetformin && record.long_covid_status) {
          if (record.long_covid_status in totals.nonMetforminLongCovidTotals) {
            totals.nonMetforminLongCovidTotals[record.long_covid_status].count += patientCount;
          } else {
            totals.nonMetforminLongCovidTotals[record.long_covid_status] = {count: patientCount, percent: 0};
          }
        }

        // Patients prescribed Metformin
        if (isMetformin && record.long_covid_status) {
          if (record.long_covid_status in totals.metforminLongCovidTotals) {
            totals.metforminLongCovidTotals[record.long_covid_status].count += patientCount;
          } else {
            totals.metforminLongCovidTotals[record.long_covid_status] = {count: patientCount, percent: 0};
          }
        }

        // Diabetic patients not prescribed Metformin
        if (isDiabetic && !isMetformin && record.long_covid_status) {
          if (record.long_covid_status in totals.diabeticNonMetforminLongCovidTotals) {
            totals.diabeticNonMetforminLongCovidTotals[record.long_covid_status].count += patientCount;
          } else {
            totals.diabeticNonMetforminLongCovidTotals[record.long_covid_status] = {count: patientCount, percent: 0};
          }
        }

        // Diabetic patients prescribed Metformin
        if (isDiabetic && isMetformin && record.long_covid_status) {
          if (record.long_covid_status in totals.diabeticMetforminLongCovidTotals) {
            totals.diabeticMetforminLongCovidTotals[record.long_covid_status].count += patientCount;
          } else {
            totals.diabeticMetforminLongCovidTotals[record.long_covid_status] = {count: patientCount, percent: 0};
          }
        }

        // Non-diabetic patients not prescribed Metformin
        if (!isDiabetic && !isMetformin && record.long_covid_status) {
          if (record.long_covid_status in totals.nonDiabeticNonMetforminLongCovidTotals) {
            totals.nonDiabeticNonMetforminLongCovidTotals[record.long_covid_status].count += patientCount;
          } else {
            totals.nonDiabeticNonMetforminLongCovidTotals[record.long_covid_status] = {count: patientCount, percent: 0};
          }
        }

        // Non-diabetic patients prescribed Metformin
        if (!isDiabetic && isMetformin && record.long_covid_status) {
          if (record.long_covid_status in totals.nonDiabeticMetforminLongCovidTotals) {
            totals.nonDiabeticMetforminLongCovidTotals[record.long_covid_status].count += patientCount;
          } else {
            totals.nonDiabeticMetforminLongCovidTotals[record.long_covid_status] = {count: patientCount, percent: 0};
          }
        }

        // MORTALITY TOTALS

        // Non-Metformin Mortality Totals
        if (!isMetformin && record.mortality) {
          if (record.mortality in totals.nonMetforminMortalityTotals) {
            totals.nonMetforminMortalityTotals[record.mortality].count += patientCount;
          } else {
            totals.nonMetforminMortalityTotals[record.mortality] = {count: patientCount, percent: 0};
          }
        }

        // Metformin Mortality Totals
        if (isMetformin && record.mortality) {
          if (record.mortality in totals.metforminMortalityTotals) {
            totals.metforminMortalityTotals[record.mortality].count += patientCount;
          } else {
            totals.metforminMortalityTotals[record.mortality] = {count: patientCount, percent: 0};
          }
        }

        // Diabetic Non-Metformin Mortality Totals
        if (isDiabetic && !isMetformin && record.mortality) {
          if (record.mortality in totals.diabeticNonMetforminMortalityTotals) {
            totals.diabeticNonMetforminMortalityTotals[record.mortality].count += patientCount;
          } else {
            totals.diabeticNonMetforminMortalityTotals[record.mortality] = {count: patientCount, percent: 0};
          }
        }

        // Diabetic Metformin Mortality Totals
        if (isDiabetic && isMetformin && record.mortality) {
          if (record.mortality in totals.diabeticMetforminMortalityTotals) {
            totals.diabeticMetforminMortalityTotals[record.mortality].count += patientCount;
          } else {
            totals.diabeticMetforminMortalityTotals[record.mortality] = {count: patientCount, percent: 0};
          }
        }

        // Non-Diabetic Non-Metformin Mortality Totals
        if (!isDiabetic && !isMetformin && record.mortality) {
          if (record.mortality in totals.nonDiabeticNonMetforminMortalityTotals) {
            totals.nonDiabeticNonMetforminMortalityTotals[record.mortality].count += patientCount;
          } else {
            totals.nonDiabeticNonMetforminMortalityTotals[record.mortality] = {count: patientCount, percent: 0};
          }
        }

        // Non-Diabetic Metformin Mortality Totals
        if (!isDiabetic && isMetformin && record.mortality) {
          if (record.mortality in totals.nonDiabeticMetforminMortalityTotals) {
            totals.nonDiabeticMetforminMortalityTotals[record.mortality].count += patientCount;
          } else {
            totals.nonDiabeticMetforminMortalityTotals[record.mortality] = {count: patientCount, percent: 0};
          }
        }
      }
    }
  }

  updateKpiVals(totals: TotalsObject) {
    const kpiTotalMap = CONST_COLORS.kpiTotalMap;
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
        this.setKPIStat(item.stat, count, '', 2);
      }
    });
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
  private newTotalsObj(): TotalsObject {
    return {
      ageTotals: {},
      sexTotals: {},
      raceTotals: {},
      metforminSeverityTotals: {}, // Initialize as empty objects
      ethnicityTotals: {},
      medOccurrenceTotals: {},
      covidStatusTotals: {},
      longCovidStatusTotals: {},
      vaccinationStatusTotals: {},
      mortalityTotals: {},
      nonMetforminSeverityTotals: {},
      diabeticNonMetforminSeverityTotals: {},
      diabeticMetforminSeverityTotals: {},
      nonDiabeticNonMetforminSeverityTotals: {},
      nonDiabeticMetforminSeverityTotals: {},
      nonMetforminLongCovidTotals: {},
      metforminLongCovidTotals: {},
      diabeticNonMetforminLongCovidTotals: {},
      diabeticMetforminLongCovidTotals: {},
      nonDiabeticNonMetforminLongCovidTotals: {},
      nonDiabeticMetforminLongCovidTotals: {},
      nonMetforminMortalityTotals: {},
      metforminMortalityTotals: {},
      diabeticNonMetforminMortalityTotals: {},
      diabeticMetforminMortalityTotals: {},
      nonDiabeticNonMetforminMortalityTotals: {},
      nonDiabeticMetforminMortalityTotals: {}
    };
  }

  kpiTxtValues = new Map<string, any>();
  calculateTotals(records: PatientRecord[]): TotalsObject {
    const raceMapping: {[key: string]: string} = {
      'American Indian or Alaska Native': 'AI/AN',
      'Black or African American': 'Black',
      'Native Hawaiian or Other Pacific Islander': 'NHPI'
    };

    const ethnicityMapping: {[key: string]: string} = {
      'Not Hispanic or Latino': 'Not Hisp/Lat',
      'Hispanic or Latino': 'Hisp/Lat'
    };

    const totals = this.newTotalsObj();

    records.forEach((record, index) => {
      this.updateTotalWithRecord(totals, record, raceMapping, ethnicityMapping);
    });

    this.caculatePercentages(totals);

    // Update kpi map set KPI values based on totals
    this.updateKpiVals(totals);

    return totals;
  }

  initializeChartsConfig(
    totalsMap: TotalsObject | null,
    pageConfig: ConfigFile,
    /* colors: ChartColorConfig, */ chartIdPrefix: string = 'metformin_1'
  ): any[] {
    if (!pageConfig) {
      console.warn('No configuration available.');
      return [];
    }

    let totalsObj: TotalsObject;
    if (totalsMap) {
      totalsObj = totalsMap;
    } /* else if (this.totals !== null) {
        totalsObj = this.totals;
    } */ else {
      totalsObj = this.newTotalsObj();
    }

    const {titleMap, chartTotals, colorScheme, numCharts} = pageConfig;

    // Map JSON keys to component variables dynamically
    const colorSchemeMap: Record<string, string[]> = {
      severityRange: CONST_COLORS.severityRange,
      ageRange: CONST_COLORS.ageRangeMin,
      sexRange: CONST_COLORS.sexRange,
      ethnicityRange: CONST_COLORS.ethnicityRange,
      raceRange: CONST_COLORS.raceRange,
      medicationOccurrenceRange: CONST_COLORS.medicationOccurrenceRange,
      covidStatusRange: CONST_COLORS.covidStatusRange,
      longStatusRange: CONST_COLORS.longStatusRange,
      vaccinationStatusRange: CONST_COLORS.vaccinationStatusRange,
      mortalityRange: CONST_COLORS.mortalityRange
    };

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
          id: `${chartIdPrefix}-${key}`,
          title: this.getTitleForChart(pageConfig, key as keyof TitleMap, this.displayMode),
          data, // Pass the transformed array
          colors: colorSchemeMap[colorScheme[key]],
          displayMode: this.displayMode,
          labels
        };
      });
    return chartsConfig;
  }
  getTitleForChart(pageConfig: ConfigFile, key: keyof TitleMap, mode: 'bar' | 'percent' | 'pie'): string {
    return pageConfig?.titleMap[key]?.[mode] ?? 'Title Not Found';
  }

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

  filterDataBasedOnSelectedFilters(metforminData: PatientRecord[], selectedFilters: SelectedFilters) {
    return metforminData.filter((item: PatientRecord) => {
      const ageFilter = selectedFilters.age.length === 0 || selectedFilters.age.includes(item.age);
      const sexFilter = selectedFilters.sex.length === 0 || selectedFilters.sex.includes(item.sex);
      const raceFilter = selectedFilters.race.length === 0 || selectedFilters.race.includes(item.race);
      const severityFilter = selectedFilters.severity.length === 0 || selectedFilters.severity.includes(item.severity);
      const ethnicityFilter =
        selectedFilters.ethnicity.length === 0 || selectedFilters.ethnicity.includes(item.ethnicity);
      const covidStatusFilter =
        selectedFilters.covidstatus.length === 0 || selectedFilters.covidstatus.includes(item.covid_status);
      const longCovidStatusFilter =
        selectedFilters.longcovidstatus.length === 0 ||
        selectedFilters.longcovidstatus.includes(item.long_covid_status);
      const vaccinationStatusFilter =
        selectedFilters.vaccinationstatus.length === 0 ||
        selectedFilters.vaccinationstatus.includes(item.vaccination_status);
      const mortalityFilter =
        selectedFilters.mortality.length === 0 || selectedFilters.mortality.includes(item.mortality);
      const medOccurrenceFilter =
        selectedFilters.medoccurrence.length === 0 || selectedFilters.medoccurrence.includes(item.metformin_occurrence);
      const cciScoreFilter = selectedFilters.cciscore.length === 0 || selectedFilters.cciscore.includes(item.cci_score);

      // Return true if all filters match
      return (
        ageFilter &&
        sexFilter &&
        raceFilter &&
        severityFilter &&
        ethnicityFilter &&
        covidStatusFilter &&
        longCovidStatusFilter &&
        mortalityFilter &&
        vaccinationStatusFilter &&
        medOccurrenceFilter &&
        cciScoreFilter
      );
    });
  }

  updateKpiProgressBar(kpiConfigs: KpiPanelConfig, filteredCount: number, originalTotalCount: number): KpiPanelConfig {
    const progress = (Number(filteredCount) / Number(originalTotalCount)) * 100; // Ensure both are numbers

    // Create a new array reference to trigger Angular's change detection
    const updatedConfigs = [...kpiConfigs];
    updatedConfigs[1] = {
      separator: updatedConfigs[1].separator,
      items: [
        {
          title: updatedConfigs[1].items[0].title,
          value: updatedConfigs[1].items[0].value,
          icon: updatedConfigs[1].items[0].icon,
          tooltipTitle: updatedConfigs[1].items[0].tooltipTitle,
          tooltipContent: updatedConfigs[1].items[0].tooltipContent,
          footer: updatedConfigs[1].items[0].footer,
          limitationsLink: updatedConfigs[1].items[0].limitationsLink,
          progress: {
            value: progress,
            tooltip: `${progress.toFixed(2)}% of total patients`
          }
        }
      ],
      rows: updatedConfigs[1].rows
    };

    return updatedConfigs;
  }

  public updateFilterMap(
    filteredData: any[],
    filterMap: {
      title: string;
      values: string[];
    }[][]
  ): {
    title: string;
    values: string[];
  }[][] {
    const cciScoreExists = filteredData.some((record: any) => 'cci_score' in record);

    // Define the CCI Score filter
    const cciScoreFilter = {
      title: 'CCI Score',
      values: ['1-2', '3-4', '5-10', '11+', 'Missing']
    };

    // Check if CCI Score filter exists in filterMap
    const covidStatusIndex = filterMap[1].findIndex((filter) => filter.title === 'COVID Status');
    const cciScoreIndex = filterMap[1].findIndex((filter) => filter.title === 'CCI Score');

    if (cciScoreExists && cciScoreIndex === -1) {
      // Insert CCI Score filter above COVID Status
      filterMap[1].splice(covidStatusIndex, 0, cciScoreFilter);
    } else if (!cciScoreExists && cciScoreIndex !== -1) {
      // Remove CCI Score filter if it exists but data does not have cci_score
      filterMap[1].splice(cciScoreIndex, 1);
    }

    // Remove Ethnicity filter if CCI Score exists
    const ethnicityIndex = filterMap[0].findIndex((filter) => filter.title === 'Ethnicity');
    if (cciScoreExists && ethnicityIndex !== -1) {
      filterMap[0].splice(ethnicityIndex, 1);
    }

    // Add back Ethnicity filter if CCI Score does not exist and Ethnicity filter is missing
    if (!cciScoreExists && ethnicityIndex === -1) {
      filterMap[0].push({
        title: 'Ethnicity',
        values: ['Hispanic or Latino', 'Not Hispanic or Latino', 'Unknown']
      });
    }

    // Force Angular to detect changes
    return [...filterMap];
  }
}
