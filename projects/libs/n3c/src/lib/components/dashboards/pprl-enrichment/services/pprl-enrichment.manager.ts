import {BaseManager} from '../../../../services/base-manager/base.manager';
import {PatientRecord, SelectedFilters} from '../types';
import * as CONST from '../const';
import {Injectable} from '@angular/core';
import {FilterDef, TotalsObject} from '@odp/n3c/lib/services/base-manager/base.manager.types';
@Injectable({
  providedIn: 'root'
})
export class PprlEnrichmentManager extends BaseManager<PatientRecord> {
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
    'Hispanic or Latino': 'Hisp/Lat'
  };

  public updateTotalWithRecord(totals: TotalsObject, record: PatientRecord): void {
    const patientCount = parseInt(record.patient_count, 10);
    if (isNaN(patientCount) || patientCount < 20) return;

    this.updateCategory(totals['ageTotals'], record.age, patientCount);
    this.updateCategory(totals['sexTotals'], record.sex, patientCount);

    const raceKey = this.raceMapping[record.race] || record.race;
    this.updateCategory(totals['raceTotals'], raceKey, patientCount);

    const ethnicityKey = this.ethnicityMapping[record.ethnicity] || record.ethnicity;
    this.updateCategory(totals['ethnicityTotals'], ethnicityKey, patientCount);
    this.updateCategory(totals['covidStatusTotals'], record.covid_status, patientCount);
    this.updateCategory(totals['longCovidStatusTotals'], record.long_covid, patientCount);
    this.updateCategory(totals['vaccinationStatusTotals'], record.vaccinated, patientCount);
    this.updateCategory(totals['mortalityTotals'], record.mortality, patientCount);
    this.updateCategory(totals['severityTotals'], record.severity, patientCount);
  }

  public filterDataBasedOnSelectedFilters(data: PatientRecord[], selectedFilters: SelectedFilters): PatientRecord[] {
    return data.filter((item: PatientRecord) => {
      const ageFilter = selectedFilters.age.length === 0 || selectedFilters.age.includes(item.age);
      const sexFilter = selectedFilters.sex.length === 0 || selectedFilters.sex.includes(item.sex);

      const raceFilter = selectedFilters.race.length === 0 || selectedFilters.race.includes(item.race_abbrev);
      const severityFilter = selectedFilters.severity.length === 0 || selectedFilters.severity.includes(item.severity);
      const ethnicityFilter =
        selectedFilters.ethnicity.length === 0 || selectedFilters.ethnicity.includes(item.ethnicity_abbrev);
      const covidStatusFilter =
        selectedFilters.covidstatus.length === 0 || selectedFilters.covidstatus.includes(item.covid_status);
      const longCovidStatusFilter =
        selectedFilters.longcovidstatus.length === 0 || selectedFilters.longcovidstatus.includes(item.long_covid);
      const vaccinationStatusFilter =
        selectedFilters.vaccinationstatus.length === 0 || selectedFilters.vaccinationstatus.includes(item.vaccinated);
      const mortalityFilter =
        selectedFilters.mortalitystatus.length === 0 || selectedFilters.mortalitystatus.includes(item.mortality);

      // Return true if all filters match
      return (
        // &&
        ageFilter &&
        sexFilter &&
        raceFilter &&
        severityFilter &&
        ethnicityFilter &&
        covidStatusFilter &&
        longCovidStatusFilter &&
        mortalityFilter &&
        vaccinationStatusFilter
      );
    });
  }

  // Custom Logic
  public updateFilterMap(filteredData: any[], filterMap: FilterDef[][]): FilterDef[][] {
    return filterMap;
  }

  public newTotalsObj(): TotalsObject {
    return {
      ageTotals: {},
      sexTotals: {},
      raceTotals: {},
      ethnicityTotals: {},
      longCovidStatusTotals: {},
      vaccinationStatusTotals: {},
      mortalityTotals: {},
      severityTotals: {}
    };
  }
}
