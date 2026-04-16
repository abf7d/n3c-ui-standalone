import {FilterDef, KpiTotalMap} from '@odp/n3c/lib/services/base-manager/base.manager.types';

// Define the color scales
export const ethnicityRange = ['#332380', '#B6AAF3', '#a6a6a6'];
export const sexRange = ['#4833B2', '#ffa600', '#8406D1', '#a6a6a6'];
export const ageRangeMin = ['#EADEF7', '#8642CE', '#33298D', '#a6a6a6'];
export const raceRange = ['#09405A', '#AD1181', '#8406D1', '#ffa600', '#ff7155', '#a6a6a6', '#8B8B8B'];
export const statusRange = ['#4833B2', '#AD1181', '#a6a6a6'];
export const vaccinationStatusRange = ['#4833B2', '#a6a6a6'];
export const severityRange = ['#EBC4E0', '#C24DA1', '#AD1181', '#820D61', '#570941', '#a6a6a6'];
export const mortalityRange = ['#4833B2', '#a6a6a6'];
export const longStatusRange = ['#4833B2', '#a6a6a6'];
export const covidStatusRange = ['#4833B2', '#a6a6a6'];
export const ageRange = ['#EADEF7', '#A772DF', '#6512BD', '#a6a6a6'];

export const validDatasets = () => [
  'home',
  'medicare_demo',
  'medicare_covid',
  'medicaid_demo',
  'medicaid_covid',
  'mortality_demo',
  'mortality_covid',
  'viral_variants_demo',
  'viral_variants_covid'
];
export const filterMapDict = (): Record<string, FilterDef[][]> => ({
  demographics: [
    [
      {
        title: 'Age',
        values: ['<18', '18-64', '65+', 'Unknown']
      },
      {
        title: 'Ethnicity',
        values: ['Not Hisp/Lat', 'Hisp/Lat', 'Unknown']
      },
      {
        title: 'Race',
        values: ['White', 'Black', 'Asian', 'AI/AN', 'NHPI', 'Other', 'Unknown']
      },
      {
        title: 'Sex',
        values: ['Male', 'Female', 'Other', 'Unknown']
      }
    ]
  ],
  covid: [
    [
      {
        title: 'Race',
        values: ['White', 'Black', 'Asian', 'AI/AN', 'NHPI', 'Other', 'Unknown']
      }
    ],
    [
      {
        title: 'Long COVID Status',
        values: ['Long COVID', 'Unknown']
      },
      {
        title: 'Mortality Status',
        values: ['Mortality', 'No Mortality']
      },
      {
        title: 'Severity',
        values: ['Mild', 'Mild in ED', 'Moderate', 'Severe', 'Mortality', 'Unavailable']
      },
      {
        title: 'Vaccination Status',
        values: ['Vaccinated', 'Unknown']
      }
    ]
  ]
});

export const selectedFilters = () => ({
  age: [],
  sex: [],
  race: [],
  severity: [],
  ethnicity: [],
  covidstatus: [],
  longcovidstatus: [],
  vaccinationstatus: [],
  mortalitystatus: []
});

export const kpiTotalMap: KpiTotalMap[] = [
  {
    prop: 'ageTotals',
    reduce: true,
    stat: 'numTPIV'
  },
  {
    prop: 'raceTotals',
    reduce: true,
    stat: 'numTPIV'
  },
  {
    prop: 'covidStatusTotals.Positive',
    reduce: false,
    stat: 'numCIV'
  },
  {
    prop: 'longCovidStatusTotals.Long COVID',
    reduce: false,
    stat: 'numLCIV'
  },
  {
    prop: 'vaccinationStatusTotals.Vaccinated',
    reduce: false,
    stat: 'numVIV'
  },
  {
    prop: 'mortalityTotals.Mortality',
    reduce: false,
    stat: 'numMIV'
  },
  {
    prop: 'severityTotals',
    reduce: true,
    stat: 'numNMIV'
  }
];

export const colorSchemeMap: Record<string, string[]> = {
  severityRange: severityRange,
  ageRange: ageRangeMin,
  sexRange: sexRange,
  ethnicityRange: ethnicityRange,
  raceRange: raceRange,
  covidStatusRange: covidStatusRange,
  longStatusRange: longStatusRange,
  vaccinationStatusRange: vaccinationStatusRange,
  mortalityRange: mortalityRange
};
