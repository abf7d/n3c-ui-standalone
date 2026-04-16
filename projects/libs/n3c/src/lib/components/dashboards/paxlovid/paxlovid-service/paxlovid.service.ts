import {Injectable} from '@angular/core';
import {Totals, PatientRecord, TotalsObject, ConfigFile, TitleMap, ChartConfig} from '../models/paxlovid.models';
import {PaxlovidComponent} from '../paxlovid.component'; // because we pass a 'this' instance into calcualeTotals
import {KpiItemConfig, KpiPanelConfig} from '../../../shared/kpi-panel/kpi-panel.interface';

@Injectable({
  providedIn: 'root'
})
export class PaxlovidService {
  private totals: Record<string, any> = {};
  // KPI values at top of page in kpi panel
  public numTPIE: string = ''; // Total Patients in Enclave
  public numTCPIE: string = ''; // Total COVID Patients in Enclave
  public numPPIE: string = ''; // Paxlovid Patients in Enclave
  public numTPIV: string = ''; // Total Patients in View
  public numCIV: string = ''; // Covid in View
  public numLCIV: string = ''; // Lopng Covid in View
  public numVIV: string = ''; // Vaccinated in View
  public numMIV: string = ''; // Metformin in View
  public numNMIV: string = ''; // Non-Metformin in View
  public numDNMIV: string = ''; // Diabetic Non-Metformin in View
  public numDMIV: string = ''; // Diabetic Metformin in View

  // Define the color scales
  paxlovidRange = ['#AD1181']; // light gray , '#F1F1F1'
  ethnicityRange = ['#332380', '#B6AAF3', '#a6a6a6'];
  sexRange = ['#4833B2', '#ffa600', '#8406D1', '#a6a6a6'];
  ageRangeMin = ['#EADEF7', '#8642CE', '#33298D', '#a6a6a6'];
  ageRangeIdeal = [
    '#EADEF7',
    '#C9A8EB',
    '#A772DF',
    '#8642CE',
    '#762AC6',
    '#6512BD',
    '#4C1EA5',
    '#33298D',
    '#251a8a',
    '#a6a6a6'
  ];
  raceRange = ['#09405A', '#AD1181', '#8406D1', '#ffa600', '#ff7155', '#a6a6a6', '#8B8B8B'];
  statusRange = ['#4833B2', '#AD1181', '#a6a6a6'];
  cmsRange = ['#AD1181', '#8406D1', '#a6a6a6'];

  cciRange = ['#EBC4E0', '#C24DA1', '#AD1181', '#820D61', '#570941'];
  vaccinationStatusRange = ['#4833B2', '#a6a6a6'];
  severityRange = ['#EBC4E0', '#C24DA1', '#AD1181', '#820D61', '#570941', '#a6a6a6'];

  sequential15 = ['#D6BFD9', '#b88fbd', '#995fa0', '#6c4270', '#4D2F50'];
  categorical = ['#09405A', '#AD1181', '#8406D1', '#ffa600', '#ff7155', '#4833B2', '#a6a6a6'];

  medicationOccurrenceRange = ['#007bff', '#09405A', '#a6a6a6'];
  alcoholRange = ['#007bff', '#09405A', '#a6a6a6'];
  opioidRange = ['#007bff', '#09405A', '#a6a6a6'];
  smokingRange = ['#007bff', '#09405A', '#a6a6a6'];

  mortalityRange = ['#4833B2', '#a6a6a6'];
  longStatusRange = ['#4833B2', '#a6a6a6'];
  hospStatusRange = ['#4833B2', '#a6a6a6'];
  covidStatusRange = ['#4833B2', '#a6a6a6'];
  alcoholStatusRange = ['#4833B2', '#a6a6a6'];
  smokingStatusRange = ['#4833B2', '#a6a6a6'];
  opioidsStatusRange = ['#4833B2', '#a6a6a6'];
  cannabisStatusRange = ['#4833B2', '#a6a6a6'];

  resultRange = ['#4833B2', '#AD1181', '#a6a6a6'];
  diagnosisRange = ['#09405A', '#AD1181', '#8406D1'];

  sexRange3 = ['#4833B2', '#ffa600', '#8406D1', '#a6a6a6', '#8B8B8B'];
  sexRangeNoOther = ['#4833B2', '#ffa600', '#a6a6a6'];
  severityRange2 = ['#F5B1A3', '#EE765E', '#CE3617', '#A02A12', '#5C180A', '#8B8B8B', '#8B8B8B'];
  severityRange3 = ['#FFC1DC', '#F584B5', '#CE4682', '#9D285B', '#6C0934', '#8B8B8B'];
  raceRange2 = ['#3B59C7', '#AD1181', '#7602EB', '#A8F0D8', '#86CBF3', '#a6a6a6', '#8B8B8B'];
  ageRange = ['#EADEF7', '#A772DF', '#6512BD', '#a6a6a6'];
  ageRangeAll = ['#EADEF7', '#C9A8EB', '#A772DF', '#8642CE', '#762AC6', '#6512BD', '#4C1EA5', '#33298D', '#a6a6a6'];
  ageRangeAll2 = ['#EADEF7', '#C9A8EB', '#A772DF', '#8642CE', '#6512BD', '#33298D', '#a6a6a6', '#8B8B8B'];
  ageRangeAdult1 = ['#762AC6', '#4C1EA5', '#a6a6a6', '#8B8B8B', '#762AC6', '#4C1EA5', '#a6a6a6', '#8B8B8B'];
  ageRangeAdult2 = ['#762AC6', '#6512BD', '#4C1EA5', '#33298D'];
  ageRangePeds1 = ['#EADEF7', '#C9A8EB', '#A772DF', '#8642CE', '#a6a6a6', '#a6a6a6', '#a6a6a6', '#a6a6a6'];
  ageRangePeds2 = ['#EADEF7', '#C9A8EB', '#A772DF', '#8642CE'];

  categorical2 = [
    '#09405A',
    '#AD1181',
    '#8406D1',
    '#ffa600',
    '#ff7155',
    '#4833B2',
    '#a6a6a6',
    '#09405A',
    '#AD1181',
    '#8406D1',
    '#ffa600',
    '#ff7155',
    '#4833B2',
    '#a6a6a6',
    '#09405A',
    '#AD1181',
    '#8406D1',
    '#ffa600',
    '#ff7155',
    '#4833B2',
    '#a6a6a6'
  ];
  categorical8 = ['#09405A', '#AD1181', '#8406D1', '#ffa600', '#ff7155', '#4833B2', '#007BFF', '#000000', '#a6a6a6'];
  sequential12 = ['#D6BFD9', '#4D2F50'];
  sequential13 = ['#D6BFD9', '#9a5fa0', '#4D2F50'];
  sequential14 = ['#D6BFD9', '#ae7fb3', '#7a4c80', '#4D2F50'];
  sequential16 = ['#D6BFD9', '#be98c2', '#a672ab', '#87548d', '#623d66', '#4D2F50'];
  sequential17 = ['#D6BFD9', '#c29fc6', '#ae7fb3', '#9a5fa0', '#7c4c80', '#5c3960', '#4D2F50'];
  sequential22 = ['#F5B1A3', '#5C180A'];
  sequential23 = ['#F5B1A3', '#e63c19', '#5C180A'];
  sequential24 = ['#F5B1A3', '#eb6347', '#8a240f', '#5C180A'];
  sequential25 = ['#F5B1A3', '#ed765e', '#ce3617', '#a02a12', '#5C180A'];
  sequential26 = ['#F5B1A3', '#eb6347', '#e63c19', '#b83014', '#8a240f', '#5C180A'];
  sequential27 = ['#F5B1A3', '#ee765e', '#e94f2f', '#d03616', '#a12a11', '#8a240f', '#5C180A'];
  divergent = [
    '#5C180A',
    '#A02A12',
    '#CE3617',
    '#ED765E',
    '#F5B1A3',
    '#EFEFEF',
    '#D6BFD9',
    '#A36FAA',
    '#8A5590',
    '#6C4270',
    '#4D2F50'
  ];

  updateTotalsService(newTotals: Record<string, any>): void {
    this.totals = {...newTotals};
  }

  getTotalsService(): Record<string, any> {
    return this.totals;
  }

  setKPIStatService(
    target: Record<string, any>, // The object to assign the value (e.g., the service)
    varname: string, // Property to assign
    value: any,
    suffix: string,
    decimals: number
  ): void {
    // Remove commas from the value if it's a string
    const sanitizedValue = typeof value === 'string' ? value.replace(/,/g, '') : value;
    const numericValue = parseFloat(sanitizedValue);

    if (!isNaN(numericValue)) {
      const formattedValue = this.nFormatter(numericValue, decimals);
      const finalValue = formattedValue.endsWith(suffix) ? formattedValue : formattedValue + suffix;
      target[varname] = finalValue; // Assign the value to the target object
    } else {
      console.error(`setKPIStatService failed: invalid number for ${suffix}`, value);
    }
  }

  // Helper function to format large numbers
  private nFormatter(num: number, digits: number): string {
    const units = ['', 'K', 'M', 'B', 'T']; // Single M for millions
    let unitIndex = 0;

    while (Math.abs(num) >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    return num.toFixed(digits) + units[unitIndex];
  }

  updateKpiProgressBarService(
    filteredCount: number,
    originalTotalCount: number,
    kpiConfigs: KpiPanelConfig = []
  ): KpiPanelConfig {
    // Calculate percentage
    const progress = (Number(filteredCount) / Number(originalTotalCount)) * 100;

    // Create a new array reference and update the progress
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

    return updatedConfigs; // Ensure the updated array is returned
  }

  calculateTotalsService(records: PatientRecord[], componentInstance: PaxlovidComponent): TotalsObject {
    const raceMapping: {[key: string]: string} = {
      'American Indian or Alaska Native': 'AI/AN',
      'Black or African American': 'Black',
      'Native Hawaiian or Other Pacific Islander': 'NHPI'
    };

    const ethnicityMapping: {[key: string]: string} = {
      'Not Hispanic or Latino': 'Not Hisp/Lat',
      'Hispanic or Latino': 'Hisp/Lat'
    };

    // this version allows for you to pass array of strings or json objects
    function createDefaultCategory(
      categories: (string | {fullLabel: string; shortLabel: string})[]
    ): Record<string, {count: number; percent: number; shortLabel?: string}> {
      const result: Record<string, {count: number; percent: number; shortLabel?: string}> = {};

      categories.forEach((category) => {
        if (typeof category === 'string') {
          // Handle plain strings
          result[category] = {count: 0, percent: 0};
        } else {
          // Handle objects with fullLabel and shortLabel
          result[category.fullLabel] = {count: 0, percent: 0, shortLabel: category.shortLabel};
        }
      });

      return result;
    }

    const totals: TotalsObject = {
      ageTotals: createDefaultCategory(['<18', '18-64', '65+', 'Unknown']),
      sexTotals: createDefaultCategory(['Male', 'Female', 'Other', 'Unknown']),
      raceTotals: createDefaultCategory(['White', 'Black', 'Asian', 'NHPI', 'AI/AN', 'Other', 'Unknown']),
      metforminSeverityTotals: createDefaultCategory(['Mild', 'Moderate', 'Severe', 'Unknown']),
      ethnicityTotals: createDefaultCategory(['Not Hisp/Lat', 'Hisp/Lat', 'Unknown']),
      medOccurrenceTotals: createDefaultCategory(['Occasional', 'Regular', 'Unknown']),
      paxlovidStatusTotals: createDefaultCategory([
        '0 Vaccine Doses',
        '1 Vaccine Doses',
        '2 Vaccine Doses',
        '3 Vaccine Doses',
        '4 Vaccine Doses'
      ]),
      paxlovidDaysTotals: createDefaultCategory([
        {fullLabel: '0 Day(s) Between COVID+ Diagnosis and Prescription', shortLabel: '0'},
        {fullLabel: '1 Day(s) Between COVID+ Diagnosis and Prescription', shortLabel: '1'},
        {fullLabel: '2 Day(s) Between COVID+ Diagnosis and Prescription', shortLabel: '2'},
        {fullLabel: '3 Day(s) Between COVID+ Diagnosis and Prescription', shortLabel: '3'},
        {fullLabel: '4 Day(s) Between COVID+ Diagnosis and Prescription', shortLabel: '4'},
        {fullLabel: '5 Day(s) Between COVID+ Diagnosis and Prescription', shortLabel: '5'}
      ]),
      covidStatusTotals: createDefaultCategory(['Positive', 'Negative', 'Unknown']),
      longCovidStatusTotals: createDefaultCategory(['Long COVID', 'Not Long COVID', 'Unknown']),
      vaccinationStatusTotals: createDefaultCategory(['Vaccinated', 'Not Vaccinated', 'Unknown']),
      mortalityTotals: createDefaultCategory(['Mortality', 'No Mortality', 'Unknown']),

      nonMetforminSeverityTotals: createDefaultCategory(['Mild', 'Moderate', 'Severe', 'Unknown']),
      diabeticNonMetforminSeverityTotals: createDefaultCategory(['Mild', 'Moderate', 'Severe', 'Unknown']),
      diabeticMetforminSeverityTotals: createDefaultCategory(['Mild', 'Moderate', 'Severe', 'Unknown']),
      nonDiabeticNonMetforminSeverityTotals: createDefaultCategory(['Mild', 'Moderate', 'Severe', 'Unknown']),
      nonDiabeticMetforminSeverityTotals: createDefaultCategory(['Mild', 'Moderate', 'Severe', 'Unknown']),

      nonMetforminLongCovidTotals: createDefaultCategory(['Long COVID', 'Not Long COVID', 'Unknown']),
      metforminLongCovidTotals: createDefaultCategory(['Long COVID', 'Not Long COVID', 'Unknown']),
      diabeticNonMetforminLongCovidTotals: createDefaultCategory(['Long COVID', 'Not Long COVID', 'Unknown']),
      diabeticMetforminLongCovidTotals: createDefaultCategory(['Long COVID', 'Not Long COVID', 'Unknown']),
      nonDiabeticNonMetforminLongCovidTotals: createDefaultCategory(['Long COVID', 'Not Long COVID', 'Unknown']),
      nonDiabeticMetforminLongCovidTotals: createDefaultCategory(['Long COVID', 'Not Long COVID', 'Unknown']),

      nonMetforminMortalityTotals: createDefaultCategory(['Mortality', 'No Mortality']),
      metforminMortalityTotals: createDefaultCategory(['Mortality', 'No Mortality']),
      diabeticNonMetforminMortalityTotals: createDefaultCategory(['Mortality', 'No Mortality']),
      diabeticMetforminMortalityTotals: createDefaultCategory(['Mortality', 'No Mortality']),
      nonDiabeticNonMetforminMortalityTotals: createDefaultCategory(['Mortality', 'No Mortality']),
      nonDiabeticMetforminMortalityTotals: createDefaultCategory(['Mortality', 'No Mortality'])
    };

    records.forEach((record, index) => {
      if (record.patient_count?.trim() !== '<20') {
        const patientCount = parseInt(record.patient_count, 10);
        if (!isNaN(patientCount) && patientCount >= 20) {
          // paxlovid days totals
          if (record.days) {
            const daysCategoryMatch = record.days.match(/^(\d+)/);
            if (daysCategoryMatch) {
              const daysCategory = `${daysCategoryMatch[1]} Day(s) Between COVID+ Diagnosis and Prescription`;

              if (daysCategory in totals.paxlovidDaysTotals) {
                totals.paxlovidDaysTotals[daysCategory].count = parseInt(record.patient_count, 10) || 0;
                if (!totals.paxlovidDaysTotals[daysCategory].shortLabel) {
                  totals.paxlovidDaysTotals[daysCategory].shortLabel = daysCategoryMatch[1]; // Assign short label
                }
              } else {
                console.warn(`Unknown days category: ${daysCategory}`);
              }
            }
          }

          // paxlovid dose totals
          if (record.vaccination_doses) {
            const doseCategoryMatch = record.vaccination_doses.match(/^(\d+)/);
            if (doseCategoryMatch) {
              const doseCategory = `${doseCategoryMatch[1]} Vaccine Doses`; // Extract dose number and construct the category

              if (doseCategory in totals.paxlovidStatusTotals) {
                // Assign the patient count to the matching category
                totals.paxlovidStatusTotals[doseCategory].count = parseInt(record.patient_count, 10) || 0;
              } else {
                console.warn(`Unknown dose category: ${doseCategory}`);
              }
            } else {
              console.warn(`Invalid vaccination doses format: ${record.vaccination_doses}`);
            }
          }

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
              totals.nonDiabeticNonMetforminLongCovidTotals[record.long_covid_status] = {
                count: patientCount,
                percent: 0
              };
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
    });

    // Calculate percentages for each category
    const calculatePercentages = (category: Totals) => {
      const total = Object.values(category).reduce((sum, entry) => sum + (entry as {count: number}).count, 0);
      if (total > 0) {
        Object.keys(category).forEach((key) => {
          const entry = category[key];
          entry.percent = (entry.count / total) * 100; // Assign percent
        });
      }
    };

    Object.keys(totals).forEach((key) => {
      const category = totals[key as keyof TotalsObject];
      if (category && typeof category === 'object') {
        calculatePercentages(category as Totals);
      }
    });

    //debugger;
    // Dynamically set KPI values based on totals
    // Check if totals.ageTotals has any non-zero counts
    const totalAgeCount = Object.values(totals.ageTotals).reduce((sum, item) => sum + item.count, 0);
    const totalDoseCount = Object.values(totals.paxlovidStatusTotals).reduce((sum, item) => sum + item.count, 0);
    if (totalAgeCount > 0) {
      this.setKPIStatService(componentInstance, 'numTPIV', totalAgeCount, '', 2);
    } else if (totalDoseCount > 0) {
      // Special case for paxlovid_5 (doses)
      this.setKPIStatService(componentInstance, 'numTPIV', totalDoseCount, '', 2);
    } else if (totals.paxlovidDaysTotals && Object.values(totals.paxlovidDaysTotals).length > 0) {
      // Special case for paxlovid_9 (days)
      const totalDaysCount = Object.values(totals.paxlovidDaysTotals).reduce((sum, item) => sum + item.count, 0);
      this.setKPIStatService(componentInstance, 'numTPIV', totalDaysCount, '', 2);
    } else {
      console.warn('No totals available to calculate numTPIV');
    }

    if (totals.covidStatusTotals?.['Positive']) {
      const totalCovidStatusCount = totals.covidStatusTotals['Positive']?.count || 0;
      this.setKPIStatService(componentInstance, 'numCIV', totalCovidStatusCount, '', 2);
    }

    if (totals.longCovidStatusTotals?.['Long COVID']) {
      const totalLongCovidStatusCount = totals.longCovidStatusTotals['Long COVID']?.count || 0;
      this.setKPIStatService(componentInstance, 'numLCIV', totalLongCovidStatusCount, '', 2);
    }

    if (totals.vaccinationStatusTotals?.['Vaccinated']) {
      const totalVaccinationCount = totals.vaccinationStatusTotals['Vaccinated']?.count || 0;
      this.setKPIStatService(componentInstance, 'numVIV', totalVaccinationCount, '', 2);
    }

    if (totals.mortalityTotals?.['Mortality']) {
      const totalMortalityCount = totals.mortalityTotals['Mortality']?.count || 0;
      this.setKPIStatService(componentInstance, 'numTMIV', totalMortalityCount, '', 2);
    }

    if (totals.nonMetforminSeverityTotals) {
      const totalNonMetforminCount = Object.values(totals.nonMetforminSeverityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numNMIV', totalNonMetforminCount, '', 2);
    }

    if (totals.diabeticNonMetforminSeverityTotals) {
      const totalDiabeticNonMetforminCount = Object.values(totals.diabeticNonMetforminSeverityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numDNMIV', totalDiabeticNonMetforminCount, '', 2);
    }

    if (totals.metforminSeverityTotals) {
      const totalMetforminCount = Object.values(totals.metforminSeverityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numMIV', totalMetforminCount, '', 2);
    }

    if (totals.diabeticMetforminSeverityTotals) {
      const totalDiabeticMetforminCount = Object.values(totals.diabeticMetforminSeverityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numDMIV', totalDiabeticMetforminCount, '', 2);
    }

    // Long COVID kpi stats
    if (totals.nonMetforminLongCovidTotals) {
      const totalNonMetforminLongCovidCount = Object.values(totals.nonMetforminLongCovidTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numNMIV', totalNonMetforminLongCovidCount, '', 2);
    }

    if (totals.diabeticNonMetforminLongCovidTotals) {
      const totalDiabeticNonMetforminLongCovidCount = Object.values(totals.diabeticNonMetforminLongCovidTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numDNMIV', totalDiabeticNonMetforminLongCovidCount, '', 2);
    }

    if (totals.metforminLongCovidTotals) {
      const totalMetforminLongCovidCount = Object.values(totals.metforminLongCovidTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numMIV', totalMetforminLongCovidCount, '', 2);
    }

    if (totals.diabeticMetforminLongCovidTotals) {
      const totalDiabeticMetforminLongCovidCount = Object.values(totals.diabeticMetforminLongCovidTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numDMIV', totalDiabeticMetforminLongCovidCount, '', 2);
    }

    // Mortality KPI stats
    if (totals.nonMetforminMortalityTotals) {
      const totalNonMetforminMortalityCount = Object.values(totals.nonMetforminMortalityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numNMIV', totalNonMetforminMortalityCount, '', 2);
    }

    if (totals.diabeticNonMetforminMortalityTotals) {
      const totalDiabeticNonMetforminMortalityCount = Object.values(totals.diabeticNonMetforminMortalityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numDNMIV', totalDiabeticNonMetforminMortalityCount, '', 2);
    }

    if (totals.metforminMortalityTotals) {
      const totalMetforminMortalityCount = Object.values(totals.metforminMortalityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numMIV', totalMetforminMortalityCount, '', 2);
    }

    if (totals.diabeticMetforminMortalityTotals) {
      const totalDiabeticMetforminMortalityCount = Object.values(totals.diabeticMetforminMortalityTotals).reduce(
        (sum, item) => sum + item.count,
        0
      );
      this.setKPIStatService(componentInstance, 'numDMIV', totalDiabeticMetforminMortalityCount, '', 2);
    }

    // Transform the data for each total
    const transformCategoryData = (categoryTotals: any) =>
      categoryTotals
        ? Object.entries(categoryTotals).map(([key, value]: any) => ({
            abbrev: key,
            count: value?.count || 0, // Fallback to 0 if count is undefined
            percent: value?.percent || 0 // Fallback to 0 if percent is undefined
          }))
        : [];

    const transformedData: TotalsObject = {
      ageTotals: totals.ageTotals,
      sexTotals: totals.sexTotals,
      raceTotals: totals.raceTotals,
      metforminSeverityTotals: totals.metforminSeverityTotals,
      ethnicityTotals: totals.ethnicityTotals,
      medOccurrenceTotals: totals.medOccurrenceTotals,
      paxlovidStatusTotals: totals.paxlovidStatusTotals,
      paxlovidDaysTotals: totals.paxlovidDaysTotals,
      covidStatusTotals: totals.covidStatusTotals,
      longCovidStatusTotals: totals.longCovidStatusTotals,
      vaccinationStatusTotals: totals.vaccinationStatusTotals,
      mortalityTotals: totals.mortalityTotals,
      // Severity
      nonMetforminSeverityTotals: totals.nonMetforminSeverityTotals,
      diabeticNonMetforminSeverityTotals: totals.diabeticNonMetforminSeverityTotals,
      diabeticMetforminSeverityTotals: totals.diabeticMetforminSeverityTotals,
      nonDiabeticNonMetforminSeverityTotals: totals.nonDiabeticNonMetforminSeverityTotals,
      nonDiabeticMetforminSeverityTotals: totals.nonDiabeticMetforminSeverityTotals,
      // Long COVID
      nonMetforminLongCovidTotals: totals.nonMetforminLongCovidTotals,
      metforminLongCovidTotals: totals.metforminLongCovidTotals,
      diabeticNonMetforminLongCovidTotals: totals.diabeticNonMetforminLongCovidTotals,
      diabeticMetforminLongCovidTotals: totals.diabeticMetforminLongCovidTotals,
      nonDiabeticNonMetforminLongCovidTotals: totals.diabeticNonMetforminLongCovidTotals,
      nonDiabeticMetforminLongCovidTotals: totals.nonDiabeticMetforminLongCovidTotals,
      // mortality
      nonMetforminMortalityTotals: totals.nonMetforminMortalityTotals,
      metforminMortalityTotals: totals.metforminMortalityTotals,
      diabeticNonMetforminMortalityTotals: totals.diabeticNonMetforminMortalityTotals,
      diabeticMetforminMortalityTotals: totals.diabeticMetforminMortalityTotals,
      nonDiabeticNonMetforminMortalityTotals: totals.nonDiabeticNonMetforminMortalityTotals,
      nonDiabeticMetforminMortalityTotals: totals.nonDiabeticMetforminMortalityTotals
    };

    return transformedData;
  }

  loadAndInitializeChartsService(
    config: ConfigFile,
    displayMode: 'bar' | 'percent' | 'pie',
    totalsData: any,
    selectedDataset: string
  ): Promise<ChartConfig[]> {
    const resolvedColorSchemes: {[key: string]: string[]} = {};

    // Resolve color schemes for each section
    Object.keys(config.colorScheme).forEach((sectionKey) => {
      const schemeKey = config.colorScheme[sectionKey];
      const resolvedScheme = this[schemeKey as keyof this];
      resolvedColorSchemes[sectionKey] = Array.isArray(resolvedScheme) ? resolvedScheme : ['#000']; // Default to black
    });

    // Generate chart configurations dynamically
    const chartConfigs: ChartConfig[] = Object.keys(config.titleMap).map((sectionKey, index) => {
      const chartTitle = config.titleMap[sectionKey][displayMode];

      // check if chartTotals has problems
      Object.keys(config.chartTotals).forEach((sectionKey) => {
        if (!(config.chartTotals[sectionKey] in totalsData)) {
          console.warn(`Key ${config.chartTotals[sectionKey]} is missing in totalsData.`);
        }
      });

      const sectionTotals = totalsData[config.chartTotals[sectionKey]];
      const colorScheme = resolvedColorSchemes[sectionKey];

      // Ensure `selectedDataset` is incorporated into the ID
      const id = `${selectedDataset}_section${index + 1}`;

      if (!sectionTotals) {
        console.warn(`No data found for section: ${sectionKey}`);
      }

      return {
        id,
        title: chartTitle,
        data: sectionTotals
          ? Object.entries(sectionTotals).map(([abbrev, values]: [string, any]) => ({
              abbrev: values.shortLabel ? values.shortLabel : abbrev,
              count: values.count || 0, // if no count default to 0 so it still draws
              percent: values.percent || 0
            }))
          : [],
        colors: colorScheme || ['#000'], // Default to black if no color scheme
        displayMode: displayMode
      };
    });

    return Promise.resolve(chartConfigs);
  }

  initializeChartsConfigService(datasetConfig: ConfigFile, displayMode: string, totalsData: any) {
    const {chartTotals, colorScheme, titleMap, chartIdPrefix, numCharts} = datasetConfig;

    if (!chartTotals || Object.keys(chartTotals).length === 0) {
      console.error('chartTotals is undefined or empty:', chartTotals);
      throw new Error('chartTotals is missing from the configuration file.');
    }

    return Object.keys(chartTotals)
      .slice(0, numCharts)
      .map((key) => {
        const totalsKey = chartTotals[key];
        const totals = totalsData[totalsKey] || {};

        const data = Array.isArray(totals)
          ? totals
          : Object.entries(totals).map(([abbrev, value]) => ({
              abbrev,
              ...(typeof value === 'object' && value !== null ? value : {count: 0, percent: 0})
            }));

        const labels = data.map((item) => item.abbrev);

        // Resolve colors dynamically
        const colorRangeName = colorScheme[key];
        const colors = (this as Record<string, any>)[colorRangeName] || []; // Use explicit casting

        // Resolve title dynamically
        const title = (titleMap as Record<string, any>)[key]?.[displayMode] || 'Title Not Found';

        return {
          id: `${chartIdPrefix}-${key}`,
          title,
          data,
          colors,
          displayMode,
          labels
        };
      });
  }
} // end service
