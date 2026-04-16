import {Injectable} from '@angular/core';
import {BaseManager} from '@odp/n3c/lib/services/base-manager/base.manager';
import * as CONST from './constants';
import {ConfigFile, FilterDef, TotalsObject} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {PatientData} from '@odp/n3c/lib/models/enclave-health';
import {SelectedFilters} from './enclave-health.interface';

@Injectable({
  providedIn: 'root'
})
export class EnclaveHealthManager extends BaseManager<PatientData> {
  constructor() {
    super(CONST.colorSchemeMap, CONST.kpiTotalMap);
  }

  private raceMapping: Record<string, string> = {
    'American Indian or Alaska Native': 'AI/AN',
    'Black or African American': 'Black',
    'Native Hawaiian or Other Pacific Islander': 'NHPI'
  };

  private conditionMapping: Record<string, string> = {
    ART: 'Assist Reproductive Tech',
    BH: 'Behavioral Health Conditions',
    BI: 'Birth',
    HRC: 'High Risk Conditions',
    LRC: 'Low Risk Conditions',
    OC: 'Other Conditions',
    PC: 'Postpartum Conditions',
    RG: 'Record Of Gestation'
  };

  public updateTotalWithRecord(totals: TotalsObject, record: PatientData): void {
    const patientCount = record.patient_count_int;

    this.updateCategory(totals['ageTotals'], record.age, patientCount);
    this.updateCategory(totals['sexTotals'], record.sex, patientCount);

    const raceKey = this.raceMapping[record.race] || record.race;
    this.updateCategory(totals['raceTotals'], raceKey, patientCount);

    this.updateCategory(totals['covidStatusTotals'], record.covid_status, patientCount);
    this.updateCategory(totals['longCovidStatusTotals'], record.long_covid, patientCount);
    this.updateCategory(totals['vaccinationStatusTotals'], record.vaccinated, patientCount);
    this.updateCategory(totals['mortalityTotals'], record.mortality, patientCount);
    this.updateCategory(totals['severityTotals'], record.severity, patientCount);
    this.updateCategory(totals['comorbidityTotals'], record.comorbidity, patientCount);
    this.updateCategory(totals['cmstypeTotals'], record.cms, patientCount);
    this.updateConditions(totals, record);
  }

  private updateConditions(totals: TotalsObject, r: PatientData) {
    if (r.low_risk_conditions)
      this.updateCategory(totals['conditionTotals'], 'Low Risk Conditions', r.low_risk_conditions);
    if (r.assist_reproductive_tech)
      this.updateCategory(totals['conditionTotals'], 'Assist Reproductive Tech', r.assist_reproductive_tech);
    if (r.behavioral_health_conditions)
      this.updateCategory(totals['conditionTotals'], 'Behavioral Health Conditions', r.behavioral_health_conditions);
    if (r.birth) this.updateCategory(totals['conditionTotals'], 'Birth', r.birth);
    if (r.high_risk_conditions)
      this.updateCategory(totals['conditionTotals'], 'High Risk Conditions', r.high_risk_conditions);
    if (r.other_conditions) this.updateCategory(totals['conditionTotals'], 'Other Conditions', r.other_conditions);
    if (r.postpartum_conditions)
      this.updateCategory(totals['conditionTotals'], 'Postpartum Conditions', r.postpartum_conditions);
    if (r.record_of_gestation)
      this.updateCategory(totals['conditionTotals'], 'Record Of Gestation', r.record_of_gestation);
  }

  async loadConfigs(topic: string): Promise<{config: ConfigFile; limitations: LimitationsConfig}> {
    const [config, limitations] = await Promise.all([
      import(`./configs/${topic}.json`).then((m) => m.default),
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
      raceTotals: {},
      covidStatusTotals: {},
      longCovidStatusTotals: {},
      vaccinationStatusTotals: {},
      mortalityTotals: {},
      severityTotals: {},
      conditionTotals: {},
      comorbidityTotals: {},
      cmstypeTotals: {}
    };
  }

  public filterDataBasedOnSelectedFilters(data: PatientData[], selectedFilters: SelectedFilters): PatientData[] {
    const matchesFilter = <T>(value: T, filter: T[]) => filter.length === 0 || filter.includes(value);

    const matchesConditions = (itemConditionsStr?: string) => {
      const itemConditions = itemConditionsStr?.split(', ').map((c) => this.conditionMapping[c]) || [];
      const selected = selectedFilters.condition;

      if (selected.length === 0) return true;
      if (selected.length === 1) return itemConditions.includes(selected[0]);

      return itemConditions.length === selected.length && selected.every((cond) => itemConditions.includes(cond));
    };

    return data.filter(
      (item) =>
        matchesFilter(item.age, selectedFilters.age) &&
        matchesFilter(item.sex, selectedFilters.sex) &&
        matchesFilter(item.race_abbrev, selectedFilters.race) &&
        matchesFilter(item.severity, selectedFilters.severity) &&
        matchesFilter(item.covid_status, selectedFilters.covidstatus) &&
        matchesFilter(item.long_covid, selectedFilters.longcovidstatus) &&
        matchesFilter(item.vaccinated, selectedFilters.vaccinationstatus) &&
        matchesFilter(item.mortality, selectedFilters.mortalitystatus) &&
        matchesConditions(item.condition) &&
        matchesFilter(item.comorbidity, selectedFilters.comorbidity) &&
        matchesFilter(item.cms, selectedFilters.cmstype)
    );
  }

  buildSelectedFilters(raw: {[key: string]: string[]}): SelectedFilters {
    return {
      age: raw['Age'] || [],
      sex: raw['Sex'] || [],
      race: raw['Race'] || [],
      severity: raw['Severity'] || [],
      covidstatus: raw['COVID Status'] || [],
      longcovidstatus: raw['Long COVID Status'] || [],
      vaccinationstatus: raw['Vaccination Status'] || [],
      mortalitystatus: raw['Mortality Status'] || [],
      condition: raw['Condition'] || [],
      comorbidity: raw['Comorbidity'] || [],
      cmstype: raw['CMS Type'] || []
    };
  }
}
