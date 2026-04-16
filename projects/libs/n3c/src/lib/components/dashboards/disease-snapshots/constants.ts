import {FilterDataGroup} from '@odp/n3c/lib/models/filter-models';
import {KpiTotalMap} from '@odp/n3c/lib/services/base-manager/base.manager.types';

export const sexRange = ['#4833B2', '#ffa600', '#8406D1', '#a6a6a6'];
export const ageRange = ['#EADEF7', '#A772DF', '#6512BD', '#a6a6a6'];

export const validTopics = () => topicOptions.map((v) => v.value);
export const topicOptions = [
  {value: 'cancer', label: 'Cancer'},
  {value: 'chf', label: 'Congestive Heart Failure'},
  {value: 'dementia', label: 'Dementia'},
  {value: 'diabetes_mellitus', label: 'Diabetes Mellitus'},
  {value: 'diabetes_1', label: 'Diabetes Type 1'},
  {value: 'diabetes_2', label: 'Diabetes Type 2'},
  {value: 'diabetescomp', label: 'Diabetes Mellitus with Complications'},
  {value: 'hiv', label: 'HIV'},
  {value: 'liverdisease_mild', label: 'Liver Disease Mild'},
  {value: 'liverdisease_severe', label: 'Liver Disease Severe'},
  {value: 'metastasis', label: 'Metastasis'},
  {value: 'myocardial_infarction', label: 'Myocardial Infarction'},
  {value: 'paralysis', label: 'Paralysis'},
  {value: 'pepticulcer', label: 'Peptic Ulcer Disease'},
  {value: 'peripheral_vascular', label: 'Peripheral Vascular Disease'},
  {value: 'pulmonary', label: 'Pulmonary'},
  {value: 'renal', label: 'Renal Disease'},
  {value: 'rheumatologic', label: 'Rheumatologic Disease'},
  {value: 'stroke', label: 'Stroke'}
];

export const filterMap = () => {
  return [
    [
      {
        title: 'Age',
        values: ['<18', '18-64', '65+', 'Unknown']
      },
      {
        title: 'Sex',
        values: ['Male', 'Female', 'Other', 'Unknown']
      }
    ]
  ] as FilterDataGroup[][];
};

export const selectedFilters = () => ({
  age: [],
  sex: []
});

export const kpiTotalMap: KpiTotalMap[] = [
  {
    prop: 'observationTotals.Has Disease',
    reduce: false,
    stat: 'numTPWD'
  },
  {
    prop: 'hasDiseaseLess18Totals.total',
    reduce: false,
    stat: 'numTPL18'
  }
];

export const colorSchemeMap: Record<string, string[]> = {
  ageRange,
  sexRange
};

export const columnDefs = [
  {
    field: 'observation',
    headerName: 'Observation',
    flex: 4,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  {
    field: 'age',
    headerName: 'Age',
    flex: 3,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  {
    field: 'sex',
    headerName: 'Sex',
    flex: 3,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  {
    field: 'patient_count',
    headerName: 'Patient Count',
    flex: 3,
    filter: 'agTextColumnFilter',
    resizable: true
  }
];
