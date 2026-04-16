import {FilterDataGroup} from '@odp/n3c/lib/models/filter-models';
import {KpiTotalMap} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {ColDef} from 'ag-grid-community';

export const sexRange = ['#4833B2', '#ffa600', '#8406D1', '#a6a6a6'];
export const raceRange = ['#09405A', '#AD1181', '#8406D1', '#ffa600', '#ff7155', '#a6a6a6', '#8B8B8B'];
export const vaccinationStatusRange = ['#4833B2', '#a6a6a6'];
export const severityRange = ['#EBC4E0', '#C24DA1', '#AD1181', '#820D61', '#570941', '#a6a6a6'];
export const mortalityRange = ['#4833B2', '#a6a6a6'];
export const longStatusRange = ['#4833B2', '#a6a6a6'];
export const covidStatusRange = ['#4833B2', '#a6a6a6'];
export const ageRange = ['#EADEF7', '#C9A8EB', '#A772DF', '#8642CE'];
export const comorbidityRange = [
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
  '#ffa600'
];
export const cmstypeRange = ['#AD1181', '#8406D1', '#a6a6a6'];
export const conditionRange = ['#09405A', '#AD1181', '#8406D1', '#ffa600', '#ff7155', '#4833B2', '#a6a6a6', '#09405A'];

export const validTopics = () => topicOptions.map((v) => v.value);
export const topicOptions = [
  {value: 'comorbidities', label: 'Comorbidity & Demographics Breakdown of All Patients in the Enclave'},
  {value: 'demographics', label: 'Demographics of Patients w/Maternal Health-Related Conditions'},
  {value: 'outcomes', label: 'COVID Factors of Patients w/Maternal Health-Related Conditions'}
];

export const filterMap = (selectedTopic: string) => {
  const filters = {
    comorbidities: [
      [
        {
          title: 'Sex',
          values: ['Male', 'Female', 'Other', 'Unknown']
        }
      ],
      [
        {
          title: 'COVID Status',
          values: ['Positive', 'Unknown']
        },
        {
          title: 'Long COVID Status',
          values: ['Long COVID', 'Unknown']
        },
        {
          title: 'Mortality Status',
          values: ['Mortality', 'No Mortality']
        },
        {
          title: 'Vaccination Status',
          values: ['Vaccinated', 'Unknown']
        },
        {
          title: 'Comorbidity',
          values: [
            'Cancer',
            'CHF',
            'Dementia',
            'DM',
            'DMcx',
            'HIV',
            'LiverMild',
            'LiverSevere',
            'Mets',
            'MI',
            'Paralysis',
            'Pregnancy Conditions',
            'PUD',
            'Pulmonary',
            'PVD',
            'Renal',
            'Rheumatic',
            'Stroke',
            'Unknown/None'
          ]
        }
      ]
    ],
    demographics: [
      [
        {
          description:
            'Note: Select a single option to see all patients with that condition. Each additional selection will only show patients with that specific combination.',
          title: 'Condition',
          type: 'search',
          values: [
            'Assist Reproductive Tech',
            'Behavioral Health Conditions',
            'Birth',
            'High Risk Conditions',
            'Low Risk Conditions',
            'Other Conditions',
            'Postpartum Conditions',
            'Record Of Gestation'
          ]
        },
        {
          title: 'CMS Type',
          values: ['Medicaid', 'Medicare', 'None']
        }
      ],
      [
        {
          title: 'Age',
          values: ['<18', '18-64', '65+', 'Unknown']
        },
        {
          title: 'Race',
          values: ['White', 'Black', 'Asian', 'AI/AN', 'NHPI', 'Other', 'Unknown']
        },
        {
          title: 'Sex',
          values: ['Male', 'Female', 'Other', 'Unknown']
        }
      ],
      [
        {
          title: 'COVID Status',
          values: ['Positive', 'Unknown']
        },
        {
          title: 'Mortality Status',
          values: ['Mortality', 'No Mortality']
        }
      ]
    ],
    outcomes: [
      [
        {
          description:
            'Note: Select a single option to see all patients with that condition. Each additional selection will only show patients with that specific combination.',
          title: 'Condition',
          type: 'search',
          values: [
            'Assist Reproductive Tech',
            'Behavioral Health Conditions',
            'Birth',
            'High Risk Conditions',
            'Low Risk Conditions',
            'Other Conditions',
            'Postpartum Conditions',
            'Record Of Gestation'
          ]
        }
      ],
      [
        {
          title: 'Sex',
          values: ['Male', 'Female', 'Other', 'Unknown']
        }
      ],
      [
        {
          title: 'COVID Status',
          values: ['Positive', 'Unknown']
        },
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
  } as Record<string, FilterDataGroup[][]>;

  return filters[selectedTopic];
};

export const selectedFilters = () => ({
  age: [],
  sex: [],
  race: [],
  severity: [],
  covidstatus: [],
  longcovidstatus: [],
  vaccinationstatus: [],
  mortalitystatus: [],
  condition: [],
  comorbidity: [],
  cmstype: []
});

export const kpiTotalMap: KpiTotalMap[] = [
  {
    prop: 'sexTotals',
    reduce: true,
    stat: 'numTPIV'
  },
  {
    prop: 'covidStatusTotals.Positive',
    reduce: false,
    stat: 'numCIV'
  }
];

export const colorSchemeMap: Record<string, string[]> = {
  severityRange,
  ageRange,
  sexRange,
  raceRange,
  covidStatusRange,
  longStatusRange,
  vaccinationStatusRange,
  mortalityRange,
  conditionRange,
  comorbidityRange,
  cmstypeRange
};

const columnMap: Record<string, ColDef[]> = {
  comorbidities: [
    {
      field: 'comorbidity',
      headerName: 'Comorbidity',
      flex: 5,
      filter: 'agTextColumnFilter',
      resizable: true
    },
    {field: 'sex', headerName: 'Sex', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'vaccinated', headerName: 'Vaccination Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'covid_status', headerName: 'COVID Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'long_covid', headerName: 'Long COVID Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'mortality', headerName: 'Mortality Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'patient_count', headerName: 'Patient Count', flex: 3, filter: 'agTextColumnFilter', resizable: true}
  ],
  demographics: [
    {
      field: 'condition',
      headerName: 'Condition',
      flex: 6,
      filter: 'agTextColumnFilter',
      resizable: true
    },
    {field: 'race', headerName: 'Race', flex: 6, filter: 'agTextColumnFilter', resizable: true},
    {field: 'age', headerName: 'Age', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'sex', headerName: 'Sex', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'cms', headerName: 'CMS Type', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'covid_status', headerName: 'COVID Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'mortality', headerName: 'Mortality Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'patient_count', headerName: 'Patient Count', flex: 3, filter: 'agTextColumnFilter', resizable: true}
  ],
  outcomes: [
    {
      field: 'condition',
      headerName: 'Condition',
      flex: 6,
      filter: 'agTextColumnFilter',
      resizable: true
    },
    {field: 'sex', headerName: 'Sex', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'severity', headerName: 'Severity', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'vaccinated', headerName: 'Vaccination Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'covid_status', headerName: 'COVID Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'long_covid', headerName: 'Long COVID Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'mortality', headerName: 'Mortality Status', flex: 3, filter: 'agTextColumnFilter', resizable: true},
    {field: 'patient_count', headerName: 'Patient Count', flex: 3, filter: 'agTextColumnFilter', resizable: true}
  ]
};

export const getColumnDefs = (topic: string): ColDef[] => {
  return columnMap[topic] ?? [];
};

export const indexProgBarInKpiPanelMap: Record<string, number> = {
  comorbidities: 1,
  demographics: 2,
  outcomes: 2
};
